import { useNavigate } from 'react-router-dom';
import PlaceholderImg from '../../assets/img-placeholder.svg';
import CurrencyRubleIcon from '@mui/icons-material/CurrencyRuble';
import s from './Ad.module.scss';

type AdProps = {
  ad: {
    id: string;
    category: string;
    title: string;
    price: number;
    needsRevision: boolean;
  };
};

export default function Ad({ ad }: AdProps) {
  const navigate = useNavigate();
	const categoryNames: Record<string, string> = {
		auto: 'Авто',
		real_estate: 'Недвижимость',
		electronics: 'Электроника',
	}
  return (
		<article
			key={ad.id}
			onClick={() => navigate(`/ads/${ad.id}`)}
			className={s.ad}
		>
			 {/* Блок для картинки */}
      <div className={s.imageWrapper}>
        <img
          src={/*ad.imageUrl ?? */ PlaceholderImg}
          alt={ad.title}
          className={s.image}
        />
				<p data-category={ad.category} className={s.category}>
					{categoryNames[ad.category] ?? ad.category}
				</p>
      </div>
	
			<div className={s.adsInfo}>
				<p className={s.title}>{ad.title}</p>

				<p className={s.price}>
					{ad.price} <CurrencyRubleIcon fontSize="inherit" sx={{ margin: 0 }} />
				</p>

				{ad.needsRevision && (
					<div className={s.statusContainer}>
						<b>&bull;</b>
						<p className={s.status}>
							Требует доработок
						</p>
					</div>
				)}
			</div>
				
		</article>
  );
}