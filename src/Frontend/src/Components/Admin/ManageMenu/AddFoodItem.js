import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createNewFoodItem } from "../../../API/MenuAPI";
import { useAuth } from "../../../Components/Auth/AuthContext";
import { refreshToken } from "../../../API/authAPI";
import { isTokenExpired } from "../../../utils/tokenHelper.mjs";
import { getMenuTabs } from "../../../API/MenuAPI";
import style from "./AddFoodItem.module.css";
import { ModalGeneral } from "../../ModalGeneral";
function AddFoodItem() {
  const [menu, setMenu] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
    category: "",
  });
  const [categories, setCategories] = useState([]); // State để lưu danh sách danh mục
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { accessToken, setAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    text: "",
    type: "", // "confirm" hoặc "success"
    onConfirm: null, // Hàm được gọi khi xác nhận
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getMenuTabs();
        setCategories(categoriesData); // Cập nhật danh mục từ API
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

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
    const { name, value, type, files } = e.target;
    setMenu((prevMenu) => ({
      ...prevMenu,
      [name]: type === "file" ? files[0] : value, // Lưu file nếu input là file
    }));
  };

  const handleCloseModal = () => {
    setModal({ isOpen: false }); // Đóng modal
    navigate("/admin-dashboard/manage-menu"); // Điều hướng
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, price, description, image, category } = menu;

    if (name.length > 255) {
      setError("Tên món ăn không được quá 255 ký tự.");
      return;
    }

    if (isNaN(price) || price <= 0) {
      setError("Giá phải lớn hơn 0.");
      return;
    }

    if (menu.image instanceof File) {
      const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
      if (!allowedExtensions.exec(menu.image.name)) {
        setError("Chỉ chấp nhận file ảnh với định dạng jpg, jpeg, png.");
        return;
      }
    }
    setLoading(true);

    try {
      const activeToken = await ensureActiveToken();
      await createNewFoodItem(menu, activeToken);
      setModal({
        isOpen: true,
        text: "Thêm món ăn thành công!",
        type: "success",
      });
      setTimeout(() => {
        handleCloseModal();
      }, 15000);
    } catch (error) {
      console.error("Lỗi khi thêmthêm món ăn:", error.message);
      setError("Đã có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style["add-food"]}>
      <h2>Thêm món ăn mới</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className={style["form-group"]}>
          <label htmlFor="name">Tên món ăn</label>
          <input
            type="text"
            id="name"
            name="name"
            value={menu.name}
            onChange={handleChange}
            placeholder="Nhập tên món ăn"
            required
          />
        </div>

        <div className={style["form-group"]}>
          <label htmlFor="price">Giá</label>
          <input
            type="number"
            id="price"
            name="price"
            value={menu.price}
            onChange={handleChange}
            placeholder="Nhập giá (>0)"
            min={0}
            required
          />
        </div>

        <div className={style["form-group"]}>
          <label htmlFor="image">Hình ảnh</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleChange}
            required
          />
        </div>

        <div className={style["form-group"]}>
          <label htmlFor="category">Danh mục</label>
          <select
            id="category"
            name="category"
            value={menu.category}
            onChange={handleChange}
            required
          >
            <option value="">Chọn danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className={`${style["form-group"]} ${style.description}`}>
          <label htmlFor="description">Mô tả</label>
          <textarea
            id="description"
            name="description"
            value={menu.description}
            onChange={handleChange}
            placeholder="Nhập mô tả"
            required
          />
        </div>

        <button className={style["submit-button"]} type="submit">
          Thêm món ăn
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

export default AddFoodItem;
