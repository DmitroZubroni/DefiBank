// Общая презентационная шкала риска для HealthFactorGauge — вынесена в отдельный
// модуль, чтобы файлы компонентов (*.jsx) экспортировали только компоненты
// (требование react-refresh/only-export-components для корректного Fast Refresh).
export function zoneFor(ratio) {
  if (ratio >= 0.9) return { tone: '#fb7185', label: 'Высокий риск' };
  if (ratio >= 0.65) return { tone: '#f59e0b', label: 'Умеренный риск' };
  return { tone: '#10b981', label: 'Безопасно' };
}
