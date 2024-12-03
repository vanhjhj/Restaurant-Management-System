import axios from "axios";
import { API_BASE_URL } from "../Config/apiConfig";
import { refreshToken } from "./authAPI";

// Hàm lấy danh sách ưu đãi
export const fetchPromotions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/promotion/promotions/`);
    const filteredPromotions = response.data.results.map((promotion) => ({
      id: promotion.id,
      title: promotion.title,
      description: promotion.description,
      image: promotion.image,
      discount: promotion.discount,
    }));

    return filteredPromotions;
  } catch (error) {
    console.error("Error fetching promotions:", error);
    throw error;
  }
};

export const fetchPromotionById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/promotion/promotions/${id}/`
    );

    // API trả về đối tượng trực tiếp, không phải mảng
    const promotion = response.data; // Đây là đối tượng trực tiếp, không cần lọc từ mảng

    // Lọc thông tin cần thiết
    const filteredPromotion = {
      id: promotion.id,
      title: promotion.title,
      description: promotion.description,
      image: promotion.image,
      discount: promotion.discount,
    };

    return filteredPromotion; // Trả về thông tin đã lọc
  } catch (error) {
    console.error("Error fetching promotion:", error);
    throw error; // Ném lỗi ra ngoài
  }
};
// Hàm xóa một ưu đãi
export const deletePromotion = async (id) => {
  let token = localStorage.getItem("access_token"); // Lấy token từ localStorage
  if (!token) {
    console.error("Token không tồn tại trong localStorage");
    return; // Nếu không có token, dừng lại
  }

  try {
    const response = await axios.delete(
      `${API_BASE_URL}/promotion/promotions/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token qua header Authorization
        },
      }
    );
    console.log("Ưu đãi đã được xóa:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      console.error(`Lỗi từ server (Status: ${status}):`, data);
      // Nếu token hết hạn, gọi refresh token và thử lại
      if (status === 401) {
        console.log("Token hết hạn, đang làm mới token...");
        const newToken = await refreshToken(
          localStorage.getItem("refresh_token")
        );
        if (newToken) {
          return await deletePromotion(id); // Gọi lại hàm deletePromotion với token mới
        }
      }
      if (status === 500) {
        console.error("Lỗi nội bộ từ server. Vui lòng kiểm tra lại API.");
      }
    } else {
      console.error("Lỗi không xác định:", error.message);
    }
  }
};

// Hàm thêm mới một ưu đãi
export const addPromotion = async (promotion) => {
  let token = localStorage.getItem("access_token"); // Lấy token từ localStorage

  if (!token) {
    console.error("Token không tồn tại");
    return;
  }

  try {
    // Tạo đối tượng FormData để gửi file
    const formData = new FormData();
    formData.append("title", promotion.title);
    formData.append("description", promotion.description);
    formData.append("discount", promotion.discount);
    formData.append("image", promotion.image); // Thêm file ảnh

    // Gửi request với FormData
    const response = await axios.post(
      `${API_BASE_URL}/promotion/promotions/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Đặt đúng Content-Type
        },
      }
    );

    return response.data; // Trả về dữ liệu nếu thành công
  } catch (error) {
    // Kiểm tra nếu token hết hạn (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      console.log("Token hết hạn, đang làm mới token...");

      // Làm mới token
      const newToken = await refreshToken(
        localStorage.getItem("refresh_token")
      );

      if (newToken) {
        // Sau khi làm mới token, thử lại yêu cầu
        return await addPromotion(promotion); // Gọi lại hàm addPromotion với token mới
      }
    } else {
      // Nếu gặp lỗi khác
      console.error(
        "Lỗi khi thêm ưu đãi:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }
};

// Hàm cập nhật ưu đãi
export const updatePromotion = async (id, promotion) => {
  let token = localStorage.getItem("access_token"); // Lấy token từ localStorage

  if (!token) {
    console.error("Token not found");
    return; // Nếu không có token, dừng lại
  }

  try {
    // Gửi PATCH request với các trường dữ liệu cần cập nhật
    const response = await axios.patch(
      `${API_BASE_URL}/promotion/promotions/${id}/`,
      promotion, // Chỉ gửi những trường thay đổi
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Trả về dữ liệu ưu đãi đã cập nhật thành công
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log("Token hết hạn, đang làm mới token...");
      // Nếu token hết hạn, gọi hàm làm mới token
      token = await refreshToken(localStorage.getItem("refresh_token"));
      if (token) {
        // Sau khi làm mới token, thử lại yêu cầu
        return await updatePromotion(id, promotion); // Gọi lại hàm updatePromotion với token mới
      }
    } else {
      console.error(
        "Lỗi khi cập nhật ưu đãi:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }
};
