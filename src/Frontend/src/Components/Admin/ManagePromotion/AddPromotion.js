import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addPromotion, fetchPromotions } from "../../../API/PromotionAPI"; // Import hàm thêm ưu đãi
import { useAuth } from "../../../Components/Auth/AuthContext"; // Import useAuth
import { isTokenExpired } from "../../../utils/tokenHelper.mjs";
import { refreshToken } from "../../../API/authAPI";
import style from "./AddPromotion.module.css";
import { ModalGeneral } from "../../ModalGeneral";
function AddPromotion() {
  const [promotion, setPromotion] = useState({
    code: "",
    title: "",
    description: "",
    image: null,
    discount: 0,
    startdate: "",
    enddate: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { accessToken, setAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    text: "",
    type: "", // "confirm" hoặc "success"
    onConfirm: null, // Hàm được gọi khi xác nhận
  });

  const ensureActiveToken = async () => {
    let activeToken = accessToken;
    if (isTokenExpired(accessToken)) {
      try {
        const refreshed = await refreshToken(
          localStorage.getItem("refreshToken")
        );
        activeToken = refreshed.access;
        setAccessToken(activeToken);
      } catch (error) {
        console.error("Error refreshing token:", error);
        navigate("/login"); // Điều hướng đến login nếu refresh thất bại
        throw error;
      }
    }
    return activeToken;
  };

  const checkCodeExistence = async (code) => {
    try {
      const promotions = await fetchPromotions();
      return promotions.some((promo) => promo.code === code);
    } catch (error) {
      console.error("Lỗi khi kiểm tra mã ưu đãi:", error.message);
      throw error;
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setPromotion((prevPromotion) => ({
      ...prevPromotion,
      [name]: type === "file" ? files[0] : value, // Lưu file nếu input là file
    }));
  };

  const handleCloseModal = () => {
    setModal({ isOpen: false }); // Đóng modal
    navigate("/admin-dashboard/manage-promotions"); // Điều hướng
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { code, title, description, image, discount, startdate, enddate } =
      promotion;

    if (await checkCodeExistence(code)) {
      setError("Mã ưu đãi đã tồn tại.");
      return;
    }

    if (code.length > 10) {
      setError("Mã ưu đãi không được quá 10 ký tự.");
      return;
    }

    if (isNaN(discount) || discount < 0 || discount > 100) {
      setError("Tỷ lệ giảm giá phải từ 0 đến 100.");
      return;
    }

    if (new Date(startdate) >= new Date(enddate)) {
      setError("Ngày bắt đầu phải trước ngày kết thúc.");
      return;
    }

    if (promotion.image instanceof File) {
      const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
      if (!allowedExtensions.exec(promotion.image.name)) {
        setError("Chỉ chấp nhận file ảnh với định dạng jpg, jpeg, png.");
        return;
      }
    }

    // Format dates
    const formattedStartDate = new Date(startdate).toISOString().split("T")[0];
    const formattedEndDate = new Date(enddate).toISOString().split("T")[0];

    const promotionData = {
      ...promotion,
      startdate: formattedStartDate,
      enddate: formattedEndDate,
    };

    setLoading(true);
    try {
      const activeToken = await ensureActiveToken();
      await addPromotion(promotionData, activeToken);
      setModal({
        isOpen: true,
        text: "Thêm ưu đãi thành công!",
        type: "success",
      });
      setTimeout(() => {
        handleCloseModal();
      }, 15000);
    } catch (error) {
      if (error.response) {
        console.error("Lỗi từ server:", error.response.data);
      } else {
        console.error("Lỗi khác:", error.message);
      }
      setError("Đã có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style["add-promotion"]}>
      <h2>Thêm ưu đãi mới</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className={style["form-group"]}>
          <label htmlFor="code">Mã ưu đãi</label>
          <input
            type="text"
            id="code"
            name="code"
            value={promotion.code}
            onChange={handleChange}
            placeholder="Nhập mã ưu đãi"
            required
          />
        </div>
        <div className={style["form-group"]}>
          <label htmlFor="title">Tiêu đề</label>
          <input
            type="text"
            id="title"
            name="title"
            value={promotion.title}
            onChange={handleChange}
            placeholder="Nhập tiêu đề"
            required
          />
        </div>

        <div className={style["form-group"]}>
          <label htmlFor="description">Mô tả</label>
          <textarea
            id="description"
            name="description"
            value={promotion.description}
            onChange={handleChange}
            placeholder="Nhập mô tả"
            required
          />
        </div>

        <div className={style["form-group"]}>
          <label htmlFor="discount">Giảm giá (%)</label>
          <input
            type="number"
            id="discount"
            name="discount"
            value={promotion.discount}
            onChange={handleChange}
            placeholder="Nhập tỷ lệ giảm giá (0-100)"
            required
            min={0}
            max={100}
          />
        </div>

        <div className={style["form-group"]}>
          <label htmlFor="startdate">Ngày bắt đầu</label>
          <input
            type="date"
            id="startdate"
            name="startdate"
            value={promotion.startdate}
            onChange={handleChange}
            required
          />
        </div>

        <div className={style["form-group"]}>
          <label htmlFor="enddate">Ngày kết thúc</label>
          <input
            type="date"
            id="enddate"
            name="enddate"
            value={promotion.enddate}
            onChange={handleChange}
            required
          />
        </div>

        <div className={style["form-group"]}>
          <label htmlFor="image">Hình ảnh</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleChange}
            required
          />
        </div>

        <div className={style["submit-button-container"]}>
          <button className={style["submit-button"]} type="submit">
            Thêm ưu đãi
          </button>
        </div>
      </form>
      {modal.isOpen && (
        <ModalGeneral
          isOpen={modal.isOpen}
          text={modal.text}
          type={modal.type}
          onClose={handleCloseModal}
          onConfirm={modal.onConfirm}
        />
      )}
    </div>
  );
}

export default AddPromotion;
