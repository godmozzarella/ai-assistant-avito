import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { adApi } from '../../shared/api/adApi'
import { AiDescription } from '../../shared/ui/AiDescription/AiDescription'
import type {
	Ad,
	AutoItemParams,
	Category,
	ElectronicsItemParams,
	RealEstateItemParams
} from '../../shared/types/ad'
import { AutoParamsBlock } from './AutoParamsBlock'
import { ElectronicsParamsBlock } from './ElectronicsParamsBlock'
import { RealEstateParamsBlock } from './RealEstateParamsBlock'
import { Field } from '../../shared/ui/Field/Field'
import PageLoader from '../../shared/ui/PageLoader'
import s from './AdEditPage.module.scss'

export function AdEditPage() {
	const { id } = useParams<{ id?: string }>()
	const navigate = useNavigate()
	const [ad, setAd] = useState<Ad | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [invalidFields, setInvalidFields] = useState<{ [key: string]: boolean }>({})

	useEffect(() => {
		if (!id) return
		adApi
			.getAdById(id)
			.then(data => setAd(data))
			.catch(err => setError(err.message))
			.finally(() => setLoading(false))
	}, [id])

	const categoryOptions: { label: string; value: Category }[] = [
		{ label: 'Авто', value: 'auto' },
		{ label: 'Недвижимость', value: 'real_estate' },
		{ label: 'Электроника', value: 'electronics' }
	]

	if (loading) return <PageLoader />
	if (!ad) return <p>Объявление не найдено</p>


	const isInvalid = (field: string) => invalidFields[field]

	let ParamsBlock
	switch (ad.category) {
		case 'auto':
			ParamsBlock = (
				<AutoParamsBlock
					params={ad.params as AutoItemParams}
					onChange={(newParams: AutoItemParams) =>
						setAd({ ...ad, params: newParams })
					}
				/>
			)
			break
		case 'real_estate':
			ParamsBlock = (
				<RealEstateParamsBlock
					params={ad.params as RealEstateItemParams}
					onChange={(newParams: RealEstateItemParams) =>
						setAd({ ...ad, params: newParams })
					}
					required={true}
					isInvalid={isInvalid('type')}
				/>
			)
			break
		case 'electronics':
			ParamsBlock = (
				<ElectronicsParamsBlock
					params={ad.params as ElectronicsItemParams}
					onChange={(newParams: ElectronicsItemParams) =>
						setAd({ ...ad, params: newParams })
					}
					required={true}
					isInvalid={isInvalid('type')}
				/>
			)
			break
	}

	const handleSubmit = async () => {
		setError(null)
		if (!ad) return
		const newInvalidFields = {
			title: !ad.title.trim(),
			price: ad.price === undefined || ad.price === null || ad.price <= 0,
			type:
				ad.category === 'electronics'
					? !(ad.params as ElectronicsItemParams).type?.trim()
					: ad.category === 'real_estate'
					? !(ad.params as RealEstateItemParams).type?.trim()
					: false
		}
		setInvalidFields(newInvalidFields)

		if (Object.values(newInvalidFields).some(Boolean)) {
			return
		}

		try {
			localStorage.setItem(`draft-ad-${ad.id}`, JSON.stringify(ad))
			await adApi.updateAd(ad.id, ad)

			navigate(`/ads/${ad.id}`)
		} catch (err: unknown) {
			const message = (err as Error).message || 'Ошибка при сохранении'
			setError(message)
		}
	}

	return (
		<div className={s.container}>
			<h1 className={s.title}>Редактирование объявления</h1>
			<form className={s.editForm}>
				<Field label="Категория">
					<select
						className={s.select}
						value={ad.category}
						onChange={e =>
							setAd(prev => prev ? { ...prev, category: e.target.value as Category } : prev)
						}
					>
						{categoryOptions.map(opt => (
							<option key={opt.value} value={opt.value}>
								{opt.label}
							</option>
						))}
					</select>
				</Field>

				<hr />

				<Field label="Название" required={true} >
					<input
						className={isInvalid('title') ? s.invalid : ''}
						type="text"
						value={ad.title}
						required
						onChange={e => {
							setAd({ ...ad, title: e.target.value })
							if (invalidFields.title) {
								setInvalidFields(prev => ({ ...prev, title: false }))
							}
						}}
					/>
				</Field>

				<hr />

				<Field label="Цена" required={true}>
					<input
						className={isInvalid('price') ? s.invalid : ''}
						type="number"
							value={ad.price}
							required
							min={0}
							onChange={e => {
								setAd({ ...ad, price: Number(e.target.value) })
								if (invalidFields.price) {
									setInvalidFields(prev => ({ ...prev, price: false }))
								}
							}}
						/>
				</Field>

				<hr />

				<p className={s.paramsTitle}>Характеристики</p>
				{ParamsBlock}

				<Field label="Описание">
					<textarea
						className={s.textarea}
						value={ad.description}
						maxLength={1000} 
						onChange={e => setAd({ ...ad, description: e.target.value })}
					/>
					<AiDescription
						value={ad.description ?? ''}
						title={ad.title}
						category={ad.category}
						params={ad.params ?? {}}
						onApply={text => setAd(prev => prev ? { ...prev, description: text } : prev)}
					/>
				</Field>
				
				<div className={s.buttons}>
					<button className={s.save} type="button" onClick={handleSubmit}>Сохранить</button>
					<button
						className={s.cancel}
						type="button"
						onClick={() => navigate(`/ads/${ad.id}`)}
					>
						Отмена
					</button>
				</div>
				
			</form>
		</div>
	)
}
