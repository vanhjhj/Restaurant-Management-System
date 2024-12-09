import React, { useState } from 'react';
import style from '../../Style/AuthStyle/Login.module.css';
import { useNavigate } from 'react-router-dom';
import { login } from '../../API/authAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { decodeToken } from '../../utils/tokenHelper.mjs';
import { useAuth } from './AuthContext';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Để điều khiển hiển thị mật khẩu
    const [error, setError] = useState(null);
    const { accessToken, setAccessToken } = useAuth();

    const navigate = useNavigate();

    const handleLoginSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await login({ username, password });
            setAccessToken(response.access);
            localStorage.setItem('refreshToken',response.refresh);

            // Decode token và lấy thông tin người dùng
            const userInfo = decodeToken(response.access);
            if (userInfo) {
                localStorage.setItem('userId', userInfo.user_id);
                console.log(userInfo.user_id);
                localStorage.setItem('accountType', userInfo.account_type);
                // Gọi hàm onLogin được truyền từ App.js
                localStorage.setItem('isLoggedIn', true);
                localStorage.setItem('userRole', userInfo.account_type);
                // Điều hướng đến trang chính
                navigate('/');
            } else {
                throw new Error('Không thể giải mã token!');
            }
          } catch (error) {
            setError('Tên đăng nhập hoặc mật khẩu sai'); // Hiển thị lỗi nếu có
          }
    };


    return (
        <div className={style["login-container"]}>
            <div className={style["login-box"]}>
                <h2 className={style['title']}>Đăng nhập</h2>
                <form onSubmit={handleLoginSubmit} className={style["login-form"]}>
                    {error && <p className={style["error-message"]}>{error}</p>} {/* Hiển thị lỗi nếu có */}
                    <label htmlFor="username" className={style['login-form-label']}>Tài khoản</label>
                    <div>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className={style['login-form-input']}
                            placeholder="Nhập tài khoản"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <label htmlFor="password" className={style['login-form-label']}>Mật khẩu</label>
                    <div className={style['password-input-container']}>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            className={style['login-form-input']}
                            placeholder="Nhập mật khẩu"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                            className={style["password-toggle-icon"]}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <FontAwesomeIcon icon={showPassword ? "eye-slash" : "eye"} />
                        </span>
                    </div>
                    <button type="submit" className={style["button"]}>Đăng nhập</button>

                    <button
                        type="button"
                        onClick={() => navigate('/ForgotPassword')}
                        className={style["forgot-password"]}
                    >
                        Quên mật khẩu?
                    </button>
                </form>
            </div>

            <div className={style["register-box"]}>
                <p className={style["text-register"]}>Bạn chưa có tài khoản? <br /> Ấn vào nút bên dưới để đăng ký ngay!</p>
                <button
                    type="button"
                    onClick={() => navigate('/SignUp')}
                    className={style["button"]}
                >
                    Đăng ký
                </button>
            </div>
        </div>
    );
}

export default Login;
