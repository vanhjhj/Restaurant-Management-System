// src/Components/EmployeeRegistration.js
import React, { useState } from 'react';
import './RegisterEmployeeAccount.css';

function RegisterEmployeeAccount() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        phone: '',
        fullName: '',
        address: '',
        dateOfBirth: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add API call or form validation logic here
        console.log("Employee registered:", formData);
    };

    return (
        <div className="employee-registration">
            <button className="back-button">← Back</button>
            <div className="registration-form">
                <h2>Đăng ký</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Tên đầy đủ
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Email
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Số điện thoại
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Địa chỉ
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Ngày sinh
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Tài khoản
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Mật khẩu
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Xác nhận mật khẩu
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <button type="submit" className="submit-button">Đăng ký</button>
                </form>
            </div>
        </div>
    );
}

export default RegisterEmployeeAccount;
