// src/API/authAPI.js
import axios from "axios";
import { API_BASE_URL } from "../Config/apiConfig";
// Hàm đăng ký tài khoản mới
//kiểm tra username, password, email, account_type hợp lệ
export const account_check = async (userData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/account-check/`,
      userData
    );
    console.log(response.message); // Trả về dữ liệu từ API nếu thành công
  } catch (error) {
    console.log("User Data:", userData);
    console.error(error.response.data);
    throw error.response.data;
  }
};

// Hàm đăng nhập
export const login = async (credentials) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/token/`,
      credentials
    );
    console.log(response);
    const { access, refresh } = response.data; // Sử dụng tên chính xác của các trường
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);

    console.log("Token đã được lưu vào localStorage:", access, refresh);

    return response.data; // Trả về access và refresh tokens nếu thành công
  } catch (error) {
    console.error(
      "Lỗi khi đăng nhập:",
      error.response ? error.response.data : error.message
    );
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
      "Lỗi khi xác nhận OTP:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Gửi OTP
export const sendOrResendOTP = async (emailData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/register-otp/`,
      emailData
    );
    console.log("sendOrResendOTP try");
    return response.data; // Trả về kết quả nếu thành công
  } catch (error) {
    console.error(
      "Lỗi khi gửi OTP:",
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
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data.data); // Thông báo từ API nếu thành công
    return response.data.data;
  } catch (error) {
    console.error(
      "Lỗi khi đăng ký:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

//Hàm lấy mã otp khi quên mật khẩu
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/forgot-password/`, {
      email,
    });
    console.log("Yêu cầu quên mật khẩu thành công:", response.data.message);
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi gửi yêu cầu quên mật khẩu:",
      error.response ? error.response.data : error.message
    );
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
          "Content-Type": "application/json", // Định dạng nội dung JSON
        },
      }
    );

    // Trả về dữ liệu nếu thành công
    console.log("Đặt lại mật khẩu thành công:", response.data.message);
    return response.data;
  } catch (error) {
    // Ghi log lỗi chi tiết
    console.error(
      "Lỗi khi đặt lại mật khẩu:",
      error.response ? error.response.data : error.message
    );

    // Ném lỗi với thông báo chi tiết
    throw error;
  }
};

// Hàm refresh token
export const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh_token"); // Lấy refresh_token từ localStorage
  const access = localStorage.getItem("access_token"); // Lấy access_token từ localStorage

  // Kiểm tra xem token có tồn tại không
  if (!refresh || !access) {
    console.error("Không tìm thấy token trong localStorage");
    return null; // Nếu không có token, trả về null
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/token/refresh/`,
      { refresh }, // Chỉ cần gửi refresh_token vào request body
      {
        headers: {
          Authorization: `Bearer ${access}`, // Gửi access_token qua header Authorization
          "Content-Type": "application/json", // Định dạng nội dung JSON
        },
      }
    );

    // Trả về dữ liệu nếu thành công
    const { access: newAccessToken } = response.data; // Giả sử API trả về trường 'access'
    localStorage.setItem("access_token", newAccessToken); // Cập nhật access_token mới vào localStorage

    console.log("Làm mới token thành công:", response.data.message);
    return newAccessToken; // Trả về access_token mới
  } catch (error) {
    // Ghi log lỗi chi tiết
    console.error(
      "Lỗi khi làm mới token:",
      error.response ? error.response.data : error.message
    );

    // Xóa hết các token khi gặp lỗi
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    // Ném lỗi để xử lý ở nơi gọi hàm
    throw error;
  }
};

// Hàm đăng xuất
export const logout = async (refreshToken, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/logout/`,
      { refresh: refreshToken },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token qua header Authorization
          "Content-Type": "application/json", // Định dạng nội dung JSON
        },
      }
    );

    // Trả về dữ liệu nếu thành công
    console.log("dang xuat thanh cong:", response.data.message);
    return response.data;
  } catch (error) {
    // Ghi log lỗi chi tiết
    console.error(
      "Lỗi khi đang xuat:",
      error.response ? error.response.data : error.message
    );

    // Ném lỗi với thông báo chi tiết
    throw error;
  }
};
