// src/API/authAPI.js
import axios from 'axios';
import { API_BASE_URL } from '../Config/apiConfig';
// Hàm đăng ký tài khoản mới
//kiểm tra username, password, email, account_type hợp lệ
export const account_check=async(userData)=>{
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/account-check/`, userData);
        console.log(response.message); // Trả về dữ liệu từ API nếu thành công
    } catch (error) {
        console.log("User Data:", userData);
        console.error('Lỗi khi đăng ký:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : { message: "Đã xảy ra lỗi không xác định" };
    }
}

// Hàm đăng nhập
export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/token/`, credentials);
        console.log(response);
        return response.data; // Trả về access và refresh tokens nếu thành công
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error.response ? error.response.data : error.message);
        throw error;
    }
};


//xác minh OTP
export const verifyOTP = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/verify-otp/`, data);
        return response.data; // Trả về dữ liệu thành công
    } catch (error) {
        console.error(
            'Lỗi khi xác nhận OTP:',
            error.response ? error.response.data : error.message
          );
        throw error;
    }
};

// Gửi OTP
export const sendOrResendOTP = async (emailData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register-otp/`, emailData);
        console.log("sendOrResendOTP try");
        return response.data; // Trả về kết quả nếu thành công
    } catch (error) {
        console.error(
            'Lỗi khi gửi OTP:',
            error.response ? error.response.data : error.message
          );
        throw error;
    }
};


//đăng kí
export const register = async (userData, token) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/accounts/`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm header Authorization
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data.data); // Thông báo từ API nếu thành công
      return response.data.data;
    } catch (error) {
      console.error(
        'Lỗi khi đăng ký:',
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };

  //Hàm lấy mã otp khi quên mật khẩu
export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/forgot-password/`, { email });
        console.log('Yêu cầu quên mật khẩu thành công:', response.data.message);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gửi yêu cầu quên mật khẩu:', error.response ? error.response.data : error.message);
        throw error;
    }
};
//reset-Password
export const resetPassword = async (resetData, token) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/auth/reset-password/`,
            resetData,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Gửi token qua header Authorization
                    'Content-Type': 'application/json', // Định dạng nội dung JSON
                },
            }
        );

        // Trả về dữ liệu nếu thành công
        console.log('Đặt lại mật khẩu thành công:', response.data.message);
        return response.data;
    } catch (error) {
        // Ghi log lỗi chi tiết
        console.error(
            'Lỗi khi đặt lại mật khẩu:',
            error.response ? error.response.data : error.message
        );

        // Ném lỗi với thông báo chi tiết
        throw error;
    }
};


// Hàm refresh token
export const refreshToken = async (refreshToken,accessToken) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/auth/token/refresh/`,
            {refresh: refreshToken},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Gửi token qua header Authorization
                    'Content-Type': 'application/json', // Định dạng nội dung JSON
                },
            }
        );

        // Trả về dữ liệu nếu thành công
        console.log('lam moi token thanh cong:', response.data.message);
        return response.data;
    } catch (error) {
        // Ghi log lỗi chi tiết
        console.error(
            'Lỗi khi lam moi token:',
            error.response ? error.response.data : error.message
        );

        // Ném lỗi với thông báo chi tiết
        throw error;
    }
};

// Hàm đăng xuất
export const logout = async (refreshToken,token) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/auth/logout/`,
            {refresh: refreshToken},
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Gửi token qua header Authorization
                    'Content-Type': 'application/json', // Định dạng nội dung JSON
                },
            }
        );

        // Trả về dữ liệu nếu thành công
        console.log('dang xuat thanh cong:', response.data.message);
        return response.data;
    } catch (error) {
        // Ghi log lỗi chi tiết
        console.error(
            'Lỗi khi đang xuat:',
            error.response ? error.response.data : error.message
        );

        // Ném lỗi với thông báo chi tiết
        throw error;
    }
};