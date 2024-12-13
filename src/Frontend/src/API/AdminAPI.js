import axios from "axios";
import { API_BASE_URL } from '../Config/apiConfig';

// Hàm FillInfoEmployee
export const FillInfoEmp = async (EmpId, InfoChange, token) => {
    try {
        const response = await axios.patch(
            `${API_BASE_URL}/auth/customers/${EmpId}/`,
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
                "Lỗi khi cập nhật thông tin nhân viên:",
                error.response ? error.response.data : error.message
            );
            throw error;
        }
};

//Lấy thông tin bộ phận


