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
    <div className={style["reservation-container"]}>
      <h2>Đặt Bàn</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Tên:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Số điện thoại:
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </label>
        <label>
          Ngày:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <label>
          Giờ:
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </label>
        <label>
          Số khách:
          <input
            type="number"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            min="1"
            required
          />
        </label>
        <label>
          Ghi chú:
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Thêm ghi chú của bạn"
          />
        </label>
        <button type="submit">Đặt Bàn</button>
      </form>
    </div>
  );
}

export default Reservation;
