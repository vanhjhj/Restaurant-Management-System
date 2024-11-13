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
            const credentials = { username, password };
            const data = await login(credentials); // Gọi API

            // // Kiểm tra phản hồi và lấy account_type từ server
            // if (data && data.account_type) {
            //     localStorage.setItem('account_type', data.account_type); // Lưu account_type vào localStorage để sử dụng trong ứng dụng
            //     onLogin(data); // Gọi callback với dữ liệu đăng nhập (nếu cần)
            //     navigate('/'); // Chuyển hướng sau khi đăng nhập thành công
            // } else {
            //     setError('Không tìm thấy account_type trong phản hồi.');
            // }
            onLogin(data); // Gọi callback với dữ liệu đăng nhập (nếu cần)
            navigate('/');
        } catch (err) {
            setError(<h1 className="error">Tên đăng nhập hoặc tài khoản sai!</h1>);
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
                    <input
                        type="password"
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
