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
        string memory borrowName_, // имя borrowShare (ERC20)
        string memory borrowSymbol_,
        uint256 lltv_,
        uint256 interestRate_,
        address vault_,
        address treasure_,
        address collateralToken_
    ) public initializer {
        // ERC4626: collateralToken → collateralShares
        __ERC4626_init(IERC20(collateralToken_));
        __ERC20_init(title_, shareName_);

        owner = msg.sender;
        title = title_;
        lltv = lltv_;
        interestRate = interestRate_;
        vault = vault_;
        treasure = treasure_;

        blockPerYear = 2_102_400;
        currentBorrowIndex = 1e18;
        collateralPrice = 1e18;
        borrowPrice = 1e18;
        lastAccrueBlock = block.number;
        fee = 70;

        // Деплоим BorrowShare ERC20 из Market-а
        borrowShare = new BorrowShare(borrowName_, borrowSymbol_);
    }

    function getData(
        string memory title_,
        string memory shareName_, // имя collateralShare (ERC4626)
        string memory borrowName_, // имя borrowShare (ERC20)
        string memory borrowSymbol_,
        uint256 lltv_,
        uint256 interestRate_,
        address vault_,
        address treasure_,
        address collateralToken_
    ) public view returns (bytes memory) {
        return
            abi.encodeCall(
                this.initialize,
                (title_, shareName_, borrowName_, borrowSymbol_, lltv_, interestRate_, vault_, treasure_, collateralToken_)
            );
    }
    
    function getData(address _owner, uint _value) public pure returns(bytes memory) {
        bytes memory data = abi.encodeWithSignature("initialize(address,uint256)",_owner,_value);
        return data;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function _pendingBorrowIndex() internal view returns (uint256) {
        return
            currentBorrowIndex +
            (currentBorrowIndex *
                interestRate *
                (block.number - lastAccrueBlock)) /
                (blockPerYear * 1e10);
    }

    function accrue() internal {
        currentBorrowIndex = _pendingBorrowIndex();
        lastAccrueBlock = block.number;
    }

    /// @notice Текущий долг пользователя (principal + accumulated interest)
    function getCurrentDebt(address user) public view returns (uint256) {
        uint256 principal = userBorrowAmount[user];
        if (principal == 0) return 0;

        uint256 userIndex = userBorrowIndex[user];
        if (userIndex == 0) return 0;

        uint256 pendingIndex = _pendingBorrowIndex();
        return (principal * pendingIndex) / userIndex;
    }

    function getLtv(address user) public view returns (uint256) {
        uint256 collateralAssets = convertToAssets(balanceOf(user));
        uint256 debt = getCurrentDebt(user);
        return
            (debt * borrowPrice * 1e18) / (collateralAssets * collateralPrice);
    }

    function depositMarket(uint256 assets) public {
        accrue();
        super.deposit(assets, msg.sender);
        require(getLtv(msg.sender) < lltv, "LTV will exceed LLTV");
    }

    function withdrawMarket(uint256 amount) public {
        accrue();
        super.withdraw(amount, msg.sender, msg.sender);
        require(getLtv(msg.sender) < lltv, "LTV will exceed LLTV");
    }

    function borrow(uint256 amount) external {
        accrue();

        uint256 debtBefore = getCurrentDebt(msg.sender);
        uint256 shares = (amount * 1e18) / currentBorrowIndex;

        userBorrowAmount[msg.sender] = debtBefore + amount;
        userBorrowIndex[msg.sender] = currentBorrowIndex;

        borrowShare.mint(msg.sender, shares);

        require(getLtv(msg.sender) < lltv, "LTV >= LLTV");
        require(
            borrowToken.transfer(msg.sender, amount),
            "borrow transfer failed"
        );
    }

    function repay(uint256 amount) external {
        accrue();

        uint256 debt = getCurrentDebt(msg.sender);
        uint256 principal = userBorrowAmount[msg.sender];
        uint256 accruedInterest = debt - principal;

        uint256 paidInterest = amount > accruedInterest
            ? accruedInterest
            : amount;
        uint256 paidPrincipal = amount - paidInterest;

        uint256 shares = borrowShare.balanceOf(msg.sender);
        uint256 sharesToBurn = (shares * amount) / debt;

        require(
            borrowToken.transferFrom(msg.sender, address(this), amount),
            "repay transfer failed"
        );

        uint256 vaultReward = (paidInterest * fee) / 100;
        uint256 treasureReward = paidInterest - vaultReward;

        require(
            borrowToken.transfer(vault, paidPrincipal + vaultReward),
            "vault transfer failed"
        );
        require(
            borrowToken.transfer(treasure, treasureReward),
            "treasure transfer failed"
        );

        borrowShare.burn(msg.sender, sharesToBurn);

        uint256 remainingDebt = debt - amount;
        if (remainingDebt == 0) {
            userBorrowAmount[msg.sender] = 0;
            userBorrowIndex[msg.sender] = 0;
        } else {
            userBorrowAmount[msg.sender] = remainingDebt;
            userBorrowIndex[msg.sender] = currentBorrowIndex;
        }
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
            getCurrentDebt(user),
            getLtv(user)
        );
    }

    function returnLiquidityToVault(uint256 amount) external onlyOwner {
        require(borrowToken.transfer(vault, amount), "transfer failed");
    }
}
