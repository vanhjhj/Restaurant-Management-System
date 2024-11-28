// src/Components/ManageEmployees.js
import React from 'react';
import './ManageEmployees.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

function ManageEmployees() {
    return (
        <div className="manage-employees">
            <div className="header">
                <h2>Quản lý nhân viên</h2>
            </div>
            <h3>Danh sách nhân viên hiện tại</h3>
            <table className="employee-table">
                <thead>
                    <tr>
                        <th>Mã nhân viên</th>
                        <th>Họ và tên</th>
                        <th>Ngày sinh</th>
                        <th>Số điện thoại</th>
                        <th>Địa chỉ</th>
                        <th>Bộ phận</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Dummy data for illustration */}
                    {[...Array(8)].map((_, index) => (
                        <tr key={index}>
                            <td>Text</td>
                            <td>Text</td>
                            <td>Text</td>
                            <td>Text</td>
                            <td>Text</td>
                            <td>Text</td>
                            <td className="action-buttons">
                                <button className="edit-button">
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button className="delete-button">
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="actions">
                <button className="add-employee-button">
                    Thêm nhân viên mới <FontAwesomeIcon icon={faPlus} />
                </button>
                <button className="save-button">Lưu thay đổi</button>
            </div>
        </div>
    );
}

export default ManageEmployees;
