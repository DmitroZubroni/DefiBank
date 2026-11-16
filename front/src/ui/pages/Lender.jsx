import { useContext, useState } from 'react';
import { AtlantContext } from '../../core/context';
import ContractService from '../../service/ContractService';
import { VAULTS } from '../../service/contracts.js';
import Header from '../component/Header.jsx';
import { typograph } from '../../core/typograph';
import Icon from '../icons/Icon.jsx';
import { LoadingSkeleton, EmptyState, ErrorState, SuccessState, StateSwitcher } from '../component/States.jsx';

const vaultServices = VAULTS.map((v) => ({
  ...v,
  service: new ContractService(v.abi, v.address),
}));

const VAULT_ICONS = { vault1: 'vault', vault2: 'gem', vault3: 'crown' };

const VaultCard = ({ vault }) => {
  const { wallet, currentAccount, login, showToast } = useContext(AtlantContext);
  const [activeTab, setActiveTab] = useState('deposit'); // 'deposit' | 'withdraw'
  const [amount, setAmount] = useState('');
  const [pendingAction, setPendingAction] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const assetKey = vault.asset === 'USDC' ? 'balanceUSDC' : vault.asset === 'wETH' ? 'balanceETH' : 'balanceBTC';
  const availableBal = currentAccount?.[assetKey] ?? 0;
  const userPosition = currentAccount?.vaultPositions?.[vault.key];
  const userShares = userPosition?.shares ?? 0;

  const handleMax = () => {
    if (activeTab === 'deposit') {
      setAmount(availableBal.toString());
    } else {
      setAmount((userShares * (vault.sharePrice || 1.0842)).toFixed(2));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!wallet) {
      login();
      return;
    }
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) {
      setFeedback({ type: 'danger', message: 'Укажите положительную сумму транзакции' });
      return;
    }

    setPendingAction(true);
    setFeedback(null);

    try {
      if (activeTab === 'deposit') {
        const res = await vault.service.depositVault(num, wallet);
        setFeedback({
          type: 'success',
          message: `Депозит ${num.toLocaleString('ru-RU')} ${vault.asset} успешно принят хранилищем`,
          hash: res.transactionHash,
        });
        showToast(`Успешный депозит в ${vault.title}`, 'success');
      } else {
        const res = await vault.service.withdrawVault(num, wallet);
        setFeedback({
          type: 'success',
          message: `Выведено ${num.toLocaleString('ru-RU')} ${vault.asset} на ваш кошелек`,
          hash: res.transactionHash,
        });
        showToast(`Вывод средств из ${vault.title} подтвержден`, 'success');
      }
      setAmount('');
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.message || 'Ошибка выполнения транзакции: проверьте баланс',
      });
    } finally {
      setPendingAction(false);
    }
  };

  const amountInputId = `amount-${vault.key}`;
  const feedbackId = `lender-feedback-${vault.key}`;

  return (
    <div className="card card--pad">
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
              <div className="text-subtle mono-number truncate" style={{ fontSize: '0.72rem', maxWidth: 220 }}>
                {vault.address}
              </div>
            </div>
          </div>
          <span className="badge badge--emerald">{vault.apy} APY</span>
        </div>

        <div className="data-tile" style={{ marginBottom: '1rem' }}>
          <div className="data-grid">
            <div>
              <span className="data-tile__label">{typograph('Ваши доли в пуле')}</span>
              <div className="mono-number" style={{ fontWeight: 700 }}>
                {userShares.toLocaleString('ru-RU')} {vault.shareSymbol}
              </div>
            </div>
            <div>
              <span className="data-tile__label">{typograph('Доступно на кошельке')}</span>
              <div className="mono-number" style={{ fontWeight: 700, color: 'var(--gold)' }}>
                {availableBal.toLocaleString('ru-RU')} {vault.asset}
              </div>
            </div>
          </div>
        </div>

        <div className="segmented" role="group" aria-label="Тип операции с хранилищем">
          <button
            type="button"
            onClick={() => {
              setActiveTab('deposit');
              setFeedback(null);
            }}
            className="segmented__btn"
            aria-pressed={activeTab === 'deposit'}
          >
            {typograph('Внести депозит')}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('withdraw');
              setFeedback(null);
            }}
            className="segmented__btn segmented__btn--emerald"
            aria-pressed={activeTab === 'withdraw'}
          >
            {typograph('Вывести средства')}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <div className="field__label-row">
              <label htmlFor={amountInputId} className="field__label mb-0">
                {activeTab === 'deposit' ? typograph(`Сумма для внесения (${vault.asset})`) : typograph(`Сумма для вывода (${vault.asset})`)}
              </label>
              <button type="button" onClick={handleMax} className="field__max">
                {typograph('МАКС')}
              </button>
            </div>

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
              <span className="input-suffix">{vault.asset}</span>
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

          <button type="submit" disabled={pendingAction} className={`btn btn--block ${activeTab === 'deposit' ? 'btn--primary' : 'btn--emerald'}`}>
            {pendingAction
              ? typograph('Синхронизация с контрактом…')
              : !wallet
              ? typograph('Подключить кошелек')
              : activeTab === 'deposit'
              ? typograph('Подтвердить депозит')
              : typograph('Подтвердить вывод')}
          </button>
        </form>
      </div>
    </div>
  );
};

const Lender = () => {
  const { stateMode, setStateMode } = useContext(AtlantContext);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />

      <main className="container" id="main-content">
        <div className="section">
          <span className="badge badge--gold badge--dot mb-0" style={{ marginBottom: '0.75rem' }}>
            {typograph('Смарт-контракты стандарта ERC-4626 · демо')}
          </span>
          <h1 className="h1 mt-2" style={{ marginBottom: '0.75rem' }}>
            {typograph('Инвестиционные хранилища доходности')}
          </h1>
          <p className="lede mb-0">
            {typograph(
              'Предоставляйте ликвидность в институциональные смарт-контракты ERC-4626. Капитализация процентов происходит непрерывно, а доли пула могут быть конвертированы обратно в базовый актив в любой момент.'
            )}
          </p>
        </div>

        {stateMode === 'loading' ? (
          <LoadingSkeleton count={3} />
        ) : stateMode === 'error' ? (
          <ErrorState
            title="Ошибка получения позиций хранилища"
            description="Не удалось связаться с интерфейсом ERC-4626. Проверьте сетевое соединение."
            onRetry={() => setStateMode('normal')}
          />
        ) : stateMode === 'empty' ? (
          <EmptyState
            title="Нет доступных инвестиционных пулов"
            description="В настоящее время все пулы заполнены до максимального лимита (Cap Reached)."
            actionLabel="Вернуться в обзор"
            onAction={() => setStateMode('normal')}
          />
        ) : stateMode === 'success' ? (
          <SuccessState
            title="Депозит успешно обработан"
            description="Доли ERC-4626 начислены на ваш баланс. Доходность начисляется с текущего блока."
            actionLabel="Продолжить работу"
            onAction={() => setStateMode('normal')}
          />
        ) : (
          <div className="grid-cards">
            {vaultServices.map((v) => (
              <VaultCard key={v.key || v.address} vault={v} />
            ))}
          </div>
        )}
      </main>

      <StateSwitcher />
    </div>
  );
};

export default Lender;
