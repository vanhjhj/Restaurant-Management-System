// src/Components/ManageMenu.js
import React from 'react';
import './ManageMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

function ManageMenu() {
    const dishes = [
        { id: 1, name: "Manam Tiste", imageUrl: "/assets/images/dish1.jpg" },
        { id: 2, name: "Aut Luia", imageUrl: "/assets/images/dish2.jpg" },
        { id: 3, name: "Est Eligendi", imageUrl: "/assets/images/dish3.jpg" },
        // Add more dishes as necessary
    ];

    return (
        <div className="manage-menu">
            <div className="header">
                <h2>Quản lý thực đơn</h2>
            </div>
            <h3>Thực đơn hiện có</h3>
            <div className="dishes-container">
                {dishes.map((dish) => (
                    <div key={dish.id} className="dish-item">
                        <img src={dish.imageUrl} alt={dish.name} className="dish-image" />
                        <p className="dish-name">{dish.name}</p>
                        <button className="edit-button">
                            <FontAwesomeIcon icon={faEdit} /> Chỉnh sửa
                        </button>
                        <button className="delete-button">
                            <FontAwesomeIcon icon={faTrash} /> Xóa
                        </button>
                    </div>
                ))}
            </div>
            <div className="actions">
                <button className="add-dish-button">
                    Tạo món ăn mới <FontAwesomeIcon icon={faPlus} />
                </button>
                <button className="save-button">Lưu thay đổi</button>
            </div>
        </div>
    );
}

export default ManageMenu;
