import type { RealEstateItemParams } from '../../shared/types/ad';

export function RealEstateParamsBlock({ params, onChange }: { params: RealEstateItemParams; onChange: (newParams: RealEstateItemParams) => void }) {
  return (
    <>
      <label>Тип
        <select value={params.type ?? ''} onChange={e => onChange({ ...params, type: e.target.value as 'flat' | 'house' | 'room' })}>
          <option value="flat">Квартира</option>
          <option value="house">Дом</option>
          <option value="room">Комната</option>
        </select>
      </label>
      <label>Адрес
        <input value={params.address ?? ''} onChange={e => onChange({ ...params, address: e.target.value })} />
      </label>
      <label>Площадь
        <input type="number" value={params.area ?? ''} onChange={e => onChange({ ...params, area: Number(e.target.value) })} />
      </label>
      <label>Этаж
        <input type="number" value={params.floor ?? ''} onChange={e => onChange({ ...params, floor: Number(e.target.value) })} />
      </label>
    </>
  )
}