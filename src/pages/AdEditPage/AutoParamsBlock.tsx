import type { AutoItemParams } from '../../shared/types/ad';
import { Field } from '../../shared/ui/Field/Field';
import s from './AdEditPage.module.scss';

export function AutoParamsBlock({ params, onChange }: { params: AutoItemParams; onChange: (newParams: AutoItemParams) => void }) {
  return (
    <>
      <Field label="Бренд" characteristics>
        <input value={params.brand ?? ''} onChange={e => onChange({ ...params, brand: e.target.value })} />
      </Field>
      <Field label="Модель" characteristics>
        <input value={params.model ?? ''} onChange={e => onChange({ ...params, model: e.target.value })} />
      </Field>
      <Field label="Коробка передач" characteristics>
        <select
          className={s.select}
          value={params.transmission ?? ''}
          onChange={e => onChange({ ...params, transmission: e.target.value as 'automatic' | 'manual' })}
        >
          <option value="automatic">Автоматическая</option>
          <option value="manual">Ручная</option>
        </select>
      </Field>
      <Field label="Пробег" characteristics>
        <input type="number" value={params.mileage ?? ''} onChange={e => onChange({ ...params, mileage: Number(e.target.value) })} />
      </Field>
      <Field label="Год выпуска" characteristics>
        <input type="number" value={params.yearOfManufacture ?? ''} onChange={e => onChange({ ...params, yearOfManufacture: Number(e.target.value) })} />
      </Field>
      <Field label="Мощность двигателя" characteristics>
        <input type="number" value={params.enginePower ?? ''} onChange={e => onChange({ ...params, enginePower: Number(e.target.value) })} />
      </Field>
    </>
  )
}