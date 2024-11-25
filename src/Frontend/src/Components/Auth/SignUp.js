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
    const [showPassword, setShowPassword] = useState(false); // Để điều khiển hiển thị mật khẩu
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Điều khiển confirm password
    const [requirement, setRequirement] = useState(null);

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const account_type = "Customer";

    const handlePasswordChange = (e) => {
        const inputPassword = e.target.value;
        setPassword(inputPassword);

        if(inputPassword==="")
        {
            setRequirement(null); 
            return; 
        }
        // Lấy yêu cầu đầu tiên chưa đạt
        const firstUnmetRequirement = checkPasswordRequirements(inputPassword);
        setRequirement(firstUnmetRequirement);

    };
      

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
                <h2 className={style["title"]}>Đăng ký</h2>
                <form onSubmit={handleSignUpSubmit} className={style["signup-form"]}>
                    {errors && <p className={style["error-message"]}>{errors.message}</p>}

                    <label htmlFor="username" className={style["form-title"]}>Tài khoản</label>
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

                    <label htmlFor="email" className={style["form-title"]}>Email</label>
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

                    <label htmlFor="password" className={style["form-title"]}>Mật khẩu</label>
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
                            <FontAwesomeIcon icon={showPassword ? "eye-slash" : "eye"} />
                        </span>
                        {errors.password && <p className={style["error-message"]}>{errors.password}</p>}
                    </div>

                    {/* Hiển thị yêu cầu đầu tiên chưa đạt */}
                    {requirement && (
                    <div className={style["password-requirement"]}>
                        <p style={{ color: "red" }}>
                        • {requirement.text}
                        </p>
                    </div>
                    )}


                    <label htmlFor="confirm-password" className={style["form-title"]}>Xác nhận mật khẩu</label>
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
