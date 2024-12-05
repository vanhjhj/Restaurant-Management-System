import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from '../../Style/AuthStyle/SignUp.module.css';
import { account_check, sendOrResendOTP } from '../../API/authAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { checkPasswordRequirements } from '../../utils/checkPasswordRequirements';

function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [requirement, setRequirement] = useState(null);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const account_type = "Customer";

    const handlePasswordChange = (e) => {
        const inputPassword = e.target.value;
        setPassword(inputPassword);

        if (inputPassword === "") {
            setRequirement(null);
            return;
        }

        const firstUnmetRequirement = checkPasswordRequirements(inputPassword);
        setRequirement(firstUnmetRequirement);
    };

    const handleSignUpSubmit = async (event) => {
        event.preventDefault();

        // Reset lỗi trước khi kiểm tra
        setErrors({});

        if (password !== confirmPassword) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                confirmPassword: "Mật khẩu xác nhận không khớp.",
            }));
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
        } catch (err) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                ...err,
            }));
            return;
        }

        try {
            navigate('/verify-otp', {
                state: { mode: 'register', signupData, email: signupData.email },
            });
            await sendOrResendOTP({ email: signupData.email });
        } catch (err) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                message: "Lỗi gửi OTP: " + err.message,
            }));
            return;
        }
    };

    return (
        <div className={style["signup-container"]}>
            <div className={style["signup-box"]}>
                <h2 className={style["title"]}>Đăng ký</h2>
                <form onSubmit={handleSignUpSubmit} className={style["signup-form"]}>
                    {errors.message && (
                        <p className={style["error-message"]}>{errors.message}</p>
                    )}

                    <label htmlFor="username" className={style["form-title"]}>
                        Tài khoản
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Nhập tài khoản"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {errors.username && (
                        <p className={style["error-message"]}>{'Tên đăng nhập đã tồn tại'}</p>
                    )}

                    <label htmlFor="email" className={style["form-title"]}>
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Nhập email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && (
                        <p className={style["error-message"]}>{errors.email}</p>
                    )}

                    <label htmlFor="password" className={style["form-title"]}>
                        Mật khẩu
                    </label>
                    <div className={style["password-input-container"]}>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            placeholder="Nhập mật khẩu"
                            required
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        <span
                            className={style["password-toggle-icon"]}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <FontAwesomeIcon
                                icon={showPassword ? "eye-slash" : "eye"}
                            />
                        </span>
                    </div>
                    {errors.password && (
                        <p className={style["error-message"]}>{errors.password[0]}</p>
                    )}
                    {requirement && (
                        <div className={style["password-requirement"]}>
                            <p style={{ color: "red" }}>• {requirement.text}</p>
                        </div>
                    )}

                    <label htmlFor="confirm-password" className={style["form-title"]}>
                        Xác nhận mật khẩu
                    </label>
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
                            <FontAwesomeIcon
                                icon={showConfirmPassword ? "eye-slash" : "eye"}
                            />
                        </span>
                    </div>
                    {errors.confirmPassword && (
                        <p className={style["error-message"]}>
                            {errors.confirmPassword}
                        </p>
                    )}

                    <button type="submit" className={style["signup-btn"]}>
                        Đăng ký
                    </button>
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
