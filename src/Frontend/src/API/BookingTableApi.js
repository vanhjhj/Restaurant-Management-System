import axios from "axios";
import { API_BASE_URL } from "../Config/apiConfig";

//Đặt bàn
export const AddBookingTable=async(BookingInfo)=>{
    try {
        const response = await axios.post(
          `${API_BASE_URL}/booking/reservations/`,
          BookingInfo
        );
        return response.data; // Trả về kết quả nếu thành công
      } catch (error) {
        console.error(
          "Lỗi khi tạo Phiếu đặt bàn:",
          error.response ? error.response.data : error.message
        );
        throw error;
      }
};

//Lấy thông tin phiếu đặt bàn khi có sđt
export const GetBookingTableByPhone=async(phone)=>{
    console.log(phone);
    try {
        const response = await axios.get(
          `${API_BASE_URL}/booking/reservations/latest/`,
          {
            params: {
              phone_number: phone, // Tham số truyền qua params
            },
          }
        );
        return response.data; // Trả về kết quả nếu thành công
      } catch (error) {
        console.error(
          "Lỗi khi lấy phiếu đặt bàn:",
          error.response ? error.response.data : error.message
        );
        console.log({phone_number: phone});
        throw error;
      }
};
