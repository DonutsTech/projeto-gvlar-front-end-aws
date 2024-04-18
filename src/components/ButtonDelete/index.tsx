import { Button } from '@/types';
import style from './buttonDelete.module.scss';
import LoadingGV from '../LoadingGV';

const ButtonDelete: React.FC<Button> = ({ name, onClick, disabled, loading }: Button) => {
  return (
    <button className={style.button} type='button' onClick={onClick} disabled={disabled || loading}>
      {loading ? (
        <>
          <LoadingGV />
        </>
      ) : (
        <>{name}</>
      )}
      <div />
    </button>
  );
};

export default ButtonDelete;
