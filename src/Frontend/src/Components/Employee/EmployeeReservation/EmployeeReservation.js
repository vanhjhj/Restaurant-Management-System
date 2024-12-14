import React, { useEffect, useState } from 'react';
import style from './EmployeeReservation.module.css';
import { MdTableRestaurant  } from "react-icons/md"; // Sử dụng icon chỉnh sửa từ react-icons
import { fetchTablesData, fetchReservationData, assignTableAPI } from '../../../API/EE_ReservationAPI';
import { useAuth } from '../../Auth/AuthContext';
import { isTokenExpired } from '../../../utils/tokenHelper.mjs';
import { refreshToken } from '../../../API/authAPI';
import TableIcon from './tableIcon';

function EmployeeReservation() {
    const { accessToken, setAccessToken } = useAuth();
    const [ tables, setTables ] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [searchStatus, setSearchStatus] = useState('All');
    const [inputTable, setInputTable] = useState({ id: null, value: "" });

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

    const getTableColor = (status) => {
        if (status === 'A') {
            return '#000000';
        }
        else if (status === 'R') {
            return '#FFC107';
        }
        else if (status === 'S') {
            return '#007BFF';
        }
        else if (status === 'D') {
            return '#28A745';
        }
    }

    const checkReservationStatus = (status) => {
        if (status === 'P') {
            return 'yellow';
        }
        else if (status === 'A') {
            return 'blue';
        }
        else if (status === 'C') {
            return 'red';
        }
        else if (status === 'D') {
            return 'green';
        }
    }

    useEffect(() => {
        const loadData = async () => {
            const activeToken = await ensureActiveToken();
            try {
                const tablesData = await fetchTablesData(activeToken);
                console.log(tablesData.results);
                setTables(tablesData.results);

                const reservationsData = await fetchReservationData(activeToken);
                console.log(reservationsData.results);
                setReservations(reservationsData.results);
                setReservations(reservationsData.results.map((reser) => ({
                    ...reser,
                    isEditing: false,
                })))
            }
            catch (error) {
                console.log(error);
            }
        };
        loadData();
    }, [reservations.reduce((acc, item) => acc + item.table, 0)]);

    const handleInputTableData = (id, value) => {
        setReservations((preReser) =>
            preReser.map((r) => 
                r.id === id ? {...r, table: value} : r
            )
        );
    }

    const handleEdit = (id) => {
        setReservations((preReser) =>
            preReser.map((r) =>
                r.id === id ? { ...r, isEditing: true } : r)
        );
    }

    const handleSave = () => {
        console.log(inputTable.id, inputTable.value);
        const hasIdInTablesData = () => {
            return tables.some((table) => table.id === inputTable.value);
        };
        const assignTable = async () => {
            if (!hasIdInTablesData) {
                return;
            }
            const activeToken = await ensureActiveToken();
            try {
                const result = await assignTableAPI(activeToken, inputTable.id, inputTable.value);
                setReservations((preReser) =>
                    preReser.map((r) =>
                        r.id === inputTable.id ? { ...r,table:inputTable.value, isEditing: false } : r)
                );
            }
            catch (error) {
                console.error(error);
            }
        }
        assignTable();
    }

    const filterReservation = (r, name, status) => {
        if (status == 'All') return r.guest_name.toLowerCase().includes(name.toLowerCase());
        return r.guest_name.toLowerCase().includes(name.toLowerCase()) && r.status === status;
    };

    const reservationFilered = reservations.filter(r => filterReservation(r, searchName, searchStatus));

    return (
        <div className={style['EER-container']}>
            <div className={style['body-EER']}> 
                <div className={style['sidebar-container']}>
                    <div className={style['container']}>
                        <div className={style['row']}>
                            <div className={style['col-lg-12']}>
                                <div className={style["section-title"]}>
                                    <h2>Danh sách các phiếu đặt</h2>
                                </div>
                            </div>
                        </div>
                        <div className={style["search-row"]}>
                            <div className={style['col-lg-12']}>
                                <div className={style['search-cus']}>
                                    <input type='text'  
                                        placeholder="Tìm theo tên..."
                                        value={searchName}
                                        onChange={e => setSearchName(e.target.value) }
                                        className={style['input-search-cus']} />
                                    <button type="button" className={style["input-search-btn"]}>
                                        <i className="fas fa-search"></i>
                                    </button>
                                </div>
                            </div>
                        </div>    
                        {/* <div className={style["status-search-row"]}>
                            <div className={style["row"]}>
                                <div className={style['col-lg-12']}>
                                    <div className={style["status-search"]}>
                                        <ul>
                                          <li key ={0}>
                                            <button
                                                  onClick={() => setSearchStatus('All')}
                                                  className={style['status-search-btn'] + ' ' + style[searchStatus === 'All' ? 'active' : '']}
                                                >
                                                  All
                                            </button>
                                          </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        <div className={style['row']}>
                            {reservationFilered.map(r => (
                                <div key={r.id} className={style['col-lg-12']}>
                                    <div className={style['reservation-info']}>
                                        <div className={style[checkReservationStatus(r.status)]}>
                                            <h5>Mã phiếu đặt: {r.id}</h5> 
                                        </div>
                                        <p>Tên khách hàng: {r.guest_name}</p>
                                        <p>Số điện thoại: {r.phone_number}</p>
                                        <p>Thời gian: {r.time}</p>
                                        <p>Ghi chú: {r.note}</p>
                                        <div>
                                            <p className={style['input-table']}>Bàn số:</p>
                                            {r.isEditing ? (
                                                <input
                                                    type='text'
                                                    value={r.isEditing ? inputTable.value : r.table}
                                                    onChange={(e) => setInputTable({ id: r.id,value: e.target.value })}
                                                    autoFocus
                                                />)
                                                : (
                                                    <span>{r.table || ''}</span>
                                                )}
                                            <button onClick={()=>r.isEditing ? handleSave(r.id) : handleEdit(r.id)}>
                                                    {r.isEditing ? 'Save' : 'Edit'}
                                            </button>
                                        </div>
                                        <div>
                                            {r.status === 'A' && <button onClick={handleDoneReservation}>Done</button>} 
                                            {r.status !== 'D' && <button onClick={handleCancelReservation}>Cancel</button>}
                                        </div>
                                    
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                    </div>
                </div> 
                <div className={style['Table-container']}>
                    <div className={style['container']}>
                        <div className={style['row']}>
                            <div className={style['col-lg-12']}>
                                <div className={style["section-title"]}>
                                    <h2>Danh sách các bàn</h2>
                                </div>
                            </div>
                        </div>
                        <div className={style['table-info-ctn']}>
                            <div className={style['row']}>
                                {tables.map(table => (
                                    <div key={table.id} className={style['col-lg-2']}>
                                        <div className={style['table-info']}>
                                            <TableIcon w={64} h={64} c={getTableColor(table.status)} />
                                            <p>Bàn số: {table.id}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}

export default EmployeeReservation;