import LoadingGV from '../LoadingGV';
import style from './button.module.scss';
import { Button as ButtonProps } from '@/types';

const Button: React.FC<ButtonProps> = ({
  name,
  onClick,
  className,
  disabled,
  loading,
}: ButtonProps) => {
  return (
    <button
      type='button'
      disabled={disabled || loading}
      onClick={onClick}
      className={className ? className : style.button}
    >
      {loading ? (
        <>
          <LoadingGV />
        </>
      ) : (
        <>{name}</>
      )}
    </button>
  );
};

export default Button;
