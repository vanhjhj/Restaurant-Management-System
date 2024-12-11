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
      startdate: promotion.startdate,
      enddate: promotion.enddate,
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

    const promotion = response.data;
    const filteredPromotion = {
      id: promotion.id,
      title: promotion.title,
      startdate: promotion.startdate,
      enddate: promotion.enddate,
      description: promotion.description,
      image: promotion.image,
      discount: promotion.discount,
    };

    return filteredPromotion;
  } catch (error) {
    console.error("Error fetching promotion:", error);
    throw error;
  }
};

// Hàm xóa một ưu đãi
export const deletePromotion = async (id, accessToken) => {
  if (!accessToken) {
    console.error("Token không tồn tại");
    return;
  }

  try {
    const response = await axios.delete(
      `${API_BASE_URL}/promotion/promotions/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("Ưu đãi đã được xóa:", response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log("Token hết hạn, đang làm mới token...");
      const newToken = await refreshToken(
        localStorage.getItem("refresh_token")
      );
      if (newToken) {
        return await deletePromotion(id, newToken); // Gọi lại với token mới
      }
    } else {
      console.error("Lỗi khi xóa ưu đãi:", error.message);
    }
    throw error;
  }
};

// Hàm thêm mới một ưu đãi
export const addPromotion = async (promotion, accessToken) => {
  if (!accessToken) {
    console.error("Token không tồn tại");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("title", promotion.title);
    formData.append("startdate", promotion.startdate); // Đảm bảo định dạng ngày đúng
    formData.append("enddate", promotion.enddate); // Đảm bảo định dạng ngày đúng
    formData.append("description", promotion.description);
    formData.append("image", promotion.image);
    formData.append("discount", promotion.discount);

    const response = await axios.post(
      `${API_BASE_URL}/promotion/promotions/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log("Token hết hạn, đang làm mới token...");
      const newToken = await refreshToken(
        localStorage.getItem("refresh_token")
      );
      if (newToken) {
        return await addPromotion(promotion, newToken); // Gọi lại với token mới
      }
    } else {
      console.error("Lỗi khi thêm ưu đãi:", error.message);
    }
    throw error;
  }
};

// Hàm cập nhật ưu đãi
export const updatePromotion = async (id, promotion, accessToken) => {
  if (!accessToken) {
    console.error("Token không tồn tại");
    return;
  }

  try {
    const response = await axios.patch(
      `${API_BASE_URL}/promotion/promotions/${id}/`,
      promotion,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log("Token hết hạn, đang làm mới token...");
      const newToken = await refreshToken(
        localStorage.getItem("refresh_token")
      );
      if (newToken) {
        return await updatePromotion(id, promotion, newToken); // Gọi lại với token mới
      }
    } else {
      console.error("Lỗi khi cập nhật ưu đãi:", error.message);
    }
    throw error;
  }
};
