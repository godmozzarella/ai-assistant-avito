import type { ElectronicsItemParams } from '../../../shared/types/ad'
import { useEffect } from 'react'
import s from './ParamsDetails.module.scss'

const electronicsFieldLabels: [keyof ElectronicsItemParams, string][] = [
  ['type', 'Тип устройства'],
  ['brand', 'Бренд'],
  ['model', 'Модель'],
  ['condition', 'Состояние'],
  ['color', 'Цвет'],
]

function isEmptyValue(value: unknown) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'string' && value.trim() === '')
  )
}

export function ElectronicsParams({
  params,
  onMissing,
}: {
  params: ElectronicsItemParams
  onMissing?: (missing: string[]) => void
}) {
  const missing: string[] = []

  electronicsFieldLabels.forEach(([key, label]) => {
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
      {params.type && (
        <span className={s.param}>
          <p>Тип устройства</p>
          <p className={s.value}>
            {params.type === 'phone'
              ? 'Телефон'
              : params.type === 'laptop'
              ? 'Ноутбук'
              : 'Прочее'}
          </p>
        </span>
      )}
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
      {params.condition && (
        <span className={s.param}>
          <p>Состояние</p>
          <p className={s.value}>
            {params.condition === 'new' ? 'Новое' : 'Б/У'}
          </p>
        </span>
      )}
      {params.color && (
        <span className={s.param}>
          <p>Цвет</p>
          <p className={s.value}>{params.color}</p>
        </span>
      )}
    </>
  )
}

export function MissingElectronicsParams({
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