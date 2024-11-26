// src/Components/forgotPassword.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from'../../Style/AuthStyle/ForgotPassword.module.css';
import { forgotPassword } from '../../API/authAPI';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState({});
    const navigate = useNavigate();

    const handleChangeEmail=(e)=>{
        setError(null);
        setEmail(e.target.value)
    }

    const handleResetSubmit = async (event) => {
        event.preventDefault();

        try {
            await forgotPassword(email); // Gọi API quên mật khẩu
            alert("Liên kết đặt lại mật khẩu đã được gửi đến email của bạn!");
            navigate('/verify-otp', { state: { mode: 'forgotPassword', email } });
        } catch (err) {
            setError("Email Chưa được đăng kí");
        }
    };

    return (
        <div className={style["forgot-password-container"]}>
        <div className={style["forgot-password-box"]}>
            <h2>Quên mật khẩu</h2>
                <form class={style["forgot-form"]} onSubmit={handleResetSubmit}>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Nhập email"
                    required
                    value={email}
                    onChange={handleChangeEmail}
                />
                {error && <p className={style["error-message"]}>{error}</p>}
                <button type="submit" className={style["reset-btn"]}>
                    Đặt lại mật khẩu
                    </button>
            </form>
            <button
                type="button"
                onClick={() => navigate('/login')}
                className={style["login-btn"]}
            >
                Trở lại Đăng nhập
                </button>
        </div>
    </div>
    );
}

export default ForgotPassword;
