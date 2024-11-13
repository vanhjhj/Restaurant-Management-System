// src/Components/Auth/SignUp/SignUp.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';
import { register } from '../../../API/authAPI';

function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // Biến lưu trữ lỗi nếu có
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();

    const account_type= "Customer";

    const handleSignUpSubmit = async (event) => {
        event.preventDefault();
        
        if (password !== confirmPassword) {
            setError(<h1 className="erorr">Mật khẩu xác nhận không khớp</h1>);
            return;
        }

        const userData = {
            username:username,
            email:email,
            password:password,
            account_type:account_type,
        };

        try {
            await register(userData);
            alert("Đăng ký thành công!");
            navigate('/')
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Đăng ký thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2>Đăng ký</h2>
                <form onSubmit={handleSignUpSubmit}>
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

                    <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
                    <input
                        type="password"
                        id="confirm-password"
                        name="confirm-password"
                        placeholder="Xác nhận mật khẩu"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <button type="submit" className="signup-btn">Đăng ký</button>
                </form>
                <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="login-btn"
                >
                    Đã có tài khoản? Đăng nhập
                </button>
            </div>
        </div>
    );
}

export default SignUp;
