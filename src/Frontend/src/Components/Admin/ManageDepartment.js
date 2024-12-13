import React, { useState } from 'react';
import style from './../../Style/AdminStyle/ManageDepartment.module.css';
import { useAuth } from '../Auth/AuthContext';

function ManageDepartment() {

    const { accessToken,setAccessToken } = useAuth();
    const refresh = localStorage.getItem('refreshToken');

    const [departments, setDepartments] = useState([]);
    const [newDepartment, setNewDepartment] = useState({ name: '', salary: '' });
    const [isEditing, setIsEditing] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDepartment((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddDepartment = () => {
        if (newDepartment.name && newDepartment.salary) {
            setDepartments([...departments, { ...newDepartment }]);
            setNewDepartment({ name: '', salary: '' });
        }
    };

    const handleDeleteDepartment = (index) => {
        setDepartments(departments.filter((_, i) => i !== index));
    };

    const handleEditDepartment = (index) => {
        setIsEditing(index);
        setNewDepartment(departments[index]);
    };

    const handleUpdateDepartment = () => {
        if (newDepartment.name && newDepartment.salary) {
            const updatedDepartments = departments.map((dept, i) =>
                i === isEditing ? newDepartment : dept
            );
            setDepartments(updatedDepartments);
            setNewDepartment({ name: '', salary: '' });
            setIsEditing(null);
        }
    };

    return (
        <div className={style["manage-department-container"]}>
            <h2>Quản lý bộ phận</h2>

            {departments.length === 0 ? (
                <p className={style["manager-department-announce"]}>Hiện tại chưa có bộ phận nào.</p>
            ) : (
                <table className="department-table">
                    <thead>
                        <tr>
                            <th>Tên bộ phận</th>
                            <th>Lương</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map((dept, index) => (
                            <tr key={index}>
                                <td>{dept.name}</td>
                                <td>{dept.salary}</td>
                                <td>
                                    <button onClick={() => handleEditDepartment(index)}>Sửa</button>
                                    <button onClick={() => handleDeleteDepartment(index)}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div className={style["add-edit-form"]}>
                <h3>{isEditing !== null ? 'Sửa bộ phận' : 'Thêm bộ phận mới'}</h3>
                <input
                    type="text"
                    name="name"
                    value={newDepartment.name}
                    onChange={handleInputChange}
                    placeholder="Tên bộ phận"
                />
                <input
                    type="number"
                    name="salary"
                    value={newDepartment.salary}
                    onChange={handleInputChange}
                    placeholder="Lương"
                />
                {isEditing !== null ? (
                    <button onClick={handleUpdateDepartment}>Cập nhật</button>
                ) : (
                    <button onClick={handleAddDepartment}>Thêm mới</button>
                )}
            </div>
        </div>
    );
}

export default ManageDepartment;
