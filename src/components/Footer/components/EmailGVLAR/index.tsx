import style from './emailGVLAR.module.scss';

const EmailGVLAR = () => {
  return (
    <a
      className={style.email}
      target='_blank'
      rel='noopener noreferrer'
      href='mailto:contato@gvlar.com.br'
    >
      <div />
      <span>contato@gvlar.com.br</span>
    </a>
  );
};

export default EmailGVLAR;
