import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchPromotionByCode,
  updatePromotion,
} from "../../../API/PromotionAPI";
import { useAuth } from "../../../Components/Auth/AuthContext";
import { isTokenExpired } from "../../../utils/tokenHelper.mjs";
import { refreshToken } from "../../../API/authAPI";
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
  const { accessToken, setAccessToken } = useAuth();
  const [originalPromotion, setOriginalPromotion] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getPromotion() {
      try {
        const data = await fetchPromotionByCode(code);
        if (data) {
          setPromotion(data); // Gán dữ liệu từ API
          setOriginalPromotion(data);
          console.log(data);
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
    const { title, description, discount, image, startdate, enddate } =
      promotion;

    if (discount < 0 || discount > 100) {
      setError("Giảm giá phải nằm trong khoảng 0-100%.");
      return;
    }

    if (new Date(startdate) >= new Date(enddate)) {
      setError("Ngày kết thúc phải sau ngày bắt đầu.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("discount", discount);
    formData.append("startdate", startdate);
    formData.append("enddate", enddate);

    // Nếu có ảnh mới, thêm vào formData
    if (promotion.image instanceof File) {
      const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
      if (!allowedExtensions.exec(promotion.image.name)) {
        setError("Chỉ chấp nhận file ảnh với định dạng jpg, jpeg, png.");
        return;
      }
      formData.append("image", promotion.image);
    }

    const hasChanges =
      promotion.title !== originalPromotion.title ||
      promotion.description !== originalPromotion.description ||
      new Date(promotion.startdate).getTime() !==
        new Date(originalPromotion.startdate).getTime() ||
      new Date(promotion.enddate).getTime() !==
        new Date(originalPromotion.enddate).getTime() ||
      promotion.discount !== originalPromotion.discount ||
      promotion.image instanceof File;

    if (!hasChanges) {
      setError("Chưa có thay đổi gì để cập nhật.");
      return;
    }

    setLoading(true);

    try {
      const activeToken = await ensureActiveToken();
      await updatePromotion(code, formData, activeToken);
      alert("Ưu đãi đã được cập nhật thành công");
      navigate("/manage-promotions");
    } catch (error) {
      console.error("Lỗi khi cập nhật ưu đãi:", error.message);
      setError("Đã có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
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
