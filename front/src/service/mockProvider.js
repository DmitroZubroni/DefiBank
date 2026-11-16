// Mock Web3 & ERC-4626 Storage for DefiBank Institutional Vault
// Полная изоляция от Docker/Geth с сохранением в localStorage

const STORAGE_KEY = 'defibank_mock_state_v2';

const INITIAL_STATE = {
  activeAccount: '0x71C8324eB738A5bF7A23d51082c18B5034D9B29F',
  accounts: {
    '0x71C8324eB738A5bF7A23d51082c18B5034D9B29F': {
      name: 'Atlant Family Office LP',
      tier: 'Institutional Tier 1',
      balanceUSDC: 1250000,
      balanceETH: 145.5,
      balanceBTC: 12.8,
      vaultPositions: {
        vault1: { shares: 485000, depositedAsset: 525000 },
        vault2: { shares: 35.2, depositedAsset: 36.3 },
        vault3: { shares: 2.5, depositedAsset: 2.545 },
      },
      marketPositions: {
        market1: {
          borrowShares: 150000,
          collateralShares: 95.0, // wETH
          userIndex: 1.024,
          currentDebt: 153600,
          ltvPercent: '58.4%',
        },
        market2: {
          borrowShares: 80000,
          collateralShares: 4.2, // WBTC
          userIndex: 1.018,
          currentDebt: 81440,
          ltvPercent: '64.2%',
        },
        market3: {
          borrowShares: 0,
          collateralShares: 0,
          userIndex: 1.0,
          currentDebt: 0,
          ltvPercent: '0.0%',
        },
      },
      transactions: [
        {
          id: 'tx_101',
          type: 'deposit_vault',
          title: 'Депозит в Atlant Prime Yield USDC',
          amount: '100 000 USDC',
          shares: '92 233 vUSDC',
          timestamp: Date.now() - 3600000 * 2,
          status: 'success',
          hash: '0x9a8f...3e21',
        },
        {
          id: 'tx_102',
          type: 'deposit_collateral',
          title: 'Предоставление залога wETH',
          amount: '25.0 wETH',
          shares: '25.0 shares',
          timestamp: Date.now() - 3600000 * 8,
          status: 'success',
          hash: '0x4f12...bd78',
        },
      ],
    },
    '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7': {
      name: 'Caspian Capital Partners',
      tier: 'Institutional Tier 2',
      balanceUSDC: 4800000,
      balanceETH: 320.0,
      balanceBTC: 28.5,
      vaultPositions: {},
      marketPositions: {},
      transactions: [],
    },
    '0x28C6c06298d514Db089934071355E5743bf21d60': {
      name: 'Apex Treasury Reserve',
      tier: 'Sovereign / Treasury',
      balanceUSDC: 12500000,
      balanceETH: 850.0,
      balanceBTC: 95.0,
      vaultPositions: {
        vault1: { shares: 2500000, depositedAsset: 2710500 },
      },
      marketPositions: {
        market1: {
          borrowShares: 0,
          collateralShares: 400.0,
          userIndex: 1.0,
          currentDebt: 0,
          ltvPercent: '0.0%',
        },
      },
      transactions: [],
    },
  },
  vaults: {
    vault1: {
      address: '0x662ACB69b3975a0452Ab98E1E1a6AF5B86CBb106',
      title: 'Atlant Prime Yield USDC',
      asset: 'USDC',
      shareSymbol: 'vUSDC-4626',
      totalAssets: 24850000,
      apyPercent: '14.85%',
      sharePrice: 1.0842,
      totalShares: 22920125,
      riskScore: 'AAA (Audited)',
      lockupPeriod: 'Без блокировки',
    },
    vault2: {
      address: '0xf53365282CC8783839d6a95C58c430ECc47816eD',
      title: 'Caspian Treasury wETH',
      asset: 'wETH',
      shareSymbol: 'vwETH-4626',
      totalAssets: 14250,
      apyPercent: '8.20%',
      sharePrice: 1.0315,
      totalShares: 13814,
      riskScore: 'AA+ (Automated)',
      lockupPeriod: 'Без блокировки',
    },
    vault3: {
      address: '0x9923D171bAf294E819385C77b81928dA5619171C',
      title: 'Apex Sovereign BTC Vault',
      asset: 'WBTC',
      shareSymbol: 'vWBTC-4626',
      totalAssets: 850.4,
      apyPercent: '6.95%',
      sharePrice: 1.0180,
      totalShares: 835.3,
      riskScore: 'AAA (Multi-sig)',
      lockupPeriod: 'Без блокировки',
    },
  },
  markets: {
    market1: {
      address: '0x660D5aFd8A1429Ff31fA7cc8De4F9a988AC95217',
      title: 'USDC Prime Market',
      borrowAsset: 'USDC',
      collateralAsset: 'wETH',
      lltv: '85.0%',
      borrowRate: '4.25%',
      borrowIndex: 1.042,
      totalDebt: 18450000,
      totalCollateral: 32600000,
      liquidationBonus: '5.0%',
      oracle: 'Chainlink High-Frequency',
    },
    market2: {
      address: '0x7379bD8e9a3522FCBc7e709083cf048D0929ecA0',
      title: 'USDT Core Liquidity Market',
      borrowAsset: 'USDT',
      collateralAsset: 'WBTC',
      lltv: '80.0%',
      borrowRate: '5.10%',
      borrowIndex: 1.055,
      totalDebt: 12900000,
      totalCollateral: 25100000,
      liquidationBonus: '6.0%',
      oracle: 'Chainlink High-Frequency',
    },
    market3: {
      address: '0x88fA183C9013FaC55C3E3321A58dB3981881B341',
      title: 'EURC Sovereign Vault Market',
      borrowAsset: 'EURC',
      collateralAsset: 'stETH',
      lltv: '88.0%',
      borrowRate: '3.80%',
      borrowIndex: 1.021,
      totalDebt: 8200000,
      totalCollateral: 14500000,
      liquidationBonus: '4.0%',
      oracle: 'Pyth Network Institutional',
    },
  },
};

