import React, { useState, useEffect } from 'react';
import style from "./../../../Style/AdminStyle/FillInfoEmployee.module.css";
import { useAuth } from '../../Auth/AuthContext';
import { FillInfoEmp/*, fetchDepartments*/ } from '../../../API/AdminAPI';

function FillInfoEmployee() {
    const { accessToken, setAccessToken } = useAuth();
    const refresh = localStorage.getItem('refreshToken');
    const EmpID = localStorage.getItem('EmpID');

    const [formData, setFormData] = useState({
        fullName: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        department: '',
        account: '',
    });

    const [departments, setDepartments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Load danh sách bộ phận từ database
        const loadDepartments = async () => {
            try {
                const activeToken = await ensureActiveToken();
                /*const departmentList = await fetchDepartments(activeToken);
                setDepartments(departmentList); // Giả định `departmentList` là danh sách bộ phận từ API*/
            } catch (err) {
                console.error("Error fetching departments:", err);
                setError("Không thể tải danh sách bộ phận.");
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

    const handleSaveInfo = async () => {
        setIsSubmitting(true);
        try {
            const activeToken = await ensureActiveToken();
            await FillInfoEmp(EmpID, formData, activeToken);
            alert("Thông tin nhân viên đã được lưu thành công.");
        } catch (error) {
            console.error("Error filling employee info:", error);
            setError("Không thể cập nhật thông tin.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={style["fill-info-employee-container"]}>
            <h2>Nhập thông tin nhân viên</h2>
            {error && <p className={style["error-message"]}>{error}</p>}
            <form className={style["fill-info-employee-form"]} onSubmit={(e) => e.preventDefault()}>
                {/* Họ và tên */}
                <div className={style["form-group"]}>
                    <label>Họ và Tên</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
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
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
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
                            <option key={dept.id} value={dept.name}>
                                {dept.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tài khoản */}
                <div className={style["form-group"]}>
                    <label>Tài khoản</label>
                    <input
                        type="text"
                        name="account"
                        value={formData.account}
                        onChange={handleInputChange}
                        placeholder="Nhập tài khoản"
                        required
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
        </div>
    );
}

export default FillInfoEmployee;
