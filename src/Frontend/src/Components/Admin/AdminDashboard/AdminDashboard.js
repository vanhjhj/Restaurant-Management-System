// src/Components/AdminDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
    const navigate = useNavigate(); // Initialize useNavigate hook

    // Function to navigate to different paths
    const handleNavigate = (path) => {
        navigate(path);
    };
  
    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>Xin chào, admin</h1>
            </div>
            <div className="dashboard-container">
                <div className="menu-options">
                    <button onClick={() => handleNavigate('/manage-restaurant-info')} className="menu-item">
                        Quản lý thông tin nhà hàng
                    </button>
                    <button onClick={() => handleNavigate('/manage-promotions')} className="menu-item">
                        Quản lý ưu đãi
                    </button>
                    <button onClick={() => handleNavigate('/manage-menu')} className="menu-item">
                        Quản lý thực đơn
                    </button>
                    <button onClick={() => handleNavigate('/view-sales-reports')} className="menu-item">
                        Xem báo cáo doanh thu
                    </button>
                    <button onClick={() => handleNavigate('/register-employee-account')} className="menu-item">
                        Đăng ký tài khoản cho nhân viên
                    </button>
                    <button onClick={() => handleNavigate('/manage-employees')} className="menu-item">
                        Quản lý nhân viên
                    </button>
                </div>
                <div className="image-section">
                    <img src="/assets/images/bt1.jpg" alt="Admin illustration" />
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
