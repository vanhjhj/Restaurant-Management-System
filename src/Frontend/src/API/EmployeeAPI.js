import axios from "axios";
import { API_BASE_URL } from '../Config/apiConfig';

// Hàm GetInfoEmp
export const GetInfoEmp = async (EmpId, token) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/auth/employees/${EmpId}/`,
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
            "Lỗi khi lấy thông tin khách hàng:",
            error.response ? error.response.data : error.message
        );
        throw error;
    }

};

// Hàm GetInfoEmp
export const GetEmailEmp = async (EmpId, token) => {
    try {

        console.log(`Requesting: /auth/accounts/${EmpId}/`);

        const response = await axios.get(
            `${API_BASE_URL}/auth/accounts/${EmpId}/`,
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
            "Lỗi khi lấy thông tin email:",
            error.response ? error.response.data : error.message
        );
        throw error;
        
    }
};


// Hàm ChangeInfoEmp
export const ChangeInfoEmp = async (EmpId, InfoChange, token) => {
    try {
        const response = await axios.patch(
            `${API_BASE_URL}/auth/employees/${EmpId}/`,
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

//Change Info Login
export const ChangeInfoLogEmp = async (EmpId, InfoChange, token) => {
    try {
        const response = await axios.patch(
            `${API_BASE_URL}/auth/accounts/${EmpId}/`,
            InfoChange,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Đính kèm token
                    "Content-Type": "application/json",
                },
            }
        );
        console.log(response.data.message); // Thông báo từ API nếu thành công
        console.log("Pass moi",InfoChange);
        return response.data;
    } catch (error) {
            console.error(
                "Lỗi khi đổi email/password:",
                error.response ? error.response.data : error.message
            );
            throw error;
        }
};

