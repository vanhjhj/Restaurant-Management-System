import axios from "axios";
import { API_BASE_URL } from "../Config/apiConfig";
import { refreshToken } from "./authAPI";

export const getFoodItemsByID = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/menu/menuitems/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getMenuTabByID = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/menu/categories/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getMenuTabs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/menu/categories/`);
    return response.data.results;
  } catch (error) {
    throw error;
  }
};

export const getFoodItems = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/menu/menuitems/`);
    return response.data.results;
  } catch (error) {
    throw error;
  }
};
export const createNewMenuTab = async (category, accessToken) => {
  if (!accessToken) {
    console.error("Token không tồn tại");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("name", category.name);

    const response = await axios.post(
      `${API_BASE_URL}/menu/categories/`,
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
    if (error.response?.status === 401) {
      console.log("Token hết hạn, đang làm mới token...");
      const newToken = await refreshToken(
        localStorage.getItem("refresh_token")
      );
      if (newToken) return await createNewMenuTab(category, newToken);
    }
    console.error("Lỗi khi thêm mới mục:", error.message);
    throw error;
  }
};

export const deleteFoodItem = async (id, accessToken) => {
  if (!accessToken) {
    console.error("Token không tồn tại");
    return;
  }

  try {
    await axios.delete(`${API_BASE_URL}/menu/menuitems/${id}/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log("Xóa ưu đãi thành công");
  } catch (error) {
    if (error.response?.status === 401) {
      console.log("Token hết hạn, đang làm mới token...");
      const newToken = await refreshToken(
        localStorage.getItem("refresh_token")
      );
      if (newToken) return await deleteFoodItem(id, newToken);
    }
    console.error("Lỗi khi xóa món ăn:", error.message);
    throw error;
  }
};
