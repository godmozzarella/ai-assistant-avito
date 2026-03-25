import type { RealEstateItemParams } from '../../shared/types/ad';
import { Field } from '../../shared/ui/Field/Field';
import s from './AdEditPage.module.scss'

export function RealEstateParamsBlock({ params, onChange, required, isInvalid }: { params: RealEstateItemParams; onChange: (newParams: RealEstateItemParams) => void; required?: boolean; isInvalid?: boolean }) {
  return (
    <>
      <Field label="Тип" required={required} characteristics>
        <select
          value={params.type ?? ''}
          onChange={e => onChange({ ...params, type: e.target.value as 'flat' | 'house' | 'room' })}
          className={`${s.select} ${isInvalid ? s.invalid : ''} ${!params.type ? s.warning : ''}`}
        >
          <option value="">Выберите тип</option>
          <option value="flat">Квартира</option>
          <option value="house">Дом</option>
          <option value="room">Комната</option>
        </select>
      </Field>
      <Field label="Адрес" characteristics>
        <input value={params.address ?? ''} onChange={e => onChange({ ...params, address: e.target.value })}
        placeholder='Адрес' className={`${!params.address ? s.warning : ''}`}/>
      </Field>
      <Field label="Площадь" characteristics>
        <input type="number" value={params.area ?? ''} onChange={e => onChange({ ...params, area: Number(e.target.value) })} 
        placeholder='Площадь в метрах квадратных' className={`${params.area == null ? s.warning : ''}`}/>
      </Field>
      <Field label="Этаж" characteristics>  
        <input type="number" value={params.floor ?? ''} onChange={e => onChange({ ...params, floor: Number(e.target.value) })} 
        placeholder='Этаж' className={`${params.floor == null ? s.warning : ''}`}/>
      </Field>
    </>
  )
}