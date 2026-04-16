// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./Token.sol";

interface IVault {
    function addReward(uint256 amount) external;
}

/// @notice Lending market.
///   - collateralShares: стандарт ERC4626 (deposit/withdraw collateral → mint/burn shares).
///   - borrowShares: отдельный ERC20-токен BorrowShare, деплоится в initialize().
///   - userBorrowIndex: mapping для начисления процентов на каждого заёмщика.
contract Market is ERC4626Upgradeable, UUPSUpgradeable {
    string public title;
    uint256 public lltv;
    uint256 public blockPerYear;
    uint256 public lastAccrueBlock;
    uint256 public currentBorrowIndex;
    uint256 public interestRate;
    uint256 public collateralPrice;
    uint256 public borrowPrice;
    uint256 public fee;
    uint fee2 = 100 - fee;

    address public owner;
    address public treasure;
    address public vault;

    BorrowToken public borrowToken; // usdc/pyusdc
    CollateralToken collateralToken; // usdt/usd1/dai
    BorrowShare public borrowShare; // ERC20-токен долей share

    mapping(address => uint256) public userBorrowIndex; // индекс в момент последнего borrow/repay

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    /// @param collateralToken_ актив ERC4626 (collateral), используется как underlying
    function initialize(
        string memory title_,
        string memory shareName_, // имя collateralShare (ERC4626)
        uint256 lltv_,
        uint256 interestRate_,
        address vault_,
        address treasure_,
        address collateralToken_,
        address borrowToken_,
        address borrowShare_
    ) public initializer {
        // ERC4626: collateralToken → collateralShares
        __ERC4626_init(IERC20(collateralToken_));
        __ERC20_init(title_, shareName_);

        owner = msg.sender;
        title = title_;
        lltv = lltv_;
        interestRate = interestRate_ * 1e18;
        vault = vault_;
        treasure = treasure_;

        blockPerYear = 2_102_400;
        currentBorrowIndex = 1e18;
        collateralPrice = 1e18;
        borrowPrice = 1e18;
        lastAccrueBlock = block.number;
        fee = 70;
        borrowToken = BorrowToken(borrowToken_);
        collateralToken = CollateralToken(collateralToken_);
        borrowShare = BorrowShare(borrowShare_);
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function accrue() internal {
        currentBorrowIndex = currentBorrowIndex +
            (currentBorrowIndex *
                interestRate *
                (block.number - lastAccrueBlock)) /
                (blockPerYear * 1e10);
        lastAccrueBlock = block.number;
    }

   function accruedInterest(address user) public view returns(uint) {
    return (borrowShare.balanceOf(user) * (currentBorrowIndex - userBorrowIndex[user]) / 1e18);
   }

   function getDebt(address user) public view returns (uint256) {
    return (borrowShare.balanceOf(user) * currentBorrowIndex) / 1e18;
    }

    function getLtv(address user) public view returns (uint256) {
        uint256 collateralAmount = convertToAssets(balanceOf(user)); // сколько токенов в залог вложил пользователь
        uint256 borrowAmount = borrowShare.balanceOf(user) + accruedInterest(user);
        return
            (borrowAmount * borrowPrice * 1e18) / (collateralAmount * collateralPrice);
    }

    function depositMarket(uint256 amount) public {
        accrue();
        uint256 shares = previewDeposit(amount);
    _mint(msg.sender, shares);
    collateralToken.transferCustom(msg.sender, address(this), amount);
    require(getLtv(msg.sender) < lltv, "LTV will exceed LLTV");
    }

    function withdrawMarket(uint256 amount) public {
        accrue();
        uint256 shares = previewWithdraw(amount);
    _burn(msg.sender, shares);
    collateralToken.transferCustom(msg.sender, address(this), amount);
        require(getLtv(msg.sender) < lltv, "LTV will exceed LLTV");
    }

    function borrow(uint256 amount) external {
        accrue();

        uint256 shares = (amount * 1e18) / currentBorrowIndex;
        userBorrowIndex[msg.sender] = currentBorrowIndex;

        borrowShare.mint(msg.sender, shares);

        require(getLtv(msg.sender) < lltv, "LTV >= LLTV");
        require(borrowToken.transfer(msg.sender, amount),"borrow transfer failed"
        );
    }

    function repay(uint256 amount) external {
        accrue();

        require(
            borrowToken.transfer(vault, accruedInterest(msg.sender) / fee),
            "vault transfer failed"
        );
        require(
            borrowToken.transfer(treasure, accruedInterest(msg.sender) / fee2),
            "treasure transfer failed"
        );

        require(
            borrowToken.transfer(address(this), accruedInterest(msg.sender) / fee2),
            "treasure transfer failed"
        );

        uint256 shares = (amount * 1e18) / currentBorrowIndex;
        borrowShare.burn(msg.sender, shares);


        uint256 remainingDebt = getDebt(msg.sender) + accruedInterest(msg.sender) - amount;
        if (remainingDebt == 0) {
            userBorrowIndex[msg.sender] = 0;
        } else {
            userBorrowIndex[msg.sender] = currentBorrowIndex;
        }
        require(getLtv(msg.sender) < lltv, "LTV will exceed LLTV");
    }

    // ─── Info views ───────────────────────────────────────────────────────

    function getMarket() external view returns (
            string memory,uint256,uint256,uint256,uint256,
            uint256,address,address,address) {
        return (
            title,
            lltv,
            interestRate,
            currentBorrowIndex,
            collateralPrice,
            borrowPrice,
            address(borrowToken),
            asset(),
            address(borrowShare)
        );
    }

    function getUserInfo(
        address user
    )
        external
        view
        returns (
            uint256 borrowShares,
            uint256 collateralShares,
            uint256 userBorrowIdx,
            uint256 currentDebt_,
            uint256 currentLtv
        )
    {
        return (
            borrowShare.balanceOf(user),
            balanceOf(user),
            userBorrowIndex[user],
            getDebt(msg.sender) + accruedInterest(msg.sender),
            getLtv(user)
        );
    }

    function returnLiquidityToVault(uint256 amount) external onlyOwner {
        require(borrowToken.transfer(vault, amount), "transfer failed");
    }
}
