import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Header from '../component/Header.jsx';
import ContractService from '../../service/ContractService.jsx';
import { MARKETS, VAULTS } from '../../service/contracts.js';
import { typograph } from '../../core/typograph';
import Icon from '../icons/Icon.jsx';
import VaultIllustration from '../illustrations/VaultIllustration.jsx';
import YieldCurveIllustration from '../illustrations/YieldCurveIllustration.jsx';
import { LoadingSkeleton, EmptyState, ErrorState, SuccessState, StateSwitcher } from '../component/States.jsx';
import { AtlantContext } from '../../core/context.jsx';

const marketServices = MARKETS.map((item) => ({
  ...item,
  service: new ContractService(item.abi, item.address),
}));

const vaultServices = VAULTS.map((item) => ({
  ...item,
  service: new ContractService(item.abi, item.address),
}));

// Презентационное соответствие «ключ хранилища/рынка → иконка» (замена эмодзи из
// contracts.js на кастомные SVG-иконки). Исходные данные контрактов не меняются.
const VAULT_ICONS = { vault1: 'vault', vault2: 'gem', vault3: 'crown' };
const MARKET_ICONS = { market1: 'bolt', market2: 'gem', market3: 'shield' };

export default function Dashboard() {
  const { stateMode, setStateMode } = useContext(AtlantContext);
  const [markets, setMarkets] = useState([]);
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const [marketsData, vaultsData] = await Promise.all([
        Promise.all(
          marketServices.map(async (item) => {
            const data = await item.service.getMarket();
            return { ...item, data };
          })
        ),
        Promise.all(
          vaultServices.map(async (item) => {
            const data = await item.service.getVault();
            return { ...item, data };
          })
        ),
      ]);

      setMarkets(marketsData);
      setVaults(vaultsData);
    } catch (err) {
      console.error('Failed to load DeFi contracts:', err);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Сводные метрики хедлайна — демонстрационные (см. DemoBanner в Header).
  const totalTVL = '$39 950 000';
  const totalBorrowed = '$39 550 000';
  const avgYield = '10,00%';

  const yieldPoints = VAULTS.map((v) => ({ label: v.asset, value: parseFloat(v.apy) }));

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />

      <main className="container" id="main-content">
        <section className="card card--hero section">
          <div className="grid-cards grid-cards--2" style={{ alignItems: 'center' }}>
            <div>
              <span className="badge badge--gold badge--dot mb-0" style={{ marginBottom: '1rem' }}>
                {typograph('Институциональный протокол · демо')}
              </span>

              <h1 className="h1 mt-2" style={{ marginBottom: '0.75rem' }}>
                {typograph('Институциональные хранилища ликвидности и стейкинг')}
              </h1>

              <p className="lede" style={{ marginBottom: '1.5rem' }}>
                {typograph(
                  'Децентрализованный сейф активов с автоматизированным управлением доходностью по стандарту ERC-4626 и изолированными рынками кредитования.'
                )}
              </p>

              <div className="stat-row">
                <div className="data-tile">
                  <span className="data-tile__label">{typograph('ОБЩИЙ TVL ХРАНИЛИЩ')}</span>
                  <span className="data-tile__value mono-number" style={{ color: 'var(--gold)' }}>
                    {totalTVL}
                  </span>
                </div>
                <div className="data-tile">
                  <span className="data-tile__label">{typograph('ОБЪЕМ ЗАЙМОВ')}</span>
                  <span className="data-tile__value mono-number" style={{ color: 'var(--data-secondary)' }}>
                    {totalBorrowed}
                  </span>
                </div>
                <div className="data-tile">
                  <span className="data-tile__label">{typograph('СРЕДНЯЯ ДОХОДНОСТЬ')}</span>
                  <span className="data-tile__value mono-number" style={{ color: 'var(--emerald)' }}>
                    {avgYield} APY
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="vault-illustration-frame">
                <VaultIllustration locked />
              </div>
              <YieldCurveIllustration points={yieldPoints} className="mt-4" />
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section__head">
            <div>
              <h2 className="h2">{typograph('Инвестиционные хранилища (ERC-4626 Vaults)')}</h2>
              <p className="text-muted mt-2 mb-0">
                {typograph('Токенизированные пулы доходности с капитализацией процентов и мгновенным выводом')}
              </p>
            </div>
            <Link to="/lender" className="badge badge--gold no-underline">
              {vaults.length} {typograph('пула')}
              <Icon name="arrowRight" size={12} />
            </Link>
          </div>

          {stateMode === 'loading' || (loading && stateMode === 'normal') ? (
            <LoadingSkeleton count={3} />
          ) : stateMode === 'error' || hasError ? (
            <ErrorState
              title="Не удалось загрузить параметры хранилищ"
              description="RPC-узел не отвечает на вызовы ERC-4626. Проверьте соединение или повторите запрос."
              onRetry={loadData}
            />
          ) : stateMode === 'empty' ? (
            <EmptyState
              title="Хранилища временно отсутствуют"
              description="В данный момент нет открытых пулов ликвидности. Новые институциональные хранилища будут добавлены в ближайшее время."
              actionLabel="Обновить список"
              onAction={loadData}
            />
          ) : stateMode === 'success' ? (
            <SuccessState
              title="Параметры хранилищ верифицированы"
              description="Смарт-контракты ERC-4626 проверены мультисиг-аудитом. Все балансы синхронизированы."
              actionLabel="Внести депозит"
              onAction={() => setStateMode('normal')}
            />
          ) : (
            <div className="grid-cards">
              {vaults.map((vault) => (
                <div key={vault.key || vault.address} className="card card--pad">
                  <div>
                    <div className="flex items-center justify-between gap-2" style={{ marginBottom: '1rem' }}>
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="glyph-tile glyph-tile--gold">
                          <Icon name={VAULT_ICONS[vault.key] || 'layers'} size={20} />
                        </span>
                        <div className="min-w-0">
                          <h3 className="h3 truncate" style={{ fontSize: '1.05rem' }}>
                            {vault.title}
                          </h3>
                          <div className="text-subtle mono-number truncate" style={{ fontSize: '0.72rem' }}>
                            {vault.data?.[1]?.toString?.() || vault.shareSymbol}
                          </div>
                        </div>
                      </div>
                      <span className="badge badge--emerald">{vault.apy || '12.5%'} APY</span>
                    </div>

                    <div className="data-tile" style={{ marginBottom: '1rem' }}>
                      <div className="data-grid">
                        <div>
                          <span className="data-tile__label">{typograph('Активы под управлением')}</span>
                          <div className="mono-number" style={{ fontWeight: 700 }}>
                            {vault.data?.[2]?.toString?.() || '0.00'}
                          </div>
                        </div>
                        <div>
                          <span className="data-tile__label">{typograph('Цена доли')}</span>
                          <div className="mono-number" style={{ fontWeight: 700, color: 'var(--gold)' }}>
                            {vault.data?.[4]?.toString?.() || '1.0000'}
                          </div>
                        </div>
                        <div className="data-grid__divider">
                          <span className="data-tile__label">{typograph('Адрес смарт-контракта (демо)')}</span>
                          <div className="mono-number text-subtle truncate" style={{ fontSize: '0.72rem' }}>
                            {vault.address}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link to="/lender" className="btn btn--primary btn--block">
                    {typograph('Управление депозитом')}
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
              <h2 className="h2">{typograph('Кредитные рынки (Lending Markets)')}</h2>
              <p className="text-muted mt-2 mb-0">
                {typograph('Изолированные рынки залогового кредитования с защитой от каскадных ликвидаций')}
              </p>
            </div>
            <Link to="/borrow" className="badge badge--gold no-underline">
              {markets.length} {typograph('рынка')}
              <Icon name="arrowRight" size={12} />
            </Link>
          </div>

          {stateMode === 'loading' || (loading && stateMode === 'normal') ? (
            <LoadingSkeleton count={3} />
          ) : stateMode === 'error' ? (
            <ErrorState
              title="Ошибка загрузки кредитных рынков"
              description="Не удалось связаться с контрактами пулов залогов."
              onRetry={loadData}
            />
          ) : (
            <div className="grid-cards">
              {markets.map((market) => (
                <div key={market.key || market.address} className="card card--pad">
                  <div>
                    <div className="flex items-center justify-between gap-2" style={{ marginBottom: '1rem' }}>
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="glyph-tile glyph-tile--neutral">
                          <Icon name={MARKET_ICONS[market.key] || 'layers'} size={20} />
                        </span>
                        <div className="min-w-0">
                          <h3 className="h3 truncate" style={{ fontSize: '1.05rem' }}>
                            {market.title}
                          </h3>
                          <div className="text-subtle mono-number truncate" style={{ fontSize: '0.72rem' }}>
                            {market.data?.[7]?.toString?.() || market.collateralAsset} / {market.data?.[6]?.toString?.() || market.borrowAsset}
                          </div>
                        </div>
                      </div>
                      <span className="badge badge--gold">LLTV: {market.data?.[1]?.toString?.() || market.lltv}</span>
                    </div>

                    <div className="data-tile" style={{ marginBottom: '1rem' }}>
                      <div className="data-grid">
                        <div>
                          <span className="data-tile__label">{typograph('Ставка займа')}</span>
                          <div className="mono-number" style={{ fontWeight: 700, color: 'var(--gold)' }}>
                            {market.data?.[2]?.toString?.() || market.borrowRate}
                          </div>
                        </div>
                        <div>
                          <span className="data-tile__label">{typograph('Индекс займа')}</span>
                          <div className="mono-number" style={{ fontWeight: 700 }}>
                            {market.data?.[3]?.toString?.() || '1.042'}
                          </div>
                        </div>
                        <div className="data-grid__divider">
                          <span className="data-tile__label">{typograph('Общий пул залога')}</span>
                          <div className="mono-number truncate" style={{ fontWeight: 600 }}>
                            {market.data?.[5]?.toString?.() || '32 600 000 wETH'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link to="/borrow" className="btn btn--secondary btn--block">
                    {typograph('Взять займ под залог')}
                    <Icon name="arrowRight" size={16} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <StateSwitcher />
    </div>
  );
}
