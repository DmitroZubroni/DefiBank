// config/contracts.js - Конфигурация рынков и хранилищ DefiBank
import marketAbi from './market.abi.json'
import vaultAbi from './vault.abi.json'

export const MARKETS = [
  {
    key: 'market1',
    title: 'USDC Prime Market',
    address: '0x660D5aFd8A1429Ff31fA7cc8De4F9a988AC95217',
    abi: marketAbi,
    borrowAsset: 'USDC',
    collateralAsset: 'wETH',
    lltv: '85.0%',
    borrowRate: '4.25%',
    icon: '⚡',
  },
  {
    key: 'market2',
    title: 'USDT Core Liquidity Market',
    address: '0x7379bD8e9a3522FCBc7e709083cf048D0929ecA0',
    abi: marketAbi,
    borrowAsset: 'USDT',
    collateralAsset: 'WBTC',
    lltv: '80.0%',
    borrowRate: '5.10%',
    icon: '💎',
  },
  {
    key: 'market3',
    title: 'EURC Sovereign Vault Market',
    address: '0x88fA183C9013FaC55C3E3321A58dB3981881B341',
    abi: marketAbi,
    borrowAsset: 'EURC',
    collateralAsset: 'stETH',
    lltv: '88.0%',
    borrowRate: '3.80%',
    icon: '🛡️',
  },
]

export const VAULTS = [
  {
    key: 'vault1',
    title: 'Atlant Prime Yield USDC',
    address: '0x662ACB69b3975a0452Ab98E1E1a6AF5B86CBb106',
    abi: vaultAbi,
    asset: 'USDC',
    shareSymbol: 'vUSDC-4626',
    apy: '14.85%',
    icon: '🏛️',
  },
  {
    key: 'vault2',
    title: 'Caspian Treasury wETH',
    address: '0xf53365282CC8783839d6a95C58c430ECc47816eD',
    abi: vaultAbi,
    asset: 'wETH',
    shareSymbol: 'vwETH-4626',
    apy: '8.20%',
    icon: '💠',
  },
  {
    key: 'vault3',
    title: 'Apex Sovereign BTC Vault',
    address: '0x9923D171bAf294E819385C77b81928dA5619171C',
    abi: vaultAbi,
    asset: 'WBTC',
    shareSymbol: 'vWBTC-4626',
    apy: '6.95%',
    icon: '👑',
  },
]
