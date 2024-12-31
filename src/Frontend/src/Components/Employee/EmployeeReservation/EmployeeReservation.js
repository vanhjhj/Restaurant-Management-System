import React, { useEffect, useState } from 'react';
import style from './EmployeeReservation.module.css';
import { MdTableRestaurant  } from "react-icons/md"; // Sử dụng icon chỉnh sửa từ react-icons
import { fetchTablesData, fetchReservationData, assignTableAPI, markDoneReservationAPI, markCancelReservationAPI, unsignTableAPI, createOrder } from '../../../API/EE_ReservationAPI';
import { useAuth } from '../../Auth/AuthContext';
import { isTokenExpired } from '../../../utils/tokenHelper.mjs';
import { refreshToken } from '../../../API/authAPI';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'; // Import biểu tượng chỉnh sửa
import TableIcon from './tableIcon';
import Invoice from './Invoice'

function EmployeeReservation() {
    const { accessToken, setAccessToken } = useAuth();
    const [ tables, setTables ] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [searchStatus, setSearchStatus] = useState('All');
    const [inputTable, setInputTable] = useState({ id: null, value: "" });
    const [errorMessage, setErrorMessage] = useState();

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

    const fetchData = async () => {
        const activeToken = await ensureActiveToken();
        try {
            const tablesData = await fetchTablesData(activeToken);
            setTables(tablesData.results.map((table) => ({
                ...table,
                isShowInvoice: false,
            })));

            const reservationsData = await fetchReservationData(activeToken);
            setReservations(reservationsData.results.map((reser) => ({
                ...reser,
                isEditing: false,
            })))
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData()
    }, []);

    const handleEdit = (id) => {
        setReservations((preReser) =>
            preReser.map((r) =>
                r.id === id ? { ...r, isEditing: true } : r)
        );
    }

    const handleCancelEdit = (id) => {
        setInputTable({ id: null, value: "" });
        setReservations((preReser) =>
            preReser.map((r) =>
                r.id === id ? { ...r, isEditing: false } : r)
        );
        setErrorMessage();
    }

    const handleSave = () => {
        const hasIdInTablesData = () => {
            return tables.some((table) => table.id == inputTable.value && table.status === 'A');
        };
        const assignTable = async () => {
            if (!hasIdInTablesData()) {
                setErrorMessage('Lỗi: Bàn trên không tồn tại hoặc không thể gán.')
                return;
            }
            const activeToken = await ensureActiveToken();
            try {
                const result = await assignTableAPI(activeToken, inputTable.id, inputTable.value);
                fetchData();
                setInputTable({ id: null, value: "" });
                setErrorMessage();
            }
            catch (error) {
                console.error(error);
            }
        }
        assignTable();
    }

    const handleEraseTable = async (id) => {
        const activeToken = await ensureActiveToken();
        try {
            const result = await unsignTableAPI(activeToken, id);
            fetchData();
            setInputTable({ id: null, value: "" });
        }
        catch (error) {
                console.error(error);
        }
    }

    const handleDoneReservation = async (id, tID) => {
        const activeToken = await ensureActiveToken();
        try {
            const result = await markDoneReservationAPI(activeToken, id);
            createOrder(accessToken, tID);
            fetchData();
            setInputTable({ id: null, value: "" });
            setErrorMessage();
        }
        catch (error) {
                console.error(error);
        }
    }

    const handleCancelReservation = async (id) => {
        const activeToken = await ensureActiveToken();
            try {
                const result = await markCancelReservationAPI(activeToken, id);
                fetchData();
                setInputTable({ id: null, value: "" });
                setErrorMessage();
            }
            catch (error) {
                    console.error(error);
        }
    }

    const filterReservation = (r, name, status) => {
        if (status == 'All') return r.guest_name.toLowerCase().includes(name.toLowerCase());
        return r.guest_name.toLowerCase().includes(name.toLowerCase()) && r.status === status;
    };

    const handleShowInvoice = (id, status) => {
        setTables((preTable) =>
            preTable.map((table) =>
                table.id === id ? { ...table, isShowInvoice: status } : table)
        );
        if (!status) fetchData();
    }

    const reservationFilered = reservations.filter(r => filterReservation(r, searchName, searchStatus));

    return (
        <div className={style['EER-container']}>
            <div className={style['body-EER']}> 
                <div className={style['sidebar-container']}>
                    <div className={style['container']}>
                        <div className={style['row']}>
                            <div className={style['col-lg-12']}>
                                <div className={style["section-r-title"]}>
                                    <h2>Danh sách các phiếu đặt</h2>
                                    <div className={style['status-reservation-info']}>
                                        <section className={style['section-reservation-info']}>
                                            <div className={style['my-square'] + ' ' + style['yellow']}></div>
                                            <p>Chờ</p>
                                        </section>
                                        <section className={style['section-reservation-info']}>
                                            <div className={style['my-square'] + ' ' + style['green'] }></div>
                                            <p>Gán</p>
                                        </section>
                                        <section className={style['section-reservation-info']}>
                                            <div className={style['my-square'] + ' ' + style['blue']}></div>
                                            <p>Xong</p>
                                        </section>
                                        <section className={style['section-reservation-info']}>
                                            <div className={style['my-square'] + ' ' + style['red']}></div>
                                            <p>Hủy</p>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={style["search-row"]}>
                            <div className={style['col-lg-12']}>
                                <div className={style['search-cus']}>
                                    <input type='text'  
                                        placeholder="Tìm theo tên..."
                                        value={searchName}
                                        onChange={e => setSearchName(e.target.value)}
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
                                        <p>Tên KH: {r.guest_name}</p>
                                        <p>Số điện thoại: {r.phone_number}</p>
                                        <p>Thời gian: {r.time}</p>
                                        <p>Ghi chú: {r.note}</p>
                                        <div className={style['']}>
                                                {errorMessage ? <p className={style['error-message']}>{errorMessage}</p> : <p></p>}
                                            </div>
                                        <div className={style['input-table-ctn']}>
                                            
                                            {r.isEditing ? (
                                                <div className={style['input-table-input']}>
                                                    <p className={style['input-table-text']}>Bàn số: </p>
                                                    <input
                                                    type='text'
                                                    value={r.isEditing ? inputTable.value : r.table}
                                                    onChange={(e) => setInputTable({ id: r.id,value: e.target.value })}
                                                    autoFocus
                                                />
                                                </div>
                                                    
                                            )
                                                : (
                                                    <p className={style['input-table-text']}>Bàn số: {r.table}</p>
                                                )}
                                            <div className={style['input-table-btn']}>
                                                <button className={style['input-table-edit-btn']} onClick={()=>r.isEditing ? handleSave(r.id) : handleEdit(r.id)}>
                                                        {r.isEditing ? 'Lưu' : <AiOutlineEdit size={20}/>}
                                                </button>
                                                <button className={style['input-table-erase-btn']} onClick={()=>r.isEditing ? handleCancelEdit(r.id) : handleEraseTable(r.id)}>
                                                        {r.isEditing ? 'Hủy' :  <AiOutlineDelete  size={20}/> }
                                                </button>
                                            </div>
                                            
                                        </div>
                                        <div className={style['status-btn-ctn']}>
                                            <button className={style['status-btn'] + ' ' + style[r.status === 'A' ? '' : 'inactive-btn']} onClick={() => {
                                                if (r.status === 'A') {
                                                    handleDoneReservation(r.id, r.table);
                                                }
                                            }}>Done</button>
                                            <button className={style['status-btn'] + ' ' + style[r.status !== 'D' && r.status !== 'C' ? '' : 'inactive-btn']} onClick={() => {
                                                if (r.status !== 'D' && r.status !== 'C') {
                                                    handleCancelReservation(r.id);
                                                }
                                            }}>Cancel</button>
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
                                    <div className={style['table-status-info']}>
                                        <section className={style['section-status-info']}>
                                            <TableIcon w={64} h={64} c={getTableColor('A')}></TableIcon>    
                                            <p>Bàn trống</p>
                                        </section>
                                        <section className={style['section-status-info']}>
                                            <TableIcon w={64} h={64} c={getTableColor('R')}></TableIcon>
                                            <p>Bàn đã được đặt</p>
                                        </section>
                                        <section className={style['section-status-info']}>
                                            <TableIcon w={64} h={64} c={getTableColor('S')}></TableIcon>   
                                            <p>Bàn đang phục vụ</p>
                                        </section>
                                        <section className={style['section-status-info']}>
                                            <TableIcon w={64} h={64} c={getTableColor('D')}></TableIcon>   
                                            <p>Bàn phục vụ xong</p>
                                        </section>
                                    </div>
                                     
                                </div>
                            </div>
                        </div>
                        <div className={style['table-info-ctn']}>
                            <div className={style['row']}>
                                {tables.map(table => (
                                    <div key={table.id} className={style['col-lg-2']}>
                                        <div className={style['table-info']} onClick={() => handleShowInvoice(table.id, !table.isShowInvoice)}>
                                            <TableIcon w={64} h={64} c={getTableColor(table.status)} />
                                            <p>Bàn số: {table.id}</p>
                                            <p>Số lượng ghế: {table.number_of_seats}</p>
                                        </div>
                                        {table.isShowInvoice && <Invoice tableID={table.id} setShowInvoice={handleShowInvoice}/>}
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