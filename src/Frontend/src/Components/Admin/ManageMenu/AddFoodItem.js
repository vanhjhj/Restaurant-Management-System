import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createNewFoodItem, getFoodItems } from "../../../API/MenuAPI";
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
  const [previewImage, setPreviewImage] = useState(null);

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
        throw error;
      }
    }
    return activeToken;
  };

  const checkFoodExistence = async (name) => {
    try {
      const fooditems = await getFoodItems();
      return fooditems.some((food) => food.name === name);
    } catch (error) {
      console.error("Lỗi khi kiểm tra tên món ăn:", error.message);
      throw error;
    }
  };

  const handleChange = (e) => {
    const { name, files } = e.target;

    if (name === "image" && files.length > 0) {
      const file = files[0];

      const allowedExtensions = /(\.jpg|\.png)$/i;
      if (!allowedExtensions.exec(file.name)) {
        setError("Chỉ chấp nhận file ảnh với định dạng jpg và png.");
        return;
      }

      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        setError("Ảnh quá lớn. Vui lòng chọn ảnh dưới 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;

        img.onload = () => {
          const width = img.width;
          const height = img.height;

          const aspectRatio = width / height;

          if (aspectRatio < 0.5 || aspectRatio > 2) {
            setError(
              "Ảnh phải có tỷ lệ chiều rộng/chiều cao trong khoảng 1:2 và 2:1."
            );
            return;
          }

          setError("");
          setPreviewImage(reader.result);
        };
      };
      reader.readAsDataURL(file);

      setMenu((prevMenu) => ({
        ...prevMenu,
        image: file,
      }));
    } else if (name !== "image") {
      setMenu((prevMenu) => ({
        ...prevMenu,
        [name]: e.target.value,
      }));
    }
  };

  const handleCloseModal = () => {
    setModal({ isOpen: false }); // Đóng modal
    navigate("/admin-dashboard/manage-menu"); // Điều hướng
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, price, description, image, category } = menu;
    if (!menu.image) {
      setError("Vui lòng chọn ảnh món ăn.");
      return;
    }

    setError("");

    if (await checkFoodExistence(name)) {
      setError("Tên món ăn đã tồn tại. Vui lòng chọn tên khác.");
      return;
    }
    setError("");

    setLoading(true);

    try {
      const activeToken = await ensureActiveToken();
      await createNewFoodItem(menu, activeToken);
      setModal({
        isOpen: true,
        text: "Thêm món ăn thành công!",
        type: "success",
        onConfirm:handleCloseModal
      });
    } catch (error) {
      console.error("Lỗi khi thêm món ăn:", error.message);
      setError("Đã có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style["add-food"]}>
      <h2>THÊM MÓN ĂN MỚI</h2>
      <div className={style["add-food-container"]}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className={style["left-side"]}>
            <div className={style["form-img"]}>
              {previewImage ? (
                <img src={previewImage} alt="Preview" />
              ) : (
                <>
                  <img src="/assets/images/menu.jpg" alt="Default" />
                  <p className={style["placeholder"]}> Ảnh ví dụ</p>
                </>
              )}

              <label htmlFor="image" className={style["image-upload-button"]}>
                Chọn ảnh món ăn
                <input
                  type="file"
                  id="image"
                  name="image"
                  style={{ display: "none" }}
                  onChange={handleChange}
                />
              </label>

              <p className={style["instructions"]}>
                Dung lượng file tối đa 2MB <br />
                Định dạng: JPEG, PNG <br />
                Nên sử dụng hình ảnh có tỉ lệ 1:1 <br />
                Ảnh cần có tỉ lệ kích thước chiều rộng và chiều cao không quá
                1:2 và không nhỏ hơn 2:1
              </p>
            </div>
          </div>
          <div className={style["right-side"]}>
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
                maxLength={255}
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

            <button className={style["submit-button"]} type="submit">
              Thêm món ăn
            </button>
          </div>
        </form>
        {modal.isOpen && (
          <ModalGeneral
            isOpen={modal.isOpen}
            text={modal.text}
            type={modal.type}
            onClose={modal.onConfirm || (() => setModal({ isOpen: false }))}
            onConfirm={modal.onConfirm}
          />
        )}
      </div>
    </div>
  );
}

export default AddFoodItem;
