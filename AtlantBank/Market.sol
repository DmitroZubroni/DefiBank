// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./MockERC20.sol";

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

    IERC20 public borrowToken;
    BorrowShare public borrowShare; // ERC20-токен долей

    mapping(address => uint256) public userBorrowIndex; // индекс в момент последнего borrow/repay
    mapping(address => uint256) public userBorrowAmount; // тело долга (principal)

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
        address borrowToken_
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
        borrowToken = IERC20(borrowToken_);
    }

    function getData(
        string memory title_,
        string memory shareName_, // имя collateralShare (ERC4626)
        uint256 lltv_,
        uint256 interestRate_,
        address vault_,
        address treasure_,
        address collateralToken_,
        address borrowToken_
    ) public view returns (bytes memory) {
        return
            abi.encodeCall(
                this.initialize,
                (title_, shareName_, lltv_, interestRate_, vault_, treasure_, collateralToken_, borrowToken_)
            );
    }
    
    function getData(address _owner, uint _value) public pure returns(bytes memory) {
        bytes memory data = abi.encodeWithSignature("initialize(address,uint256)",_owner,_value);
        return data;
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

   function accruedInterest() public view returns(uint) {
    return userBorrowAmount[msg.sender] * (currentBorrowIndex - userBorrowIndex[msg.sender]);
   }

    function getLtv(address user) public view returns (uint256) {
        uint256 collateralAmount = convertToAssets(balanceOf(user)); // сколько токенов в залог вложил пользователь
        uint256 borrowAmount = userBorrowAmount[msg.sender] + accruedInterest();
        return
            (borrowAmount * borrowPrice * 1e18) / (collateralAmount * collateralPrice);
    }

    function depositMarket(uint256 amount) public {
        accrue();
        super.deposit(amount, msg.sender);
        require(getLtv(msg.sender) < lltv, "LTV will exceed LLTV");
    }

    function withdrawMarket(uint256 amount) public {
        accrue();
        super.withdraw(amount, msg.sender, msg.sender);
        require(getLtv(msg.sender) < lltv, "LTV will exceed LLTV");
    }

    function borrow(uint256 amount) external {
        accrue();

        uint256 debtBefore = userBorrowAmount[msg.sender] + accruedInterest();
        uint256 shares = (amount * 1e18) / currentBorrowIndex;

        userBorrowAmount[msg.sender] = debtBefore + amount;
        userBorrowIndex[msg.sender] = currentBorrowIndex;

        borrowShare.mint(msg.sender, shares);

        require(getLtv(msg.sender) < lltv, "LTV >= LLTV");
        require(borrowToken.transfer(msg.sender, amount),"borrow transfer failed"
        );
    }

    function repay(uint256 amount) external {
        accrue();

        
        require(
            borrowToken.transfer(vault, accruedInterest() / fee),
            "vault transfer failed"
        );
        require(
            borrowToken.transfer(treasure, accruedInterest() / fee2),
            "treasure transfer failed"
        );

        require(
            borrowToken.transfer(address(this), accruedInterest() / fee2),
            "treasure transfer failed"
        );

        uint256 remainingDebt = userBorrowAmount[msg.sender] + accruedInterest() - amount;
        if (remainingDebt == 0) {
            userBorrowAmount[msg.sender] = 0;
            userBorrowIndex[msg.sender] = 0;
        } else {
            userBorrowAmount[msg.sender] = remainingDebt;
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
            userBorrowAmount[msg.sender] + accruedInterest(),
            getLtv(user)
        );
    }

    function returnLiquidityToVault(uint256 amount) external onlyOwner {
        require(borrowToken.transfer(vault, amount), "transfer failed");
    }
}
