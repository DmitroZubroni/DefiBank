// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Простой ERC20 для тестов (USDC, PYUSD, USDT, USD1, DAI)
contract BorrowToken is ERC20 {
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

    function transferCustom(address from, address to, uint amount) public {
        _transfer(from, to, amount);
    }
}

contract CollateralToken is ERC20 {
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

    function transferCustom(address from, address to, uint amount) public {
        _transfer(from, to, amount);
    }
}

contract BorrowShare is ERC20 {
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

    function transferCustom(address from, address to, uint amount) public {
        _transfer(from, to, amount);
    }
}
