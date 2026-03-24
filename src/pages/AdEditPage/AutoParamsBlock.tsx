import type { AutoItemParams } from '../../shared/types/ad';

export function AutoParamsBlock({ params, onChange }: { params: AutoItemParams; onChange: (newParams: AutoItemParams) => void }) {
  return (
    <>
      <label>Бренд
        <input value={params.brand ?? ''} onChange={e => onChange({ ...params, brand: e.target.value })} />
      </label>
      <label>Модель
        <input value={params.model ?? ''} onChange={e => onChange({ ...params, model: e.target.value })} />
      </label>
      <label>Коробка передач
        <select
          value={params.transmission ?? ''}
          onChange={e => onChange({ ...params, transmission: e.target.value as 'automatic' | 'manual' })}
        >
          <option value="automatic">Автоматическая</option>
          <option value="manual">Ручная</option>
        </select>
      </label>
      <label>Пробег
        <input type="number" value={params.mileage ?? ''} onChange={e => onChange({ ...params, mileage: Number(e.target.value) })} />
      </label>
      <label>Год выпуска
        <input type="number" value={params.yearOfManufacture ?? ''} onChange={e => onChange({ ...params, yearOfManufacture: Number(e.target.value) })} />
      </label>
      <label>Мощность двигателя
        <input type="number" value={params.enginePower ?? ''} onChange={e => onChange({ ...params, enginePower: Number(e.target.value) })} />
      </label>
    </>
  )
}