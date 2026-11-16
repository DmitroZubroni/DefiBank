import { useContext, useState } from 'react';
import { AtlantContext } from '../../core/context';
import ContractService from '../../service/ContractService';
import { MARKETS } from '../../service/contracts.js';
import Header from '../component/Header.jsx';
import { typograph } from '../../core/typograph';
import Icon from '../icons/Icon.jsx';
import HealthFactorGauge from '../illustrations/HealthFactorGauge.jsx';
import { zoneFor } from '../illustrations/healthZone.js';
import { LoadingSkeleton, EmptyState, ErrorState, SuccessState, StateSwitcher } from '../component/States.jsx';

const marketServices = MARKETS.map((v) => ({
  ...v,
  service: new ContractService(v.abi, v.address),
}));

const MARKET_ICONS = { market1: 'bolt', market2: 'gem', market3: 'shield' };

const ACTION_CONFIG = {
  depositMarket: { label: 'Внести залог', className: 'btn--emerald', unit: 'collateralAsset' },
  withdrawMarket: { label: 'Вывести залог', className: 'btn--secondary', unit: 'collateralAsset' },
  borrow: { label: 'Взять займ', className: 'btn--primary', unit: 'borrowAsset' },
  repay: { label: 'Погасить долг', className: 'btn--secondary', unit: 'borrowAsset' },
};

// Чисто презентационная оценка Health Factor для гейджа: доля использованного
// лимита LLTV (= текущий LTV / лимитный LTV рынка). Отображение, не бизнес-логика —
// исходные значения (ltvPercent, lltv) приходят без изменений от mock-провайдера.
function readPercent(str, fallback) {
  const n = parseFloat(String(str).replace('%', '').replace(',', '.'));
  return Number.isFinite(n) ? n : fallback;
}

