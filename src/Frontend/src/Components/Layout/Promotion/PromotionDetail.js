import React, { useState, useEffect } from "react";
import style from "./PromotionDetail.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPromotionByCode } from "../../../API/PromotionAPI";

function PromotionDetail() {
  const { code } = useParams(); // Lấy code từ URL
  const [promotion, setPromotion] = useState({
    title: "",
    description: "",
    image: "",
    discount: 0,
    startdate: "",
    enddate: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPromotionDetail = async () => {
      setLoading(true);
      try {
        const data = await fetchPromotionByCode(code);
        if (data) {
          setPromotion(data);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadPromotionDetail();
  }, [code]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div
      className={`${style["promotion-detail"]} ${
        loading ? style["loading"] : ""
      }`}
    >
      {loading && (
        <div className={style["loading-overlay"]}>
          <div className={style["spinner"]}></div>
        </div>
      )}
      <h2>{promotion.title}</h2>
      <div className={style["promotion-container"]}>
        <div className={style["promotion-image"]}>
          <img src={promotion.image} alt={promotion.title} />
        </div>
        <div className={style["promotion-info"]}>
          <p className={style["promotion-description"]}>
            {promotion.description}
          </p>
          <hr className={style["divider"]} />
          <p className={style["promotion-startdate"]}>
            Bắt đầu từ: {formatDate(promotion.startdate)}
          </p>
          <p className={style["promotion-enddate"]}>
            Kết thúc vào: {formatDate(promotion.enddate)}
          </p>
          <hr className={style["divider"]} />
          <p className={style["promotion-code"]}>
            Điền mã này để được áp dụng khuyến mãi: {promotion.code}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PromotionDetail;
