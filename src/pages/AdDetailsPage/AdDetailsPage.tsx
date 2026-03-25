import { CurrencyRuble as CurrencyRubleIcon } from '@mui/icons-material'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined'
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined'
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PlaceholderImg from '../../assets/img-placeholder.svg'
import { adApi } from '../../shared/api/adApi'
import type {
	Ad,
	AutoItemParams,
	ElectronicsItemParams,
	RealEstateItemParams
} from '../../shared/types/ad'
import PageLoader from '../../shared/ui/PageLoader'
import s from './AdDetailsPage.module.scss'
import { AutoParams } from './ParamsDetails/ AutoParamsDetails'
import { ElectronicsParams } from './ParamsDetails/ElectronicsParamsDetails'
import { RealEstateParams } from './ParamsDetails/RealEstateParamsDetails'

export function AdDetailsPage() {
	const { id } = useParams<{ id?: string }>()
	const navigate = useNavigate()
	const [ad, setAd] = useState<Ad | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [missingParams, setMissingParams] = useState<string[]>([])

	const formatDate = (dateString?: string) => {
		if (!dateString) return '-';
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('ru-RU', {
			day: '2-digit',
			month: 'long',
			hour: '2-digit',
			minute: '2-digit',
		}).format(date);
	};	

	useEffect(() => {
		if (!id) return
		adApi
			.getAdById(id)
			.then(data => setAd(data))
			.catch(err => setError(err.message))
			.finally(() => setLoading(false))
	}, [id])

	if (loading) return <PageLoader />
	if (error) return <p style={{ color: 'red' }}>Ошибка: {error}</p>
	if (!ad) return <p>Объявление не найдено</p>

	return (
		<div className={s.container}>
			<header className={s.header}>
				{/*Название + цена*/}
				<h1 className={s.headerTitle}>{ad.title}</h1>
				<b className={s.headerPrice}>
					Цена: {ad.price}{' '}
					<CurrencyRubleIcon
						fontSize="inherit"
						sx={{ margin: 0 }}
					/>{' '}
				</b>
			</header>

			{/*Панель приколов*/}
			<section className={s.toolBar}>
				<div className={s.toolBarButtons}>
					<button
						className={s.toolBarButtonsBack}
						onClick={() => navigate('/ads')}
					>
						Назад <ArrowBackIosNewOutlinedIcon fontSize="small" />
					</button>
					<button
						className={s.toolBarButtonsEdit}
						onClick={() => navigate(`/ads/${ad.id}/edit`)}
					>
						Редактировать <BorderColorOutlinedIcon fontSize="small" />
					</button>
				</div>
				<div className={s.toolBarDates}>
					<p>Опубликовано: {formatDate(ad.createdAt)}</p>
					<p>Отредактировано: {formatDate(ad.updatedAt)}</p>
				</div>
			</section>
			<hr />

			{/*Информация об объявлении*/}
			<main className={s.adInfo}>
				<img
					src={/*ad.imageUrl ?? */ PlaceholderImg}
					alt={ad.title}
					className={s.image}
				/>

				<div className={s.adInfoContent}>
					{/**Требует доработок*/}
					{missingParams.length > 0 && (
					<aside className={s.adNeedsRevision}>
						<ErrorOutlinedIcon sx={{ color: 'rgba(255, 169, 64, 1)' }} />
						<div>
							<h2 className={s.adNeedsRevisionTitle}>Требуются доработки</h2>
							<p className={s.adNeedsRevisionText}>
								У объявления не заполнены поля:
							</p>
							<ul>
								{missingParams.map(field => (
									<li className={s.adNeedsRevisionText} key={field}>
										{field}
									</li>
								))}
							</ul>
						</div>
					</aside>
				)}

					{/*Характеристики*/}
					<section className={s.adProperty}>
						<h2 className={s.adPropertyTitle}>Характеристики</h2>

						{ad.category === 'auto' && (
							<AutoParams
								params={ad.params as AutoItemParams}
								onMissing={setMissingParams}
							/>
						)}

						{ad.category === 'real_estate' && (
							<RealEstateParams
								params={ad.params as RealEstateItemParams}
								onMissing={setMissingParams}
							/>
						)}

						{ad.category === 'electronics' && (
							<ElectronicsParams
								params={ad.params as ElectronicsItemParams}
								onMissing={setMissingParams}
							/>
						)}
					</section>
				</div>
				
			</main>
			
			{/*Описание*/}
			<section className={s.adDescription}>
				<h2 className={s.adDescriptionTitle}>Описание</h2>
				{ad.description && ad.description.trim() ? (
					<p className={s.adDescriptionText}>{ad.description}</p>
				) : (
					<p className={s.adDescriptionNoText}>Отсутствует</p>
				)}
			</section>
		</div>
	)
}
