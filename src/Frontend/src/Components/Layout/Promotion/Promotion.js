// src/components/PromotionPage.js
import React, { useState, useEffect } from "react";
import style from "./Promotion.module.css";
import { useNavigate } from "react-router-dom";
import { fetchPromotions } from "../../../API/PromotionAPI";
import PromotionDetail from "./PromotionDetail";

function Promotion() {
  const [promotions, setPromotions] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPromotions = async () => {
      try {
        const data = await fetchPromotions();
        const today = new Date();
        const filteredPromotions = data.filter((promotion) => {
          const startDate = new Date(promotion.startdate);
          const endDate = new Date(promotion.enddate);
          return startDate <= today && today <= endDate;
        });
        setPromotions(filteredPromotions);
      } catch (err) {
        setError(err);
      }
    };
    loadPromotions();
  }, []);

  return (
    <div className={style["promotions-container"]}>
      <div className={style["content"]}>
        <div className={style["title-row"]}>
          <h1>Khuyến mãi</h1>
        </div>
        <div className={style["image"]}>
          <img
            src="assets/images/chuong-trinh-khuyen-mai-trong-kinh-doanh-scaled.jpg"
            alt=""
          />
        </div>
        {error ? (
          <div className={style["error-message"]}>
            <p>
              Có lỗi xảy ra:{" "}
              {error.response ? error.response.data : error.message}
            </p>
          </div>
        ) : promotions.length === 0 ? (
          <div className={style["no-promotions-message"]}>
            <p>Oops...Hiện tại chưa có khuyến mãi!</p>
          </div>
        ) : (
          <div className={style["promotions-list"]}>
            {promotions.map((promotion) => (
              <div
                key={promotion.code}
                className={style["promotion-card"]}
                onClick={() => navigate(`/promotion/${promotion.code}`)}
              >
                <img
                  src={promotion.image}
                  alt={promotion.title}
                  className={style["promotion-image"]}
                />
                <h3 className={style["promotion-title"]}>{promotion.title}</h3>
                <p className={style["promotion-description"]}>
                  {promotion.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Promotion;
