import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchPromotionByCode,
  updatePromotion,
} from "../../../API/PromotionAPI";
import { useAuth } from "../../../Components/Auth/AuthContext";
import { isTokenExpired } from "../../../utils/tokenHelper.mjs";
import { refreshToken } from "../../../API/authAPI";
import style from "./EditPromotion.module.css";
import { ModalGeneral } from "../../ModalGeneral";

function EditPromotion() {
  const { code } = useParams(); // Lấy code từ URL
  const [promotion, setPromotion] = useState({
    title: "",
    description: "",
    image: "",
    discount: 0,
    startdate: "",
    enddate: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { accessToken, setAccessToken } = useAuth();
  const [originalPromotion, setOriginalPromotion] = useState({});
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    text: "",
    type: "", // "confirm" hoặc "success"
    onConfirm: null, // Hàm được gọi khi xác nhận
  });

  useEffect(() => {
    async function getPromotion() {
      try {
        const data = await fetchPromotionByCode(code);
        if (data) {
          setPromotion(data); // Gán dữ liệu từ API
          setOriginalPromotion(data);
        }
      } catch (error) {
        console.error("Error fetching promotion:", error);
        setError("Không thể tải dữ liệu ưu đãi.");
      }
    }

    if (code) {
      getPromotion();
    }
  }, [code]);

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setPromotion((prevPromotion) => ({
      ...prevPromotion,
      [name]: files ? files[0] : value, // Nếu có file, lấy file, không thì lấy giá trị input
    }));
  };

  const handleCloseModal = () => {
    setModal({ isOpen: false }); // Đóng modal
    navigate("/manage-promotions"); // Điều hướng
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, discount, image, startdate, enddate } =
      promotion;

    if (discount < 0 || discount > 100) {
      setError("Giảm giá phải nằm trong khoảng 0-100%.");
      return;
    }

    if (new Date(startdate) >= new Date(enddate)) {
      setError("Ngày kết thúc phải sau ngày bắt đầu.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("discount", discount);
    formData.append("startdate", startdate);
    formData.append("enddate", enddate);

    // Nếu có ảnh mới, thêm vào formData
    if (promotion.image instanceof File) {
      const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
      if (!allowedExtensions.exec(promotion.image.name)) {
        setError("Chỉ chấp nhận file ảnh với định dạng jpg, jpeg, png.");
        return;
      }
      formData.append("image", promotion.image);
    }

    const hasChanges =
      promotion.title !== originalPromotion.title ||
      promotion.description !== originalPromotion.description ||
      new Date(promotion.startdate).getTime() !==
        new Date(originalPromotion.startdate).getTime() ||
      new Date(promotion.enddate).getTime() !==
        new Date(originalPromotion.enddate).getTime() ||
      promotion.discount !== originalPromotion.discount ||
      promotion.image instanceof File;

    if (!hasChanges) {
      setError("Chưa có thay đổi gì để cập nhật.");
      return;
    }

    setLoading(true);

    try {
      const activeToken = await ensureActiveToken();
      await updatePromotion(code, formData, activeToken);
      setModal({
        isOpen: true,
        text: "Cập nhật ưu đãi thành công!",
        type: "success",
      });
      setTimeout(() => {
        handleCloseModal();
      }, 15000);
    } catch (error) {
      console.error("Lỗi khi cập nhật ưu đãi:", error.message);
      setError("Đã có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style["edit-promotion"]}>
      <h2>Chỉnh sửa ưu đãi</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className={style["form-group"]}>
          <label htmlFor="title">Tiêu đề</label>
          <input
            type="text"
            id="title"
            name="title"
            value={promotion.title}
            onChange={handleChange}
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
          />
        </div>

        <div className={style["form-group"]}>
          <label htmlFor="discount">Giảm giá</label>
          <input
            type="number"
            id="discount"
            name="discount"
            value={promotion.discount}
            onChange={handleChange}
          />
        </div>

        <div className={`${style["form-group"]} ${style.description}`}>
          <label htmlFor="description">Mô tả</label>
          <textarea
            id="description"
            name="description"
            value={promotion.description}
            onChange={handleChange}
          />
        </div>

        <div className={style["form-group"]}>
          <label htmlFor="image">Hình ảnh</label>
          {promotion.image && !(promotion.image instanceof File) && (
            <div className={style["image-preview"]}>
              <p>Hình ảnh hiện tại:</p>
              <img
                src={promotion.image}
                alt="Current promotion"
                className={style["current-image"]}
              />
            </div>
          )}
          <input type="file" id="image" name="image" onChange={handleChange} />
          <p style={{ fontSize: "12px", color: "#888" }}>
            Chọn tệp hình ảnh mới để thay đổi.
          </p>
        </div>

        <button type="submit" className={style["submit-button"]}>
          Cập nhật ưu đãi
        </button>
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

export default EditPromotion;
