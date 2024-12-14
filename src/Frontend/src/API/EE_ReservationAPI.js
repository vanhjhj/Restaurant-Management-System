import axios from 'axios';
import { API_BASE_URL } from '../Config/apiConfig';

export const fetchTablesData = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/booking/tables/`,
        {
            headers: {
              Authorization: `Bearer ${token}`, // Gửi token qua header Authorization
              "Content-Type": "application/json", // Định dạng nội dung JSON
            },
          });
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const fetchReservationData = async (token) => {
  try {
      const response = await axios.get(`${API_BASE_URL}/booking/reservations/`,
      {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token qua header Authorization
            "Content-Type": "application/json", // Định dạng nội dung JSON
          },
        });
        
      return response.data;
  }
  catch(error) {
      throw error;
  }
}

export const assignTableAPI = async (token, rID, tID) => {
  try {
    console.log(token);
    const response = await axios.patch(`${API_BASE_URL}/booking/reservations/assign-table/${rID}/`,
      { table: tID },
      {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token qua header Authorization
            "Content-Type": "application/json", // Định dạng nội dung JSON
          },
        });
    console.log(response.data);
    return response.data;
  }
  catch(error) {
      throw error;
  }
}
