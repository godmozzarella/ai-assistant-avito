import type { ElectronicsItemParams } from '../../shared/types/ad';

export function ElectronicsParamsBlock({ params, onChange }: { params: ElectronicsItemParams; onChange: (newParams: ElectronicsItemParams) => void }) {
  return (
    <>
      <label>Тип
        <select value={params.type ?? ''} onChange={e => onChange({ ...params, type: e.target.value as 'phone' | 'laptop' | 'misc' })}>
          <option value="phone">Телефон</option>
          <option value="laptop">Ноутбук</option>
          <option value="misc">Прочее</option>
        </select>
      </label>
      <label>Бренд
        <input value={params.brand ?? ''} onChange={e => onChange({ ...params, brand: e.target.value })} />
      </label>
      <label>Модель
        <input value={params.model ?? ''} onChange={e => onChange({ ...params, model: e.target.value })} />
      </label>
      <label>Состояние
        <select value={params.condition ?? ''} onChange={e => onChange({ ...params, condition: e.target.value as 'new' | 'used' })}>
          <option value="new">Новое</option>
          <option value="used">Б/У</option>
        </select>
      </label>
      <label>Цвет
        <input value={params.color ?? ''} onChange={e => onChange({ ...params, color: e.target.value })} />
      </label>
    </>
  )
}