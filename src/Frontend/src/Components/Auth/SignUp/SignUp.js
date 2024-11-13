import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';
import { register } from '../../../API/authAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Để điều khiển hiển thị mật khẩu
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Điều khiển confirm password
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const account_type = "Customer";

    const handleSignUpSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }

        const userData = {
            username,
            email,
            password,
            account_type,
        };

        try {
            await register(userData);
            alert("Đăng ký thành công!");
            navigate('/');
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Đăng ký thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2>Đăng ký</h2>
                <form onSubmit={handleSignUpSubmit}>
                    {error && <p className="error-message">{error}</p>}

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

                    <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
                    <div className="password-input-container">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirm-password"
                            name="confirm-password"
                            placeholder="Xác nhận mật khẩu"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <span
                            className="password-toggle-icon"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                           <FontAwesomeIcon icon={showPassword ? "eye-slash" : "eye"} />
                        </span>
                    </div>

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
