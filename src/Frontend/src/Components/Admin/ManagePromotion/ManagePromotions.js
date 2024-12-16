import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./ManagePromotions.module.css";
import { fetchPromotions, deletePromotion } from "../../../API/PromotionAPI";
import { useAuth } from "../../../Components/Auth/AuthContext";

function ManagePromotions() {
  const [Promotions, setPromotions] = useState([]);
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  useEffect(() => {
    async function getPromotions() {
      try {
        const data = await fetchPromotions();
        setPromotions(data);
      } catch (error) {
        console.error("Error fetching promotions:", error);
      }
    }

    getPromotions();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEdit = (code) => {
    navigate(`/edit-promotion/${code}`);
  };

  const handleDelete = async (code) => {
    if (!accessToken) {
      console.error("Token không tồn tại");
      return;
    }

    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa ưu đãi này không?"
    );
    if (confirmDelete) {
      try {
        await deletePromotion(code, accessToken);
        setPromotions(Promotions.filter((discount) => discount.code !== code));
      } catch (error) {
        console.error("Lỗi khi xóa ưu đãi:", error);
        alert("Có lỗi xảy ra khi xóa ưu đãi. Vui lòng thử lại.");
      }
    } else {
      console.log("Hành động xóa đã bị hủy.");
    }
  };

  const handleAddDiscount = () => {
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
        </div>
      ) : (
        <div className={style["discount-cards"]}>
          {Promotions.map((discount) => (
            <div key={discount.code} className={style["discount-card"]}>
              <img
                src={discount.image}
                alt={discount.title}
                className={style["discount-image"]}
              />
              <p>{discount.code}</p>
              <p>Tiêu đề: {discount.title}</p>
              <p>
                Từ {discount.startdate} đến hết {discount.enddate}
              </p>
              <p>Mô tả: {discount.description}</p>
              <p>Giảm giá: {discount.discount}%</p>
              <div className={style["button-group"]}>
                <button
                  onClick={() => handleEdit(discount.code)}
                  className={style["edit-button"]}
                >
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => handleDelete(discount.code)}
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
