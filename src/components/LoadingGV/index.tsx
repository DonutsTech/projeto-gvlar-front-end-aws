import Logo from '@/assets/gvlar/symbolGVLar/symbolGray.svg';
import style from './loadingGV.module.scss';

const LoadingGV: React.FC = () => {
  return (
    <div className={style.loading}>
      <Logo />
    </div>
  );
};

export default LoadingGV;
