// src/components/Reservation.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Reservation.module.css';

function Reservation({ isLoggedIn }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(1);
  const [note, setNote] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Đã đặt bàn cho ${name} vào ngày ${date} lúc ${time}. Số khách: ${guests}.`);
    navigate('/');
  };

  return (
    <div className={style['reservation']}>
      <div className={style['container']}>
        <div className={style['row']}>
          <div className={style['reservation-img']}>
            <div className={style['col-lg-12']}>

            </div>
          </div>
        </div>
        <div className={style['reservation-content']}>
          <div className={style['row']}>
            <div className={style['promotion-info']}>
              <h2>Promotion note</h2>    
              <ul>
                <li>Giảm giá ...</li> 
              </ul>
              <h3>Chi tiết xem tại khuyễn mãi</h3>  
            </div>
          </div>
          <div className={style['row']}>
            <div className={style['reservation-form']}>
              <h2>title</h2>  
              <form></form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reservation;
