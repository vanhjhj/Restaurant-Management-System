import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addPromotion } from "../../../API/PromotionAPI"; // Import hàm thêm ưu đãi
import { useAuth } from "../../../Components/Auth/AuthContext"; // Import useAuth
import { isTokenExpired } from "../../../utils/tokenHelper.mjs";
import { refreshToken } from "../../../API/authAPI";
import style from "./AddPromotion.module.css";

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
    const { name, value, type, files } = e.target;
    setPromotion((prevPromotion) => ({
      ...prevPromotion,
      [name]: type === "file" ? files[0] : value, // Lưu file nếu input là file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { code, title, description, image, discount, startdate, enddate } =
      promotion;

    // Validate input
    if (!code || !title || !description || !image || !startdate || !enddate) {
      setError("Tất cả các trường đều phải nhập.");
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
      alert("Ưu đãi đã được thêm thành công");
      navigate("/manage-promotions");
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
      <button
        onClick={() => navigate("/manage-promotions")}
        className={style["back-button"]}
      >
        ← Back
      </button>
      <h2>Thêm ưu đãi mới</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
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
          <label htmlFor="image">Hình ảnh</label>
          <input type="file" id="image" name="image" onChange={handleChange} />
        </div>

        <button className={style["submit-button"]} type="submit">
          Thêm ưu đãi
        </button>
      </form>
    </div>
  );
}

export default AddPromotion;
