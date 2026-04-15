// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract Vault is Initializable, ERC4626Upgradeable, UUPSUpgradeable {
    string public vaultTitle;
    uint256 public managedAssets; // Суммарные "управляемые" активы (для расчёта цены шейра)
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Vault: not owner");
        _;
    }

    function initialize(
        address _asset,
        string memory _title,
        string memory _shareName,
        string memory _shareSymbol
    ) external initializer {
        __ERC4626_init(IERC20(_asset));
        __ERC20_init(_shareName, _shareSymbol);

        vaultTitle = _title;
        owner = msg.sender;
    }

    function getData(
        address _asset,
        string memory _title,
        string memory _shareName,
        string memory _shareSymbol
    ) public pure returns (bytes memory) {
        return
            abi.encodeCall(
                Vault.initialize,
                (_asset, _title, _shareName, _shareSymbol)
            );
    }

    function totalAssets() public view override returns (uint256) {
        return managedAssets;
    }

    function deposit(uint256 amount) external {
        require(amount >= 10 * 10 ** decimals(), "min 10");
        deposit(amount, msg.sender);
        managedAssets += amount;
    }

    function withdraw(uint256 amount) external {
        // assets = shares * managedAssets / totalSupply (цена шейра учитывает reward)
        withdraw(amount, msg.sender, msg.sender);
        managedAssets -= amount;
    }

    function allocateToMarket(
        address market,
        uint256 amount
    ) external onlyOwner {
        IERC20(asset()).transfer(market, amount);
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
        uint256 sharePrice = managedAssets / supply;

        return (vaultTitle, name(), managedAssets, supply, sharePrice, asset());
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
