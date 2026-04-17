// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./Token.sol";

contract Vault is Initializable, ERC4626Upgradeable, UUPSUpgradeable {
    string public vaultTitle;
    uint256 public managedAssets; // Суммарные "управляемые" активы (для расчёта цены шейра)
    address public owner;
    uint apy;
    BorrowToken public borrowToken;

    modifier onlyOwner() {
        require(msg.sender == owner, "Vault: not owner");
        _;
    }

    function initialize(
        string memory _title,
        string memory _shareName,
        string memory _shareSymbol,
        address _borrowToken
    ) external initializer {
        __ERC4626_init(IERC20(_borrowToken));
        __ERC20_init(_shareName, _shareSymbol);
        borrowToken = BorrowToken(_borrowToken);
        vaultTitle = _title;
        owner = msg.sender;
        apy = 10;
    }

    function totalAssets() public view override returns (uint256) {
        return managedAssets;
    }

    function depositVault(uint256 amount) external {
        require(amount >= 10 * 10 ** decimals(), "min 10");
        uint256 shares = previewDeposit(amount);
        _mint(msg.sender, shares);
        borrowToken.transferCustom(msg.sender, address(this), amount);
        managedAssets += amount;
    }

    function withdrawVault(uint256 amount) external {
        uint256 shares = previewWithdraw(amount);
        _burn(msg.sender, shares);
        borrowToken.transferCustom(address(this), msg.sender, amount);
        managedAssets -= amount;
    }

    function allocateToMarket(
        address market,
        uint256 amount
    ) external onlyOwner {
        borrowToken.transferCustom(address(this), market, amount);
    }

    function addReward(uint256 amount) external {
        managedAssets += amount;
    }

    /// @notice Полная информация о Vault.
    function getVault()
    external
    view
    returns (
        string memory _title,
        string memory _shareName,
        uint256 _managedAssets,
        uint256 _totalShares,
        uint256 _sharePrice,
        address _asset
    )
{
    uint256 supply = totalSupply();
    uint256 sharePrice = supply == 0 ? 0 : managedAssets / supply;

    return (vaultTitle, name(), managedAssets, supply, sharePrice, asset());
}

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
