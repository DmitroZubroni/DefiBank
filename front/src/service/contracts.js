// config/contracts.js
import marketAbi from './market.abi.json'
import vaultAbi  from './vault.abi.json'

export const MARKETS = [
    { id: 'market1', label: 'Market 1', address: '0xf53365282CC8783839d6a95C58c430ECc47816eD', abi: marketAbi },
    { id: 'market2', label: 'Market 2', address: '0x00f97040Edee9831982186Fe17373FB4d2e9cC9F', abi: marketAbi },
    { id: 'market3', label: 'Market 3', address: '0x660D5aFd8A1429Ff31fA7cc8De4F9a988AC95217', abi: marketAbi },
]

export const VAULTS = [
    { id: 'vault1', label: 'Vault 1', address: '0xBcD9f04Bf2b82090AC375EF70020CD18A4aFb5Fa', abi: vaultAbi },
    { id: 'vault2', label: 'Vault 2', address: '0xE094A146323E525e9db536907ad6b7ab9d0FCAbe', abi: vaultAbi },
]