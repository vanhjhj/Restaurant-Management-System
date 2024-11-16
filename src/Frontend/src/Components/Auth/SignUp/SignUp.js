import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './SignUp.module.css';
import { account_check, sendOrResendOTP } from '../../../API/authAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Để điều khiển hiển thị mật khẩu
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Điều khiển confirm password
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const account_type = "Customer";

    const handleSignUpSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setErrors("Mật khẩu xác nhận không khớp.");
            return;
        }

        const signupData = {
            username,
            email,
            password,
            account_type,
        };

        try {
            await account_check(signupData);
            alert('Thông tin hợp lệ!')
        } catch (err) {
            setErrors(err,"lỗi khi check account");
        }
        try{
            await sendOrResendOTP({email: signupData.email});
            localStorage.setItem('signupData', JSON.stringify(signupData));
            navigate('/verify-otp', { state: { mode: 'register', signupData, email: signupData.email } });
        }  catch (err) {
            setErrors(err,"lỗi khi gửi otp");
        }
    };

    return (
        <div className={style["signup-container"]}>
            <div className={style["signup-box"]}>
                <h2>Đăng ký</h2>
                <form onSubmit={handleSignUpSubmit}>
                    {errors && <p className={style["error-message"]}>{errors.message}</p>}

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
                    {errors.username && <p className={style["error-message"]}>{errors.username}</p>}

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
                    {errors.email && <p className={style["error-message"]}>{errors.email}</p>}

                    <label htmlFor="password">Mật khẩu</label>
                    <div className={style["password-input-container"]}>
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
                            className={style["password-toggle-icon"]}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <FontAwesomeIcon icon={showPassword ? "eye-slash" : "eye"} />
                        </span>
                        {errors.password && <p className={style["error-message"]}>{errors.password}</p>}
                    </div>

                    <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
                    <div className={style["password-input-container"]}>
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
                            className={style["password-toggle-icon"]}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <FontAwesomeIcon icon={showConfirmPassword ? "eye-slash" : "eye"} />
                        </span>
                        {errors.confirmPassword && <p className={style["error-message"]}>{errors.confirmPassword}</p>}
                    </div>

                    <button type="submit" className={style["signup-btn"]}>Đăng ký</button>
                </form>
                <button
                    type="button"
                    className={style["login-btn"]}
                    onClick={() => navigate('/login')}
                >
                    Đã có tài khoản? Đăng nhập
                </button>
            </div>
        </div>
    );
}

export default SignUp;
