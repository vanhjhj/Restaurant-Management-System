import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './../../../Style/AdminStyle/ManageDepartment.module.css';
import { useAuth } from './../../Auth/AuthContext';
import { getDepartments, deleteDepartment } from '../../../API/AdminAPI';
import { isTokenExpired } from '../../../utils/tokenHelper.mjs';
import { refreshToken } from '../../../API/authAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

function ManageDepartment() {
    const [departments, setDepartments] = useState([]); // Danh sách bộ phận
    const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
    const [error, setError] = useState(null); // Trạng thái lỗi
    const { accessToken, setAccessToken } = useAuth();
    const navigate = useNavigate();

    // Hàm đảm bảo token hợp lệ
    const ensureActiveToken = async () => {
        let activeToken = accessToken;
        if (isTokenExpired(accessToken)) {
            try {
                const refreshed = await refreshToken(localStorage.getItem('refreshToken'));
                activeToken = refreshed.access;
                setAccessToken(activeToken);
            } catch (error) {
                console.error('Error refreshing token:', error);
                navigate('/login'); // Điều hướng đến login nếu refresh thất bại
                throw error;
            }
        }
        return activeToken;
    };

    // Hàm lấy danh sách bộ phận
    const fetchDepartments = async () => {
        setLoading(true);
        setError(null); // Xóa lỗi cũ
        try {
            const activeToken = await ensureActiveToken();
            const data = await getDepartments(activeToken);
            console.log("Dữ liệu trả về từ API:", data); // Log kiểm tra dữ liệu
            if (data && Array.isArray(data.results)) {
                setDepartments(data.results); // Gán danh sách từ `results`
            } else {
                throw new Error("Dữ liệu API không hợp lệ");
            }
        } catch (error) {
            console.error('Error fetching departments:', error);
            setError('Không thể tải danh sách bộ phận. Vui lòng thử lại sau.');
            setDepartments([]); // Đặt mảng rỗng nếu lỗi xảy ra
        } finally {
            setLoading(false);
        }
    };

    //hàm chuyển hướng qua trang chỉnh sửa
    const handleEditDepartment=async(id) =>{
        navigate(`/edit-department/${id}`)
    };

    // Hàm xóa bộ phận với xác nhận
    const handleDeleteDepartment = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa bộ phận này không?")) return;
        try {
            const activeToken = await ensureActiveToken();
            await deleteDepartment(id, activeToken);
            setDepartments(departments.filter((dept) => dept.id !== id));
            alert('Xóa bộ phận thành công!');
        } catch (error) {
            console.error('Error deleting department:', error);
            alert('Không thể xóa bộ phận. Vui lòng thử lại sau.');
        }
    };

    // Tự động tải danh sách bộ phận khi component được render
    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            try {
                const activeToken = await ensureActiveToken();
                const data = await getDepartments(activeToken, { signal: controller.signal });
                console.log("Dữ liệu trả về từ API:", data); // Log kiểm tra dữ liệu
                if (data && Array.isArray(data.results)) {
                    setDepartments(data.results); // Gán danh sách từ `results`
                } else {
                    throw new Error("Dữ liệu API không hợp lệ");
                }
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Error fetching departments:", error);
                    setError('Không thể tải danh sách bộ phận. Vui lòng thử lại sau.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        return () => controller.abort(); // Dọn dẹp khi component bị hủy
    }, [accessToken]);

    return (
        <div className={style["manage-department-container"]}>
            <h2 className={style["manage-department-header"]}>Quản lý bộ phận</h2>
        
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : departments.length === 0 ? (
                <div>
                    <p>Hiện tại chưa có bộ phận nào!</p>
                    <div className={style["button-container"]}>
                        <button 
                            className={style["manage-department-button"]} 
                            onClick={() => navigate('/add-department')}
                        >
                            Thêm bộ phận
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <table className={style["department-table"]}>
                        <thead>
                            <tr>
                                <th>Tên bộ phận</th>
                                <th>Lương</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map((dept) => (
                                <tr key={dept.id}>
                                    <td>{dept.name}</td>
                                    <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dept.salary)}</td>
                                    <td>
                                    <button className={style["edit-button"]} onClick={() => handleEditDepartment(dept.id)}>
                                        Sửa <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button className={style["delete-button"]} onClick={() => handleDeleteDepartment(dept.id)}>
                                        Xóa  <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
        
                    <div className={style["button-container"]}>
                        <button 
                            className={style["manage-department-button"]} 
                            onClick={() => navigate('/add-department')}
                        >
                            Thêm bộ phận
                        </button>
                    </div>
                </>
            )}
    </div>
    
    );
}

export default ManageDepartment;
