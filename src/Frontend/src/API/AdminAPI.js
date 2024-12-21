import axios from "axios";
import { API_BASE_URL } from '../Config/apiConfig';

// Hàm FillInfoEmployee
export const FillInfoEmp = async (EmpId, InfoChange, token) => {
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
                "Lỗi khi cập nhật thông tin nhân viên:",
                error.response ? error.response.data : error.message
            );
            throw error;
        }
};

// Lấy danh sách bộ phận
export const getDepartments = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/auth/departments/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching departments:', error);
        throw error;
    }
};

// Thêm bộ phận mới
export const addDepartment = async (department,token) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/departments/`, department,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error adding department:', error);
        throw error;
    }
};

// Cập nhật bộ phận 
export const updateDepartment = async (id, updatedFields,token) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/auth/departments/${id}/`, updatedFields,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating department:', error);
        throw error;
    }
};


// Xóa bộ phận
export const deleteDepartment = async (id,token) => {
    try {
        await axios.delete(`${API_BASE_URL}/auth/departments/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    } catch (error) {
        console.error('Error deleting department:', error);
        throw error;
    }
};



// Lấy danh sách nhan vien
export const getEmployee = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/auth/employees/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching employees:', error);
        throw error;
    }
};

//xoa tai khoan nhan vien
export const deleteEmployee= async (id,token) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/auth/accounts/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error delete employee:', error);
        throw error;
    }
};

//xem danh sách hóa đơn
export const getInvoice= async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/bookings/order`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error get Invoices:', error);
        throw error;
    }
};
