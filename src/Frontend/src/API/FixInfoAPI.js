import axios from "axios";
import {refreshToken} from './authAPI'
import { API_BASE_URL } from '../Config/apiConfig';

// Hàm GetInfoCus
export const GetInfoCus = async (CusId, token) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/auth/customers/${CusId}/`,
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
            `${API_BASE_URL}/auth/customers/${CusId}/`,
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


export const PostInfoCus= async(FormData,token) =>{
    try {
        const response = await axios.post(
            `${API_BASE_URL}/auth/customers/`,
            FormData,
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