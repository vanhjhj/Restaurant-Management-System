import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate để điều hướng
import style from './../../../Style/AdminStyle/ManageTable.module.css';
import { GetTable, DeleteTable } from '../../../API/AdminAPI';
import { useAuth } from '../../Auth/AuthContext';
import { isTokenExpired } from '../../../utils/tokenHelper.mjs';
import { refreshToken } from '../../../API/authAPI';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'; // Import icons
import TableIcon from './../../Employee/EmployeeReservation/tableIcon'; // Import TableIcon component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ModalGeneral } from '../../ModalGeneral';
function TableManagement() {
    const { accessToken, setAccessToken } = useAuth();
    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng
    const [tables, setTables] = useState([]);
    const [modal, setModal] = useState({
        isOpen: false,
        text: "",
        type: "", // "confirm" hoặc "success"
        onConfirm: null, // Hàm được gọi khi xác nhận
    });

    // Ensure token is valid
    const ensureActiveToken = async () => {
        let activeToken = accessToken;
        const refresh = localStorage.getItem('refreshToken');
        if (!accessToken || isTokenExpired(accessToken)) {
            const refreshed = await refreshToken(refresh);
            activeToken = refreshed.access;
            setAccessToken(activeToken);
        }
        return activeToken;
    };

    // Fetch table data
    const fetchData = async () => {
        const activeToken = await ensureActiveToken();
        try {
            const tablesData = await GetTable(activeToken);
            setTables(tablesData.results);
        } catch (error) {
            console.error('Error fetching table data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Edit an existing table
    const handleEditTable = async (id) => {
        setModal({ isOpen: false });
        navigate(`/edit-table/${id}`);
    };

    // Delete a table
    const handleDeleteTable = async (id) => {
        setModal({
            isOpen: true,
            text: "Bạn có chắc chắn muốn xóa bàn này không?",
            type: "confirm",
            onConfirm: async () => {
                console.log("Confirmed delete!");
                setModal({ isOpen: false });
                try {
                    const activeToken = await ensureActiveToken();
                    await DeleteTable(id, activeToken);
                    setTables(tables.filter((dept) => dept.id !== id));
                    setModal({
                        isOpen: true,
                        text: "Xóa bàn thành công!",
                        type: "success",
                    });
                    await fetchData();
                } catch (error) {
                    console.error("Error deleting Table:", error);
                    setModal({
                        isOpen: true,
                        text: "Không thể xóa bàn. Vui lòng thử lại sau.",
                        type: "error",
                    });
                }
            },
        });
    };

    // Handle "Thêm bàn mới" button click
    const handleAddTableClick = () => {
        navigate('/add-table'); // Chuyển đến trang thêm bàn
    };

    return (
        <div className={style['TableManagement-container']}>
            {/* Header Section */}
            <div className={style['header']}>
                <h2>Quản lý bàn</h2>
            </div>
            <div className={style['header-controls']}>
                <p>Tổng số bàn: {tables.length}</p>
                <button className={style['add-table-btn']}onClick={handleAddTableClick}>
                    Thêm bàn mới <FontAwesomeIcon icon={faPlus} />
                </button>
            </div>
            
            <div className={style['content']}>
                {tables.length === 0 ? (
                    <p className={style['no-tables']}>Hiện tại chưa có bàn nào.</p>
                ) : (
                    // Table List
                    <div className={style['table-list']}>
                        {tables.map((table) => (
                            <div key={table.id} className={style['table-item']}>
                                <TableIcon
                                    w={64}
                                    h={64}
                                    c={
                                        table.status === 'A'
                                            ? 'green'
                                            : table.status === 'R'
                                            ? 'yellow'
                                            : table.status === 'OP'
                                            ? 'blue'
                                            :table.status==='OFS'
                                            ? 'gray'
                                            : 'black'
                                    }
                                />
                                <p>Bàn số: {table.id}</p>
                                <p>Số ghế: {table.number_of_seats}</p>
                                <p>
                                    Trạng thái:{" "}
                                    {table.status === 'A'
                                        ? 'Trống'
                                        : table.status === 'R'
                                        ? 'Đang đặt'
                                        : table.status === 'OP'
                                        ? 'Đang phục vụ'
                                        :table.status==='OFS'
                                        ? 'Hoàn tất'
                                        : 'Không xác định'
                                    }
                                </p>
                                <div className={style['table-actions']}>
                                    <button className={style['table-actions-edit']} onClick={() => handleEditTable(table.id)}>
                                        <AiOutlineEdit size={20} /> Chỉnh sửa
                                    </button>
                                    <button className={style['table-actions-delete']} onClick={() => handleDeleteTable(table.id)}>
                                        <AiOutlineDelete size={20} /> Xóa
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {modal.isOpen && (
                <ModalGeneral 
                    isOpen={modal.isOpen} 
                    text={modal.text} 
                    type={modal.type} 
                    onClose={() => setModal({ isOpen: false })} 
                    onConfirm={modal.onConfirm}
                />
            )}
        </div>
    );
}

export default TableManagement;
