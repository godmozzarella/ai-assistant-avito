import type { RealEstateItemParams } from '../../../shared/types/ad'
import { useEffect } from 'react'
import s from './ParamsDetails.module.scss'

const realEstateFieldLabels: [keyof RealEstateItemParams, string][] = [
	['type', 'Тип недвижимости'],
	['address', 'Адрес'],
	['area', 'Площадь'],
	['floor', 'Этаж'],
]


function isEmptyValue(value: unknown) {
	return (
		value === undefined ||
		value === null ||
		(typeof value === 'string' && value.trim() === '')
	)
}

export function RealEstateParams({
	params,
	onMissing,
}: {
	params: RealEstateItemParams
	onMissing?: (missing: string[]) => void
}) {
	const missing: string[] = []

	realEstateFieldLabels.forEach(([key, label]) => {
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
					<p>Тип недвижимости</p>
					<p className={s.value}>
						{params.type === 'flat'
							? 'Квартира'
							: params.type === 'house'
							? 'Дом'
							: 'Комната'}
					</p>
				</span>
			)}

			{params.address && (
				<span className={s.param}>
					<p>Адрес</p>
					<p className={s.value}>{params.address}</p>
				</span>
			)}

			{params.area !== undefined && !isEmptyValue(params.area) && (
				<span className={s.param}>
					<p>Площадь</p>
					<p className={s.value}>{params.area} м²</p>
				</span>
			)}

			{params.floor !== undefined && !isEmptyValue(params.floor) && (
				<span className={s.param}>
					<p>Этаж</p>
					<p className={s.value}>{params.floor}</p>
				</span>
			)}
		</>
	)
}

export function MissingRealEstateParams({
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