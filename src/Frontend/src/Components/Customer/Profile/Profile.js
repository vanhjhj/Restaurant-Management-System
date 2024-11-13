// src/Components/Profile.js
import React, { useState } from 'react';
import './Profile.css';

function Profile() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const handleSaveChanges = () => {
        // Logic to save the updated profile information (e.g., API call)
        alert('Thông tin của bạn đã được lưu!');
    };

    return (
        <div className="profile-container">
            <div className="profile-image">
                <img src="/assets/images/profile-bg.jpg" alt="Profile Background" />
            </div>
            <div className="profile-info">
                <h2>Thông tin của bạn</h2>
                <form>
                    <div className="form-group">
                        <label>Họ và tên:</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="Tên của bạn" 
                        />
                    </div>
                    <div className="form-group">
                        <label>Số điện thoại:</label>
                        <input 
                            type="text" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            placeholder="Số điện thoại của bạn" 
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Liên hệ:</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Email liên hệ của bạn" 
                        />
                    </div>
                    <button type="button" className="save-button" onClick={handleSaveChanges}>
                        Lưu thay đổi
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Profile;
