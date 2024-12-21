import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getFoodItemByID,
  updateFoodItem,
  getMenuTabs,
} from "../../../API/MenuAPI";
import { useAuth } from "../../../Components/Auth/AuthContext";
import style from "./EditFoodItem.module.css";
import { FaEdit } from "react-icons/fa"; // Sử dụng icon chỉnh sửa từ react-icons

function EditFoodItem() {
  const { id } = useParams();
  const [fooditem, setFoodItem] = useState({
    name: "",
    price: "",
    description: "",
    image: 0,
    category: "",
  });
  const [editingField, setEditingField] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [originalFoodItem, setOriginalFoodItem] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchFoodItem = async () => {
      try {
        const data = await getFoodItemByID(id);
        setFoodItem({ ...data, category: data.category || "" });
      } catch (error) {
        console.error("Error fetching food item:", error);
        setError("Không thể tải dữ liệu món ăn.");
      }
    };

    const fetchCategories = async () => {
      try {
        const categoriesData = await getMenuTabs();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchFoodItem();
    fetchCategories();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFoodItem((prevPromotion) => ({
      ...prevPromotion,
      [name]: files ? files[0] : value, // Nếu có file, lấy file, không thì lấy giá trị input
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accessToken) {
      window.alert("Token không tồn tại, vui lòng đăng nhập lại.");
      return;
    }

    const { name, price, description, image, category } = fooditem;

    // Kiểm tra các thay đổi
    const hasChanges =
      fooditem.name !== originalFoodItem.name ||
      fooditem.price !== originalFoodItem.price ||
      fooditem.description !== originalFoodItem.description ||
      fooditem.category !== originalFoodItem.category ||
      fooditem.image instanceof File;

    if (!hasChanges) {
      setError("Chưa có thay đổi gì để cập nhật.");
      return;
    }

    if (name.length > 255) {
      setError("Tên món ăn không được quá 255 ký tự.");
      return;
    }

    if (isNaN(price) || price < 0) {
      setError("Giá phải là số nguyên và lớn hơn hoặc bằng 0.");
      return;
    }

    const formData = new FormData();
    if (fooditem.name !== originalFoodItem.name) {
      formData.append("name", name);
    }
    if (fooditem.price !== originalFoodItem.price) {
      formData.append("price", price);
    }
    if (fooditem.description !== originalFoodItem.description) {
      formData.append("description", description);
    }
    if (fooditem.category !== originalFoodItem.category) {
      formData.append("category", category);
    }

    if (fooditem.image instanceof File) {
      const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
      if (!allowedExtensions.exec(fooditem.image.name)) {
        setError("Chỉ chấp nhận file ảnh với định dạng jpg, jpeg, png.");
        return;
      }
      formData.append("image", fooditem.image);
    }

    try {
      await updateFoodItem(id, formData, accessToken);
      alert("Món ăn đã được cập nhật thành công");
      navigate("/manage-menu");
    } catch (error) {
      console.error("Lỗi khi cập nhật món ăn:", error.message);
      setError("Đã có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const handleEdit = (field) => {
    setEditingField(field);
  };

  return (
    <div className={style["edit-fooditem"]}>
      <button
        onClick={() => navigate("/manage-menu")}
        className={style["back-button"]}
      >
        ← Back
      </button>
      <h2>Chỉnh sửa món ăn</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className={style["form-group"]}>
          <label htmlFor="name">Tên món ăn</label>
          {editingField === "name" ? (
            <input
              type="text"
              id="name"
              name="name"
              value={fooditem.name}
              onChange={handleChange}
            />
          ) : (
            <p>
              {fooditem.name}{" "}
              <FaEdit
                className={style.editIcon}
                onClick={() => handleEdit("name")}
              />
            </p>
          )}
        </div>

        <div className={style["form-group"]}>
          <label htmlFor="price">Giá</label>
          {editingField === "price" ? (
            <input
              type="number"
              id="price"
              name="price"
              value={fooditem.price}
              onChange={handleChange}
            />
          ) : (
            <p>
              {fooditem.price}{" "}
              <FaEdit
                className={style.editIcon}
                onClick={() => handleEdit("price")}
              />
            </p>
          )}
        </div>

        <div className={style["form-group"]}>
          <label htmlFor="description">Mô tả</label>
          {editingField === "description" ? (
            <input
              type="text"
              id="description"
              name="description"
              value={fooditem.description}
              onChange={handleChange}
            />
          ) : (
            <p>
              {fooditem.description}{" "}
              <FaEdit
                className={style.editIcon}
                onClick={() => handleEdit("description")}
              />
            </p>
          )}
        </div>

        <div className={style["form-group"]}>
          <label htmlFor="image">Hình ảnh</label>
          {editingField === "image" ? (
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
            />
          ) : (
            <p>
              {fooditem.image ? fooditem.image.name : "Chưa có hình ảnh"}{" "}
              <FaEdit
                className={style.editIcon}
                onClick={() => handleEdit("image")}
              />
            </p>
          )}
        </div>

        <div className={style["form-group"]}>
          <label htmlFor="category">Danh mục</label>
          <select
            id="category"
            name="category"
            value={fooditem.category}
            onChange={handleChange}
          >
            <option value="">Chọn danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className={style["submit-button"]}>
          Cập nhật món ăn
        </button>
      </form>
    </div>
  );
}

export default EditFoodItem;
