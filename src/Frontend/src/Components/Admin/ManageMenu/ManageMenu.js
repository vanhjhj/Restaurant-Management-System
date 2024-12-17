import React, { useEffect, useState } from "react";
import {
  getMenuTabs,
  getFoodItems,
  createNewMenuTab,
  deleteFoodItem,
} from "../../../API/MenuAPI";
import "./ManageMenu.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Components/Auth/AuthContext";

const ManageMenu = () => {
  const [categories, setCategories] = useState([]); // Danh sách mục
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [foodItems, setFoodItems] = useState([]); // Danh sách món ăn
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false); // Hiển thị form tạo mục mới
  const [newCategoryName, setNewCategoryName] = useState(""); // Tên mục mới
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getMenuTabs();
        setCategories(data);
        if (data.length > 0) setSelectedCategory(data[0]?.id); // Chọn mục đầu tiên nếu có
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

  const handleDelete = async (id) => {
    if (!accessToken) {
      console.error("Token không tồn tại");
      return;
    }

    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa món ăn này không?"
    );
    if (confirmDelete) {
      try {
        await deleteFoodItem(id, accessToken);
        setFoodItems(foodItems.filter((item) => item.id !== id));
        alert("Món ăn đã được xóa thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa món ăn:", error);
        alert("Có lỗi xảy ra khi xóa món ăn. Vui lòng thử lại.");
      }
    } else {
      console.log("Hành động xóa đã bị hủy.");
    }
  };

  const updateCategories = async () => {
    try {
      const updatedCategories = await getMenuTabs();
      setCategories(updatedCategories);
    } catch (error) {
      console.error("Error updating categories:", error);
    }
  };

  const handleCreateNewCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Tên mục không được để trống!");
      return;
    }

    try {
      const newCategory = await createNewMenuTab(
        { name: newCategoryName },
        accessToken
      );

      // Cập nhật danh sách mục và ẩn form
      setCategories([...categories, newCategory]);
      setNewCategoryName(""); // Reset tên mục
      setShowNewCategoryForm(false);

      // Làm mới lại danh sách mục
      await updateCategories();

      // Chọn mục mới được tạo
      setSelectedCategory(newCategory.id);

      alert("Tạo mục mới thành công!");
    } catch (error) {
      console.error("Lỗi khi tạo mục mới:", error);
      alert("Tạo mục mới thất bại. Vui lòng thử lại!");
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
        {categories.length > 0 ? (
          categories.map((category) => (
            <button
              key={category.id}
              className={`menu-tab ${
                selectedCategory === category.id ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))
        ) : (
          <p>Đang tải danh sách mục...</p>
        )}

        {/* Nút và Form tạo mục mới */}
        {!showNewCategoryForm ? (
          <button
            className="add-category-button"
            onClick={() => setShowNewCategoryForm(true)}
          >
            Tạo mục mới +
          </button>
        ) : (
          <div className="new-category-form">
            <input
              type="text"
              placeholder="Tên mục mới"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="new-category-input"
            />
            <button
              className="save-category-button"
              onClick={handleCreateNewCategory}
            >
              Lưu
            </button>
            <button
              className="cancel-category-button"
              onClick={() => setShowNewCategoryForm(false)}
            >
              Hủy
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="menu-content">
        <h2>Quản lý thực đơn</h2>
        {foodItems.length === 0 ? (
          <p className="no-food-message">Chưa có món ăn nào, hãy thêm mới!</p>
        ) : (
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
        )}
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
