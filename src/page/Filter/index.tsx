import { FormEvent, useCallback, useEffect, useState } from 'react';
import Form from './Form';
import style from './filter.module.scss';
import { ErrorAxios, FilterPageProperty, Message as TypeMessage, PageFilter } from '@/types';
import { pageWithFilter } from '@/service/api/property';
import Card from '@/components/Card';
import 'glider-js/glider.min.css';
import GliderComponent from 'react-glider';
import Spinner from '@/components/Spinner';
import { scrollToTop } from '@/functions/scroll';
import InputSelect from '@/components/InputSelect';
import {
  shrinkingObjectFilters,
  shrinkingObjectFiltersTransform,
  transformationEmailForGvLar,
  transformationFiltersArrays,
} from '@/functions/transformation';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { validatePhone } from '@/functions/validate';
import { sendEmail } from '@/service/api/email';
import { useLocation } from 'react-router-dom';
import Message from '@/components/Message';

interface FormFiltersEmail {
  email: string;
  name: string;
  phone: string;
}

const Filter = () => {
  const { state } = useLocation();

  const [data, setData] = useState<PageFilter>({} as PageFilter);
  const [loading, setLoading] = useState<boolean>(false);
  const [_error, setError] = useState<ErrorAxios | null>(null);
  const [filter, setFilter] = useState({} as FilterPageProperty);
  const [start, setStart] = useState<boolean>(true);
  const [filterPage, setFilterPage] = useState({} as FilterPageProperty);
  const [form, setForm] = useState({} as FormFiltersEmail);
  const [message, setMessage] = useState<TypeMessage>({} as TypeMessage);
  const [loadingMensagem, setLoadingMensagem] = useState<boolean>(false);

  useEffect(() => {
    scrollToTop();
  }, []);

  useEffect(() => {
    if (state && !(Object.keys(state.state).length === 0)) {
      setFilterPage(shrinkingObjectFiltersTransform({ ...state.state }));
      setLoading(true);
      fetchData(1, { ...state.state });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const handleFilterChange = useCallback(
    (e: FormEvent<HTMLInputElement | HTMLButtonElement | HTMLTextAreaElement>) => {
      const type = e.currentTarget.type;
      let value: number | string = e.currentTarget.value;
      let name = e.currentTarget.name;

      if (type === 'checkbox') {
        name = e.currentTarget.title;

        if (
          ('bedroom' === name || 'bathroom' === name || 'garage' === name) &&
          filter[name] === Number(value)
        ) {
          value = '';
        }
      }

      if (name === 'order') {
        handleOrderPageClick(value);
      }

      if (
        name === 'minFoo' ||
        name === 'maxFoo' ||
        'bedroom' === name ||
        'bathroom' === name ||
        'garage' === name
      ) {
        value = Number(value);
      }

      setFilter({
        ...filter,
        [name]: value,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filter],
  );

  const handleFormChange = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      setForm({
        ...form,
        [e.currentTarget.name]: e.currentTarget.value,
      });
    },
    [form],
  );

  const fetchData = useCallback(async (page: number, filter: FilterPageProperty) => {
    scrollToTop();
    try {
      const data = await pageWithFilter(page, filter);

      if (data && 'items' in data) {
        setData(data);
      }
    } catch (error: any) {
      console.log(error);
      if ('message' in error) {
        setError({ ...error });
      } else {
        console.log('Erro inesperado:', error);
      }
    } finally {
      setLoading(false);
      setStart(false);
    }
  }, []);

  useEffect(() => {
    if (start) {
      fetchData(1, {});
    }
  }, [start, fetchData]);

  const handleFilterPageClick = async () => {
    setFilterPage(shrinkingObjectFiltersTransform(filter));
    setLoading(true);
    setFilter({} as FilterPageProperty);
    await fetchData(1, filter);
  };

  const handleOrderPageClick = async (order: string) => {
    if (!(order === '')) {
      setLoading(true);
      setFilterPage({ ...filterPage, order: order });
      await fetchData(1, { ...filterPage, order: order });
    } else {
      const newFilters = shrinkingObjectFilters(filterPage, ['order']);
      setLoading(true);
      setFilterPage(newFilters);
      await fetchData(1, newFilters);
    }
  };

  const shrinkingObjectFilterForFilters = async (nameFilters: string[]) => {
    setLoading(true);
    const newFilters = shrinkingObjectFilters(filterPage, nameFilters);
    setFilterPage(newFilters);
    await fetchData(1, newFilters);
  };

  const buttonFilters = transformationFiltersArrays(filterPage);

  const handleCleanOnClink = () => {
    setFilterPage({} as FilterPageProperty);
    setLoading(true);
    fetchData(1, {});
  };

  const indexs = [
    [0, 5],
    [5, 10],
    [10, 15],
    [15, 20],
    [20, 25],
  ];

  const sendEmailAboutPropertySearchNotFound = async () => {
    setLoadingMensagem(true);
    const data = await sendEmail({
      ...form,
      subject: 'Solicitação de imovel',
      text: transformationEmailForGvLar(filterPage),
    });

    setForm({} as FormFiltersEmail);

    if (data && 'message' in data) {
      setMessage({ message: 'Mensagem não enviado', type: 'create', status: data.statusCode });
      setLoadingMensagem(false);
    }

    if (data && 'sucess' in data) {
      setMessage({ message: 'Mensagem enviada', status: 201, type: 'create' });
      setLoadingMensagem(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (message.message) {
        setMessage({} as TypeMessage);
        if (message.status === 201) {
          setFilterPage({} as FilterPageProperty);
          setLoading(true);
          fetchData(1, {});
        }
      }
    }, 10000);
  }, [message, fetchData]);

  return (
    <section className={style.main}>
      <h1 className={style.title}>Encontre aqui o imóvel do seus sonhos</h1>
      <Form
        filter={filter}
        handleFilterChange={handleFilterChange}
        handleOnClick={handleFilterPageClick}
      />
      <div className={style['box-filters']}>
        <div>
          {buttonFilters.length > 0 && (
            <>
              {buttonFilters.map((obj, index) => (
                <button
                  key={index}
                  type='submit'
                  onClick={() => {
                    shrinkingObjectFilterForFilters(obj[0]);
                  }}
                  className={style['filter']}
                >
                  {obj[1]}
                </button>
              ))}
            </>
          )}
        </div>
        <div className={style['box-filters-select-and-clean']}>
          <InputSelect
            iten='order'
            handleChange={handleFilterChange}
            valeu={filter.order === undefined ? '' : filter.order}
          />
          {buttonFilters.length > 0 && (
            <button type='button' onClick={() => handleCleanOnClink()} className={style.clean}>
              Limpar filtros
            </button>
          )}
        </div>
      </div>
      {!loading ? (
        <>
          {data.items && data.items.length > 0 && (
            <>
              {indexs.map(
                (i, index) =>
                  data.items.slice(i[0], i[1]).length > 0 && (
                    <div key={index} className={style.glider}>
                      <GliderComponent
                        slidesToShow={'auto'}
                        slidesToScroll={1}
                        itemWidth={300}
                        exactWidth
                        draggable
                        dots={false}
                        hasArrows
                        scrollLock={false}
                      >
                        {data.items.slice(i[0], i[1]).map((item, index) => (
                          <div key={index}>
                            <Card {...item} to={`${item.id}`} />
                          </div>
                        ))}
                      </GliderComponent>
                    </div>
                  ),
              )}
              <div className={style.box}>
                {data.previousPage && (
                  <button
                    type='button'
                    onClick={() => {
                      setLoading(true);
                      fetchData(Number(data.previousPage), filterPage);
                    }}
                    className={style.page}
                  >
                    {data.previousPage}
                  </button>
                )}
                {data.page && <p className={style.action}>{data.page}</p>}
                {data.nextPage && (
                  <button
                    type='button'
                    onClick={() => {
                      setLoading(true);
                      fetchData(Number(data.nextPage), filterPage);
                    }}
                    className={style.page}
                  >
                    {data.nextPage}
                  </button>
                )}
              </div>
            </>
          )}
          {data.items && data.items.length === 0 && buttonFilters.length > 0 && (
            <div className={style['box-information-about-filters']}>
              <p className={style['box-information-about-filters-text']}>
                Ops! Parece que não encontramos imóveis que correspondam aos seus critérios de
                busca. Mas não se desanime, deixe o seu e-mail que entraremos em contato assim que
                tivermos imóveis correspondentes.
              </p>
              {!(message.message === '') && <Message mss={message} />}
              <form className={style['box-information-about-filters-form']}>
                <Input type='text' name='name' onChange={handleFormChange} placeholder='Nome*' />
                <Input type='text' name='email' onChange={handleFormChange} placeholder='E-mail' />
                <Input
                  type='text'
                  name='phone'
                  mask='phone'
                  onChange={handleFormChange}
                  placeholder='Telefone*'
                />
                <Button
                  name='Enviar'
                  disabled={form.name === '' || !validatePhone(form.phone)}
                  className={style.button}
                  loading={loadingMensagem}
                  onClick={() => sendEmailAboutPropertySearchNotFound()}
                />
              </form>
            </div>
          )}
        </>
      ) : (
        <div className={style.spinner}>
          <Spinner />
        </div>
      )}
    </section>
  );
};

export default Filter;
