// config/contracts.js
import marketAbi from './market.abi.json'
import vaultAbi  from './vault.abi.json'

export const MARKETS = [
    { key: 'market1', title: 'Market 1', address: '0x660D5aFd8A1429Ff31fA7cc8De4F9a988AC95217', abi: marketAbi },
    { key: 'market2', title: 'Market 2', address: '0x7379bD8e9a3522FCBc7e709083cf048D0929ecA0', abi: marketAbi },
]

export const VAULTS = [
    { key: 'vault1', title: 'Vault 1', address: '0x662ACB69b3975a0452Ab98E1E1a6AF5B86CBb106', abi: vaultAbi },
    { key: 'vault2', title: 'Vault 2', address: '0xf53365282CC8783839d6a95C58c430ECc47816eD', abi: vaultAbi },
]
