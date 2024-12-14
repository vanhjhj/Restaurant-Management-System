import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDepartment } from '../../../API/AdminAPI';
import { refreshToken } from '../../../API/authAPI';
import { useAuth } from './../../Auth/AuthContext';
import { isTokenExpired } from '../../../utils/tokenHelper.mjs';
import style from './../../../Style/AdminStyle/AddDepartment.module.css';


function AddDepartment() {
    const [newDepartment, setNewDepartment] = useState({ name: '', salary: '' });
    const [loading, setLoading] = useState(false); // Trạng thái đang xử lý
    const [error, setError] = useState(null); // Trạng thái lỗi
    const { accessToken, setAccessToken } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDepartment((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const ensureActiveToken = async () => {
        let activeToken = accessToken;
        if (isTokenExpired(accessToken)) {
            try {
                const refreshed = await refreshToken(localStorage.getItem('refreshToken'));
                activeToken = refreshed.access;
                setAccessToken(activeToken);
            } catch (error) {
                console.error('Error refreshing token:', error);
                navigate('/login');
                throw error;
            }
        }
        return activeToken;
    };

    const handleAddDepartment = async () => {
        setLoading(true);
        setError(null); // Xóa lỗi cũ
        try {
            const activeToken = await ensureActiveToken();
            await addDepartment(newDepartment, activeToken);
            alert('Thêm thành công!');
            navigate('/manage-department');
        } catch (error) {
            console.error('Error adding department:', error);
            setError('Không thể thêm bộ phận. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={style["add-department-container"]}>
            <h2 className={style["add-department-header"]}>Thêm bộ phận</h2>
            {error && <p className={style["error-message"]}>{error}</p>} {/* Hiển thị lỗi nếu có */}
            <input
                type="text"
                name="name"
                value={newDepartment.name}
                onChange={handleInputChange}
                placeholder="Tên bộ phận"
                required
            />
            <input
                type="number"
                name="salary"
                value={newDepartment.salary}
                onChange={handleInputChange}
                placeholder="Lương"
                required
            />
            <button 
                className={style["add-department-button"]} 
                onClick={handleAddDepartment} 
                disabled={loading}
            >
                {loading ? 'Đang thêm...' : 'Thêm mới'}
            </button>
        </div>
    );
}
export default AddDepartment;