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
        address tom
    ) ERC20(name_, symbol_) {
        _decimals = decimals_;
        _mint(tom, 1000000000000000000000);
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
        address tom
    ) ERC20(name_, symbol_) {
        _decimals = decimals_;
        _mint(tom, 1000000000000000000000);
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
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
        uint8 decimals_
    ) ERC20(name_, symbol_) {
        _decimals = decimals_;
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    function mint(address from, uint amount) public {
        _mint(from, amount);
    }

    function burn(address from, uint amount) public {
        _burn(from, amount);
    }

    function transferCustom(address from, address to, uint amount) public {
        _transfer(from, to, amount);
    }
}
