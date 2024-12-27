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

  useEffect(() => {
    const loadPromotionDetail = async () => {
      try {
        const data = await fetchPromotionByCode(code);
        if (data) {
          setPromotion(data);
        }
      } catch (err) {
        setError(err);
      }
    };

    loadPromotionDetail();
  }, [code]);

  return (
    <div className={style["promotion-detail"]}>
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
            Bắt đầu từ: {promotion.startdate}
          </p>
          <p className={style["promotion-enddate"]}>
            Kết thúc vào: {promotion.enddate}
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
