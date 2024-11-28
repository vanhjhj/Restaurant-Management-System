// src/Components/AdminDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import style from './../../Style/AdminStyle/AdminDashboard.module.css';

function AdminDashboard() {
    const navigate = useNavigate(); // Initialize useNavigate hook

    // Function to navigate to different paths
    const handleNavigate = (path) => {
        navigate(path);
    };
  
    return (
        <div className={style["admin-dashboard"]}>
            <div className={style["dashboard-header"]}>
                <h1>Xin chào, admin</h1>
            </div>
            <div className={style["dashboard-container"]}>
                <div className={style["menu-options"]}>
                    <button onClick={() => handleNavigate('/manage-restaurant-info')} className={style["menu-item"]}>
                        Quản lý thông tin nhà hàng
                    </button>
                    <button onClick={() => handleNavigate('/manage-promotions')} className={style["menu-item"]}>
                        Quản lý ưu đãi
                    </button>
                    <button onClick={() => handleNavigate('/manage-menu')} className={style["menu-item"]}>
                        Quản lý thực đơn
                    </button>
                    <button onClick={() => handleNavigate('/view-sales-reports')} className={style["menu-item"]}>
                        Xem báo cáo doanh thu
                    </button>
                    <button onClick={() => handleNavigate('/register-employee-account')} className={style["menu-item"]}>
                        Đăng ký tài khoản cho nhân viên
                    </button>
                    <button onClick={() => handleNavigate('/manage-employees')} className={style["menu-item"]}>
                        Quản lý nhân viên
                    </button>
                </div>
                <div className={style["image-section"]}>
                    <img src="/assets/images/bt1.jpg" alt="Admin illustration" />
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
