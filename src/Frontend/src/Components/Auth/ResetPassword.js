import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import style from '../../Style/AuthStyle/ResetPassword.module.css'; // CSS module import
import { refreshToken, forgotPassword, resetPassword } from '../../API/authAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const { email, token } = location.state || {};

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setError(null);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setError(null);
    };

    const handleResetPassword = async () => {
        if (isSubmitting) return;

        // Basic validation
        if (!email || !token) {
            setError({ message: 'Thông tin không hợp lệ. Vui lòng thử lại.' });
            navigate('/forgot-password');
            return;
        }
        if (password.trim() === '') {
            setError({ message: 'Mật khẩu không được để trống.' });
            return;
        }
        if (password.length < 8) {
            setError({ message: 'Mật khẩu phải có ít nhất 8 ký tự.' });
            return;
        }
        if (password !== confirmPassword) {
            setError({ message: 'Mật khẩu và mật khẩu xác nhận không khớp.' });
            return;
        }

        setIsSubmitting(true);
        try {
            const resetData = { email, password };
            await resetPassword(resetData, token);
            setSuccessMessage('Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập.');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            const serverError = err.response.data;

            console.log('HTTP Status:', err.response.status);
            console.log('Server Error:', serverError);

            // Handle password errors
            if (serverError.non_field_errors) {
                const passwordErrors = serverError.non_field_errors.join(' ');
                console.log('Password Errors:', passwordErrors);
                setError({ message: passwordErrors });
                return;
            }

            // Handle other errors
            if (serverError.detail) {
                try {
                    console.log('Token hết hạn. Đang refresh token...');
                    const refreshedToken = await refreshToken(token); // Refresh token
                    console.log('Token mới:', refreshedToken);
                    const resetData = { email, password };
                    await resetPassword(resetData, refreshedToken.access); // Retry resetPassword with new token
                } catch (refreshError) {
                    console.error('Lỗi khi refresh token:', refreshError);
                    setError({ message: 'Không thể làm mới token. Vui lòng thử lại.' });
                    await forgotPassword(email);
                    navigate('/verify-otp', { state: { mode: 'forgotPassword', email } });
                }
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={style['reset-password-container']}>
            <h2>Đặt Lại Mật Khẩu</h2>

            {error && <p className={style['error-message']}>{error.message}</p>}

            <label htmlFor="new-password">Mật khẩu mới</label>
            <div className={style['password-input-container']}>
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu mới"
                    value={password}
                    onChange={handlePasswordChange}
                    className={style['password-input']}
                />
                <span
                    className={style['password-toggle-icon']}
                    onClick={() => setShowPassword(!showPassword)}
                >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
            </div>

            <label htmlFor="confirm-new-password">Xác nhận mật khẩu mới</label>
            <div className={style['password-input-container']}>
                <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Xác nhận mật khẩu mới"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className={style['password-input']}
                />
                <span
                    className={style['password-toggle-icon']}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </span>
            </div>

            {successMessage && <p className={style['success-message']}>{successMessage}</p>}

            <button
                type="button"
                onClick={handleResetPassword}
                className={style['reset-password-button']}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Đang xử lý...' : 'Đặt Lại Mật Khẩu'}
            </button>
        </div>
    );
}

export default ResetPassword;
