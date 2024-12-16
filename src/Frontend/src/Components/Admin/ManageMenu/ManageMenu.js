import React, { useEffect, useState } from "react";
import {
  getMenuTabs,
  getFoodItems,
  getFoodItemsByID,
} from "../../../API/MenuAPI";
import "./ManageMenu.css";
import { useNavigate } from "react-router-dom";

const ManageMenu = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getMenuTabs();
        setCategories(data);
        if (data.length > 0) setSelectedCategory(data[0].id); // Chọn mục đầu tiên
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

  const formatPrice = (price) => {
    return `${price.toLocaleString("vi-VN")} VND`;
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa món ăn này không?")) {
      // API delete logic
      console.log("Deleting food item:", id);
      setFoodItems(foodItems.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="manage-menu-container">
      {/* Sidebar */}
      <div className="menu-sidebar">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
        <h3>Thực đơn hiện tại</h3>
        <h4>Danh sách mục có sẵn</h4>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`menu-tab ${
              selectedCategory === category.id ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
        <button className="add-category-button">Tạo mục mới +</button>
      </div>

      {/* Main Content */}
      <div className="menu-content">
        <h2>Quản lý thực đơn</h2>
        {foodItems.length === 0 && (
          <p className="no-food-message">Chưa có món ăn nào, hãy thêm mới!</p>
        )}
        <div className="food-items-container">
          {foodItems.map((item) => (
            <div key={item.id} className="food-item-card">
              <img
                src={item.image || "https://via.placeholder.com/150"}
                alt={item.name}
                className="food-image"
              />
              <h4>{item.name}</h4>
              <p className="food-price">{formatPrice(item.price)}</p>
              <div className="food-card-buttons">
                <button
                  className="edit-button"
                  onClick={() => navigate(`/edit-food/${item.id}`)}
                >
                  Chỉnh sửa
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(item.id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          className="add-food-button"
          onClick={() => navigate("/add-food")}
        >
          Tạo món ăn mới +
        </button>
      </div>
    </div>
  );
};

export default ManageMenu;
