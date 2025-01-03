import React, { useContext, useState } from "react";
import { RestaurantContext } from "../../../Config/RestaurantContext"; // Import Context
import { UpdateResInfo } from "../../../API/AdminAPI"; // Hàm cập nhật thông tin API
import style from "./ManageRestaurantInfo.module.css";
import { AiOutlineEdit } from "react-icons/ai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ManageRestaurantInfo() {
  const { restaurantInfo, loading, error, setRestaurantInfo } = useContext(RestaurantContext); // Sử dụng context
  const [editMode, setEditMode] = useState(false); // Quản lý trạng thái chỉnh sửa
  const [updatedInfo, setUpdatedInfo] = useState({}); // Thông tin cập nhật

  // Khi bật chế độ chỉnh sửa, đồng bộ dữ liệu từ context vào updatedInfo
  const enableEditMode = () => {
    setUpdatedInfo(restaurantInfo); // Lấy dữ liệu từ context
    setEditMode(true); // Bật chế độ chỉnh sửa
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedChange = (e, parentKey) => {
    const { name, value } = e.target;
    setUpdatedInfo((prev) => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [name]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      await UpdateResInfo(updatedInfo); // Gửi dữ liệu cập nhật đến API
      setRestaurantInfo(updatedInfo); // Cập nhật lại context
      setEditMode(false); // Tắt chế độ chỉnh sửa
    } catch (err) {
      console.error("Cập nhật thông tin thất bại:", err);
    }
  };

  if (loading) return <p className={style["ManageRes"]}>Loading...</p>;
  if (error) return <p className={style["ManageRes"]}>{error}</p>;

  return (
    <div className={style["ManageRes-container"]}>
        {editMode ?(
            <h1>CHỈNH SỬA THÔNG TIN NHÀ HÀNG</h1>
        ):(
            <h1>QUẢN LÝ THÔNG TIN NHÀ HÀNG</h1>
        )}
      <div className={style["ManageRes-form"]}>
        <div className={style["ManageRes-field"]}>
          <label>Tên nhà hàng:</label>
          {editMode ? (
            <div className={style["ManageRes-input"]}>
                <input
                type="text"
                name="name"
                value={updatedInfo.name || ""}
                onChange={handleChange}
                />
                <AiOutlineEdit size={20}/>
            </div>
          ) : (
            <p>{restaurantInfo.name}</p>
          )}
        </div>

        <div className={style["ManageRes-field"]}>
          <label>Địa chỉ:</label>
          {editMode ? (
            <div className={style["ManageRes-input"]}>
                <input
                type="text"
                name="address"
                value={updatedInfo.address || ""}
                onChange={handleChange}
                />
                <AiOutlineEdit size={20}/>
            </div>
          ) : (
            <p>{restaurantInfo.address}</p>
          )}
        </div>

        <div className={style["ManageRes-field"]}>
          <label>Số điện thoại:</label>
          {editMode ? (
            <div className={style["ManageRes-input"]}>
                <input
                type="text"
                name="phone"
                value={updatedInfo.phone || ""}
                onChange={handleChange}
                />
                <AiOutlineEdit size={20}/>
            </div>
          ) : (
            <p>{restaurantInfo.phone}</p>
          )}
        </div>

        <div className={style["ManageRes-field"]}>
          <label>Google Map:</label>
          {editMode ? (
            <div className={style["ManageRes-input"]}>
                <input
                type="text"
                name="google_map"
                value={updatedInfo.google_map || ""}
                onChange={handleChange}
                />
                <AiOutlineEdit size={20}/>
            </div>
          ) : (
            <a href={restaurantInfo.google_map} target="_blank" rel="noopener noreferrer">
              {restaurantInfo.google_map}
            </a>
          )}
        </div>

        <div className={style["ManageRes-field"]}>
          <label>Email:</label>
          {editMode ? (
            <div className={style["ManageRes-input"]}>
                <input
                type="text"
                name="email"
                value={updatedInfo.email || ""}
                onChange={handleChange}
                />
                <AiOutlineEdit size={20}/>
            </div>
          ) : (
            <p>{restaurantInfo.email}</p>
          )}
        </div>

        <div className={style["ManageRes-field-social"]}>
            <label>Social Links:</label>
            {editMode ? (
                <div className={style["social-links"]}>
                <div className={style["social-item"]}>
                    <label>Facebook:</label>
                    <input
                    type="text"
                    name="facebook"
                    value={updatedInfo.social?.facebook || ""}
                    onChange={(e) => handleNestedChange(e, "social")}
                    />
                    <AiOutlineEdit size={20}/>
                </div>
                <div className={style["social-item"]}>
                    <label>Instagram:</label>
                    <input
                    type="text"
                    name="instagram"
                    value={updatedInfo.social?.instagram || ""}
                    onChange={(e) => handleNestedChange(e, "social")}
                    />
                    <AiOutlineEdit size={20}/>
                </div>
                <div className={style["social-item"]}>
                    <label>YouTube:</label>
                    <input
                    type="text"
                    name="youtube"
                    value={updatedInfo.social?.youtube || ""}
                    onChange={(e) => handleNestedChange(e, "social")}
                    />
                    <AiOutlineEdit size={20}/>
                </div>
                <div className={style["social-item"]}>
                    <label>Chat Box:</label>
                    <input
                    type="text"
                    name="chatbox"
                    value={updatedInfo.social?.chatbox || ""}
                    onChange={(e) => handleNestedChange(e, "social")}
                    />
                    <AiOutlineEdit size={20}/>
                </div>
                </div>
            ) : (
                <div className={style["social-links"]}>
                <div className={style["social-item"]}>
                    <label>Facebook:</label>
                    <a href={restaurantInfo.social.facebook} target="_blank" rel="noopener noreferrer">
                    {restaurantInfo.social.facebook}
                    </a>
                </div>
                <div className={style["social-item"]}>
                    <label>Instagram:</label>
                    <a href={restaurantInfo.social.instagram} target="_blank" rel="noopener noreferrer">
                    {restaurantInfo.social.instagram}
                    </a>
                </div>
                <div className={style["social-item"]}>
                    <label>YouTube:</label>
                    <a href={restaurantInfo.social.youtube} target="_blank" rel="noopener noreferrer">
                    {restaurantInfo.social.youtube}
                    </a>
                </div>
                <div className={style["social-item"]}>
                    <label>Chat Box:</label>
                    <a href={restaurantInfo.social.chatbox} target="_blank" rel="noopener noreferrer">
                    {restaurantInfo.social.chatbox}
                    </a>
                </div>
                </div>
            )}
            </div>


        <div className={style["ManageRes-actions"]}>
          {editMode ? (
            <>
              <button onClick={handleSave}>Lưu</button>
              <button onClick={() => setEditMode(false)}>Hủy</button>
            </>
          ) : (
            <button onClick={enableEditMode}>Chỉnh Sửa</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageRestaurantInfo;
