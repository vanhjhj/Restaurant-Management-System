import axios from "axios";
import { API_BASE_URL } from "../Config/apiConfig";

export const getFoodItemsByID = async (id) => {};
export const postMenuTab = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/menu/categories/`);
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
