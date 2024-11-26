import React, { useState, useEffect } from 'react';
import { GetEmailCus, GetInfoCus, ChangeInfoCus } from '../../API/FixInfoAPI';
import { useNavigate } from 'react-router-dom';
import { isTokenExpired } from '../../utils/tokenHelper.mjs';
import { refreshToken } from '../../API/authAPI';
import style from '../../Style/CustomerStyle/Profile.module.css';

function Profile() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [personalInfo, setPersonalInfo] = useState({
        full_name: "",
        gender: "",
        phone_number: "",
    });

    const [originalInfo, setOriginalInfo] = useState({
        full_name: "",
        gender: "",
        phone_number: "",
    });

    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: "********", // Hiển thị mặc định
    });

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('accessToken');
    const refresh = localStorage.getItem('refreshToken');
    const CusID = localStorage.getItem('userId');

    if (!token || !refresh || !CusID) {
        navigate('/login'); // Điều hướng nếu thiếu token hoặc userId
    }

    // Hàm tải dữ liệu
    const fetchProfileData = async () => {
        setError('');
        try {
            let activeToken = token;

            if (isTokenExpired(token)) {
                activeToken = await refreshToken(refresh);
                activeToken=activeToken.access;
                localStorage.setItem('accessToken', activeToken);
                
            }

            const responseCus = await GetInfoCus(CusID, activeToken);
            const responseEmail = await GetEmailCus(CusID,activeToken);

            const fetchedPersonalInfo = {
                full_name: responseCus.full_name || "",
                gender: responseCus.gender || "",
                phone_number: responseCus.phone_number || "",
            };

            setPersonalInfo(fetchedPersonalInfo);
            setOriginalInfo(fetchedPersonalInfo);

            setLoginInfo({
                email: responseEmail.email || "",
                password: "********", // Không hiển thị mật khẩu thật
            });
        } catch (error) {
            setError(error.message || "Failed to fetch profile data.");
            console.error("Error fetching profile data:", error);

            // Điều hướng đến trang login nếu token hết hạn
            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
    };
    useEffect(() => {
        fetchProfileData();
    }, []); // Chỉ gọi một lần khi component được render
    
    // Hàm xử lý lưu thay đổi
    const handleSaveChanges = async () => {
        setIsSubmitting(true);
        setError('');
        try {
            let activeToken = token;

            if (isTokenExpired(token)) {
                activeToken = await refreshToken(refresh);
                activeToken=activeToken.access;
                localStorage.setItem('accessToken', activeToken);
            }

            if (personalInfo.phone_number&&!personalInfo.phone_number.match(/^\d{10}$/)) {
                setError("Phone number must be 10 digits");
                return;
            }            

            await ChangeInfoCus( CusID, personalInfo, activeToken );
            setOriginalInfo(personalInfo); // Cập nhật trạng thái gốc
            alert("Profile updated successfully!");
        } catch (error) {
            setError(error.message || "Failed to update profile.");
            console.error("Error updating profile:", error);
        }
        finally {
            setIsSubmitting(false); // Dù thành công hay thất bại, nút Save có thể bấm lại
        }
    };

    // Hàm xử lý hủy thay đổi
    const handleCancelChanges = () => {
        setPersonalInfo(originalInfo); // Khôi phục trạng thái gốc
    };

    return (
        <div className={style["profile-container"]}>
            <h1 className ={style["title"]}>Thông Tin Của Bạn</h1>
            <h2>Thông tin cá nhân</h2>
            <p>Hãy cập nhật thông tin cá nhân của bạn!</p>
            {error && <p className={style["error-message"]}>{error}</p>}
            <div>
                <label>
                    Họ và Tên:
                    <input
                        type="text"
                        value={personalInfo.full_name}
                        onChange={(e) => {
                            setPersonalInfo({ ...personalInfo, full_name: e.target.value });
                            if (error) setError("");
                        }}
                    />
                </label>
                <label>
                    Giới tính:
                    <select
                        value={personalInfo.gender}
                        onChange={(e) => {
                            setPersonalInfo({ ...personalInfo, gender: e.target.value });
                            if (error) setError("");
                        }}
                    >
                        <option value=""></option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                    </select>
                </label>

                <label>
                    Số Điện Thoại:
                    <input
                        type="text"
                        value={personalInfo.phone_number}
                        onChange={(e) => {
                            setPersonalInfo({ ...personalInfo, phone_number: e.target.value });
                            if (error) setError("");
                        }}
                    />
                </label>
            </div>
            <button className={style["btn-cancel"]} onClick={handleCancelChanges}>
                Hủy
            </button>
            <button className={style["btn-save"]} onClick={handleSaveChanges} disabled={isSubmitting}>
                Lưu Thay Đổi
            </button>


            <h2>Thông tin đăng nhập</h2>
            <p></p>
            <div>
                <p>Email đăng nhập: {loginInfo.email}</p>
                <button
                    type="button"
                    onClick={() => navigate('/Chang-email')}
                    className={style["button"]}
                >
                    Thay đổi Email
                </button>
                <p>Mật khẩu: {loginInfo.password}</p>
                <button
                    type="button"
                    onClick={() => navigate('/Change-password')}
                    className={style["button"]}
                >
                    Thay đổi mật khẩu
                </button>
            </div>
        </div>
    );
}

export default Profile;
