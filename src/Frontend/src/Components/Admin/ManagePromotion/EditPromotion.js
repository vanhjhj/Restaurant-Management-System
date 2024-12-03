import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPromotionById, updatePromotion } from "../../../API/PromotionAPI"; // Import API functions
import "./EditPromotion.css"; // Import stylesheet

function EditPromotion() {
  const { id } = useParams();
  const [promotion, setPromotion] = useState({
    title: "",
    description: "",
    imageUrl: "",
    discount: 0,
  });
  const [editableField, setEditableField] = useState(null); // Trạng thái để xác định trường nào có thể chỉnh sửa
  const navigate = useNavigate(); // Hook để điều hướng sau khi cập nhật

  useEffect(() => {
    async function getPromotion() {
      try {
        const data = await fetchPromotionById(id); // Lấy ưu đãi theo ID
        if (data && data.results && data.results[0]) {
          setPromotion(data.results[0]); // Giả sử API trả về results là mảng chứa đối tượng ưu đãi
        }
      } catch (error) {
        console.error("Error fetching promotion:", error);
      }
    }
    getPromotion();
  }, [id]); // Cập nhật khi `id` thay đổi

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromotion((prevPromotion) => ({
      ...prevPromotion,
      [name]: value,
    }));
  };

  const handleEditField = (field) => {
    setEditableField(field); // Cho phép chỉnh sửa trường cụ thể
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!promotion.title || !promotion.description || !promotion.discount) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    try {
      await updatePromotion(id, promotion);
      alert("Ưu đãi đã được cập nhật!");
      navigate("/manage-promotions"); // Điều hướng về trang quản lý ưu đãi
    } catch (error) {
      console.error("Lỗi khi cập nhật ưu đãi:", error);
    }
  };

  return (
    <div>
      <h2>Chỉnh sửa ưu đãi</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tiêu đề</label>
          <input
            type="text"
            name="title"
            value={promotion.title}
            onChange={handleChange}
            placeholder="Tiêu đề"
          />
        </div>

        <div>
          <label>Mô tả</label>
          <input
            type="text"
            name="description"
            value={promotion.description}
            onChange={handleChange}
            placeholder="Mô tả"
          />
        </div>

        <div>
          <label>Giảm giá</label>
          <input
            type="number"
            name="discount"
            value={promotion.discount}
            onChange={handleChange}
            placeholder="Giảm giá (%)"
          />
        </div>

        <div>
          <label>URL hình ảnh</label>
          <input
            type="text"
            name="imageUrl"
            value={promotion.imageUrl}
            onChange={handleChange}
            placeholder="URL hình ảnh"
          />
        </div>

        <button type="submit">Cập nhật ưu đãi</button>
      </form>
    </div>
  );
}

export default EditPromotion;
