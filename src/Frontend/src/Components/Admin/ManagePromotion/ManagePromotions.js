// src/Components/ManagePromotions.js
import React, { useState, useEffect } from 'react';
import './ManagePromotions.css';

function ManagePromotions() {
    const [Promotions, setPromotions] = useState([]);

    useEffect(() => {
        // Fetch Promotions from API on component mount
        async function fetchPromotions() {
            try {
                const response = await fetch('/api/Promotions');
                const data = await response.json();
                setPromotions(data);
            } catch (error) {
                console.error('Error fetching Promotions:', error);
            }
        }
        fetchPromotions();
    }, []);

    const handleEdit = (id) => {
        // Edit discount logic
        console.log(`Edit discount with id: ${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`/api/Promotions/${id}`, { method: 'DELETE' });
            setPromotions(Promotions.filter(discount => discount.id !== id));
        } catch (error) {
            console.error('Error deleting discount:', error);
        }
    };

    const handleAddDiscount = () => {
        console.log('Navigate to add new discount page');
    };

    return (
        <div className="manage-Promotions">
            <button onClick={() => window.history.back()} className="back-button">← Back</button>
            <h2>Quản lý ưu đãi</h2>
            <div className="discount-cards">
                {Promotions.map(discount => (
                    <div key={discount.id} className="discount-card">
                        <img src={discount.imageUrl} alt={discount.title} className="discount-image" />
                        <p>{discount.description}</p>
                        <div className="button-group">
                            <button onClick={() => handleEdit(discount.id)} className="edit-button">Chỉnh sửa</button>
                            <button onClick={() => handleDelete(discount.id)} className="delete-button">Xóa</button>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={handleAddDiscount} className="add-discount-button">Tạo ưu đãi mới</button>
            <button className="save-changes-button">Lưu thay đổi</button>
        </div>
    );
}

export default ManagePromotions;
