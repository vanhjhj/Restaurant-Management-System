import axios from "axios";
import { API_BASE_URL } from "../Config/apiConfig";

export const fetchTablesData = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/booking/tables/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token qua header Authorization
        "Content-Type": "application/json", // Định dạng nội dung JSON
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchReservationData = async (token) => {
  try {
    let formattedDate;
    const today = new Date();

    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    formattedDate = `${year}-${month}-${day}`;
    const response = await axios.get(
      `${API_BASE_URL}/booking/reservations/?date=${formattedDate}&ordering=status`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token qua header Authorization
          "Content-Type": "application/json", // Định dạng nội dung JSON
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchDateData = async (token, date) => {
  try {
    let formattedDate;
    if (!date) {
      const today = new Date();

      const day = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      formattedDate = `${year}-${month}-${day}`;
    } else {
      formattedDate = date;
    }
    const response = await axios.get(
      `${API_BASE_URL}/booking/reservations/?date=${formattedDate}&ordering=status`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token qua header Authorization
          "Content-Type": "application/json", // Định dạng nội dung JSON
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getReservationByNumber = async (token, phone_number) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/booking/reservations/?phone_number=${phone_number}`,
      {
        params: { phone_number },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const patchReservation = async (token, rID, data) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/booking/reservations/${rID}/`,
      {
        guest_name: data.guest_name,
        note: data.note,
        number_of_guests: data.number_of_guests,
        phone_number: data.phone_number,
        time: data.time,
        date: data.date,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token qua header Authorization
          "Content-Type": "application/json", // Định dạng nội dung JSON
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchReservationDataByPhoneNumber = async (
  token,
  phone_number
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/booking/reservations/history/`,
      {
        params: { phone_number },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const assignTableAPI = async (token, rID, tID) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/booking/reservations/assign-table/${rID}/`,
      { table: tID },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token qua header Authorization
          "Content-Type": "application/json", // Định dạng nội dung JSON
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markDoneReservationAPI = async (token, rID) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/booking/reservations/mark-done/${rID}/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token qua header Authorization
          "Content-Type": "application/json", // Định dạng nội dung JSON
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markCancelReservationAPI = async (token, rID) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/booking/reservations/mark-cancel/${rID}/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token qua header Authorization
          "Content-Type": "application/json", // Định dạng nội dung JSON
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const unsignTableAPI = async (token, rID) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/booking/reservations/unassign-table/${rID}/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token qua header Authorization
          "Content-Type": "application/json", // Định dạng nội dung JSON
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createOrder = async (token, tID) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/booking/orders/`,
      { table: tID },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchOrderData = async (token, tID) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/booking/tables/current-order/${tID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchOrderItemData = async (token, oID) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/booking/orderitems/?order=${oID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addFood = async (token, oID, fID, q, n) => {
  try {
    const myData = {
      order: oID,
      menu_item: fID,
      quantity: q,
      note: n,
    };
    const response = await axios.post(
      `${API_BASE_URL}/booking/orders/add-item/`,
      myData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateItem = async (token, iID, q, n) => {
  try {
    const myData = {
      quantity: q,
      note: n,
    };
    const response = await axios.patch(
      `${API_BASE_URL}/booking/orderitem/update-item/${iID}/`,
      myData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateItemStatus = async (token, iID) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/booking/orderitem/mark-done/${iID}/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeItem = async (token, iID) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/booking/orders/remove-item/${iID}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkPhoneNumber = async (token, number) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/account-exists-check/`,
      {
        phone_number: { number },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addPromotionToInvoice = async (token, iID, pID) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/booking/orders/${iID}/`,
      {
        promotion: pID,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markPaid = async (token, iID) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/booking/orders/mark-paid/${iID}/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
