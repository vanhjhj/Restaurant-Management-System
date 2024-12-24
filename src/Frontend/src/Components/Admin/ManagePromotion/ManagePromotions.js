import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./ManagePromotions.module.css";
import { fetchPromotions, deletePromotion } from "../../../API/PromotionAPI";
import { isTokenExpired } from "../../../utils/tokenHelper.mjs";
import { useAuth } from "../../../Components/Auth/AuthContext";
import { refreshToken } from "../../../API/authAPI";
import { ModalGeneral } from "../../ModalGeneral";

function ManagePromotions() {
  const [Promotions, setPromotions] = useState([]);
  const navigate = useNavigate();
  const { accessToken, setAccessToken } = useAuth();
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
          localStorage.getdiscount("refreshToken")
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

    setModal({
      isOpen: true,
      text: "Bạn có chắc chắn muốn xóa ưu đãi này không?",
      type: "confirm",
      onConfirm: async () => {
          setModal({ isOpen: false });
          try {
            const activeToken = await ensureActiveToken();
            await deletePromotion(code, activeToken);
            setPromotions((prevPromotions) =>
              prevPromotions.filter((discount) => discount.code !== code)
            );
            setModal({
              isOpen: true,
              text: "Xóa ưu đãi thành công",
              type: "success",
            });
          } catch (error) {
            console.error("Lỗi khi xóa ưu đãi:", error);
            setModal({
              isOpen: true,
              text: "Có lỗi xảy ra khi xóa ưu đãi. Vui lòng thử lại.",
              type: "error",
            });
          }
      },
    });
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

      {modal.isOpen && (
          <ModalGeneral 
              isOpen={modal.isOpen} 
              text={modal.text} 
              type={modal.type} 
              onClose={() => setModal({ isOpen: false })} 
              onConfirm={modal.onConfirm}
          />
      )}
    </div>
  );
}

export default ManagePromotions;
