import axios from "axios";
import { API_BASE_URL } from "../Config/apiConfig";
import { refreshToken } from "./authAPI";

export const getFoodItemByID = async (id) => {
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
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFoodItems = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/menu/menuitems/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const createNewMenuTab = async (category, accessToken) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/menu/categories/`,
      category,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm mới mục:", error.message);
    throw error;
  }
};

export const deleteMenuTab = async (id, accessToken) => {
  try {
    await axios.delete(`${API_BASE_URL}/menu/categories/${id}/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (error) {
    console.error("Lỗi khi xóa mục món ăn:", error.message);
    throw error;
  }
};

export const updateMenuTab = async (id, category, accessToken) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/menu/categories/${id}/`,
      category,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi khi sửa mục món ăn:", error.message);
    throw error;
  }
};

export const deleteFoodItem = async (id, accessToken) => {
  try {
    await axios.delete(`${API_BASE_URL}/menu/menuitems/${id}/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (error) {
    console.error("Lỗi khi xóa món ăn:", error.message);
    throw error;
  }
};

export const createNewFoodItem = async (foodItem, accessToken) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/menu/menuitems/`,
      foodItem,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm mới món ăn:", error.message);
    throw error;
  }
};

export const updateFoodItem = async (id, menuitem, accessToken) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/menu/menuitems/${id}/`,
      menuitem,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật món ăn:", error.message);
    throw error;
  }
};
