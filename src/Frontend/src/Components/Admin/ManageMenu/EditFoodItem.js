import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getFoodItemByID,
  updateFoodItem,
  getMenuTabs,
} from "../../../API/MenuAPI";
import { useAuth } from "../../../Components/Auth/AuthContext";
import { isTokenExpired } from "../../../utils/tokenHelper.mjs";
import { refreshToken } from "../../../API/authAPI";
import style from "./EditFoodItem.module.css";
import { ModalGeneral } from "../../ModalGeneral";

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
  const { accessToken, setAccessToken } = useAuth();
  const [originalFoodItem, setOriginalFoodItem] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    text: "",
    type: "", // "confirm" hoặc "success"
    onConfirm: null, // Hàm được gọi khi xác nhận
  });

  useEffect(() => {
    const fetchFoodItem = async () => {
      try {
        const data = await getFoodItemByID(id);
        setFoodItem({
          ...data,
          category: data.category || "",
          image: data.image,
        });
        setOriginalFoodItem({
          ...data,
          category: data.category || "",
          image: data.image,
        });
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFoodItem((prevPromotion) => ({
      ...prevPromotion,
      [name]: files ? files[0] : value, // Nếu có file, lấy file, không thì lấy giá trị input
    }));
  };

  const handleCloseModal = () => {
    setModal({ isOpen: false }); // Đóng modal
    navigate("/manage-menu"); // Điều hướng
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
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

    setLoading(true);
    try {
      const activeToken = await ensureActiveToken();
      await updateFoodItem(id, formData, activeToken);
      setModal({
        isOpen: true,
        text: "Món ăn được cập nhật thành công!",
        type: "success",
      });
      setTimeout(() => {
        handleCloseModal();
      }, 15000);
    } catch (error) {
      console.error("Lỗi khi cập nhật món ăn:", error.message);
      setError("Đã có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (field) => {
    setEditingField(field);
  };

  return (
    <div className={style["edit-fooditem"]}>
      <h2>Chỉnh sửa món ăn</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className={style["form-group"]}>
          <label htmlFor="name">Tên món ăn</label>
          <input
            type="text"
            id="name"
            name="name"
            value={fooditem.name}
            onChange={handleChange}
          />
        </div>

        <div className={style["form-group"]}>
          <label htmlFor="price">Giá</label>
          <input
            type="number"
            id="price"
            name="price"
            value={fooditem.price}
            onChange={handleChange}
          />
        </div>

        <div className={style["form-group"]}>
          <label htmlFor="description">Mô tả</label>
          <textarea
            id="description"
            name="description"
            value={fooditem.description}
            onChange={handleChange}
          />
        </div>

        <div className={style["form-group"]}>
          <label htmlFor="image">Hình ảnh</label>
          {fooditem.image && (
            <div className={style["current-image"]}>
              <p>Hình ảnh hiện tại:</p>
              <img
                src={fooditem.image}
                alt="Current Food Item"
                className={style["preview-image"]}
              />
            </div>
          )}
          <input type="file" id="image" name="image" onChange={handleChange} />
          <p style={{ fontSize: "12px", color: "#888" }}>
            Chọn tệp hình ảnh mới để thay đổi.
          </p>
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
      {modal.isOpen && (
        <ModalGeneral
          isOpen={modal.isOpen}
          text={modal.text}
          type={modal.type}
          onClose={handleCloseModal}
          onConfirm={modal.onConfirm}
        />
      )}
    </div>
  );
}

export default EditFoodItem;
