import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import type { Ad } from '../../shared/types/ad'
import { adApi } from '../../shared/api/adApi'
import { CircularProgress, Typography} from '@mui/material'
import DropDownMenu from '../../shared/ui/DropDownMenu'
import type { Category, AutoItemParams, RealEstateItemParams, ElectronicsItemParams } from '../../shared/types/ad'
import { AutoParamsBlock } from './AutoParamsBlock'
import { RealEstateParamsBlock } from './RealEstateParamsBlock'
import { ElectronicsParamsBlock } from './ElectronicsParamsBlock'

export function AdEditPage() {

  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const [ad, setAd] = useState<Ad | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    adApi.getAdById(id)
      .then(data => setAd(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categories: Category[] = ['auto', 'real_estate', 'electronics'];

  const categoryOptions: { label: string; value: Category }[] = categories.map(c => ({
    label: c,
    value: c,
  }));

  if (loading) return <CircularProgress />
  if (error) return <Typography color="error">Ошибка: {error}</Typography>
  if (!ad) return <Typography>Объявление не найдено</Typography>

  const handleSelectCategory = (categoryOption: { label: string; value: Category }) => {
    setAd(prev => {
      if (!prev) return prev;
      let newParams;
      switch (categoryOption.value) {
        case 'auto':
          newParams = (prev.category === 'auto' && prev.params) ? prev.params : {} as AutoItemParams;
          break;
        case 'real_estate':
          newParams = (prev.category === 'real_estate' && prev.params) ? prev.params : {} as RealEstateItemParams;
          break;
        case 'electronics':
          newParams = (prev.category === 'electronics' && prev.params) ? prev.params : {} as ElectronicsItemParams;
          break;
        default:
          newParams = prev.params;
      }
      return { ...prev, category: categoryOption.value, params: newParams };
    })
    setTimeout(() => setIsCategoryOpen(false), 0)
  }

  let ParamsBlock;
  switch (ad.category) {
    case 'auto':
      ParamsBlock = <AutoParamsBlock params={ad.params as AutoItemParams} onChange={(newParams: AutoItemParams) => setAd({ ...ad, params: newParams })} />;
      break;
    case 'real_estate':
      ParamsBlock = <RealEstateParamsBlock params={ad.params as RealEstateItemParams} onChange={(newParams: RealEstateItemParams) => setAd({ ...ad, params: newParams })} />;
      break;
    case 'electronics':
      ParamsBlock = <ElectronicsParamsBlock params={ad.params as ElectronicsItemParams} onChange={(newParams: ElectronicsItemParams) => setAd({ ...ad, params: newParams })} />;
      break;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!ad) return;
    try {
      localStorage.setItem(`draft-ad-${ad.id}`, JSON.stringify(ad));
      await adApi.updateAd(ad.id, ad);

      navigate(`/ads/${ad.id}`);
    } catch (err: unknown) {
      const message = (err as Error).message || 'Ошибка при сохранении';
      setError(message);
    }
  };

  return (
    <div>
      <h2>Редактирование объявления</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Категория
          <DropDownMenu
            isOpen={isCategoryOpen}
            setIsOpen={setIsCategoryOpen}
            selected={{ label: ad.category, value: ad.category }}
            options={categoryOptions}
            handleSelect={handleSelectCategory}
          />
        </label>

        <hr />

        <label>
          Название
          <input
            type="text"
            value={ad.title}
            onChange={e => setAd({ ...ad, title: e.target.value })}
          />
        </label>

        <hr />

        <label>
          Цена
          <input
            type="number"
            value={ad.price}
            onChange={e => setAd({ ...ad, price: Number(e.target.value) })}
          />
        </label>

        <hr />

        <p>Характеристики</p>
        {ParamsBlock}

        <label>
          Описание
          <textarea
            value={ad.description}
            onChange={e => setAd({ ...ad, description: e.target.value })}
          />
        </label>

        <button type="submit">Сохранить</button>
        <button type="button" onClick={() => navigate(`/ads/${ad.id}`)}>Отмена</button>
      </form>
    </div>)
}