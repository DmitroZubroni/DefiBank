import { useContext } from 'react';
import { AtlantContext } from '../../core/context';
import { typograph } from '../../core/typograph';
import Icon from '../icons/Icon.jsx';

// --- ПРАВИЛО У1: 4 СОСТОЯНИЯ ЭКРАНА СТУДИИ «КАЛИБР» ---

/**
 * 1. Пустое состояние (EmptyState)
 * Объясняет: что это за раздел, почему здесь пока пусто и как наполнить (Я4).
 */
export function EmptyState({
  title = 'Нет активных позиций',
  description = 'Подключите институциональный кошелек или внесите депозит в хранилище ликвидности ERC-4626 для начисления доходности.',
  actionLabel = 'Открыть хранилища',
  onAction,
  secondaryLabel,
  onSecondary,
  icon = 'inbox',
  className = '',
}) {
  return (
    <div role="status" aria-live="polite" className={`card state-card state-card--empty ${className}`}>
      <div className="state-card__icon state-card__icon--gold">
        <Icon name={icon} size={26} />
      </div>
      <h3 className="state-card__title">{typograph(title)}</h3>
      <p className="state-card__desc">{typograph(description)}</p>

      {(actionLabel || secondaryLabel) && (
        <div className="cluster" style={{ justifyContent: 'center' }}>
          {actionLabel && (
            <button type="button" onClick={onAction} className="btn btn--primary">
              {typograph(actionLabel)}
            </button>
          )}
          {secondaryLabel && (
            <button type="button" onClick={onSecondary} className="btn btn--secondary">
              {typograph(secondaryLabel)}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * 2. Состояние загрузки (LoadingSkeleton)
 * Повторяет геометрию будущих карточек, исключая прыжки макета (CLS = 0).
 */
export function LoadingSkeleton({ count = 2, className = '' }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className={`grid-cards ${className}`}>
      <span className="visually-hidden">Загрузка данных смарт-контрактов…</span>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="card card--pad" style={{ minHeight: 230 }}>
          <div className="flex items-center justify-between gap-2 mb-0" style={{ marginBottom: '1rem' }}>
            <div className="flex items-center gap-3">
              <span className="skeleton" style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)' }} />
              <span>
                <span className="skeleton mb-0" style={{ width: 130, height: 16, display: 'block', marginBottom: 6 }} />
                <span className="skeleton" style={{ width: 80, height: 12, display: 'block' }} />
              </span>
            </div>
            <span className="skeleton" style={{ width: 70, height: 24, borderRadius: 9999 }} />
          </div>

          <div className="data-tile" style={{ marginBottom: '1rem' }}>
            <div className="data-grid">
              <div>
                <span className="skeleton" style={{ width: 90, height: 11, display: 'block', marginBottom: 6 }} />
                <span className="skeleton" style={{ width: 110, height: 18, display: 'block' }} />
              </div>
              <div>
                <span className="skeleton" style={{ width: 80, height: 11, display: 'block', marginBottom: 6 }} />
                <span className="skeleton" style={{ width: 90, height: 18, display: 'block' }} />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <span className="skeleton" style={{ height: 44, flex: 1, borderRadius: 'var(--radius-md)' }} />
            <span className="skeleton" style={{ height: 44, flex: 1, borderRadius: 'var(--radius-md)' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * 3. Состояние ошибки (ErrorState)
 * Формулирует причину сбоя и обязательно даёт кнопку повтора (У1, Я2).
 */
export function ErrorState({
  title = 'Сбой синхронизации с узлом блокчейна',
  description = 'Не удалось получить актуальные данные смарт-контракта. Проверьте сетевое подключение к RPC-шлюзу и повторите запрос.',
  onRetry,
  retryLabel = 'Повторить запрос',
  className = '',
}) {
  return (
    <div role="alert" className={`card state-card state-card--error ${className}`}>
      <div className="state-card__icon state-card__icon--danger">
        <Icon name="alert" size={26} />
      </div>
      <h3 className="state-card__title">{typograph(title)}</h3>
      <p className="state-card__desc">{typograph(description)}</p>

      {onRetry && (
        <button type="button" onClick={onRetry} className="btn btn--ghost-danger">
          <Icon name="refresh" size={16} />
          {typograph(retryLabel)}
        </button>
      )}
    </div>
  );
}

/**
 * 4. Состояние успеха (SuccessState)
 * Сообщает о результате и следующем шаге (Я5). Хэш транзакции показывается
 * только если он реально передан — без фиктивного примера по умолчанию.
 */
export function SuccessState({
  title = 'Транзакция успешно подтверждена',
  description = 'Смарт-контракт обработал перевод, обновил долю в хранилище и зафиксировал баланс в распределенном реестре.',
  actionLabel = 'К списку хранилищ',
  onAction,
  txHash,
  className = '',
}) {
  return (
    <div role="status" aria-live="polite" className={`card state-card state-card--success ${className}`}>
      <div className="state-card__icon state-card__icon--emerald">
        <Icon name="check" size={26} />
      </div>
      <h3 className="state-card__title">{typograph(title)}</h3>
      <p className="state-card__desc">{typograph(description)}</p>

      {txHash && (
        <div className="state-card__hash">
          <span className="text-subtle">{typograph('Хэш транзакции:')}</span>
          <span className="mono-number" style={{ color: 'var(--text)', fontWeight: 600 }}>
            {txHash}
          </span>
        </div>
      )}

      {actionLabel && (
        <div>
          <button type="button" onClick={onAction} className="btn btn--primary">
            {typograph(actionLabel)}
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * ПРАВИЛО Н4: Демо-переключатель состояний студии «Калибр» — закреплённая панель,
 * позволяющая мгновенно открыть и проверить все состояния экрана.
 */
export function StateSwitcher() {
  const { stateMode, setStateMode } = useContext(AtlantContext);

  if (!(["review", "dev"].some(key => new URLSearchParams(window.location.search).has(key)))) return null;

  const modes = [
    { key: 'normal', label: 'Обычное', icon: 'dot' },
    { key: 'loading', label: 'Загрузка', icon: 'refresh' },
    { key: 'empty', label: 'Пусто', icon: 'inbox' },
    { key: 'error', label: 'Ошибка', icon: 'alert' },
    { key: 'success', label: 'Успех', icon: 'check' },
  ];

  return (
    <aside aria-label="Проверка состояний экрана" className="state-switcher">
      <div className="state-switcher__panel">
        <span className="state-switcher__label">Проверка интерфейса</span>
        {modes.map((m) => {
          const isActive = stateMode === m.key;
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => setStateMode(m.key)}
              className="state-switcher__btn"
              aria-pressed={isActive}
              title={`Включить состояние: ${m.label}`}
            >
              <Icon name={m.icon} size={14} />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
