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
  const formData = new FormData();

  // Xử lý các trường dạng mảng
  formData.append("name", JSON.stringify(restaurantInfor.name));
  formData.append("address", JSON.stringify(restaurantInfor.address));
  formData.append("phone", JSON.stringify(restaurantInfor.phone));
  formData.append("google_map", JSON.stringify(restaurantInfor.google_map));
  formData.append("email", JSON.stringify(restaurantInfor.email));


  // Xử lý social
  if (Array.isArray(restaurantInfor.social) && restaurantInfor.social.length > 0) {
    const socialObject = JSON.parse(restaurantInfor.social[0]);
    formData.append("social", JSON.stringify(socialObject));
  }

  // Xử lý các trường giờ mở cửa
  formData.append("onweek_openhour", restaurantInfor.onweek_openhour);
  formData.append("onweek_closehour", restaurantInfor.onweek_closehour);
  formData.append("weekend_openhour", restaurantInfor.weekend_openhour);
  formData.append("weekend_closehour", restaurantInfor.weekend_closehour);

  // Xử lý QR (file hoặc URL)
  if (restaurantInfor.QR[0] instanceof File) {
    formData.append("QR", restaurantInfor.QR[0]);
  } else if (typeof restaurantInfor.QR[0] === "string") {
    formData.append("QR", restaurantInfor.QR[0]); // Gửi URL
  }

  try {
    const response = await axios.patch(
      `${API_BASE_URL}/config/restaurant-configs/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating restaurant info:", error);
    throw error;
  }
};
