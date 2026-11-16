import { useState, useEffect } from 'react';
import { AtlantContext } from './AtlantContext';
import { mockStorage } from '../service/mockProvider';

export { AtlantContext };

export const AppProvider = ({ children }) => {
  const [mockState, setMockState] = useState(mockStorage.state);
  const [wallet, setWallet] = useState(
    localStorage.getItem('defibank_wallet') || mockStorage.state.activeAccount
  );
  // Режимы экрана по правилу У1 и Н4: normal | loading | empty | error | success
  const [stateMode, setStateMode] = useState('normal');
  const [toast, setToast] = useState(null);

  // Синхронизация с mockStorage
  useEffect(() => {
    const unsubscribe = mockStorage.subscribe((newState) => {
      setMockState({ ...newState });
    });
    return () => unsubscribe();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  const login = async (customAddress) => {
    let targetAddress = customAddress;
    if (!targetAddress && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts[0]) {
          targetAddress = accounts[0];
        }
      } catch (e) {
        console.warn('MetaMask request rejected, using institutional mock wallet:', e);
      }
    }

    if (!targetAddress) {
      targetAddress = '0x71C8324eB738A5bF7A23d51082c18B5034D9B29F';
    }

    setWallet(targetAddress);
    localStorage.setItem('defibank_wallet', targetAddress);
    mockStorage.setActiveAccount(targetAddress);
    showToast('Кошелек успешно подключен к узлу DefiBank', 'success');
  };

  const logout = async () => {
    setWallet('');
    localStorage.removeItem('defibank_wallet');
    showToast('Кошелек отключен от сессии', 'info');
  };

  const switchAccount = (address) => {
    setWallet(address);
    localStorage.setItem('defibank_wallet', address);
    mockStorage.setActiveAccount(address);
    showToast(`Переключен профиль: ${mockStorage.state.accounts[address]?.name || address}`, 'info');
  };

  const currentAccount = wallet ? mockState.accounts[wallet] || mockStorage.getActiveAccount() : null;

  const values = {
    wallet,
    currentAccount,
    mockState,
    login,
    logout,
    switchAccount,
    stateMode,
    setStateMode,
    toast,
    showToast,
  };

  return <AtlantContext.Provider value={values}>{children}</AtlantContext.Provider>;
};
