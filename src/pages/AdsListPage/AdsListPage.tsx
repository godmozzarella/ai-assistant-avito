import { Container, FormControlLabel, Switch, Checkbox } from '@mui/material'
import {
  CheckBoxOutlineBlankRounded as CheckBoxOutlineBlankRoundedIcon,
  CheckBoxRounded as CheckBoxRoundedIcon,
  FormatListBulleted as ViewListIcon,
  GridView as GridViewIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Search as SearchIcon
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { adApi } from '../../shared/api/adApi'
import type { Category } from '../../shared/types/ad'
import DropDownMenu from '../../shared/ui/DropDownMenu/DropDownMenu'
import ErrorState from '../../shared/ui/ErrorState'
import PageLoader from '../../shared/ui/PageLoader'
import Ad from './Ad/Ad'
import s from './AdsListPage.module.scss'

export function AdsListPage() {
	const [isOpen, setIsOpen] = useState(false)
	const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
	const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
	const [onlyRequiringRework, setOnlyRequiringRework] = useState(false)

	type Option = {
		label: string
		value: string
	}

	const getSortParams = (sortValue: Option['value']) => {
		switch (sortValue) {
			case 'newest':
				return {
					sortColumn: 'createdAt' as const,
					sortDirection: 'desc' as const
				}
			case 'oldest':
				return {
					sortColumn: 'createdAt' as const,
					sortDirection: 'asc' as const
				}
			case 'name_az':
				return { sortColumn: 'title' as const, sortDirection: 'asc' as const }
			case 'name_za':
				return { sortColumn: 'title' as const, sortDirection: 'desc' as const }
			default:
				return {}
		}
	}

	const options: Option[] = [
		{ label: 'По новизне (сначала новые)', value: 'newest' },
		{ label: 'По новизне (сначала старые)', value: 'oldest' },
		{ label: 'По цене (сначала дешевле)', value: 'cheap' },
		{ label: 'По цене (сначала дороже)', value: 'expensive' },
		{ label: 'По названию (А-Я)', value: 'name_az' },
		{ label: 'По названию (Я-А)', value: 'name_za' }
	]

	const [selected, setSelected] = useState<Option>(options[0])
	const [searchInput, setSearchInput] = useState('')
	const [search, setSearch] = useState('')
	const sortParams = getSortParams(selected.value)

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['ads', search, selected.value],
		queryFn: () =>
			adApi.getAds({
				limit: 1000,
				skip: 0,
				q: search || undefined,
				...sortParams
			})
	})

	if (isLoading) return <PageLoader />

	if (isError)
		return (
			<Container>
				<ErrorState
					message={
						error instanceof Error
							? error.message
							: 'Не удалось загрузить объявления'
					}
				/>
			</Container>
		)

	const allCategories: Category[] = ['auto', 'real_estate', 'electronics']

	const announcementEndWord =
		Math.abs(data?.total ?? 0) % 10 === 1 && (data?.total ?? 0) !== 11
			? 'е'
			: Math.abs(data?.total ?? 0) % 10 === 2 ||
				  Math.abs(data?.total ?? 0) % 10 === 3 ||
				  Math.abs(data?.total ?? 0) % 10 === 4
				? 'я'
				: 'й'

	const handleCategoryToggle = (category: Category) => {
		setSelectedCategories(prev =>
			prev.includes(category)
				? prev.filter(c => c !== category)
				: [...prev, category]
		)
	}

	const filteredAds = (data?.items ?? []).filter(ad => {
		const categoryMatch =
			selectedCategories.length > 0
				? selectedCategories.includes(ad.category)
				: true

		const reworkMatch = onlyRequiringRework ? ad.needsRevision : true

		return categoryMatch && reworkMatch
	})

	return (
		<div className={s.con}>
			{/* Верхний заголовок */}
			<header className={s.header}>
				<div className={s.headerContent}>
					<h1 className={s.title}>Мои объявления</h1>
					<p className={s.announcementCount}>
						{data?.total ?? 0} объявлени{announcementEndWord}
					</p>
				</div>
			</header>

			{/* Панель инструментов */}
			<section className={s.toolbar}>
				<form
					className={s.searchContainer}
					onSubmit={e => {
						e.preventDefault()
						setSearch(searchInput.trim())
					}}
				>
					<input
						className={s.searchInput}
						type="search"
						placeholder="Найти объявление..."
						value={searchInput}
						onChange={e => setSearchInput(e.target.value)}
					/>
					<button
						type="submit"
						className={s.searchIcon}
					>
						<SearchIcon sx={{ color: 'rgba(0, 0, 0, 0.85)' }} />
					</button>
				</form>

				<div className={s.actions}>
					<div className={s.viewToggle}>
						<button className={`${s.viewButton} ${s.gridView}`}>
							<GridViewIcon />
						</button>
						<button className={`${s.viewButton} ${s.listView}`}>
							<ViewListIcon />
						</button>
					</div>

					<DropDownMenu
						isOpen={isOpen}
						setIsOpen={setIsOpen}
						selected={selected}
						options={options}
						handleSelect={o => {
							setSelected(o)
							setIsOpen(false)
						}}
					/>
				</div>
			</section>

			{/* Главная часть с боковой панелью */}
			<main className={s.main}>
				<aside className={s.filters}>
					<div className={s.filtersContent}>
						<h2>Фильтры</h2>

						{/* Фильтр по категориям */}
						<div className={s.filterBlock}>
							<p
								className={s.filterTitle}
								onClick={() => setIsCategoriesOpen(prev => !prev)}
							>
								Категория{' '}
								{isCategoriesOpen ? (
									<KeyboardArrowUpIcon />
								) : (
									<KeyboardArrowDownIcon />
								)}
							</p>

							{isCategoriesOpen && (
								<div className={s.filterList}>
									{allCategories.map(cat => (
										<FormControlLabel
											key={cat}
											sx={{
												'& .MuiFormControlLabel-label': {
													fontSize: '0.875rem',
													fontWeight: 400,
													fontFamily: 'Roboto, sans-serif',
													color: 'rgba(0,0,0,0.85)'
												}
											}}
											control={
												<Checkbox
													checked={selectedCategories.includes(cat)}
													onChange={() => handleCategoryToggle(cat)}
													icon={<CheckBoxOutlineBlankRoundedIcon />}
													checkedIcon={<CheckBoxRoundedIcon />}
													sx={{
														color: 'rgb(195, 193, 202)',
														'&.Mui-checked': {
															color: 'rgba(24, 144, 255, 1)'
														},
														margin: 0
													}}
												/>
											}
											label={
												cat === 'auto'
													? 'Авто'
													: cat === 'real_estate'
														? 'Недвижимость'
														: 'Электроника'
											}
										/>
									))}
								</div>
							)}
						</div>
						<hr />
						<div className={s.requiringRework}>
							<p>Только требующие доработок</p>
							<FormControlLabel
								sx={{ margin: 0 }}
								control={
									<Switch
										checked={onlyRequiringRework}
										onChange={() => setOnlyRequiringRework(prev => !prev)}
										color="primary"
									/>
								}
								label=""
							/>
						</div>
					</div>

					<button
						className={`${s.resetFilters} ${
							selectedCategories.length > 0 || onlyRequiringRework
								? s.resetFiltersActive
								: ''
						}`}
						onClick={() => {
							setSelectedCategories([])
							setOnlyRequiringRework(false)
						}}
					>
						Сбросить фильтры
					</button>
				</aside>

				{/* Список объявлений */}
				<section className={s.adsGrid}>
					{filteredAds.map(ad => (
						<Ad
							key={ad.id}
							ad={ad}
						/>
					))}
				</section>
			</main>
		</div>
	)
}
