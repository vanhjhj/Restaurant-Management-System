// src/API/authAPI.js
import axios from 'axios';

// Hàm đăng ký tài khoản mới
export const register = async (userData) => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/auth/accounts/', userData);
        console.log(response); // Trả về dữ liệu từ API nếu thành công
    } catch (error) {
        console.log("User Data:", userData);
        console.error('Lỗi khi đăng ký:', error.response ? error.response.data : error.message);
        throw error; // Ném lỗi để component xử lý tiếp
    }
};

// Hàm đăng nhập
export const login = async (credentials) => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/auth/token/', credentials);
        console.log(response);
        return response.data; // Trả về access và refresh tokens nếu thành công
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Hàm refresh token
export const refreshToken = async (refreshToken) => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', { refresh: refreshToken });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi refresh token:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Hàm đăng xuất
export const logout = async (refreshToken) => {
    try {
        await axios.post('http://127.0.0.1:8000/api/logout/', { refresh: refreshToken });
    } catch (error) {
        console.error('Lỗi khi đăng xuất:', error.response ? error.response.data : error.message);
        throw error;
    }
};
