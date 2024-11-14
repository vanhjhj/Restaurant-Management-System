import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './VerifyOTP.css';
import { verifyOTP, register, sendOrResendOTP,forgotPassword } from '../../../API/authAPI';

function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy mode, email, và signupData từ location.state
  const { mode = 'register', email, signupData } = location.state || {};

  const handleInputChange = (e) => {
    setOtp(e.target.value);
    setError(''); // Xóa thông báo lỗi khi người dùng nhập lại
    setSuccessMessage('');
  };

  const handleVerify = async () => {
    if (!email) {
      setError('Không tìm thấy email. Vui lòng thử lại.');
      return;
    }

    if (otp.trim() === '') {
      setError('Vui lòng nhập mã OTP.');
      return;
    }

    setError('');
    setSuccessMessage('');

    try {
      console.log(`Xác minh OTP cho email: ${email}`);

      // Gửi yêu cầu xác minh OTP
      let response = await verifyOTP({ email, otp });

      if (mode === 'register') {
        // Nếu ở chế độ đăng ký, gửi thông tin đăng ký
        if (!signupData) {
          setError('Không tìm thấy thông tin đăng ký. Vui lòng thử lại.');
          return;
        }

        const userData = {
          username: signupData.username,
          email: signupData.email,
          password: signupData.password,
          account_type: signupData.account_type,
        };

        // Đăng ký tài khoản
        await register(userData, response.token);
        alert('Đăng ký thành công!');
        navigate('/login');
      } else if (mode === 'forgotPassword') {

        // Nếu ở chế độ quên mật khẩu, điều hướng đến trang đặt lại mật khẩu
        alert('OTP xác minh thành công. Vui lòng đặt lại mật khẩu!');
        navigate('/reset-password', { state: { email, token: response.token } });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Mã OTP không hợp lệ. Vui lòng thử lại.';
      setError(errorMessage);
    }
  };

  const handleReSendOTP = async () => {
    try {
      if(mode==="register"){
      // Gửi lại mã OTP
      await sendOrResendOTP({ email });
      }else if( mode==="forgotPassword")
      {
        await forgotPassword({email});
      }
      setSuccessMessage('Mã OTP đã được gửi lại, vui lòng kiểm tra email của bạn.');
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Email không hợp lệ';
      setError(errorMessage);
    }
  };

  return (
    <div className="verify-otp-container">
      <h2>Xác Minh OTP</h2>
      <input
        type="text"
        placeholder="Nhập mã OTP"
        value={otp}
        onChange={handleInputChange}
        className="otp-input"
      />
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <button onClick={handleVerify} className="verify-button">
        Xác Minh
      </button>
      <button onClick={handleReSendOTP} className="re-verify-button">
        Gửi lại mã xác minh
      </button>
    </div>
  );
}

export default VerifyOTP;
