import React, { useState, useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import style from "./../../../Style/AdminStyle/FillInfoEmployee.module.css";
import { useAuth } from '../../Auth/AuthContext';
import { refreshToken } from '../../../API/authAPI';
import { isTokenExpired } from '../../../utils/tokenHelper.mjs';
import { FillInfoEmp, getDepartments } from '../../../API/AdminAPI';
import { ModalGeneral } from '../../ModalGeneral';

function FillInfoEmployee() {
    const { accessToken, setAccessToken } = useAuth();
    // Ensure token is valid
    const ensureActiveTokenAmin = async () => {
        let activeTokenAdmin = accessToken;
        const refresh = localStorage.getItem('refreshToken');
        if (!accessToken || isTokenExpired(accessToken)) {
            const refreshed = await refreshToken(refresh);
            activeTokenAdmin = refreshed.access;
            setAccessToken(activeTokenAdmin);
        }
        return activeTokenAdmin;
    };
    
    const [formData, setFormData] = useState({
        full_name: '',
        date_of_birth: '',
        gender: '',
        address: '',
        start_working_date: '',
        department: '',
        phone_number: '',
    });

    const [departments, setDepartments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const [modal, setModal] = useState({
        isOpen: false,
        text: "",
        type: "", // "confirm" hoặc "success"
        onConfirm: null, // Hàm được gọi khi xác nhận
    });
    const {email, id, refresh_employee, token_employee}=location.state || {};
    const { accessTokenEmployee, setaccessTokenEmployee } = useState(token_employee);
    // Đảm bảo token hợp lệ
    const ensureActiveToken = async () => {
        let activeToken = accessTokenEmployee;
        if (!accessTokenEmployee||isTokenExpired(accessTokenEmployee)) {
            const refreshed = await refreshToken(refresh_employee);
            activeToken = refreshed.access;
            setaccessTokenEmployee(activeToken);
        }
        return activeToken;
    };

    useEffect(() => {
        const loadDepartments = async () => {
            try {
                const activeTokenAdmin = await ensureActiveTokenAmin();
                const departmentList = await getDepartments(activeTokenAdmin);
                setDepartments(departmentList.results);
            } catch (err) {
                console.error("Error fetching departments:", err);
                setError("Hiện tại chưa có bộ phận nào");
            }
        };

        loadDepartments();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCloseModal = () => {
        setModal({ isOpen: false }); // Đóng modal
        navigate('/admin-dashboard'); // Điều hướng
    };

    const handleSaveInfo = async () => {
        setIsSubmitting(true);
        setError(null);
        await ensureActiveTokenAmin();
        // Lấy ngày hiện tại
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Đặt giờ về 0 để chỉ so sánh ngày
    
        // Kiểm tra dữ liệu đầu vào
        if (!formData.full_name || formData.full_name.trim() === "") {
            setError("Họ và tên không được để trống.");
            setIsSubmitting(false);
            return;
        }
    
        if (!formData.date_of_birth) {
            setError("Ngày sinh không được để trống.");
            setIsSubmitting(false);
            return;
        }
    
        // Kiểm tra tuổi >= 18
        const birthDate = new Date(formData.date_of_birth);
        const age = today.getFullYear() - birthDate.getFullYear();
        const ageCheck = today < new Date(birthDate.setFullYear(birthDate.getFullYear() + age)) ? age - 1 : age;
    
        if (ageCheck < 18) {
            setError("Nhân viên chưa đủ 18 tuổi.");
            setIsSubmitting(false);
            return;
        }
    
        if (!formData.gender) {
            setError("Giới tính không được để trống.");
            setIsSubmitting(false);
            return;
        }
    
        if (!formData.department) {
            setError("Vui lòng chọn bộ phận.");
            setIsSubmitting(false);
            return;
        }
    
        if (!formData.start_working_date) {
            setError("Ngày bắt đầu làm việc không được để trống.");
            setIsSubmitting(false);
            return;
        }
        if (!formData.phone_number) {
            setError("Số điện thoại không được để trống.");
            setIsSubmitting(false);
            return;
        }
    
        // Kiểm tra ngày bắt đầu làm việc >= ngày hiện tại
        const startDate = new Date(formData.start_working_date);
        if (startDate < today) {
            setError("Ngày bắt đầu làm việc đang là quá khứ.");
            setIsSubmitting(false);
            return;
        }
    
        // Chuẩn bị dữ liệu gửi lên API
        const sanitizedData = {
            account_id: id,
            full_name: formData.full_name.trim(),
            date_of_birth: formData.date_of_birth,
            gender: formData.gender,
            email: email,
            address: formData.address ? formData.address.trim() : "",
            start_working_date: formData.start_working_date,
            department: formData.department,
            phone_number: formData.phone_number,
        };
    
        try {
            const activeToken = await ensureActiveToken();
            console.log("Dữ liệu gửi lên API:", sanitizedData);
            await FillInfoEmp(sanitizedData, activeToken);
            setModal({
                isOpen: true,
                text: "Thông tin nhân viên đã được lưu thành công!",
                type: "success",
            });
            setTimeout(() => {
                handleCloseModal();
            }, 15000);
        } catch (error) {
            console.error("Error filling employee info:", error.response?.data || error.message);
            setError("Không thể cập nhật thông tin. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    

    return (
        <div className={style["fill-info-employee-container"]}>
            <h2 className={style["fill-info-employee-header"]}>Thông tin nhân viên</h2>
            {error && <p className={style["error-message"]}>{error}</p>}
            <form className={style["fill-info-employee-form"]} onSubmit={(e) => e.preventDefault()}>
                {/* Họ và tên */}
                <div className={style["form-group"]}>
                    <label>Họ và Tên</label>
                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        placeholder="Nhập họ và tên"
                        required
                    />
                </div>

                {/* Ngày sinh */}
                <div className={style["form-group"]}>
                    <label>Ngày sinh</label>
                    <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Giới tính */}
                <div className={style["form-group"]}>
                    <label>Giới tính</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Chọn giới tính</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                    </select>
                </div>

                 {/* Ngày bắt đầu làm việc */}
                 <div className={style["form-group"]}>
                    <label>Ngày bắt đầu làm việc</label>
                    <input
                        type="date"
                        name="start_working_date"
                        value={formData.start_working_date}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Số điện thoại */}
                <div className={style["form-group"]}>
                    <label>Số Điện Thoại</label>
                    <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        placeholder="Nhập số điện thoại"
                    />
                </div>

                {/* Bộ phận */}
                <div className={style["form-group"]}>
                    <label>Bộ phận</label>
                    <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Chọn bộ phận</option>
                        {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                                {dept.name}
                            </option>
                        ))}
                    </select>
                </div>


                {/* Địa chỉ */}
                <div className={style["form-group"]}>
                    <label>Địa chỉ</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Nhập địa chỉ"
                    />
                </div>

                <button
                    className={style["submit-button"]}
                    onClick={handleSaveInfo}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Đang lưu..." : "Lưu Thông Tin"}
                </button>
            </form>

            {modal.isOpen && (
                <ModalGeneral 
                    isOpen={modal.isOpen} 
                    text={modal.text} 
                    type={modal.type} 
                    onClose={handleCloseModal}
                    onConfirm={modal.onConfirm}
                />
            )}
        </div>
    );
}

export default FillInfoEmployee;