const MarketCard = ({ market }) => {
  const { wallet, currentAccount, login, showToast } = useContext(AtlantContext);
  const [activeAction, setActiveAction] = useState('depositMarket');
  const [amount, setAmount] = useState('');
  const [pendingAction, setPendingAction] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const userMarketPos = currentAccount?.marketPositions?.[market.key] || {
    borrowShares: 0,
    collateralShares: 0,
    currentDebt: 0,
    ltvPercent: '0.0%',
  };

  const lltvValue = readPercent(market.lltv, 85);
  const currentLtvValue = readPercent(userMarketPos.ltvPercent, 0);
  const healthRatio = lltvValue > 0 ? Math.min(1, currentLtvValue / lltvValue) : 0;
  const healthZone = zoneFor(healthRatio);

  const handleAction = async (e) => {
    e.preventDefault();
    if (!wallet) {
      login();
      return;
    }
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) {
      setFeedback({ type: 'danger', message: 'Укажите положительную сумму' });
      return;
    }

    setPendingAction(true);
    setFeedback(null);

    try {
      const res = await market.service[activeAction](num, wallet);
      const actionName = ACTION_CONFIG[activeAction].label;
      setFeedback({
        type: 'success',
        message: `Транзакция «${actionName}» (${num.toLocaleString('ru-RU')}) успешно завершена`,
        hash: res.transactionHash,
      });
      showToast(`Операция «${actionName}» подтверждена`, 'success');
      setAmount('');
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.message || 'Ошибка выполнения транзакции: проверьте лимиты залога',
      });
    } finally {
      setPendingAction(false);
    }
  };

  const config = ACTION_CONFIG[activeAction];
  const tokenUnit = market[config.unit];
  const amountInputId = `borrow-input-${market.key}`;
  const feedbackId = `borrow-feedback-${market.key}`;

  return (
    <div className="card card--pad">
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
              <div className="text-subtle mono-number truncate" style={{ fontSize: '0.72rem', maxWidth: 220 }}>
                {market.address}
              </div>
            </div>
          </div>
          <span className="badge badge--gold">LLTV: {market.lltv}</span>
        </div>

        <div className="flex items-center gap-3" style={{ marginBottom: '1rem' }}>
          <HealthFactorGauge
            ratio={healthRatio}
            caption="HEALTH"
            className="min-w-0"
            style={{ width: 128, flexShrink: 0 }}
          />
          <div className="min-w-0">
            <span className="badge" style={{ background: 'transparent', border: `1px solid ${healthZone.tone}`, color: healthZone.tone, padding: '0.2rem 0.6rem' }}>
              <Icon name="gauge" size={12} />
              {healthZone.label}
            </span>
            <p className="text-subtle text-small mt-2 mb-0">
              {typograph('Доля использованного лимита LLTV: текущий LTV относительно максимально допустимого.')}
            </p>
          </div>
        </div>

        <div className="data-tile" style={{ marginBottom: '1rem' }}>
          <div className="data-grid">
            <div>
              <span className="data-tile__label">{typograph('Ваш залог в рынке')}</span>
              <div className="mono-number" style={{ fontWeight: 700, color: 'var(--emerald)' }}>
                {userMarketPos.collateralShares?.toLocaleString?.('ru-RU')} {market.collateralAsset}
              </div>
            </div>
            <div>
              <span className="data-tile__label">{typograph('Текущий долг')}</span>
              <div className="mono-number" style={{ fontWeight: 700, color: 'var(--gold)' }}>
                {userMarketPos.currentDebt?.toLocaleString?.('ru-RU')} {market.borrowAsset}
              </div>
            </div>
            <div className="data-grid__divider">
              <span className="data-tile__label">{typograph('Ставка займа (APY)')}</span>
              <div className="mono-number" style={{ fontWeight: 700 }}>
                {market.borrowRate}
              </div>
            </div>
            <div>
              <span className="data-tile__label">{typograph('Коэффициент LTV')}</span>
              <div className="mono-number" style={{ fontWeight: 700 }}>
                {userMarketPos.ltvPercent || '0.0%'}
              </div>
            </div>
          </div>
        </div>

        <div className="segmented" role="group" aria-label="Тип операции">
          {Object.entries(ACTION_CONFIG).map(([actKey, actCfg]) => {
            const isAct = activeAction === actKey;
            const isBorrowSide = actKey.includes('borrow') || actKey.includes('repay');
            return (
              <button
                key={actKey}
                type="button"
                onClick={() => {
                  setActiveAction(actKey);
                  setFeedback(null);
                }}
                className={`segmented__btn ${isBorrowSide ? '' : 'segmented__btn--emerald'}`}
                aria-pressed={isAct}
              >
                {typograph(actCfg.label)}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleAction}>
          <div className="field">
            <label htmlFor={amountInputId} className="field__label" style={{ display: 'block', marginBottom: '0.4rem' }}>
              {typograph(`Сумма операции (${tokenUnit})`)}
            </label>
            <div className="input-wrap">
              <input
                id={amountInputId}
                type="number"
                className="input input--suffixed mono-number"
                placeholder="0.00"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={pendingAction}
                required
                aria-describedby={feedback ? feedbackId : undefined}
                aria-invalid={feedback?.type === 'danger' ? 'true' : undefined}
              />
              <span className="input-suffix">{tokenUnit}</span>
            </div>
          </div>

          {feedback && (
            <div id={feedbackId} role={feedback.type === 'danger' ? 'alert' : 'status'} className={`notice notice--${feedback.type === 'danger' ? 'danger' : 'success'}`}>
              <Icon name={feedback.type === 'danger' ? 'alert' : 'check'} size={16} />
              <span>
                {typograph(feedback.message)}
                {feedback.hash && <span className="notice__hash truncate">Хэш: {feedback.hash}</span>}
              </span>
            </div>
          )}

          <button type="submit" disabled={pendingAction} className={`btn ${config.className} btn--block`}>
            {pendingAction ? typograph('Синхронизация смарт-контракта…') : !wallet ? typograph('Подключить кошелек') : typograph(config.label)}
          </button>
        </form>
      </div>
    </div>
  );
};

const Borrow = () => {
  const { stateMode, setStateMode } = useContext(AtlantContext);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />

      <main className="container" id="main-content">
        <div className="section">
          <span className="badge badge--neutral badge--dot mb-0" style={{ marginBottom: '0.75rem' }}>
            {typograph('Изолированные кредитные пулы · демо')}
          </span>
          <h1 className="h1 mt-2" style={{ marginBottom: '0.75rem' }}>
            {typograph('Управление залогами и займами')}
          </h1>
          <p className="lede mb-0">
            {typograph(
              'Предоставляйте залоговые активы (wETH, WBTC, stETH) и привлекайте стейблкоины с фиксированным лимитом ликвидации (LLTV). Изолированная модель гарантирует защиту от системных рисков других пулов.'
            )}
          </p>
        </div>

        {stateMode === 'loading' ? (
          <LoadingSkeleton count={3} />
        ) : stateMode === 'error' ? (
          <ErrorState
            title="Ошибка связи с кредитными смарт-контрактами"
            description="Проверьте соединение с оракулом Chainlink и повторите запрос."
            onRetry={() => setStateMode('normal')}
          />
        ) : stateMode === 'empty' ? (
          <EmptyState
            title="Кредитные рынки недоступны"
            description="В настоящее время рынки находятся на плановой синхронизации параметров риска."
            actionLabel="Обновить"
            onAction={() => setStateMode('normal')}
          />
        ) : stateMode === 'success' ? (
          <SuccessState
            title="Кредитная линия активирована"
            description="Залоговые активы зафиксированы, заемные средства переведены на баланс счета."
            actionLabel="К списку рынков"
            onAction={() => setStateMode('normal')}
          />
        ) : (
          <div className="grid-cards">
            {marketServices.map((v) => (
              <MarketCard key={v.key || v.address} market={v} />
            ))}
          </div>
        )}
      </main>

      <StateSwitcher />
    </div>
  );
};

export default Borrow;
