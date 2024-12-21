import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createNewFoodItem } from "../../../API/MenuAPI"; // Import hàm thêm ưu đãi
import { useAuth } from "../../../Components/Auth/AuthContext"; // Import useAuth
import { getMenuTabs } from "../../../API/MenuAPI"; // Import hàm lấy danh mục
import style from "./AddFoodItem.module.css";

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
  const { accessToken } = useAuth();

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

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setMenu((prevMenu) => ({
      ...prevMenu,
      [name]: type === "file" ? files[0] : value, // Lưu file nếu input là file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, price, description, image, category } = menu;

    // Validate input
    if (!name || !price || !description || !image || !category) {
      setError("Tất cả các trường đều phải nhập.");
      return;
    }

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

    if (!accessToken) {
      window.alert("Token không tồn tại, vui lòng đăng nhập lại.");
      return;
    }

    try {
      await createNewFoodItem(menu, accessToken);
      alert("Món ăn đã được thêm thành công");
      navigate("/manage-menu");
    } catch (error) {
      if (error.response) {
        console.error("Lỗi từ server:", error.response.data);
      } else {
        console.error("Lỗi khác:", error.message);
      }
      setError("Đã có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div className={style["add-food"]}>
      <button
        onClick={() => navigate("/manage-menu")}
        className={style["back-button"]}
      >
        ← Back
      </button>
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
          />
        </div>

        <div className={style["form-group"]}>
          <label htmlFor="description">Mô tả</label>
          <input
            type="text"
            id="description"
            name="description"
            value={menu.description}
            onChange={handleChange}
            placeholder="Nhập mô tả"
          />
        </div>

        <div className={style["form-group"]}>
          <label htmlFor="image">Hình ảnh</label>
          <input type="file" id="image" name="image" onChange={handleChange} />
        </div>

        <div className={style["form-group"]}>
          <label htmlFor="category">Danh mục</label>
          <select
            id="category"
            name="category"
            value={menu.category}
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

        <button className={style["submit-button"]} type="submit">
          Thêm món ăn
        </button>
      </form>
    </div>
  );
}

export default AddFoodItem;
