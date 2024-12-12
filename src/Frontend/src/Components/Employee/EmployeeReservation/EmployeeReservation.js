import React, { useEffect, useState } from 'react';
import style from './EmployeeReservation.module.css';
import { MdTableRestaurant  } from "react-icons/md"; // Sử dụng icon chỉnh sửa từ react-icons
import { fetchTablesData, fetchReservationData } from '../../../API/EE_ReservationAPI';
import { useAuth } from '../../Auth/AuthContext';
import { isTokenExpired } from '../../../utils/tokenHelper.mjs';
import { refreshToken } from '../../../API/authAPI';


function EmployeeReservation() {
    const { accessToken, setAccessToken } = useAuth();
    const [ tables, setTables ] = useState([]);
    const [reservations, setReservations] = useState([]);

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
            }
            catch (error) {
                console.log(error);
            }
        };
        loadData();
    }, []);

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
                            <div className={style['row']}>
                                {reservations.map(r => (
                                    <div key={r.id} className={style['col-lg-12']}>
                                        <div className={style['reservation-info']}>
                                            <div className={style[checkReservationStatus(r.status)]}>
                                                <h5>Mã phiếu đặt: {r.id}</h5> 
                                            </div>
                                            <p>Tên khách hàng: {r.guest_name}</p>
                                            <p>Số điện thoại: {r.phone_number}</p>
                                            <p>Ngày: {r.date}</p>   
                                            <p>Thời gian: {r.time}</p>
                                            <p>Ghi chú: {r.note}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
                        <div className={style['row']}>
                            {tables.map(table => (
                                <div key={table.id} className={style['col-lg-2']}>
                                    <div className={style['table-info']}>
                                        <MdTableRestaurant size={70} color="black" />
                                        <p>Bàn số: {table.id}</p>
                                    </div>
                                </div>
                            ))}
                            
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        
    )
}

export default EmployeeReservation;