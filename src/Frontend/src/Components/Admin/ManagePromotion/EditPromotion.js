import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchPromotionByCode,
  updatePromotion,
} from "../../../API/PromotionAPI";
import { useAuth } from "../../../Components/Auth/AuthContext";
import style from "./EditPromotion.module.css";
import { FaEdit } from "react-icons/fa"; // Sử dụng icon chỉnh sửa từ react-icons

function EditPromotion() {
  const { code } = useParams(); // Lấy code từ URL
  const [promotion, setPromotion] = useState({
    title: "",
    description: "",
    image: "",
    discount: 0,
    startdate: "",
    enddate: "",
  });
  const [editingField, setEditingField] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [originalPromotion, setOriginalPromotion] = useState({});

  useEffect(() => {
    async function getPromotion() {
      try {
        const data = await fetchPromotionByCode(code);
        if (data) {
          setPromotion(data); // Gán dữ liệu từ API
          setOriginalPromotion(data);
        }
      } catch (error) {
        console.error("Error fetching promotion:", error);
        setError("Không thể tải dữ liệu ưu đãi.");
      }
    }

    if (code) {
      getPromotion();
    }
  }, [code]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setPromotion((prevPromotion) => ({
      ...prevPromotion,
      [name]: files ? files[0] : value, // Nếu có file, lấy file, không thì lấy giá trị input
    }));
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accessToken) {
      setError("Token không tồn tại. Vui lòng đăng nhập lại.");
      return;
    }

    const { startdate, enddate, discount, image, title, description } =
      promotion;

    if (discount < 0 || discount > 100) {
      setError("Giảm giá phải nằm trong khoảng 0-100%.");
      return;
    }

    if (new Date(startdate) >= new Date(enddate)) {
      setError("Ngày kết thúc phải sau ngày bắt đầu.");
      return;
    }

    const hasChanges =
      promotion.title !== originalPromotion.title ||
      promotion.description !== originalPromotion.description ||
      new Date(promotion.startdate).toISOString() !==
        new Date(originalPromotion.startdate).toISOString() ||
      new Date(promotion.enddate).toISOString() !==
        new Date(originalPromotion.enddate).toISOString() ||
      promotion.discount !== originalPromotion.discount ||
      promotion.image instanceof File; // Kiểm tra file ảnh

    if (!hasChanges) {
      setError("Chưa có thay đổi gì để cập nhật.");
      return;
    }

    try {
      await updatePromotion(code, promotion, accessToken);
      alert("Ưu đãi đã được cập nhật thành công");
      navigate("/manage-promotions");
    } catch (error) {
      console.error("Lỗi khi cập nhật ưu đãi:", error.message);
      setError("Đã có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const handleEdit = (field) => {
    setEditingField(field);
  };

  return (
    <div className={style["edit-promotion"]}>
      <button
        onClick={() => navigate("/manage-promotions")}
        className={style["back-button"]}
      >
        ← Back
      </button>
      <h2>Chỉnh sửa ưu đãi {code}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className={style["form-group"]}>
          <label htmlFor="title">Tiêu đề</label>
          {editingField === "title" ? (
            <input
              type="text"
              id="title"
              name="title"
              value={promotion.title}
              onChange={handleChange}
            />
          ) : (
            <p>
              {promotion.title}{" "}
              <FaEdit
                className={style.editIcon}
                onClick={() => handleEdit("title")}
              />
            </p>
          )}
        </div>

        <div className={style["form-group"]}>
          <label htmlFor="startdate">Ngày bắt đầu</label>
          {editingField === "startdate" ? (
            <input
              type="date"
              id="startdate"
              name="startdate"
              value={promotion.startdate}
              onChange={handleChange}
            />
          ) : (
            <p>
              {formatDate(promotion.startdate)}{" "}
              <FaEdit
                className={style.editIcon}
                onClick={() => handleEdit("startdate")}
              />
            </p>
          )}
        </div>

        <div className={style["form-group"]}>
          <label htmlFor="enddate">Ngày kết thúc</label>
          {editingField === "enddate" ? (
            <input
              type="date"
              id="enddate"
              name="enddate"
              value={promotion.enddate}
              onChange={handleChange}
            />
          ) : (
            <p>
              {formatDate(promotion.enddate)}{" "}
              <FaEdit
                className={style.editIcon}
                onClick={() => handleEdit("enddate")}
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
              value={promotion.description}
              onChange={handleChange}
            />
          ) : (
            <p>
              {promotion.description}{" "}
              <FaEdit
                className={style.editIcon}
                onClick={() => handleEdit("description")}
              />
            </p>
          )}
        </div>

        <div className={style["form-group"]}>
          <label htmlFor="discount">Giảm giá</label>
          {editingField === "discount" ? (
            <input
              type="number"
              id="discount"
              name="discount"
              value={promotion.discount}
              onChange={handleChange}
            />
          ) : (
            <p>
              {promotion.discount}%{" "}
              <FaEdit
                className={style.editIcon}
                onClick={() => handleEdit("discount")}
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
              {promotion.image ? promotion.image.name : "Chưa có hình ảnh"}{" "}
              <FaEdit
                className={style.editIcon}
                onClick={() => handleEdit("image")}
              />
            </p>
          )}
        </div>

        <button type="submit" className={style["submit-button"]}>
          Cập nhật ưu đãi
        </button>
      </form>
    </div>
  );
}

export default EditPromotion;
