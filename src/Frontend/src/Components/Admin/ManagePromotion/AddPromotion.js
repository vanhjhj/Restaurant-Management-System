import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addPromotion } from "../../../API/PromotionAPI"; // Import hàm thêm ưu đãi
import { useAuth } from "../../../Components/Auth/AuthContext"; // Import useAuth
import style from "./AddPromotion.module.css";

function AddPromotion() {
  const [promotion, setPromotion] = useState({
    title: "",
    description: "",
    image: null,
    discount: 0,
    startdate: "",
    enddate: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setPromotion((prevPromotion) => ({
      ...prevPromotion,
      [name]: type === "file" ? files[0] : value, // Lưu file nếu input là file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description, image, discount, startdate, enddate } =
      promotion;

    // Kiểm tra dữ liệu nhập vào
    if (!title || !description || !image || !startdate || !enddate) {
      setError("Tất cả các trường đều phải nhập.");
      return;
    }

    if (discount < 0 || discount > 100) {
      setError("Tỷ lệ giảm giá phải từ 0 đến 100.");
      return;
    }

    if (new Date(startdate) >= new Date(enddate)) {
      setError("Ngày bắt đầu phải trước ngày kết thúc.");
      return;
    }

    if (!accessToken) {
      setError("Không tìm thấy token. Vui lòng đăng nhập lại.");
      return;
    }

    // Chuyển đổi startdate và enddate về định dạng YYYY-MM-DD
    const formattedStartDate = new Date(promotion.startdate)
      .toISOString()
      .split("T")[0];
    const formattedEndDate = new Date(promotion.enddate)
      .toISOString()
      .split("T")[0];

    const promotionData = {
      ...promotion,
      startdate: formattedStartDate,
      enddate: formattedEndDate,
    };

    try {
      await addPromotion(promotionData, accessToken);
      alert("Ưu đãi đã được thêm thành công");
      navigate("/manage-promotions");
    } catch (error) {
      console.error(error);
      setError("Đã có lỗi xảy ra, vui lòng thử lại.");
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
      {/* Hiển thị lỗi nếu có */}
      <form onSubmit={handleSubmit}>
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
          <input
            type="text"
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
