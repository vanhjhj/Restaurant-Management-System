// src/Components/forgotPassword.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from'./ForgotPassword.module.css';
import { forgotPassword } from '../../../API/authAPI';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState({});
    const [success, setSuccess] = useState(false); // Trạng thái khi gửi thành công
    const navigate = useNavigate();

    const handleResetSubmit = async (event) => {
        event.preventDefault();

        try {
            await forgotPassword(email); // Gọi API quên mật khẩu
            setSuccess(true); // Hiển thị thông báo thành công
            alert("Liên kết đặt lại mật khẩu đã được gửi đến email của bạn!");
            navigate('/verify-otp', { state: { mode: 'forgotPassword', email } });
        } catch (err) {
            const errorMessage = err.response?.data?.email || 'Email chưa được đăng ký.';
            setError(errorMessage);
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
                    onChange={(e) => setEmail(e.target.value)}
                />
                {error.email && <p className={style["error-message"]}>{error.email}</p>}
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
