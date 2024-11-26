import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetEmailCus, GetInfoCus, ChangeInfoCus, CheckPassword, ChangeInfoLogCus } from '../../API/FixInfoAPI';
import { isTokenExpired } from '../../utils/tokenHelper.mjs';
import { refreshToken } from '../../API/authAPI';
import Modal from './Modal'; // Import Modal component
import style from '../../Style/CustomerStyle/Profile.module.css';

function Profile() {
    const [personalInfo, setPersonalInfo] = useState({ full_name: "", gender: "", phone_number: "" });
    const [originalInfo, setOriginalInfo] = useState({ full_name: "", gender: "", phone_number: "" });
    const [loginInfo, setLoginInfo] = useState({ email: "", password: "********" });
    const [formData, setFormData] = useState({ oldPassword: "", newPassword: "", confirmNewPassword: "", newEmail: "", confirmNewEmail: "" });
    const [showPassword, setShowPassword] = useState({ oldPassword: false, newPassword: false, confirmNewPassword: false });
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [error, setError] = useState(null);
    const [Modalerror, setModalError] = useState(null);
    const [requirement, setRequirement] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');
    const refresh = localStorage.getItem('refreshToken');
    const CusID = localStorage.getItem('userId');

    useEffect(() => {
        if (!token || !refresh || !CusID) {
            navigate('/login');
        } else {
            fetchProfileData();
        }
    }, []);

    const ensureActiveToken = async () => {
        let activeToken = token;
        if (isTokenExpired(token)) {
            const refreshed = await refreshToken(refresh);
            activeToken = refreshed.access;
            localStorage.setItem('accessToken', activeToken);
        }
        return activeToken;
    };

    const fetchProfileData = async () => {
        try {
            const activeToken = await ensureActiveToken();
            const [responseCus, responseEmail] = await Promise.all([
                GetInfoCus(CusID, activeToken),
                GetEmailCus(CusID, activeToken),
            ]);
            setPersonalInfo({
                full_name: responseCus.full_name || "",
                gender: responseCus.gender || "",
                phone_number: responseCus.phone_number || "",
            });
            setOriginalInfo({
                full_name: responseCus.full_name || "",
                gender: responseCus.gender || "",
                phone_number: responseCus.phone_number || "",
            });
            setLoginInfo({ email: responseEmail.email || "", password: "********" });
        } catch (error) {
            console.error("Error fetching profile data:", error);
            setError("Không thể tải thông tin.");
            if (error.response?.status === 401) navigate('/login');
        }
    };

    const handleSaveChanges = async () => {
        setIsSubmitting(true);
        try {
            const activeToken = await ensureActiveToken();
            await ChangeInfoCus(CusID, personalInfo, activeToken);
            setOriginalInfo(personalInfo);
            alert("Cập nhật thông tin thành công!");
        } catch (error) {
            console.error("Error updating profile:", error);
            setError("Không thể cập nhật thông tin.");
        } finally {
            setIsSubmitting(false);
        }
    };
    // Hàm xử lý hủy thay đổi
    const handleCancelChanges = () => {
        setPersonalInfo(originalInfo); // Khôi phục trạng thái gốc
    };

    const handlePasswordChange = async () => {
        setError(null);
        try {
            const activeToken = await ensureActiveToken();
            if (formData.newPassword !== formData.confirmNewPassword) {
                setError("Mật khẩu xác nhận không khớp.");
                return;
            }
            let InfoChange={password: formData.newPassword}
            await CheckPassword(CusID,formData.oldPassword, activeToken);
            await ChangeInfoLogCus(CusID,InfoChange , activeToken);
            alert("Đổi mật khẩu thành công!");
            setShowModal(false);
        } catch (error) {
            console.error("Error changing password:", error);
            setError("Đổi mật khẩu thất bại.");
        }
    };

    const handleEmailChange = async () => {
        setError(null);
        try {
            const activeToken = await ensureActiveToken();
            if (formData.newEmail !== formData.confirmNewEmail) {
                setError("Email xác nhận không khớp.");
                return;
            }
            let InfoChange={email: formData.newEmail};
            await CheckPassword(CusID,formData.oldPassword, activeToken);
            await ChangeInfoLogCus(CusID,InfoChange , activeToken);
            alert("Đổi email thành công!");
            setShowModal(false);
        } catch (error) {
            console.error("Error changing email:", error);
            setError("Đổi email thất bại.");
        }
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
                        className={style["button"]}
                        onClick={() => {
                            setModalType("email");
                            setShowModal(true);
                        }}
                    >
                        Thay đổi Email
                    </button>
                </div>
                <div className={style["login-item"]}>
                    <p className={style["login-label"]}>Mật khẩu:</p>
                    <p className={style["login-value"]}>{loginInfo.password}</p>
                    <button
                        onClick={() => {
                            setModalType("password");
                            setShowModal(true);
                        }}
                        className={style["button"]}
                    >
                        Thay đổi mật khẩu
                    </button>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <Modal
                    modalType={modalType}
                    showModal={showModal}
                    onClose={() => setShowModal(false)}
                    formData={formData}
                    setFormData={setFormData}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    handleSubmit={modalType === "email" ? handleEmailChange : handlePasswordChange}
                    Modalerror={Modalerror}
                    requirement={requirement}
                />
            )}
        </div>
    );
}

export default Profile;
