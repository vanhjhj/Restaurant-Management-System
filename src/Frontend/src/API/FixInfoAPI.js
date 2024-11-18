import axios from "axios";
import {refreshToken} from './authAPI'

// Hàm GetInfoCus
export const GetInfoCus = async (CusId, token) => {
    try {
        const response = await axios.get(
            `http://127.0.0.1:8000/api/auth/customers/${CusId}/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Đính kèm token
                    "Content-Type": "application/json",
                },
            }
        );
        console.log(response.data.message); // Thông báo từ API nếu thành công
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Token hết hạn
            try {
                const newToken = await refreshToken(); // Lấy token mới
                return await GetInfoCus(CusId, newToken); // Gửi lại yêu cầu với token mới
            } catch (refreshError) {
                console.error("Lỗi khi làm mới token:", refreshError);
                throw refreshError;
            }
        } else {
            console.error(
                "Lỗi khi lấy thông tin khách hàng:",
                error.response ? error.response.data : error.message
            );
            throw error;
        }
    }
};

// Hàm ChangeInfoCus
export const ChangeInfoCus = async (CusId, InfoChange, token) => {
    try {
        const response = await axios.patch(
            `http://127.0.0.1:8000/api/auth/customers/${CusId}/`,
            InfoChange,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Đính kèm token
                    "Content-Type": "application/json",
                },
            }
        );
        console.log(response.data.message); // Thông báo từ API nếu thành công
        return response.data;
    } catch (error) {
            console.error(
                "Lỗi khi cập nhật thông tin khách hàng:",
                error.response ? error.response.data : error.message
            );
            throw error;
        }
};


export const PostInfoCus= async(FormData) =>{
    try {
        const response = await axios.post(
            'http://127.0.0.1:8000/api/auth/customers/',
            FormData
        );
        console.log(response.data.message); // Thông báo từ API nếu thành công
        return response.data;
    } catch (error) {
        
        console.error(
            "Lỗi khi cập nhật thông tin khách hàng:",
            error.response ? error.response.data : error.message
        );
            throw error;
        }
};