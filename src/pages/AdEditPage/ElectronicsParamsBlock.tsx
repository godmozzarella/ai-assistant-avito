import type { ElectronicsItemParams } from '../../shared/types/ad';
import { Field } from '../../shared/ui/Field/Field';
import s from './AdEditPage.module.scss'

export function ElectronicsParamsBlock({ params, onChange, required, isInvalid }: { params: ElectronicsItemParams; onChange: (newParams: ElectronicsItemParams) => void; required?: boolean; isInvalid?: boolean }) {
  return (
    <>
      <Field label="Тип" required={required} characteristics>
        <select
          value={params.type ?? ''}
          onChange={e => onChange({ ...params, type: e.target.value as 'phone' | 'laptop' | 'misc' })}
          className={`${s.select} ${isInvalid ? s.invalid : ''}`}
        >
          <option value="">Выберите тип</option>
          <option value="phone">Телефон</option>
          <option value="laptop">Ноутбук</option>
          <option value="misc">Прочее</option>
        </select>
      </Field>
      <Field label="Бренд" characteristics>
        <input value={params.brand ?? ''} onChange={e => onChange({ ...params, brand: e.target.value })} />
      </Field>
      <Field label="Модель" characteristics>
        <input value={params.model ?? ''} onChange={e => onChange({ ...params, model: e.target.value })} />
      </Field>
      <Field label="Состояние" characteristics>
        <select className={s.select} value={params.condition ?? ''} onChange={e => onChange({ ...params, condition: e.target.value as 'new' | 'used' })}>
          <option value="new">Новое</option>
          <option value="used">Б/У</option>
        </select>
      </Field>
      <Field label="Цвет" characteristics>
        <input value={params.color ?? ''} onChange={e => onChange({ ...params, color: e.target.value })} />
      </Field>
    </>
  )
}