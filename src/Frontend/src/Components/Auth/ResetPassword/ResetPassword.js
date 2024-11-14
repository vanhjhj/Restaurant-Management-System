import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ResetPassword.css';
import { refreshToken,forgotPassword, resetPassword } from '../../../API/authAPI';
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

        // Validation cơ bản
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

            // Xử lý lỗi mật khẩu
            if (serverError.non_field_errors) {
                const passwordErrors = serverError.non_field_errors.join(' ');
                console.log('Password Errors:', passwordErrors);
                setError({ message: passwordErrors });
                return;
            }

            // Xử lý lỗi khác
            if(serverError.detail){
                try {
                    console.log('Token hết hạn. Đang refresh token...');
                    const refreshedToken = await refreshToken(token); // Gọi API refresh token
                    console.log('Token mới:', refreshedToken);
                    const resetData = { email, password };
                    await resetPassword(resetData, refreshedToken.access); // Thử lại resetPassword với token mới
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
        <div className="reset-password-container">
            <h2>Đặt Lại Mật Khẩu</h2>

            {error && <p className="error-message">{error.message}</p>}

            <label htmlFor="new-password">Mật khẩu mới</label>
            <div className="password-input-container">
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu mới"
                    value={password}
                    onChange={handlePasswordChange}
                    className="password-input"
                />
                <span
                    className="password-toggle-icon"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
            </div>

            <label htmlFor="confirm-new-password">Xác nhận mật khẩu mới</label>
            <div className="password-input-container">
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Xác nhận mật khẩu mới"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className="password-input"
                />
                <span
                    className="password-toggle-icon"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </span>
            </div>

            {successMessage && <p className="success-message">{successMessage}</p>}

            <button
                type="button"
                onClick={handleResetPassword}
                className="reset-password-button"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Đang xử lý...' : 'Đặt Lại Mật Khẩu'}
            </button>
        </div>
    );
}

export default ResetPassword;
