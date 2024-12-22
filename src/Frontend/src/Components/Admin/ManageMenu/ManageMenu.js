import React, { useEffect, useState } from "react";
import {
  getMenuTabs,
  getFoodItems,
  createNewMenuTab,
  deleteFoodItem,
} from "../../../API/MenuAPI";
import style from "./ManageMenu.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Components/Auth/AuthContext";
import { isTokenExpired } from "../../../utils/tokenHelper.mjs";
import { refreshToken } from "../../../API/authAPI";

const ManageMenu = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const navigate = useNavigate();
  const { accessToken, setAccessToken } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getMenuTabs();
        setCategories(data);
        if (data.length > 0) setSelectedCategory(data[0]?.id);
      } catch (error) {
        console.error("Error fetching menu categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        if (selectedCategory) {
          const data = await getFoodItems();
          const filteredItems = data.filter(
            (item) => item.category === selectedCategory
          );
          setFoodItems(filteredItems);
        }
      } catch (error) {
        console.error("Error fetching food items:", error);
      }
    };

    fetchFoodItems();
  }, [selectedCategory]);

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

  const formatPrice = (price) => {
    return `${price.toLocaleString("vi-VN")} VND`;
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa món ăn này không?")) return;
    try {
      const activeToken = await ensureActiveToken();
      await deleteFoodItem(id, activeToken);
      setFoodItems((prevFoodItems) =>
        prevFoodItems.filter((item) => item.id !== id)
      );
      alert("Món ăn đã được xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa món ăn:", error);
      alert("Có lỗi xảy ra khi xóa món ăn. Vui lòng thử lại.");
    }
  };

  const updateCategories = async () => {
    try {
      const updatedCategories = await getMenuTabs();
      setCategories(updatedCategories);
      if (updatedCategories.length > 0) {
        setSelectedCategory(updatedCategories[updatedCategories.length - 1].id);
      }
    } catch (error) {
      console.error("Error updating categories:", error);
    }
  };

  const handleCreateNewCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Tên mục không được để trống!");
      return;
    }

    if (newCategoryName.length > 255) {
      setError("Tên mục không được quá 255 ký tự.");
      return;
    }

    try {
      const activeToken = await ensureActiveToken();
      const newCategory = await createNewMenuTab(
        { name: newCategoryName },
        activeToken
      );

      setNewCategoryName("");
      setShowNewCategoryForm(false);

      await updateCategories();
      alert("Tạo mục mới thành công!");
    } catch (error) {
      console.error("Lỗi khi tạo mục mới:", error);
      alert("Tạo mục mới thất bại. Vui lòng thử lại!");
    }
  };

  return (
    <div className={style["manage-menu-container"]}>
      <div className={style["menu-sidebar"]}>
        <button
          onClick={() => navigate("/admin-dashboard")}
          className={style["back-button"]}
        >
          ← Back
        </button>
        <h3>Thực đơn hiện tại</h3>
        <h4>Danh sách mục có sẵn</h4>
        {categories.length > 0 ? (
          categories.map((category) => (
            <button
              key={category.id}
              className={`${style["menu-tab"]} ${
                selectedCategory === category.id ? style["active"] : ""
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))
        ) : (
          <p>Chưa có mục nào, hãy thêm mới!</p>
        )}

        {!showNewCategoryForm ? (
          <button
            className={style["add-category-button"]}
            onClick={() => setShowNewCategoryForm(true)}
          >
            Tạo mục mới +
          </button>
        ) : (
          <div className={style["new-category-form"]}>
            <input
              type="text"
              placeholder="Tên mục mới"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className={style["new-category-input"]}
            />
            <button
              className={style["save-category-button"]}
              onClick={handleCreateNewCategory}
            >
              Lưu
            </button>
            <button
              className={style["cancel-category-button"]}
              onClick={() => setShowNewCategoryForm(false)}
            >
              Hủy
            </button>
          </div>
        )}
      </div>

      <div className={style["menu-content"]}>
        <h2>Quản lý thực đơn</h2>
        {foodItems.length === 0 ? (
          <p className={style["no-food-message"]}>
            Chưa có món ăn nào, hãy thêm mới!
          </p>
        ) : (
          <div className={style["food-items-container"]}>
            {foodItems.map((item) => (
              <div key={item.id} className={style["food-item-card"]}>
                <img
                  src={item.image || "https://via.placeholder.com/150"}
                  alt={item.name}
                  className={style["food-image"]}
                />
                <h4>{item.name}</h4>
                <p className={style["food-price"]}>{formatPrice(item.price)}</p>
                <div className={style["food-card-buttons"]}>
                  <button
                    className={style["edit-button"]}
                    onClick={() => navigate(`/edit-fooditem/${item.id}`)}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    className={style["delete-button"]}
                    onClick={() => handleDelete(item.id)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          className={style["add-food-button"]}
          onClick={() => navigate("/add-food")}
        >
          Tạo món ăn mới +
        </button>
      </div>
    </div>
  );
};

export default ManageMenu;
