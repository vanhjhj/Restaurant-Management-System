import React, { useState, useEffect } from "react";
import style from "./FoodDetail.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { getFoodItemByID } from "../../../API/MenuAPI";

function FoodDetail() {
  const { id } = useParams();
  const [food, setFood] = useState({
    name: "",
    image: "",
    description: "",
    price: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFoodDetail = async () => {
      try {
        const data = await getFoodItemByID(id);
        if (data) {
          setFood(data);
        }
      } catch (err) {
        setError(err);
      }
    };

    loadFoodDetail();
  }, [id]);

  const formatPrice = (price) => {
    return `${price.toLocaleString("vi-VN")} VND`;
  };

  return (
    <div className={style["food-detail-container"]}>
      <button
        onClick={() => navigate("/menu")}
        className={style["back-button"]}
      >
        ← Back
      </button>
      <div className={style["food-image"]}>
        <img src={food.image} alt={food.name} />
      </div>
      <div className={style["food-info"]}>
        <h1 className={style["food-name"]}>{food.name}</h1>
        <hr className={style["divider"]} />
        <p className={style["food-description"]}>{food.description}</p>
        <hr className={style["divider"]} />
        <div className={style["food-price"]}>{formatPrice(food.price)}</div>
      </div>
    </div>
  );
}

export default FoodDetail;
