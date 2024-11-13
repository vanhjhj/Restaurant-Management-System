// src/Components/forgotPassword.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleResetSubmit = (event) => {
        event.preventDefault();
        
        // Giả sử gửi email đặt lại thành công
        if (email) {
            alert("Liên kết đặt lại mật khẩu đã được gửi đến email của bạn!");
            navigate('/login'); // Điều hướng về trang đăng nhập sau khi gửi liên kết
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
