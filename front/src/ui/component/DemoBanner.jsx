import Icon from '../icons/Icon.jsx';
import { typograph } from '../../core/typograph';

// Правило доверия к финансовому интерфейсу: все цифры в этой сборке — демонстрационные
// (мок-провайдер localStorage, не реальный узел и не реальные средства). Баннер делает
// это явным на каждом экране, а не только в одном месте — пользователь не должен
// спутать демо-баланс с реальным (см. отчёт ревью, пункт о финансовых данных).
export default function DemoBanner() {
  return (
    <div className="demo-strip" role="note">
      <span className="flex items-center justify-between gap-2" style={{ justifyContent: 'center' }}>
        <Icon name="info" size={14} />
        <span>
          {typograph('Демо-режим: все балансы, адреса и ставки — смоделированные данные мок-провайдера, не реальные средства.')}
        </span>
      </span>
    </div>
  );
}
