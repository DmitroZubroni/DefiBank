// ContractService.jsx - Высокопроизводительный сервис смарт-контрактов
// Поддерживает безопасный мок-провайдер ERC-4626 без необходимости запускать Geth в Docker

import { mockStorage } from "./mockProvider";
import { MARKETS, VAULTS } from "./contracts";

export default class ContractService {
  constructor(abi, address) {
    this.abi = abi;
    this.address = address;

    // Определение типа и ключа контракта
    const foundMarket = MARKETS.find(
      (m) => m.address?.toLowerCase() === address?.toLowerCase()
    );
    const foundVault = VAULTS.find(
      (v) => v.address?.toLowerCase() === address?.toLowerCase()
    );

    this.type = foundMarket ? "market" : foundVault ? "vault" : "unknown";
    this.key = foundMarket ? foundMarket.key : foundVault ? foundVault.key : "vault1";
  }

  // Задержка для реалистичного UX транзакций
  async _delay(ms = 200) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // --- МЕТОДЫ РЫНКОВ ЗАЙМОВ (LENDING MARKETS) ---

  async depositMarket(amount, wallet) {
    await this._delay(300);
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      throw new Error("Некорректная сумма депозита");
    }
    return await mockStorage.depositMarket(this.key, num, wallet);
  }

  async withdrawMarket(amount, wallet) {
    await this._delay(300);
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      throw new Error("Некорректная сумма вывода");
    }
    return await mockStorage.withdrawMarket(this.key, num, wallet);
  }

  async borrow(amount, wallet) {
    await this._delay(350);
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      throw new Error("Некорректная сумма займа");
    }
    return await mockStorage.borrow(this.key, num, wallet);
  }

  async repay(amount, wallet) {
    await this._delay(300);
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      throw new Error("Некорректная сумма погашения");
    }
    return await mockStorage.repay(this.key, num, wallet);
  }

  async getMarket() {
    await this._delay(80);
    return await mockStorage.getMarketData(this.key);
  }

  async getUserInfo(user) {
    await this._delay(80);
    return await mockStorage.getUserInfo(this.key, user);
  }

  // --- МЕТОДЫ ХРАНИЛИЩ СТЕЙКИНГА (ERC-4626 VAULTS) ---

  async depositVault(amount, wallet) {
    await this._delay(350);
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      throw new Error("Некорректная сумма депозита в хранилище");
    }
    return await mockStorage.depositVault(this.key, num, wallet);
  }

  async withdrawVault(amount, wallet) {
    await this._delay(350);
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      throw new Error("Некорректная сумма вывода из хранилища");
    }
    return await mockStorage.withdrawVault(this.key, num, wallet);
  }

  async getVault() {
    await this._delay(80);
    return await mockStorage.getVaultData(this.key);
  }
}
