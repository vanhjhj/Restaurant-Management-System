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
      const response = await axios.get(`${API_BASE_URL}/booking/reservations/?order=status/`,
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
    const response = await axios.patch(`${API_BASE_URL}/booking/reservations/assign-table/${rID}/`,
      { table: tID },
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

export const markDoneReservationAPI = async (token, rID) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/booking/reservations/mark-done/${rID}/`,{},
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

export const markCancelReservationAPI = async (token, rID) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/booking/reservations/mark-cancel/${rID}/`,{},
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

export const unsignTableAPI = async (token, rID) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/booking/reservations/unassign-table/${rID}/`,{},
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
