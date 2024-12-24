import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./ManagePromotions.module.css";
import { fetchPromotions, deletePromotion } from "../../../API/PromotionAPI";
import { isTokenExpired } from "../../../utils/tokenHelper.mjs";
import { useAuth } from "../../../Components/Auth/AuthContext";
import { refreshToken } from "../../../API/authAPI";

function ManagePromotions() {
  const [Promotions, setPromotions] = useState([]);
  const navigate = useNavigate();
  const { accessToken, setAccessToken } = useAuth();

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
    if (!window.confirm("Bạn có chắc chắn muốn xóa ưu đãi này không?")) return;
    try {
      const activeToken = await ensureActiveToken();
      await deletePromotion(code, activeToken);
      setPromotions(Promotions.filter((discount) => discount.code !== code));
      alert("Xóa ưu đãi thành công.");
    } catch (error) {
      console.error("Lỗi khi xóa ưu đãi:", error);
      alert("Không thể xóa ưu đãi. Vui lòng thử lại.");
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
        <div className={style["no-promotions"]}>
          <p>Chưa có ưu đãi nào, hãy tạo mới ưu đãi!</p>
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
        Tạo ưu đãi mới +
      </button>
    </div>
  );
}

export default ManagePromotions;
