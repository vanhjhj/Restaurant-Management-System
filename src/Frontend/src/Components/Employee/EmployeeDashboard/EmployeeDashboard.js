import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeeDashboard.css';

function EmployeeDashboard() {
    const navigate = useNavigate();

    const handleOrderFood = () => {
        navigate('/order-food'); // Điều hướng đến trang Đặt Món
    };

    const handleCreateBill = () => {
        navigate('/create-bill'); // Điều hướng đến trang Tạo Hóa Đơn
    };

    return (
        <div className="employee-dashboard">
            <h1>Trang Nhân Viên</h1>
            <div className="dashboard-actions">
                <button className="action-button" onClick={handleOrderFood}>
                    Đặt Món
                </button>
                <button className="action-button" onClick={handleCreateBill}>
                    Tạo Hóa Đơn
                </button>
            </div>
        </div>
    );
}

export default EmployeeDashboard;
