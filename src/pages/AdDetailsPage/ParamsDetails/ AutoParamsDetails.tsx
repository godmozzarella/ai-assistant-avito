import type { AutoItemParams } from '../../../shared/types/ad'
import { useEffect } from 'react'
import s from './ParamsDetails.module.scss'

const autoFieldLabels: [keyof AutoItemParams, string][] = [
  ['brand', 'Бренд'],
  ['model', 'Модель'],
  ['yearOfManufacture', 'Год выпуска'],
  ['transmission', 'Коробка передач'],
  ['mileage', 'Пробег'],
  ['enginePower', 'Мощность двигателя'],
]

function isEmptyValue(value: unknown) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'string' && value.trim() === '')
  )
}

export function AutoParams({
  params,
  onMissing,
}: {
  params: AutoItemParams
  onMissing?: (missing: string[]) => void
}) {

  const missing: string[] = []

  autoFieldLabels.forEach(([key, label]) => {
    if (isEmptyValue(params[key])) {
      missing.push(label)
    }
  })

  useEffect(() => {
    if (onMissing) {
      onMissing(missing)
    }
  }, [missing.join(',')])

  return (
    <>
      {params.brand && (
        <span className={s.param}>
          <p>Бренд</p>
          <p className={s.value}>{params.brand}</p>
        </span>
      )}
      {params.model && (
        <span className={s.param}>
          <p>Модель</p>
          <p className={s.value}>{params.model}</p>
        </span>
      )}
      {params.yearOfManufacture !== undefined && !isEmptyValue(params.yearOfManufacture) && (
        <span className={s.param}>
          <p>Год выпуска</p>
          <p className={s.value}>{params.yearOfManufacture}</p>
        </span>
      )}
      {params.transmission && (
        <span className={s.param}>
          <p>Коробка передач</p>
          <p className={s.value}>
            {params.transmission === 'automatic' ? 'Автоматическая' : 'Механическая'}
          </p>
        </span>
      )}
      {params.mileage !== undefined && !isEmptyValue(params.mileage) && (
        <span className={s.param}>
          <p>Пробег</p>
          <p className={s.value}>{params.mileage} км</p>
        </span>
      )}
      {params.enginePower !== undefined && !isEmptyValue(params.enginePower) && (
        <span className={s.param}>
          <p>Мощность двигателя</p>
          <p className={s.value}>{params.enginePower} л.с.</p>
        </span>
      )}
    </>
  )
}

export function MissingAutoParams({
  missingFields,
}: {
  missingFields: string[]
}) {
  if (missingFields.length === 0) {
    return null
  }
  return (
    <>
      {missingFields.map(field => (
        <span className={s.param} key={field}>
          <p>{field}</p>
          <p className={s.value}>Нет данных</p>
        </span>
      ))}
    </>
  )
}