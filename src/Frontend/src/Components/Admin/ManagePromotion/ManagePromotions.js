import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./ManagePromotions.module.css";
import { fetchPromotions, deletePromotion } from "../../../API/PromotionAPI";

function ManagePromotions() {
  const [Promotions, setPromotions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getPromotions() {
      try {
        const data = await fetchPromotions();
        setPromotions(data); // Lưu dữ liệu vào state
      } catch (error) {
        console.error("Error fetching Promotions:", error);
      }
    }

    getPromotions();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit-promotion/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa ưu đãi này không?"
    );
    if (confirmDelete) {
      try {
        await deletePromotion(id); // Gọi hàm xóa ưu đãi
        setPromotions(Promotions.filter((discount) => discount.id !== id)); // Cập nhật state sau khi xóa
      } catch (error) {
        console.error("Lỗi khi xóa ưu đãi:", error);
        alert("Có lỗi xảy ra khi xóa ưu đãi. Vui lòng thử lại.");
      }
    } else {
      console.log("Hành động xóa đã bị hủy.");
    }
  };

  const handleAddDiscount = () => {
    // Điều hướng đến trang tạo ưu đãi mới
    navigate("/add-promotion");
  };

  return (
    <div className={style["manage-Promotions"]}>
      <button
        onClick={() => navigate("/admin-dashboard")}
        className={style["back-button"]}
      >
        ← Back
      </button>
      <h2>Quản lý ưu đãi</h2>
      {/* Kiểm tra nếu không có ưu đãi */}
      {Promotions.length === 0 ? (
        <div className="no-promotions">
          <p>Chưa có ưu đãi</p>
          <button
            onClick={handleAddDiscount}
            className={style["add-discount-button"]}
          >
            Thêm ưu đãi mới
          </button>
        </div>
      ) : (
        <div className={style["discount-cards"]}>
          {Promotions.map((discount) => (
            <div key={discount.id} className={style["discount-card"]}>
              <img
                src={discount.image}
                alt={discount.title}
                className={style["discount-image"]}
              />
              <p>{discount.title}</p>
              <p>Mô tả: {discount.description}</p>
              <p>Giảm giá: {discount.discount}%</p>
              <div className={style["button-group"]}>
                <button
                  onClick={() => handleEdit(discount.id)}
                  className={style["edit-button"]}
                >
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => handleDelete(discount.id)} // Khi ấn nút xóa sẽ gọi handleDelete
                  className={style["delete-button"]}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleAddDiscount}
        className={style["add-discount-button"]}
      >
        Tạo ưu đãi mới
      </button>
    </div>
  );
}

export default ManagePromotions;
