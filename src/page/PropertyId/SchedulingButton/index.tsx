import { FormEvent, useCallback, useEffect, useState } from 'react';
import style from './schedulingButton.module.scss';
import ReactModal from 'react-modal';
import { Message as TypeMessage, Card as TypeCard } from '@/types';
import Card from '@/components/Card';
import Input from '@/components/Input';
import DateCalendar from './Date';
import InputCheck from '@/components/InputCheck';
import Closet from '@/assets/menu/MenuCloset.svg';
import Button from '@/components/Button';
import { sendEmail } from '@/service/api/email';
import { formatarData } from '@/functions/transformation';
import Message from '@/components/Message';
import { validatePhone } from '@/functions/validate';

interface Form {
  name: string;
  phone: string;
  email: string;
  date: Date;
  period: string;
  obs: string;
}

const SchedulingButton = (card: TypeCard) => {
  const [message, setMessage] = useState<TypeMessage>({} as TypeMessage);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [form, setForm] = useState<Form>({} as Form);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFormChange = useCallback(
    (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.currentTarget.type === 'checkbox') {
        e.currentTarget.name = 'period';
      }

      setForm({
        ...form,
        [e.currentTarget.name]: e.currentTarget.value,
      });
    },
    [form],
  );

  const handleDateChange = (dateSelect: Date | null) => {
    if (dateSelect) {
      setForm({
        ...form,
        date: dateSelect,
      });
    }
  };

  const toggleModal = () => {
    setOpenModal(!openModal);
    setForm({} as Form);
  };

  useEffect(() => {
    setTimeout(() => {
      if (message.message) {
        setMessage({} as TypeMessage);
      }
    }, 10000);
  }, [message]);

  const sendEmailAboutSchedule = async () => {
    setLoading(true);
    const data = await sendEmail({
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: `Agendamento do imovel id: ${card.id}`,
      text: `Esse imóvel de referência ao id: ${card.id}, (link: https//www.gvlar.com.br/encontrar/imovel/${card.id}) despertou o interesse de ${
        form.name
      }, que está interessado(a) em agendar uma visita. A data selecionada para a visita é ${formatarData(
        form.date,
      )}, durante o período de ${
        form.period
      }. Gostaríamos de confirmar a disponibilidade deste imóvel para a data mencionada.`,
    });

    console.log(data);

    if (data && 'message' in data) {
      setMessage({ message: 'Mensagem não enviado', type: 'mensagem', status: data.statusCode });
      setLoading(false);
    }

    if (data && 'sucess' in data) {
      setMessage({ message: 'Mensagem enviada', status: 201, type: 'mensagem' });
      setLoading(false);
    }
  };

  return (
    <>
      <button className={style.button} onClick={() => setOpenModal(true)}>
        AGENDAR VISITA
      </button>
      <ReactModal
        contentLabel='ModalScheduling'
        isOpen={openModal}
        onRequestClose={toggleModal}
        className={style.modal}
        style={{
          overlay: {
            backgroundColor: 'rgba(36,32,33,0.5)',
            zIndex: '3',
          },
        }}
      >
        <div>
          <div className={style['div-titles']}>
            <h1>Agendar Visita</h1>
            <button onClick={() => setOpenModal(false)}>
              <Closet />
            </button>
          </div>
          <div className={style['box']}>
            <div className={style['box-card']}>
              <Card {...card} to='/' action={true} />
            </div>
            <form className={style['box-form']}>
              {!(message.message === '') && <Message mss={message} />}
              <Input
                type='text'
                name='name'
                placeholder='Nome'
                value={form.name === undefined ? '' : form.name}
                onChange={handleFormChange}
              />
              <Input
                type='text'
                mask='phone'
                name='phone'
                placeholder='Telefone'
                onChange={handleFormChange}
                value={form.phone === undefined ? '' : form.phone}
              />
              <Input
                type='text'
                name='email'
                placeholder='E-mail'
                onChange={handleFormChange}
                value={form.email === undefined ? '' : form.email}
              />
              <div>
                <h2 className={style['title-calendar']}>Selecione a melhor data para visitação:</h2>
                <div className={style['box-calendar']}>
                  <DateCalendar onChange={handleDateChange} selectedDate={form.date} />
                  <div>
                    <h3 className={style['title-time']}>Período</h3>
                    <div className={style['box-time']}>
                      <InputCheck
                        type='checkbox'
                        label='Manhã'
                        value='Manhã'
                        checked={form.period === 'Manhã'}
                        onChange={handleFormChange}
                      />
                      <InputCheck
                        type='checkbox'
                        label='Tarde'
                        value='Tarde'
                        checked={form.period === 'Tarde'}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <textarea
                className={style.textarea}
                name='obs'
                onChange={handleFormChange}
                placeholder='Observação'
                value={form.obs === undefined ? '' : form.obs}
              />
              <div className={style['box-button']}>
                <Button
                  name='Agendar'
                  disabled={form.name === '' || !validatePhone(form.phone)}
                  onClick={() => {
                    sendEmailAboutSchedule();
                  }}
                  loading={loading}
                />
              </div>
            </form>
          </div>
        </div>
      </ReactModal>
    </>
  );
};

export default SchedulingButton;
