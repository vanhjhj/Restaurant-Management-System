import axios from "axios";
import { API_BASE_URL } from "../Config/apiConfig";
import { refreshToken } from "./authAPI";

export const fetchPromotions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/promotion/promotions/`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách ưu đãi:", error.message);
    throw error;
  }
};

export const fetchValidPromotions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/promotion/promotions/`, {
      params: {
        valid: true,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách ưu đãi:", error.message);
    throw error;
  }
};

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

export const deletePromotion = async (code, accessToken) => {
  try {
    await axios.delete(`${API_BASE_URL}/promotion/promotions/${code}/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log("Xóa ưu đãi thành công");
  } catch (error) {
    console.error("Lỗi khi xóa ưu đãi:", error.message);
    throw error;
  }
};

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
    console.error("Lỗi khi thêm mới ưu đãi:", error.message);
    throw error;
  }
};

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
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật ưu đãi:", error.message);
    throw error;
  }
};
