import axios from "axios";
import { API_BASE_URL } from "../Config/apiConfig";

// Hàm FillInfoEmployee
export const FillInfoEmp = async (InfoChange, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/employees/`,
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
      "Lỗi khi tạo thông tin nhân viên:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Lấy danh sách bộ phận
export const getDepartments = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/departments/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw error;
  }
};

// Lấy bộ phận theo id
export const getDepartmentById = async (id, token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/auth/departments/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching 1 departments:", error);
    throw error;
  }
};

// Thêm bộ phận mới
export const addDepartment = async (department, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/departments/`,
      department,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding department:", error);
    throw error;
  }
};

// Cập nhật bộ phận
export const updateDepartment = async (id, updatedFields, token) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/auth/departments/${id}/`,
      updatedFields,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating department:", error);
    throw error;
  }
};

// Xóa bộ phận
export const deleteDepartment = async (id, token) => {
  try {
    await axios.delete(`${API_BASE_URL}/auth/departments/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting department:", error);
    throw error;
  }
};

// Lấy danh sách nhan vien
export const getEmployee = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/employees/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

//xoa tai khoan nhan vien
export const deleteEmployee = async (id, token) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/auth/accounts/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error delete employee:", error);
    throw error;
  }
};

//xem danh sách hóa đơn
export const getInvoice = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/booking/orders/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error get Invoices:", error);
    throw error;
  }
};

// Lấy danh sách bàn
export const GetTable = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/booking/tables/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tables:", error);
    throw error;
  }
};

// Lấy danh bàn theo id
export const GetTableById = async (id, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/booking/tables/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching 1 table:", error);
    throw error;
  }
};

// Thêm bàn mới
export const addTable = async (department, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/booking/tables/`,
      department,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding table:", error);
    throw error;
  }
};

// Cập nhật bàn
export const UpdateTable = async (id, updatedFields, token) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/booking/tables/${id}/`,
      updatedFields,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating table:", error);
    throw error;
  }
};

// Xóa bàn
export const DeleteTable = async (id, token) => {
  try {
    await axios.delete(`${API_BASE_URL}/booking/tables/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting table:", error);
    throw error;
  }
};


//Lấy thông tin nhà hàng

export const GetResInfo = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/config/restaurant-configs/`);
    return response.data;
  } catch (error) {
    console.error("Error get restaurant info:", error);
    throw error;
  }
};

//chỉnh sửa thông tin nhà hàng
export const UpdateResInfo = async (token, restaurantInfor) => {
  const apiUrl = `${API_BASE_URL}/config/restaurant-configs/`;

  // Gửi JSON data (ngoại trừ QR)
  const jsonData = {
    name: restaurantInfor.name,
    address: restaurantInfor.address,
    phone: restaurantInfor.phone,
    google_map: restaurantInfor.google_map,
    email: restaurantInfor.email,
    social: restaurantInfor.social,
    onweek_openhour: restaurantInfor.onweek_openhour,
    onweek_closehour: restaurantInfor.onweek_closehour,
    weekend_openhour: restaurantInfor.weekend_openhour,
    weekend_closehour: restaurantInfor.weekend_closehour,
  };

  try {
    // Gửi JSON trước
    const jsonResponse = await axios.patch(apiUrl, jsonData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Đảm bảo gửi JSON
      },
    });

    console.log("JSON response:", jsonResponse.data);

    // Nếu có QR thì gửi patch riêng
    if (restaurantInfor.QR) {
      const formData = new FormData();
      if (restaurantInfor.QR instanceof File) {
        formData.append("QR", restaurantInfor.QR); // Gửi file QR
      } else if (typeof restaurantInfor.QR === "string") {
        formData.append("QR", restaurantInfor.QR); // Gửi URL QR
      }

      const qrResponse = await axios.patch(apiUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Đảm bảo gửi FormData
        },
      });

      console.log("QR response:", qrResponse.data);
    }

    return jsonResponse.data;
  } catch (error) {
    console.error("Error updating restaurant info:", error);
    throw error;
  }
};
