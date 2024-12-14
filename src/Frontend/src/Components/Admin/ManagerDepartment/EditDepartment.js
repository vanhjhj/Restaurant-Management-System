import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateDepartment, getDepartments } from '../../../API/AdminAPI';
import { refreshToken } from '../../../API/authAPI';
import { useAuth } from './../../Auth/AuthContext';
import { isTokenExpired } from '../../../utils/tokenHelper.mjs';

function EditDepartment() {
    const { id } = useParams(); // Lấy ID từ URL
    const [department, setDepartment] = useState({ name: '', salary: '' });
    const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
    const [error, setError] = useState(null); // Trạng thái lỗi
    const { accessToken, setAccessToken } = useAuth();
    const navigate = useNavigate();

    // Đảm bảo token hợp lệ
    const ensureActiveToken = async () => {
        let activeToken = accessToken;
        if (isTokenExpired(accessToken)) {
            try {
                const refreshed = await refreshToken(localStorage.getItem('refreshToken'));
                activeToken = refreshed.access;
                setAccessToken(activeToken);
            } catch (error) {
                console.error('Error refreshing token:', error);
                navigate('/login'); // Điều hướng nếu refresh token thất bại
                throw error;
            }
        }
        return activeToken;
    };

    // Lấy thông tin bộ phận
    useEffect(() => {
        const fetchDepartment = async () => {
            setLoading(true);
            setError(null);
            try {
                const activeToken = await ensureActiveToken();
                const data = await getDepartments(activeToken);
                console.log("Dữ liệu trả về từ API:", data); // Log kiểm tra dữ liệu
                const departments = Array.isArray(data.results) ? data.results : [];
                const dept = departments.find((d) => d.id === parseInt(id));
                if (dept) {
                    setDepartment(dept);
                } else {
                    setError('Không tìm thấy bộ phận.');
                }
            } catch (error) {
                console.error('Error fetching department:', error);
                setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchDepartment();
    }, [id, accessToken]);

    // Xử lý thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDepartment((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Cập nhật thông tin bộ phận
    const handleUpdateDepartment = async () => {
        setError(null);
        if (!department.name || department.salary <= 0) {
            setError('Vui lòng nhập thông tin hợp lệ.');
            return;
        }
    
        // Đảm bảo dữ liệu không có giá trị null
        const updatedDepartment = {
            name: department.name.trim(),
            salary: String(department.salary), // Đảm bảo là chuỗi nếu cần
        };
    
        try {
            const activeToken = await ensureActiveToken();
            console.log("Dữ liệu gửi lên API PATCH:", updatedDepartment);
            await updateDepartment(id, updatedDepartment, activeToken);
            alert('Cập nhật thành công!');
            navigate('/manage-department');
        } catch (error) {
            console.error('Error updating department:', error.response?.data || error.message);
            setError('Không thể cập nhật thông tin. Vui lòng thử lại.');
        }
    };
    

    if (loading) {
        return <p>Đang tải dữ liệu...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div>
            <h2>Sửa Bộ Phận</h2>
            <input
                type="text"
                name="name"
                value={department.name}
                onChange={handleInputChange}
                placeholder="Tên bộ phận"
                required
            />
            <input
                type="number"
                name="salary"
                value={department.salary}
                onChange={handleInputChange}
                placeholder="Lương"
                required
            />
            <button onClick={handleUpdateDepartment}>Cập nhật</button>
        </div>
    );
}

export default EditDepartment;
