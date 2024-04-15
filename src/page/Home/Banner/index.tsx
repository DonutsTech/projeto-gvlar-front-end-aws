import InputSelect from '@/components/InputSelect';
import style from './banner.module.scss';
import InputCheck from '@/components/InputCheck';
import InputSearch from '@/components/InputSearch';
import ButtonIcon from '@/components/ButtonIcon';
import videoMobile from '@/video/gvlarMobile.mp4';
import videoDesk from '@/video/gvlarDesk.mp4';
import GVlar from '@/assets/gvlar/logoWhite.svg';
import classNames from 'classnames';
import { FormEvent } from 'react';
import { FilterPageProperty } from '@/types';
import { NavLink } from 'react-router-dom';

interface BannerProps {
  handleFilterChange: (
    e: FormEvent<HTMLInputElement | HTMLButtonElement | HTMLTextAreaElement>,
  ) => void;
  filter: FilterPageProperty;
}

const Banner = ({ filter, handleFilterChange }: BannerProps) => {
  return (
    <section className={style.banner}>
      <video
        className={classNames({ [style['video']]: true, [style.one]: true })}
        autoPlay
        muted
        loop
      >
        <source src={videoMobile} type='video/mp4' />
        Seu navegador não suporta a reprodução de vídeos.
      </video>
      <video
        className={classNames({ [style['video']]: true, [style.two]: true })}
        autoPlay
        muted
        loop
      >
        <source src={videoDesk} type='video/mp4' />
        Seu navegador não suporta a reprodução de vídeos.
      </video>
      <div className={style.content}>
        <div className={style.title}>
          <GVlar />
          <h1>Aqui os seus sonhos ganham um novo lar!</h1>
          <p>Seja para investir, morar ou trabalhar. Aqui você encontra!</p>
        </div>
        <form className={style.form}>
          <div className={style.party}>
            <InputSelect
              iten='property'
              valeu={filter.about === undefined ? '' : filter.about}
              handleChange={handleFilterChange}
            />
            <div className={style['box-check']}>
              <InputCheck
                className={style.check}
                type='checkbox'
                label='Comprar'
                title='business'
                value={
                  filter.business === 'ambos'
                    ? 'aluguel'
                    : filter.business === 'aluguel'
                      ? 'ambos'
                      : filter.business === 'venda'
                        ? ''
                        : 'venda'
                }
                checked={filter.business === 'ambos' || filter.business === 'venda' ? true : false}
                onChange={handleFilterChange}
              />
              <InputCheck
                className={style.check}
                type='checkbox'
                label='Alugar'
                title='business'
                value={
                  filter.business === 'ambos'
                    ? 'venda'
                    : filter.business === 'venda'
                      ? 'ambos'
                      : filter.business === 'aluguel'
                        ? ''
                        : 'aluguel'
                }
                checked={
                  filter.business === 'ambos' || filter.business === 'aluguel' ? true : false
                }
                onChange={handleFilterChange}
              />
            </div>
          </div>
          <InputSearch
            name='text'
            onChange={handleFilterChange}
            value={filter.text === undefined ? '' : filter.text}
            placeholder='busque aqui o seu imóvel'
          />
          <NavLink to={`/encontrar/imovel`} state={{ state: filter }}>
            <ButtonIcon name='Buscar' onClick={() => {}} />
          </NavLink>
        </form>
      </div>
    </section>
  );
};

export default Banner;
