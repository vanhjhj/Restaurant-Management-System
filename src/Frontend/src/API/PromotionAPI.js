import axios from "axios";
import { API_BASE_URL } from "../Config/apiConfig";
import { refreshToken } from "./authAPI";

// Hàm lấy danh sách ưu đãi
export const fetchPromotions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/promotion/promotions/`);
    return response.data.results;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách ưu đãi:", error.message);
    throw error;
  }
};

// Hàm lấy thông tin ưu đãi cụ thể theo mã code
export const fetchPromotionByCode = async (code) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/promotion/promotions/${code}/`
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin ưu đãi:", error.message);
    throw error;
  }
};

// Hàm xóa một ưu đãi
export const deletePromotion = async (code, accessToken) => {
  try {
    await axios.delete(`${API_BASE_URL}/promotion/promotions/${code}/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log("Xóa ưu đãi thành công");
  } catch (error) {
    if (error.response?.status === 401) {
      console.log("Token hết hạn, đang làm mới token...");
      const newToken = await refreshToken(localStorage.getItem("refreshToken"));
      if (newToken) return await deletePromotion(code, newToken);
    }
    console.error("Lỗi khi xóa ưu đãi:", error.message);
    throw error;
  }
};

// Hàm thêm mới một ưu đãi
export const addPromotion = async (promotion, accessToken) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/promotion/promotions/`,
      promotion,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.log("Token hết hạn, đang làm mới token...");
      const newToken = await refreshToken(localStorage.getItem("refreshToken"));
      if (newToken) return await addPromotion(promotion, newToken);
    }
    console.error("Lỗi khi thêm mới ưu đãi:", error.message);
    throw error;
  }
};

// Hàm cập nhật ưu đãi
export const updatePromotion = async (code, promotion, accessToken) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/promotion/promotions/${code}/`,
      promotion,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Cập nhật thành công:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi chi tiết từ backend:", error.response?.data);
    if (error.response && error.response.status === 401) {
      console.log("Token hết hạn, đang làm mới token...");
      const newToken = await refreshToken(localStorage.getItem("refreshToken"));
      if (newToken) return await updatePromotion(code, promotion, newToken);
    }
    console.error("Lỗi khi cập nhật ưu đãi:", error.message);
    throw error;
  }
};
