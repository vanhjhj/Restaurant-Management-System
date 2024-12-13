import axios from "axios";
import { API_BASE_URL } from '../Config/apiConfig';

// Hàm GetInfoCus
export const GetInfoCus = async (CusId, token) => {
    try {

        console.log("hi",CusId);
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
        console.error(
            "Lỗi khi lấy thông tin khách hàng:",
            error.response ? error.response.data : error.message
        );
        throw error;
    }

};

// Hàm GetInfoCus
export const GetEmailCus = async (CusId, token) => {
    try {

        console.log(`Requesting: /auth/accounts/${CusId}/`);

        const response = await axios.get(
            `${API_BASE_URL}/auth/accounts/${CusId}/`,
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

//Change Info Login
export const ChangeInfoLogCus = async (CusId, InfoChange, token) => {
    try {
        const response = await axios.patch(
            `${API_BASE_URL}/auth/accounts/${CusId}/`,
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

export const CheckPassword =async(CusID,Pass,token)=>{
    try {
        const response = await axios.post(
            `${API_BASE_URL}/auth/password-check/`,
            {id: CusID, password: Pass},
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
        console.log("Check-Password",CusID);
            console.error(
                "Lỗi khi ktra Password:",
                error.response ? error.response.data : error.message
            );
            throw error;
    }
}



