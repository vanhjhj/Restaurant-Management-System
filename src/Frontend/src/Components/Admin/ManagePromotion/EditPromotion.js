import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPromotionById, updatePromotion } from "../../../API/PromotionAPI"; // Import API functions
import style from "./EditPromotion.module.css"; // Import stylesheet
import { FaEdit } from "react-icons/fa"; // Sử dụng icon chỉnh sửa từ react-icons

function EditPromotion() {
  const { id } = useParams(); // Lấy id từ URL
  const [promotion, setPromotion] = useState({
    title: "",
    description: "",
    image: null,
    discount: 0,
  });
  const [editingField, setEditingField] = useState(null); // Lưu trữ trường đang được chỉnh sửa
  const [error, setError] = useState(""); // Để lưu lỗi nếu có
  const navigate = useNavigate(); // Dùng để điều hướng sau khi cập nhật

  useEffect(() => {
    async function getPromotion() {
      try {
        const data = await fetchPromotionById(id); // Lấy ưu đãi theo ID
        if (data && data.results) {
          const promotionData = data.results[0]; // Giả sử API trả về results với dạng mảng
          setPromotion(promotionData); // Lưu dữ liệu vào state
        }
      } catch (error) {
        console.error("Error fetching promotion:", error);
      }
    }

    getPromotion();
  }, [id]); // Gọi lại khi ID thay đổi

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setPromotion((prevPromotion) => ({
      ...prevPromotion,
      [name]: type === "file" ? files[0] : value, // Lưu file nếu input là file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra và xử lý discount
    let discountValue = promotion.discount;

    if (discountValue !== "")
      if (discountValue < 0 || discountValue > 100) {
        setError("Giảm giá phải nằm trong khoảng 0-100%.");
        return;
      }
    if (
      promotion.title === "" ||
      promotion.description === "" ||
      promotion.discount === 0 ||
      promotion.image === null
    ) {
      setError("Chưa có thông tin để cập nhật.");
      return;
    }

    try {
      // Tạo object chỉ chứa các trường đã thay đổi
      const updatedPromotion = {};

      if (promotion.title !== "") updatedPromotion.title = promotion.title;
      if (promotion.description !== "")
        updatedPromotion.description = promotion.description;
      if (promotion.discount !== 0) updatedPromotion.discount = discountValue;
      if (promotion.image) updatedPromotion.image = promotion.image;

      // Cập nhật dữ liệu
      await updatePromotion(id, updatedPromotion);
      alert("Ưu đãi đã được cập nhật thành công");
      navigate("/manage-promotions"); // Chuyển hướng về trang quản lý ưu đãi
    } catch (error) {
      console.error("Lỗi khi cập nhật ưu đãi:", error);
      setError("Đã có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const handleEdit = (field) => {
    setEditingField(field); // Chỉnh sửa trường nào
  };

  return (
    <div className={style["edit-promotion"]}>
      <button
        onClick={() => navigate("/manage-promotions")}
        className={style["back-button"]}
      >
        ← Back
      </button>
      <h2>Chỉnh sửa ưu đãi</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Hiển thị lỗi nếu có */}
      <form onSubmit={handleSubmit}>
        <div className={style["form-group"]}>
          <label htmlFor="title">Tiêu đề</label>
          {editingField === "title" ? (
            <input
              type="text"
              id="title"
              name="title"
              value={promotion.title}
              onChange={handleChange}
              placeholder=""
            />
          ) : (
            <p>
              {promotion.title}{" "}
              <FaEdit
                className={style.editIcon}
                onClick={() => handleEdit("title")}
              />
            </p>
          )}
        </div>

        <div className={style["form-group"]}>
          <label htmlFor="description">Mô tả</label>
          {editingField === "description" ? (
            <input
              type="text"
              id="description"
              name="description"
              value={promotion.description}
              onChange={handleChange}
              placeholder=""
            />
          ) : (
            <p>
              {promotion.description}{" "}
              <FaEdit
                className={style.editIcon}
                onClick={() => handleEdit("description")}
              />
            </p>
          )}
        </div>

        <div className={style["form-group"]}>
          <label htmlFor="discount">Giảm giá</label>
          {editingField === "discount" ? (
            <input
              type="number"
              id="discount"
              name="discount"
              value={promotion.discount}
              onChange={handleChange}
              placeholder=""
            />
          ) : (
            <p>
              {promotion.discount * 100}%{" "}
              <FaEdit
                className={style.editIcon}
                onClick={() => handleEdit("discount")}
              />
            </p>
          )}
        </div>

        <div className={style["form-group"]}>
          <label htmlFor="image">Hình ảnh</label>
          {editingField === "image" ? (
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
            />
          ) : (
            <p>
              {promotion.image ? promotion.image.name : "Chưa có hình ảnh"}{" "}
              <FaEdit
                className={style.editIcon}
                onClick={() => handleEdit("image")}
              />
            </p>
          )}
        </div>

        <button type="submit">Cập nhật ưu đãi</button>
      </form>
    </div>
  );
}

export default EditPromotion;
