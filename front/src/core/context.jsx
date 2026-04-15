import {createContext, useState} from 'react'
const AtlantContext = createContext({})

const AppProvider = ({ children }) => {

    const [wallet, setWallet] = useState(localStorage.getItem('wallet') || '')

    const login = async () => {
        const info = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const walletAddress = info[0]
        setWallet(walletAddress)
        localStorage.setItem('wallet', walletAddress)
        console.log(walletAddress)
    }

    const logout = async () => {
         setWallet("")
        localStorage.removeItem('wallet')
    }

    const values = {
        wallet,
        login,
        logout,
    }

    return <AtlantContext.Provider value={values}>{children}</AtlantContext.Provider>
}

export  {AppProvider, AtlantContext}