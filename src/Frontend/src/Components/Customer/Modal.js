import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import style from '../../Style/CustomerStyle/Modal.module.css';

const Modal = ({
    modalType, // Loại modal: "email" hoặc "password"
    showModal, // Trạng thái hiển thị modal
    onClose, // Hàm đóng modal
    formData, // Dữ liệu trong modal (email, mật khẩu)
    setFormData, // Hàm cập nhật dữ liệu form
    showPassword, // Trạng thái hiển thị/ẩn mật khẩu
    setShowPassword, // Hàm thay đổi trạng thái hiển thị mật khẩu
    handleSubmit, // Hàm xử lý khi nhấn nút xác nhận
    error, // Lỗi cần hiển thị
    requirement, // Yêu cầu mật khẩu (nếu có)
}) => {
    if (!showModal) return null; // Không hiển thị modal nếu không được mở
    

    // Hàm xử lý thay đổi dữ liệu input
    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Hàm thay đổi trạng thái hiển thị/ẩn mật khẩu
    const togglePasswordVisibility = (field) => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    // Hàm tái sử dụng để render các input
    const renderInputField = (label, type, value, field, isPassword = false) => (
        <div className={style['input-container']}>
            <label>{label}</label>
            <div className={isPassword ? style['password-input-container'] : ''}>
                <input
                    type={isPassword && showPassword[field] ? 'text' : type}
                    value={value}
                    placeholder={`Nhập ${label.toLowerCase()}`}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    required
                />
                {isPassword && (
                    <span
                        className={style['password-toggle-icon']}
                        onClick={() => togglePasswordVisibility(field)}
                    >
                        <FontAwesomeIcon icon={showPassword[field] ? faEyeSlash : faEye} />
                    </span>
                )}
            </div>
        </div>
    );

    return (
        <div className={style["modal-overlay"]}>
            <div className={style["modal"]}>
                <button className={style["close-modal"]} onClick={onClose}>
                    &times;
                </button>
                <h3>{modalType === "email" ? "Thay Đổi Email" : "Thay Đổi Mật Khẩu"}</h3>
                <form
                    onSubmit={(e) => {
                        e.preventDefault(); // Ngăn reload trang khi submit form
                        handleSubmit();
                    }}
                >
                    {modalType === "email" ? (
                        <>
                            {renderInputField("Email Mới", "email", formData.newEmail, "newEmail")}
                            {renderInputField("Xác Nhận Email", "email", formData.confirmNewEmail, "confirmNewEmail")}
                            {renderInputField("Mật khẩu cũ", "password", formData.oldPassword, "oldPassword", true)}
                        </>
                    ) : (
                        <>
                            {renderInputField("Mật khẩu cũ", "password", formData.oldPassword, "oldPassword", true)}
                            {renderInputField("Mật khẩu mới", "password", formData.newPassword, "newPassword", true)}
                            {requirement && (
                                <p className={style["password-requirement"]} style={{ color: "red" }}>
                                    • {requirement.text}
                                </p>
                            )}
                            {renderInputField(
                                "Xác nhận mật khẩu mới",
                                "password",
                                formData.confirmNewPassword,
                                "confirmNewPassword",
                                true
                            )}
                        </>
                    )}
                    {error && <p className={style["error-message"]}>{error}</p>}
                    <button className={style["modal-button"]} type="submit">
                        {modalType === "email" ? "Thay Đổi Email" : "Thay Đổi Mật Khẩu"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Modal;
