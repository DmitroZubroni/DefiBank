import { useContext, useEffect, useRef, useState } from 'react';
import { AtlantContext } from '../../core/context.jsx';
import { NavLink, Link } from 'react-router-dom';
import { typograph } from '../../core/typograph';
import Icon from '../icons/Icon.jsx';
import DemoBanner from './DemoBanner.jsx';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Обзор' },
  { to: '/lender', label: 'Хранилища' },
  { to: '/borrow', label: 'Кредитование' },
  { to: '/', label: 'Портфель' },
];

const Header = () => {
  const { wallet, currentAccount, mockState, login, logout, switchAccount, toast } = useContext(AtlantContext);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [customInputAddr, setCustomInputAddr] = useState('');
  const modalRef = useRef(null);
  const accountTriggerRef = useRef(null);

  const shortAddress = wallet ? `${wallet.slice(0, 6)}…${wallet.slice(-4)}` : '';

  const handleCustomLogin = (e) => {
    e.preventDefault();
    if (customInputAddr.trim().length >= 10) {
      login(customInputAddr.trim());
      setShowAccountModal(false);
      setCustomInputAddr('');
    }
  };

  const closeModal = () => {
    setShowAccountModal(false);
    accountTriggerRef.current?.focus();
  };

  // Д3: модальное окно держит фокус и закрывается по Esc (чисто интерфейсное
  // поведение диалога — без изменений в логике подключения кошелька).
  useEffect(() => {
    if (!showAccountModal) return;
    const dialog = modalRef.current;
    const focusable = dialog?.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
    focusable?.[0]?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
        return;
      }
      if (e.key === 'Tab' && focusable && focusable.length > 0) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [showAccountModal]);

  return (
    <>
      <a href="#main-content" className="skip-link">
        {typograph('Перейти к содержимому')}
      </a>

      <DemoBanner />

      <header className="app-header">
        <div className="app-header__bar">
          <Link to="/dashboard" className="brand" aria-label="DefiBank Vault — главная страница">
            <span className="brand__mark">
              <Icon name="vault" size={22} style={{ color: 'var(--gold)' }} />
            </span>
            <span>
              <span className="brand__name">DefiBank Vault</span>
              <span className="brand__tag mono-number" style={{ display: 'block' }}>
                INSTITUTIONAL ERC-4626
              </span>
            </span>
          </Link>

          <nav aria-label="Разделы платформы" className="main-nav">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
              >
                {typograph(item.label)}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {wallet ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  ref={accountTriggerRef}
                  onClick={() => setShowAccountModal(true)}
                  className="btn btn--secondary btn--sm"
                  aria-haspopup="dialog"
                >
                  <Icon name="dot" size={10} style={{ color: 'var(--emerald)' }} />
                  <span className="flex flex-col" style={{ alignItems: 'flex-start', lineHeight: 1.2 }}>
                    <span className="mono-number truncate" style={{ maxWidth: 110 }}>
                      {shortAddress}
                    </span>
                    <span className="text-subtle" style={{ fontSize: '0.65rem' }}>
                      {currentAccount?.name || 'Институциональный клиент'}
                    </span>
                  </span>
                  <Icon name="chevronDown" size={14} />
                </button>

                <button type="button" onClick={logout} className="btn btn--secondary btn--sm">
                  {typograph('Выйти')}
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => login()} className="btn btn--primary btn--sm">
                <Icon name="wallet" size={16} />
                {typograph('Подключить кошелек')}
              </button>
            )}
          </div>
        </div>
      </header>

      {toast && (
        <aside role="status" aria-live="polite" className="toast">
          <div className={`toast__body toast__body--${toast.type === 'success' ? 'success' : 'info'}`}>
            <Icon name={toast.type === 'success' ? 'check' : 'info'} size={16} style={{ color: toast.type === 'success' ? 'var(--emerald)' : 'var(--gold)' }} />
            <span>{typograph(toast.message)}</span>
          </div>
        </aside>
      )}

      {showAccountModal && (
        <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && closeModal()}>
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-modal-title"
            className="modal"
          >
            <div className="modal__head">
              <h2 id="account-modal-title" className="h3" style={{ marginBottom: 0 }}>
                {typograph('Институциональные счета')}
              </h2>
              <button type="button" onClick={closeModal} className="icon-btn" aria-label="Закрыть окно">
                <Icon name="close" size={18} />
              </button>
            </div>

            <p className="text-muted text-small mt-2" style={{ marginBottom: '1rem' }}>
              {typograph('Выберите готовый демонстрационный профиль с предзаполненными балансами и залогами:')}
            </p>

            <div className="flex flex-col gap-2" style={{ marginBottom: '1.25rem' }}>
              {Object.entries(mockState.accounts).map(([addr, acc]) => {
                const isSelected = wallet?.toLowerCase() === addr.toLowerCase();
                return (
                  <button
                    key={addr}
                    type="button"
                    onClick={() => {
                      switchAccount(addr);
                      closeModal();
                    }}
                    className={`account-option ${isSelected ? 'is-selected' : ''}`}
                    aria-pressed={isSelected}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span style={{ fontWeight: 700, color: 'var(--text)' }}>{acc.name}</span>
                      <span className="badge badge--gold">{acc.tier}</span>
                    </span>
                    <span className="mono-number text-subtle truncate" style={{ display: 'block', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                      {addr}
                    </span>
                    <span className="flex gap-3 mono-number text-small text-muted mt-2" style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                      <span>USDC: {acc.balanceUSDC?.toLocaleString?.('ru-RU')}</span>
                      <span>ETH: {acc.balanceETH}</span>
                      <span>BTC: {acc.balanceBTC}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleCustomLogin} style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <label htmlFor="custom-wallet" className="field__label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                {typograph('Или укажите произвольный адрес кошелька:')}
              </label>
              <div className="flex gap-2">
                <input
                  id="custom-wallet"
                  type="text"
                  placeholder="0x…"
                  value={customInputAddr}
                  onChange={(e) => setCustomInputAddr(e.target.value)}
                  className="input mono-number"
                  style={{ fontSize: '0.85rem' }}
                />
                <button type="submit" className="btn btn--primary btn--sm">
                  {typograph('Войти')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
