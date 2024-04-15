import { useAxios } from '@/service/hook/use-axios';
import Announce from './Announce';
import Banner from './Banner';
import Company from './Company';
import Opportunities from './Opportunities';
import api from '@/service/api/axios-config';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { scrollToTop } from '@/functions/scroll';
import { FilterPageProperty } from '@/types';

const Home = () => {
  const [filter, setFilter] = useState({} as FilterPageProperty);

  const [data, _loading, _error, _sendData] = useAxios({
    axiosInstance: api,
    method: 'get',
    url: '/properties/random/list',
  });

  const handleFilterChange = useCallback(
    (e: FormEvent<HTMLInputElement | HTMLButtonElement | HTMLTextAreaElement>) => {
      const type = e.currentTarget.type;
      const value: number | string = e.currentTarget.value;
      let name = e.currentTarget.name;

      if (type === 'checkbox') {
        name = e.currentTarget.title;
      }

      setFilter({
        ...filter,
        [name]: value,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filter],
  );

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <>
      <Banner filter={filter} handleFilterChange={handleFilterChange} />
      <Announce />
      <Company />
      {Array.isArray(data) && data.length > 0 && <Opportunities properties={data} />}
    </>
  );
};

export default Home;
