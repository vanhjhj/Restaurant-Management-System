import React, { useState, useEffect } from "react";
import { GetInfoCus } from "../../../API/FixInfoAPI";
import { isTokenExpired } from '../../../utils/tokenHelper.mjs';
import { refreshToken } from '../../../API/authAPI';
import style from "./BookingTable.module.css";
import { AddBookingTable,GetBookingTableByPhone } from "../../../API/BookingTableApi";
import { ModalGeneral } from "../../ModalGeneral";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function BookingTable() {
  const [phoneNumber, setPhoneNumber] = useState(""); // Số điện thoại
  const [islogin,setIslogin]=useState(false);
  const [bookingInfo, setBookingInfo] = useState({
    guest_name: "",
    date: "",
    time: "",
    phone_number: "",
    number_of_guests: 1,
    note: "",
  });
  const navigate = useNavigate();
  let userName;
  let userPhone;

  const [modal, setModal] = useState({
    isOpen: false,
    text: "",
    type: "", // "confirm" hoặc "success"
    onConfirm: null, // Hàm được gọi khi xác nhận
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading trạng thái
  const UserID = localStorage.getItem("userId");
  useEffect(() => {
    const accountType = localStorage.getItem("accountType");
    if (accountType) {
      setIslogin(true);
    } else {
      setIslogin(false);
    }
  }, []);
  

  useEffect(() => {
    checkLoginStatus(); // Kiểm tra trạng thái đăng nhập
  }, []);

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  useEffect(() => {
    setBookingInfo((prevInfo) => ({
      ...prevInfo,
      date: prevInfo.date || today, // Đặt ngày mặc định là hôm nay nếu chưa có giá trị
    }));
  }, []);
  

  const ensureActiveToken = async () => {
    let activeToken = localStorage.getItem("accessToken");
    const refresh = localStorage.getItem("refreshToken");
    if (isTokenExpired(activeToken)) {
      const refreshed = await refreshToken(refresh);
      activeToken = refreshed.access;
      localStorage.setItem("accessToken", activeToken);
    }
    return activeToken;
  };

  const checkLoginStatus = async () => {
    try {
      const token = await ensureActiveToken();
      const response = await GetInfoCus(UserID, token); // Lấy thông tin người dùng từ API
  
      if (response) {
        userPhone = response.phone_number;
        userName = response.full_name;
  
        // Nếu người dùng có số điện thoại, tự động điền vào form
        if (userPhone) {
          setPhoneNumber(userPhone);
          setBookingInfo((prevInfo) => ({
            ...prevInfo,
            phone_number: userPhone,
            guest_name: userName,
          }));
  
          // Kiểm tra thông tin đặt bàn qua số điện thoại
          fetchBookingData(userPhone, userName);
        } else {
          // Không có số điện thoại, cho phép người dùng tự nhập
          setBookingInfo((prevInfo) => ({
            ...prevInfo,
            guest_name: userName, // Chỉ điền tên
          }));
        }
      }
    } catch (err) {
      // Nếu xảy ra lỗi (ví dụ: người dùng chưa đăng nhập), để trống thông tin
      setPhoneNumber("");
      setBookingInfo((prevInfo) => ({
        ...prevInfo,
        phone_number: "",
      }));
    }
  };

  const validatePhoneNumber = (phone) => {
    if (phone.length === 0) {
      return "Số điện thoại không được để trống.";
    }
    if (!/^[0-9]+$/.test(phone)) {
      return "Số điện thoại chỉ được chứa chữ số.";
    }
    if (phone.length !== 10) {
      return "Số điện thoại phải đủ 10 chữ số.";
    }
    if (!/^03/.test(phone)) {
      return "Số điện thoại phải bắt đầu bằng số 03.";
    }
    return null; // Hợp lệ
  };

  const fetchBookingData = async (phone, name) => {
    if (!phone) return;
    setLoading(true);
    try {
      const response = await GetBookingTableByPhone(phone);
      if (response) {
        // Load thông tin đặt bàn nếu có
        setBookingInfo({
          guest_name: response.guest_name,
          date: today,
          time: "",
          phone_number: phone,
          number_of_guests: response.number_of_guests,
          note: response.note,
        });
      } else {
        // Nếu không có thông tin đặt bàn, giữ nguyên thông tin người dùng
        setBookingInfo((prevInfo) => ({
          ...prevInfo,
          phone_number: phone,
          guest_name: name,
        }));
      }
    } catch (err) {
      // Nếu không có thông tin đặt bàn, giữ nguyên thông tin người dùng
      setBookingInfo((prevInfo) => ({
        ...prevInfo,
        phone_number: phone,
        guest_name: name,
      }));
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    const phone = e.target.value;
  
    // Gọi hàm kiểm tra số điện thoại
    const error = validatePhoneNumber(phone);
  
    if (error) {
      setError(error); // Cập nhật lỗi
    } else {
      setError(""); // Xóa lỗi nếu hợp lệ
    }
  
    setPhoneNumber(phone);
  
    if (!error && phone.trim() !== "") {
      fetchBookingData(phone, bookingInfo.guest_name); // Tải dữ liệu đặt bàn qua số điện thoại mới
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneError = validatePhoneNumber(phoneNumber);
    if (phoneError) {
      setError(phoneError);
      return; // Dừng form nếu số điện thoại không hợp lệ
    }

    const now = new Date(); 
    const bookingDate = new Date(bookingInfo.date); 
    const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const bookingDateOnly = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate());

    if (bookingDateOnly < nowDateOnly) {
      setError("Không thể đặt bàn vào ngày trong quá khứ. Vui lòng sửa lại ngày đến!");
      return;
    }
    const [hours, minutes] = bookingInfo.time.split(":").map(Number); 
    bookingDate.setHours(hours, minutes, 0); 
  
    // 1. Kiểm tra nếu thời gian đặt nhỏ hơn 1 tiếng so với hiện tại
    const timeDifference = bookingDate.getTime() - now.getTime(); // Sự khác biệt thời gian (ms)
    if (timeDifference < 60 * 60 * 1000) { // 1 tiếng = 60 phút = 3600 giây
      setError("Khách cần đặt bàn trước ít nhất 1 tiếng. Vui lòng sửa lại thời gian!");
      return;
    }
    try {
      const requestData = {
        ...bookingInfo,
        date: bookingInfo.date, // Ngày đã ở đúng định dạng
      };
      await AddBookingTable(requestData);
      setModal({
        isOpen: true,
        text: "Đặt bàn thành công!",
        type: "success",
        onClose:handleOpenModalQuestion, 
      });

      setError('');
      setBookingInfo({
        guest_name: "",
        date: "",
        time: "",
        phone_number: "",
        number_of_guests: 1,
        note: "",
      });
      
    } catch (err) {
      setError("Không thể đặt bàn. Vui lòng thử lại.");
    }
  };

  const handleOpenModalQuestion=()=>{
      console.log({islogin});
      // Đóng modal đầu tiên và mở modal thứ hai nếu cần
      if (islogin === false) {
        setModal({
          isOpen: true,
          text: "Bạn có muốn đăng ký tài khoản để nhận thêm nhiều khuyến mãi không?",
          type: "confirm",
          onConfirm: () => {
            setModal({ isOpen: false });
            navigate('/SignUp'); // Điều hướng đến trang đăng ký
          },
          onClose: () =>{ 
            setModal({ isOpen: false }); // Đóng modal nếu người dùng từ chối
            console.log('hii');
          }
        });
      } else {
        setModal({ isOpen: false });
      }
  }

  return (
    <div className={style["booking-form-container"]}>
      <h2>ĐẶT BÀN</h2>
      {loading && <p>Đang tải...</p>}
      {error && <p className={style["error-message"]}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Số điện thoại:
          <input
            type="text"
            name="phone_number"
            value={phoneNumber}
            onChange={handlePhoneChange}
            required
          />
        </label>
        <label>
          Họ và Tên:
          <input
            type="text"
            name="guest_name"
            value={bookingInfo.guest_name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Ngày đến:
          <input
            type="date"
            name="date"
            value={bookingInfo.date}
            onChange={(e) => {
              handleInputChange({ target: { name: "date", value: e.target.value} });
            }}
            min={bookingInfo.date}
            required
          />
        </label>
        <label>
          Thời gian:
          <input
            type="time"
            name="time"
            value={bookingInfo.time}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Số khách:
          <input
            type="number"
            name="number_of_guests"
            value={bookingInfo.number_of_guests}
            onChange={handleInputChange}
            min="1"
            required
          />
        </label>
        <label>
          Ghi chú:
          <textarea
            name="note"
            value={bookingInfo.note}
            onChange={handleInputChange}
          />
        </label>
        <div className={style["warning"]}>
          <FontAwesomeIcon icon={faExclamationTriangle} className={style["warning-icon"]} />
          <h3 className={style["warning-text"]}>
            Khách hàng cần đặt bàn trước ít nhất 01 tiếng so với thời gian dự định tới nhà hàng,
            và thời gian thực tế tới nhà hàng chênh lệch không quá 20 phút so với thời gian theo thông tin đặt bàn,
            để được áp dụng ưu đãi và phục vụ tốt nhất.
          </h3>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Đang xử lý..." : "Đặt bàn"}
        </button>

      </form>

      {modal.isOpen && (
          <ModalGeneral 
              isOpen={modal.isOpen} 
              text={modal.text} 
              type={modal.type} 
              onClose={modal.onClose} 
              onConfirm={modal.onConfirm}
          />
      )}
    </div>
  );
}

export default BookingTable;
