import { NavLink } from 'react-router-dom';
import style from './navFooter.module.scss';
import { useContext } from 'react';
import { Context } from '@/context';

const NavFooter = () => {
  const { user } = useContext(Context);
  return (
    <>
      <NavLink preventScrollReset={true} className={style.home} to='/'>
        <div />
        <span>Home</span>
      </NavLink>
      <NavLink preventScrollReset={true} className={style.about} to='/sobrenos'>
        Sobre nós
      </NavLink>
      <NavLink preventScrollReset={true} className={style.filter} to='/encontrar/imovel'>
        Encontre o seu imóvel
      </NavLink>
      <NavLink
        preventScrollReset={true}
        className={style.announce}
        to={user ? '/adm/imoveis' : '/login'}
      >
        Anuncie o seu imóvel
      </NavLink>
      <NavLink preventScrollReset={true} className={style.login} to={user ? '/adm' : '/login'}>
        <span>Minha conta</span>
        <div />
      </NavLink>
    </>
  );
};

export default NavFooter;
