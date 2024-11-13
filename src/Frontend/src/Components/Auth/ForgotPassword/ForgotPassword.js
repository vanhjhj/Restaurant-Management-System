// src/Components/forgotPassword.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';
import { forgotPassword } from '../../../API/authAPI';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null); // Trạng thái để hiển thị lỗi
    const [success, setSuccess] = useState(false); // Trạng thái khi gửi thành công
    const navigate = useNavigate();

    const handleResetSubmit = async (event) => {
        event.preventDefault();

        try {
            await forgotPassword(email); // Gọi API quên mật khẩu
            setSuccess(true); // Hiển thị thông báo thành công
            alert("Liên kết đặt lại mật khẩu đã được gửi đến email của bạn!");
            navigate('/login'); // Điều hướng về trang đăng nhập
        } catch (err) {
            setError(err.response?.data?.email || "Đã xảy ra lỗi. Vui lòng thử lại!"); // Hiển thị lỗi từ backend
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-box">
                <h2>Quên mật khẩu</h2>
                <form onSubmit={handleResetSubmit}>
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

                    <button type="submit" className="reset-btn">Đặt lại mật khẩu</button>
                </form>
                <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="login-btn"
                >
                    Trở lại Đăng nhập
                </button>
            </div>
        </div>
    );
}

export default ForgotPassword;
