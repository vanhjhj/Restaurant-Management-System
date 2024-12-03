import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios để gửi HTTP requests
import { addPromotion } from "../../../API/PromotionAPI"; // Import hàm thêm ưu đãi
import "./AddPromotion.css";

function AddPromotion() {
  const [promotion, setPromotion] = useState({
    title: "",
    description: "",
    image: null, // Thay đổi image thành null để lưu trữ file
    discount: 0,
  });
  const [error, setError] = useState(""); // Để lưu lỗi nếu có
  const navigate = useNavigate(); // Dùng để điều hướng sau khi thêm thành công

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setPromotion((prevPromotion) => ({
      ...prevPromotion,
      [name]: type === "file" ? files[0] : value, // Lưu file nếu input là file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra các trường nhập liệu
    if (!promotion.title || !promotion.description || !promotion.image) {
      setError("Tất cả các trường đều phải nhập.");
      return;
    }

    try {
      // Gọi hàm addPromotion với dữ liệu
      await addPromotion(promotion);
      alert("Ưu đãi đã được thêm thành công");
      navigate("/manage-promotions"); // Chuyển hướng sau khi thành công
    } catch (error) {
      console.error(error);
      setError("Đã có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div>
      <h2>Thêm ưu đãi mới</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Hiển thị lỗi nếu có */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
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

        <div className="form-group">
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

        <div className="form-group">
          <label htmlFor="discount">Giảm giá</label>
          <input
            type="number"
            id="discount"
            name="discount"
            value={promotion.discount}
            onChange={handleChange}
            placeholder="Nhập tỷ lệ giảm giá (0-100)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Hình ảnh</label>
          <input type="file" id="image" name="image" onChange={handleChange} />
        </div>

        <button type="submit">Thêm ưu đãi</button>
      </form>
    </div>
  );
}

export default AddPromotion;
