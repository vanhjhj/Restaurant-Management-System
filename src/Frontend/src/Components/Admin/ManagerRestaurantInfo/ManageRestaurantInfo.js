// src/Components/ManageRestaurantInfo.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManageRestaurantInfo.css';

function ManageRestaurantInfo() {
    const navigate = useNavigate();
    const [restaurantInfo, setRestaurantInfo] = useState({
        name: '',
        phone: '',
        address: '',
        info: '',
        openTime: '',
        closeTime: '',
    });

    // Fetch current restaurant info when component mounts
    useEffect(() => {
        async function fetchRestaurantInfo() {
            try {
                const response = await fetch('/api/restaurant-info');
                const data = await response.json();
                setRestaurantInfo(data);
            } catch (error) {
                console.error('Error fetching restaurant info:', error);
            }
        }
        fetchRestaurantInfo();
    }, []);

    // Handle form change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setRestaurantInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    // Submit updated restaurant info
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/restaurant-info', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(restaurantInfo),
            });
            if (response.ok) {
                alert('Thông tin nhà hàng đã được cập nhật.');
            } else {
                alert('Lỗi khi cập nhật thông tin.');
            }
        } catch (error) {
            console.error('Error updating restaurant info:', error);
        }
    };

    return (
        <div className="manage-restaurant-info">
            <h2>Quản lý thông tin của nhà hàng</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Tên nhà hàng</label>
                    <input
                        type="text"
                        name="name"
                        value={restaurantInfo.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Số điện thoại</label>
                    <input
                        type="text"
                        name="phone"
                        value={restaurantInfo.phone}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Địa chỉ</label>
                    <input
                        type="text"
                        name="address"
                        value={restaurantInfo.address}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Thông tin nhà hàng</label>
                    <textarea
                        name="info"
                        value={restaurantInfo.info}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Giờ mở cửa</label>
                    <input
                        type="time"
                        name="openTime"
                        value={restaurantInfo.openTime}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Giờ đóng cửa</label>
                    <input
                        type="time"
                        name="closeTime"
                        value={restaurantInfo.closeTime}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="save-button">Lưu thay đổi</button>
            </form>
        </div>
    );
}

export default ManageRestaurantInfo;
