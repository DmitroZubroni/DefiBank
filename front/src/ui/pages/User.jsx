import { useContext, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AtlantContext } from '../../core/context';
import ContractService from '../../service/ContractService';
import { MARKETS } from '../../service/contracts.js';
import Header from '../component/Header.jsx';
import { typograph } from '../../core/typograph';
import Icon from '../icons/Icon.jsx';
import { EmptyState, LoadingSkeleton, ErrorState, StateSwitcher } from '../component/States.jsx';

const marketServices = MARKETS.map((v) => ({
  ...v,
  service: new ContractService(v.abi, v.address),
}));

const MARKET_ICONS = { market1: 'bolt', market2: 'gem', market3: 'shield' };

const User = () => {
  const { wallet, currentAccount, login, stateMode, setStateMode } = useContext(AtlantContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const loadUserData = useCallback(async () => {
    if (!wallet) return;
    setLoading(true);
    setHasError(false);
    try {
      const usersData = await Promise.all(
        marketServices.map(async (item) => {
          const data = await item.service.getUserInfo(wallet);
          return { ...item, data };
        })
      );
      setUsers(usersData);
    } catch (err) {
      console.error('Failed to load user positions:', err);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }, [wallet]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  if (!wallet) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Header />
        <main className="container" id="main-content" style={{ paddingTop: '3rem' }}>
          <EmptyState
            title="Институциональный кошелек не подключен"
            description="Авторизуйтесь с помощью Web3-провайдера или выберите демонстрационный профиль для просмотра портфеля, залогов и хранилищ ERC-4626."
            actionLabel="Подключить кошелек"
            onAction={() => login()}
            icon="lock"
          />
        </main>
        <StateSwitcher />
      </div>
    );
  }

  const transactions = currentAccount?.transactions || [];

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />

      <main className="container" id="main-content">
        <section className="card card--hero section">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="eyebrow">{typograph('ИНСТИТУЦИОНАЛЬНЫЙ ПОРТФЕЛЬ · ДЕМО')}</span>
              <h1 className="h2 mt-2" style={{ marginBottom: '0.25rem' }}>
                {currentAccount?.name || 'Институциональный клиент'}
              </h1>
              <div className="mono-number text-muted truncate" style={{ maxWidth: '65ch' }}>
                {wallet}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="badge badge--emerald badge--dot">Web3 Verified</span>
              <span className="badge badge--gold">{currentAccount?.tier || 'Tier 1'}</span>
            </div>
          </div>

          <div className="stat-row mt-4" style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
            <div className="data-tile">
              <span className="data-tile__label">{typograph('Баланс USDC')}</span>
              <span className="data-tile__value mono-number" style={{ display: 'block' }}>
                ${currentAccount?.balanceUSDC?.toLocaleString?.('ru-RU') ?? '0.00'}
              </span>
            </div>
            <div className="data-tile">
              <span className="data-tile__label">{typograph('Баланс wETH')}</span>
              <span className="data-tile__value mono-number" style={{ display: 'block', color: 'var(--emerald)' }}>
                {currentAccount?.balanceETH?.toLocaleString?.('ru-RU') ?? '0.00'} ETH
              </span>
            </div>
            <div className="data-tile">
              <span className="data-tile__label">{typograph('Баланс WBTC')}</span>
              <span className="data-tile__value mono-number" style={{ display: 'block', color: 'var(--gold)' }}>
                {currentAccount?.balanceBTC?.toLocaleString?.('ru-RU') ?? '0.00'} BTC
              </span>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section__head">
            <div>
              <h2 className="h2">{typograph('Активные позиции на кредитных рынках')}</h2>
              <p className="text-muted mt-2 mb-0">{typograph('Баланс предоставленных залогов и непогашенная сумма займов')}</p>
            </div>
          </div>

          {stateMode === 'loading' || loading ? (
            <LoadingSkeleton count={2} />
          ) : stateMode === 'error' || hasError ? (
            <ErrorState
              title="Не удалось загрузить позиции портфеля"
              description="RPC-узел не отвечает на запрос балансов пользователя."
              onRetry={loadUserData}
            />
          ) : stateMode === 'empty' || users.length === 0 ? (
            <EmptyState
              title="Нет открытых кредитных позиций"
              description="Вы еще не предоставили залог и не привлекали займы в активных рынках ликвидности."
              actionLabel="Перейти к кредитованию"
              onAction={() => setStateMode('normal')}
            />
          ) : (
            <div className="grid-cards grid-cards--2">
              {users.map((u) => (
                <div key={u.key || u.address} className="card card--pad">
                  <div>
                    <div className="flex items-center justify-between gap-2" style={{ marginBottom: '1rem' }}>
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="glyph-tile glyph-tile--sm glyph-tile--neutral">
                          <Icon name={MARKET_ICONS[u.key] || 'layers'} size={18} />
                        </span>
                        <div className="min-w-0">
                          <h3 className="h3 truncate" style={{ fontSize: '1.05rem' }}>
                            {u.title}
                          </h3>
                          <div className="text-subtle mono-number truncate" style={{ fontSize: '0.72rem' }}>
                            {u.address}
                          </div>
                        </div>
                      </div>
                      <span className="badge badge--gold">LTV: {u.data?.[4]?.toString?.() || '0%'}</span>
                    </div>

                    <div className="data-tile">
                      <div className="data-grid">
                        <div>
                          <span className="data-tile__label">{typograph('Доли займа')}</span>
                          <div className="mono-number" style={{ fontWeight: 700 }}>
                            {u.data?.[0]?.toString?.() || '0'}
                          </div>
                        </div>
                        <div>
                          <span className="data-tile__label">{typograph('Доли залога')}</span>
                          <div className="mono-number" style={{ fontWeight: 700, color: 'var(--emerald)' }}>
                            {u.data?.[1]?.toString?.() || '0'}
                          </div>
                        </div>
                        <div className="data-grid__divider">
                          <span className="data-tile__label">{typograph('Индекс пользователя')}</span>
                          <div className="mono-number" style={{ fontWeight: 700 }}>
                            {u.data?.[2]?.toString?.() || '1.000'}
                          </div>
                        </div>
                        <div>
                          <span className="data-tile__label">{typograph('Текущий долг')}</span>
                          <div className="mono-number" style={{ fontWeight: 700, color: 'var(--gold)' }}>
                            {u.data?.[3]?.toString?.() || '0.00'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link to="/borrow" className="btn btn--secondary btn--block mt-4">
                    {typograph('Управление залогом')}
                    <Icon name="arrowRight" size={16} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="section">
          <div className="section__head">
            <div>
              <h2 className="h2">{typograph('Журнал транзакций блокчейна')}</h2>
              <p className="text-muted mt-2 mb-0">{typograph('История операций с депозитами, займами и хранилищами (демо-данные сессии)')}</p>
            </div>
            <span className="badge badge--gold">
              {transactions.length} {typograph('записей')}
            </span>
          </div>

          {transactions.length === 0 ? (
            <div className="card card--pad text-muted" style={{ textAlign: 'center' }}>
              {typograph('Транзакции пока не совершались в данной сессии.')}
            </div>
          ) : (
            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="table-scroll">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">{typograph('ОПЕРАЦИЯ')}</th>
                      <th scope="col" className="is-numeric">{typograph('СУММА')}</th>
                      <th scope="col">{typograph('ХЭШ')}</th>
                      <th scope="col" className="is-numeric">{typograph('СТАТУС')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id}>
                        <td style={{ fontWeight: 600 }}>{typograph(tx.title)}</td>
                        <td className="mono-number is-numeric" style={{ fontWeight: 700 }}>
                          {tx.amount}
                        </td>
                        <td className="mono-number text-subtle">{tx.hash}</td>
                        <td className="is-numeric">
                          <span className="badge badge--emerald badge--dot">{typograph('Подтверждено')}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>

      <StateSwitcher />
    </div>
  );
};

export default User;
