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
      const today = new Date();

      const day = today.getDate(); 
      const month = today.getMonth() + 1; 
      const year = today.getFullYear(); 
      const formattedDate = `${year}-${month}-${day}`;
      const response = await axios.get(`${API_BASE_URL}/booking/reservations/?date=${formattedDate}&ordering=status`,
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

export const createOrder = async (token, tID) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/booking/orders/`,{table: tID},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    console.log(response.data);
    return response.data;
  }
  catch (error) {
    console.log(error);
    throw error;
  }
}

export const fetchOrderData = async (token, tID) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/booking/tables/current-order/${tID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    return response.data;
  }
  catch (error) {
    console.log(error);
    throw error;
  }
}

export const fetchOrderItemData = async (token, oID) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/booking/orderitems/?order=${oID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    return response.data;
  }
  catch (error) {
    console.log(error);
    throw error;
  }
}

export const addFood = async (token, oID, fID, q, n) => {
  try {
    const myData = {
      order: oID,
      menu_item: fID,
      quantity: q,
      note: n,
    }
    const response = await axios.post(`${API_BASE_URL}/booking/orders/add-item/`,
      myData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    return response.data;
  }
  catch (error) {
    throw error;
  }
}

export const updateItem = async (token, oID, fID, q, n) => {
  try {
    const myData = {
      order: oID,
      menu_item: fID,
      quantity: q,
      note: n,
    }
    const response = await axios.patch(`${API_BASE_URL}/booking/orders/update-item/`,
      myData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    return response.data;
  }
  catch (error) {
    if (error.response) {
      console.log("Error response data:", error.response.data);
      console.log("Error response status:", error.response.status);
      console.log("Error response headers:", error.response.headers);
    } else {
      console.log("Error message:", error.message);
    }
    throw error;
  }
}

export const removeItem = async (token, oID, fID) => {
  try {
    const myData = {
      order: oID,
      menu_item: fID,
    }
    console.log(token);
    console.log(myData);
    const response = await axios.delete(`${API_BASE_URL}/booking/orders/remove-item/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      data: {
        order: oID,
        menu_item: fID,
      }
    });
    return response.data;
  }
  catch (error) {
    if (error.response) {
      console.log("Error response data:", error.response.data);
      console.log("Error response status:", error.response.status);
      console.log("Error response headers:", error.response.headers);
    } else {
      console.log("Error message:", error.message);
    }
    throw error;
  }
}