class MockWeb3Storage {
  constructor() {
    this.state = this.loadState();
    this.listeners = new Set();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all required fields exist
        return {
          ...INITIAL_STATE,
          ...parsed,
          accounts: { ...INITIAL_STATE.accounts, ...(parsed.accounts || {}) },
          vaults: { ...INITIAL_STATE.vaults, ...(parsed.vaults || {}) },
          markets: { ...INITIAL_STATE.markets, ...(parsed.markets || {}) },
        };
      }
    } catch {
      // fallback to memory
    }
    return JSON.parse(JSON.stringify(INITIAL_STATE));
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // ignore quota errors
    }
    this.notify();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  resetToDefault() {
    this.state = JSON.parse(JSON.stringify(INITIAL_STATE));
    this.saveState();
  }

  getActiveAccount() {
    const accKey = this.state.activeAccount;
    return this.state.accounts[accKey] || null;
  }

  setActiveAccount(address) {
    if (this.state.accounts[address]) {
      this.state.activeAccount = address;
      this.saveState();
    } else {
      // Create new mock account
      this.state.accounts[address] = {
        name: `Institutional Client (${address.slice(0, 6)}...${address.slice(-4)})`,
        tier: 'Tier 1 Standard',
        balanceUSDC: 500000,
        balanceETH: 50,
        balanceBTC: 5,
        vaultPositions: {},
        marketPositions: {},
        transactions: [],
      };
      this.state.activeAccount = address;
      this.saveState();
    }
  }

  // Vault ERC-4626 Methods
  async getVaultData(vaultKey) {
    const v = this.state.vaults[vaultKey] || this.state.vaults.vault1;
    // Return tuple compatible with contract ABI call:
    // [0: address, 1: shareSymbol, 2: totalAssets, 3: apyPercent, 4: sharePrice, 5: totalShares, 6: asset]
    return [
      v.address,
      v.shareSymbol,
      `${v.totalAssets.toLocaleString('ru-RU')} ${v.asset}`,
      v.apyPercent,
      v.sharePrice.toFixed(4),
      v.totalShares.toLocaleString('ru-RU'),
      v.asset,
    ];
  }

  async depositVault(vaultKey, amountNum, walletAddress) {
    const acc = this.state.accounts[walletAddress];
    if (!acc) throw new Error('Кошелек не найден');
    const v = this.state.vaults[vaultKey] || this.state.vaults.vault1;

    const sharesToMint = amountNum / v.sharePrice;
    v.totalAssets += amountNum;
    v.totalShares += sharesToMint;

    if (!acc.vaultPositions[vaultKey]) {
      acc.vaultPositions[vaultKey] = { shares: 0, depositedAsset: 0 };
    }
    acc.vaultPositions[vaultKey].shares += sharesToMint;
    acc.vaultPositions[vaultKey].depositedAsset += amountNum;

    // Record transaction
    const tx = {
      id: `tx_${Date.now()}`,
      type: 'deposit_vault',
      title: `Депозит в ${v.title}`,
      amount: `${amountNum.toLocaleString('ru-RU')} ${v.asset}`,
      shares: `${sharesToMint.toFixed(2)} ${v.shareSymbol}`,
      timestamp: Date.now(),
      status: 'success',
      hash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
    };
    acc.transactions.unshift(tx);
    this.saveState();
    return { status: true, transactionHash: tx.hash };
  }

  async withdrawVault(vaultKey, amountNum, walletAddress) {
    const acc = this.state.accounts[walletAddress];
    if (!acc) throw new Error('Кошелек не найден');
    const v = this.state.vaults[vaultKey] || this.state.vaults.vault1;
    const pos = acc.vaultPositions[vaultKey];

    const sharesToBurn = amountNum / v.sharePrice;
    if (!pos || pos.shares < sharesToBurn * 0.99) {
      throw new Error('Недостаточно долей хранилища для вывода указанной суммы');
    }

    pos.shares = Math.max(0, pos.shares - sharesToBurn);
    pos.depositedAsset = Math.max(0, pos.depositedAsset - amountNum);
    v.totalAssets = Math.max(0, v.totalAssets - amountNum);
    v.totalShares = Math.max(0, v.totalShares - sharesToBurn);

    const tx = {
      id: `tx_${Date.now()}`,
      type: 'withdraw_vault',
      title: `Вывод из ${v.title}`,
      amount: `${amountNum.toLocaleString('ru-RU')} ${v.asset}`,
      shares: `${sharesToBurn.toFixed(2)} ${v.shareSymbol}`,
      timestamp: Date.now(),
      status: 'success',
      hash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
    };
    acc.transactions.unshift(tx);
    this.saveState();
    return { status: true, transactionHash: tx.hash };
  }

  // Market Lending Methods
  async getMarketData(marketKey) {
    const m = this.state.markets[marketKey] || this.state.markets.market1;
    // Return tuple:
    // [0: address, 1: lltv, 2: borrowRate, 3: borrowIndex, 4: totalDebt, 5: totalCollateral, 6: borrowAsset, 7: collateralAsset]
    return [
      m.address,
      m.lltv,
      m.borrowRate,
      m.borrowIndex.toFixed(3),
      `${m.totalDebt.toLocaleString('ru-RU')} ${m.borrowAsset}`,
      `${m.totalCollateral.toLocaleString('ru-RU')} ${m.collateralAsset}`,
      m.borrowAsset,
      m.collateralAsset,
    ];
  }

  async getUserInfo(marketKey, walletAddress) {
    const acc = this.state.accounts[walletAddress];
    if (!acc || !acc.marketPositions[marketKey]) {
      return ['0.00', '0.00', '1.000', '0.00', '0.0%'];
    }
    const pos = acc.marketPositions[marketKey];
    return [
      pos.borrowShares.toLocaleString('ru-RU'),
      pos.collateralShares.toLocaleString('ru-RU'),
      pos.userIndex.toFixed(3),
      pos.currentDebt.toLocaleString('ru-RU'),
      pos.ltvPercent,
    ];
  }

  async depositMarket(marketKey, amountNum, walletAddress) {
    const acc = this.state.accounts[walletAddress];
    if (!acc) throw new Error('Кошелек не найден');
    const m = this.state.markets[marketKey] || this.state.markets.market1;

    if (!acc.marketPositions[marketKey]) {
      acc.marketPositions[marketKey] = {
        borrowShares: 0,
        collateralShares: 0,
        userIndex: 1.0,
        currentDebt: 0,
        ltvPercent: '0.0%',
      };
    }
    const pos = acc.marketPositions[marketKey];
    pos.collateralShares += amountNum;
    m.totalCollateral += amountNum;

    // Recalculate LTV
    if (pos.currentDebt > 0 && pos.collateralShares > 0) {
      const estimatedRatio = (pos.currentDebt / (pos.collateralShares * 2500)) * 100;
      pos.ltvPercent = `${Math.min(99, Math.max(1, estimatedRatio)).toFixed(1)}%`;
    }

    const tx = {
      id: `tx_${Date.now()}`,
      type: 'deposit_collateral',
      title: `Внесение залога в ${m.title}`,
      amount: `${amountNum.toLocaleString('ru-RU')} ${m.collateralAsset}`,
      timestamp: Date.now(),
      status: 'success',
      hash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
    };
    acc.transactions.unshift(tx);
    this.saveState();
    return { status: true, transactionHash: tx.hash };
  }

  async withdrawMarket(marketKey, amountNum, walletAddress) {
    const acc = this.state.accounts[walletAddress];
    if (!acc) throw new Error('Кошелек не найден');
    const m = this.state.markets[marketKey] || this.state.markets.market1;
    const pos = acc.marketPositions[marketKey];

    if (!pos || pos.collateralShares < amountNum) {
      throw new Error('Сумма превышает внесенный размер залога');
    }

    pos.collateralShares -= amountNum;
    m.totalCollateral = Math.max(0, m.totalCollateral - amountNum);

    const tx = {
      id: `tx_${Date.now()}`,
      type: 'withdraw_collateral',
      title: `Вывод залога из ${m.title}`,
      amount: `${amountNum.toLocaleString('ru-RU')} ${m.collateralAsset}`,
      timestamp: Date.now(),
      status: 'success',
      hash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
    };
    acc.transactions.unshift(tx);
    this.saveState();
    return { status: true, transactionHash: tx.hash };
  }

  async borrow(marketKey, amountNum, walletAddress) {
    const acc = this.state.accounts[walletAddress];
    if (!acc) throw new Error('Кошелек не найден');
    const m = this.state.markets[marketKey] || this.state.markets.market1;

    if (!acc.marketPositions[marketKey]) {
      acc.marketPositions[marketKey] = {
        borrowShares: 0,
        collateralShares: 0,
        userIndex: 1.0,
        currentDebt: 0,
        ltvPercent: '0.0%',
      };
    }
    const pos = acc.marketPositions[marketKey];
    if (pos.collateralShares <= 0) {
      throw new Error('Для займа необходимо сначала внести залог (Collateral)');
    }

    pos.borrowShares += amountNum;
    pos.currentDebt += amountNum;
    m.totalDebt += amountNum;

    const estimatedRatio = (pos.currentDebt / (pos.collateralShares * 2500)) * 100;
    pos.ltvPercent = `${Math.min(95, Math.max(5, estimatedRatio)).toFixed(1)}%`;

    const tx = {
      id: `tx_${Date.now()}`,
      type: 'borrow',
      title: `Взят займ в ${m.title}`,
      amount: `${amountNum.toLocaleString('ru-RU')} ${m.borrowAsset}`,
      timestamp: Date.now(),
      status: 'success',
      hash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
    };
    acc.transactions.unshift(tx);
    this.saveState();
    return { status: true, transactionHash: tx.hash };
  }

  async repay(marketKey, amountNum, walletAddress) {
    const acc = this.state.accounts[walletAddress];
    if (!acc) throw new Error('Кошелек не найден');
    const m = this.state.markets[marketKey] || this.state.markets.market1;
    const pos = acc.marketPositions[marketKey];

    if (!pos || pos.currentDebt <= 0) {
      throw new Error('У вас нет активной задолженности в данном рынке');
    }

    const repayAmt = Math.min(amountNum, pos.currentDebt);
    pos.currentDebt = Math.max(0, pos.currentDebt - repayAmt);
    pos.borrowShares = Math.max(0, pos.borrowShares - repayAmt);
    m.totalDebt = Math.max(0, m.totalDebt - repayAmt);

    if (pos.collateralShares > 0 && pos.currentDebt > 0) {
      const estimatedRatio = (pos.currentDebt / (pos.collateralShares * 2500)) * 100;
      pos.ltvPercent = `${Math.min(95, Math.max(0, estimatedRatio)).toFixed(1)}%`;
    } else {
      pos.ltvPercent = '0.0%';
    }

    const tx = {
      id: `tx_${Date.now()}`,
      type: 'repay',
      title: `Погашение займа в ${m.title}`,
      amount: `${repayAmt.toLocaleString('ru-RU')} ${m.borrowAsset}`,
      timestamp: Date.now(),
      status: 'success',
      hash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
    };
    acc.transactions.unshift(tx);
    this.saveState();
    return { status: true, transactionHash: tx.hash };
  }
}

export const mockStorage = new MockWeb3Storage();
