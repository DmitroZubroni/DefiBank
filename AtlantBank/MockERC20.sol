// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Простой ERC20 для тестов (USDC, PYUSD, USDT, USD1, DAI)
contract MockToken is ERC20 {
    uint8 private immutable _decimals;

    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 initialSupply,
        address initialHolder
    ) ERC20(name_, symbol_) {
        _decimals = decimals_;
        _mint(initialHolder, initialSupply);
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    // Функция для минта (для тестов)
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function burn(address to, uint256 amount) external {
        _burn(to, amount);
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public override returns (bool) {
        _transfer(from, to, value);
        return true;
    }
}

contract BorrowShare is ERC20 {
    address public immutable market;

    modifier onlyMarket() {
        require(msg.sender == market, "BorrowShare: only market");
        _;
    }

    constructor(
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_) {
        market = msg.sender; // при деплое через proxy: msg.sender == proxy address
    }

    function mint(address to, uint256 amount) external onlyMarket {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyMarket {
        _burn(from, amount);
    }

    function transfer(address, uint256) public pure override returns (bool) {
        revert("NON_TRANSFERABLE");
    }

    function transferFrom(
        address,
        address,
        uint256
    ) public pure override returns (bool) {
        revert("NON_TRANSFERABLE");
    }
}
