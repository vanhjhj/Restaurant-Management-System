import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../API/authAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Để điều khiển hiển thị mật khẩu
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleLoginSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await login({ username, password });
        
            // Gọi hàm onLogin được truyền từ App.js
            onLogin(response.account_type);
            navigate('/');
          } catch (error) {
            setError(error.message); // Hiển thị lỗi nếu có
          }
    };


    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Đăng nhập</h2>
                <form onSubmit={handleLoginSubmit}>
                    {error && <p className="error-message">{error}</p>} {/* Hiển thị lỗi nếu có */}
                    
                    <label htmlFor="username">Tài khoản</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Nhập tài khoản"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <label htmlFor="password">Mật khẩu</label>
                    <div className="password-input-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            placeholder="Nhập mật khẩu"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                            className="password-toggle-icon"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <FontAwesomeIcon icon={showPassword ? "eye-slash" : "eye"} />
                        </span>
                    </div>
                    <button type="submit" className="login-btn">Đăng nhập</button>

                    <button
                        type="button"
                        onClick={() => navigate('/ForgotPassword')}
                        className="forgot-password"
                    >
                        Quên mật khẩu?
                    </button>
                </form>
            </div>

            <div className="register-box">
                <p>Bạn chưa có tài khoản? <br /> Ấn vào nút bên dưới để đăng ký ngay!</p>
                <button
                    type="button"
                    onClick={() => navigate('/SignUp')}
                    className="register-btn"
                >
                    Đăng ký
                </button>
            </div>
        </div>
    );
}

export default Login;
