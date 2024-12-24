// src/components/PromotionsPage.js
import React, { useState, useEffect } from "react";
import style from "./Promotion.module.css";
import { fetchPromotions } from "../../../API/PromotionAPI";

function Promotion() {
  const [promotions, setPromotions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchPromotions();
        setPromotions(data);
      } catch (error) {
        setError(error);
        console.log(error);
      }
    };
    loadData();
  }, []);

  return (
    <div className={style["promotions-container"]}>
      <div className={style["content"]}>
        <div className={style["title-row"]}>
          <h1>Danh sách khuyến mãi</h1>
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
            <p>Chưa có khuyến mãi nào!</p>
          </div>
        ) : (
          <div className={style["promotions-list"]}>
            {promotions.map((promotion) => (
              <div key={promotion.id} className={style["promotion-card"]}>
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
