import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostInfoCus } from "../../../API/FixInfoAPI"; // API gửi thông tin
import { isTokenExpired } from "../../../utils/tokenHelper.mjs";
import style from "./FillFormInfo.module.css";
import { refreshToken } from "../../../API/authAPI";

function FillFormInfo() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        full_name: "",
        phone_number: "",
        gender: "Nam", 
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Kiểm tra thông tin trước khi gửi
        if (!formData.full_name || !formData.phone_number || !formData.gender) {
            setError("Vui lòng điền đầy đủ thông tin.");
            return;
        }
    
        try {
            let token = localStorage.getItem("token_Register");
            const refresh = localStorage.getItem("refresh_Register");
    
            // Kiểm tra và làm mới token nếu cần
            if (isTokenExpired(token)) {
                console.log("Token hết hạn, đang làm mới...");
                const newResponse = await refreshToken(refresh, token);
                token = newResponse.access;
                localStorage.setItem("token_Register", token); // Cập nhật token mới
            }
    
            const account_id = localStorage.getItem("Register_id");
            if (!account_id || !token) {
                throw new Error("Token hoặc User ID không hợp lệ. Vui lòng đăng nhập lại.");
            }
    
            // Chuẩn bị dữ liệu gửi đi
            const FormData = {
                account_id: account_id,
                full_name: formData.full_name,
                phone_number: formData.phone_number,
                gender: formData.gender,
            };
    
            console.log("Dữ liệu gửi đi:", FormData); 
            if (isTokenExpired(token)) {
                console.log("Token hết hạn, đang làm mới...");
            }
            // Gửi thông tin khách hàng đến backend
            await PostInfoCus(FormData, token);
           
            alert("Thông tin của bạn đã được cập nhật!");
            navigate("/"); // Điều hướng về trang chính
        } catch (err) {
            console.error("Lỗi khi lưu thông tin khách hàng:", err.message);
            setError("Cập nhật thông tin thất bại. Vui lòng thử lại.");
        }
    };

    return (
        <div className={style["fill-form-container"]}>
            <h2>Điền Thông Tin Cá Nhân</h2>
            {error && <p className={style["error-message"]}>{error}</p>} {/* Hiển thị lỗi */}
            <form onSubmit={handleSubmit} className={style["form"]}>
                <div className={style["form-group"]}>
                    <label htmlFor="full_name">Họ và tên:</label>
                    <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                        placeholder="Nhập họ và tên"
                    />
                </div>
                <div className={style["form-group"]}>
                    <label htmlFor="phone_number">Số điện thoại:</label>
                    <input
                        type="tel"
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        required
                        placeholder="Nhập số điện thoại"
                    />
                </div>
                <div className={style["form-group"]}>
                    <label htmlFor="gender">Giới tính:</label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                    >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                    </select>
                </div>
                <button type="submit" className={style["submit-button"]}>
                    Lưu Thông Tin
                </button>
            </form>
        </div>
    );
}

export default FillFormInfo;
