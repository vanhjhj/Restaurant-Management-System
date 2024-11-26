import React, { useState, useEffect } from 'react';
import { GetEmailCus, GetInfoCus, ChangeInfoCus } from '../../API/FixInfoAPI';
import { useNavigate } from 'react-router-dom';
import { isTokenExpired } from '../../utils/tokenHelper.mjs';
import { refreshToken } from '../../API/authAPI';
import style from '../../Style/CustomerStyle/Profile.module.css';

function Profile() {
    const [showModal, setShowModal] = useState(false); // Quản lý trạng thái hiển thị modal
    const [modalType, setModalType] = useState(""); // Xác định loại modal ("email" hoặc "password")

    const handleOpenModal = (type) => {
        setModalType(type);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

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
            <h1 className={style["title"]}>Thông Tin Của Bạn</h1>
            <h2>Thông tin cá nhân</h2>
            {error && <p className={style["error-message"]}>{'Số Điện thoại không hợp lệ'}</p>}
        
            <div className={style["form-container"]}>
                {/* Hàng đầu tiên: Họ và Tên, Giới tính */}
                <div className={style["form-row"]}>
                    <div>
                        <label htmlFor="full-name">Họ và Tên:</label>
                        <input
                            id="full-name"
                            type="text"
                            value={personalInfo.full_name}
                            onChange={(e) => {
                                setPersonalInfo({ ...personalInfo, full_name: e.target.value });
                                if (error) setError("");
                            }}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="gender">Giới tính:</label>
                        <select
                            id="gender"
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
                    </div>
                </div>

                {/* Hàng thứ hai: Số điện thoại */}
                <div>
                    <label htmlFor="phone-number">Số Điện Thoại:</label>
                    <input
                        id="phone-number"
                        type="text"
                        value={personalInfo.phone_number}
                        onChange={(e) => {
                            setPersonalInfo({ ...personalInfo, phone_number: e.target.value });
                            if (error) setError("");
                        }}
                        required
                    />
                </div>

                {/* Hàng thứ ba: Các nút hành động */}
                <div className={style["button-group"]}>
                    <button className={style["btn-cancel"]} onClick={handleCancelChanges}>
                        Hủy
                    </button>
                    <button
                        className={style["btn-save"]}
                        onClick={handleSaveChanges}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Đang lưu..." : "Lưu Thay Đổi"}
                    </button>
                </div>
            </div>

            <h2>Thông tin đăng nhập</h2>
            <div className={style["login-info"]}>
                <div className={style["login-item"]}>
                    <p className={style["login-label"]}>Email:</p>
                    <p className={style["login-value"]}>{loginInfo.email}</p>
                    <button
                        onClick={() => handleOpenModal("email")}
                        className={style["button"]}
                    >
                        Thay đổi Email
                    </button>
                </div>
                <div className={style["login-item"]}>
                    <p className={style["login-label"]}>Mật khẩu:</p>
                    <p className={style["login-value"]}>{loginInfo.password}</p>
                    <button
                        onClick={() => handleOpenModal("password")}
                        className={style["button"]}
                    >
                        Thay đổi mật khẩu
                    </button>
                </div>
            </div>
            {/* Modal */}
            {showModal && (
                <div className={style["modal-overlay"]}>
                    <div className={style["modal"]}>
                        <button
                            className={style["close-modal"]}
                            onClick={handleCloseModal}
                        >
                            &times;
                        </button>
                        <h3>
                            {modalType === "email"
                                ? "Thay Đổi Email"
                                : "Thay ĐỔi Mật Khẩu"}
                        </h3>
                        {modalType === "email" ? (
                            <form>
                                <label>Email Mới:</label>
                                <input type="email" placeholder="Enter new email" required/>
                                <label>Xác Nhận Email:</label>
                                <input
                                    type="email"
                                    placeholder="Confirm new email"
                                    required
                                />
                                <label>Mật Khẩu:</label>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => navigate('/ForgotPassword')}
                                    className={style["forgot-password"]}
                                >
                                    Quên mật khẩu?
                                </button>
                                
                                <button className={style["modal-button"]}>
                                    Thay Đổi Email
                                </button>
                            </form>
                        ) : (
                            <form>
                                <label>Mật Khẩu Cũ:</label>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    required
                                />
                                <label>Mật Khẩu Mới:</label>
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    required
                                />
                                <label>Xác Nhận Mật Khẩu Mới:</label>
                                <input
                                    type="password"
                                    placeholder="Confirm new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => navigate('/ForgotPassword')}
                                    className={style["forgot-password"]}
                                >
                                    Quên mật khẩu?
                                </button>
                                <button className={style["modal-button"]}>
                                    Thay Đổi Mật Khẩu
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}

export default Profile;
