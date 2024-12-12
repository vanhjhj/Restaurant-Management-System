import React, { useEffect, useState } from 'react';
import style from './EmployeeReservation.module.css'
import { MdTableRestaurant  } from "react-icons/md"; // Sử dụng icon chỉnh sửa từ react-icons
import { fetchTablesData } from '../../../API/EE_ReservationAPI';
import { useAuth } from '../../Auth/AuthContext';
import { isTokenExpired } from '../../../utils/tokenHelper.mjs';
import { refreshToken } from '../../../API/authAPI';
import SideBarReservation from './SideBarReservation';
import TableWithChairsTopView from './TableIcon';


function EmployeeReservation() {
    const { accessToken, setAccessToken } = useAuth();
    const [ tables, setTables ] = useState([
        {
            "id": 1,
            "number_of_seats": 4,
            "status": "A"
        },
        {
            "id": 2,
            "number_of_seats": 4,
            "status": "R"
        },
        {
            "id": 3,
            "number_of_seats": 4,
            "status": "OP"
        },
        {
            "id": 4,
            "number_of_seats": 4,
            "status": "OFS"
        },
        {
            "id": 5,
            "number_of_seats": 4,
            "status": "A"
        },
        {
            "id": 6,
            "number_of_seats": 4,
            "status": "A"
        }
    ]);

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

    // useEffect(() => {
    //     const loadData = async () => {
    //         const activeToken = await ensureActiveToken();
    //         try {
    //             const data = await fetchTablesData(activeToken);
    //             console.log(data.results);
    //             setTables(data.results);
    //         }
    //         catch (error) {
    //             console.log(error);
    //         }
    //     };
    //     loadData();
    // }, []);

    return (
        <div className={style['EER-container']}> 
            <div className={style['sidebar-container']}>
                <div className={style['container']}>
                    <div className={style['row']}>
                        <div className={style['col-lg-12']}>
                            <div className={style["section-title"]}>
                                <h2>Danh sách các phiếu đặt</h2>
                                <p>Some text to enable scrolling.. Lorem ipsum dolor sit amet, illum definitiones no quo, maluisset concludaturque et eum, altera fabulas ut quo. Atqui causae gloriatur ius te, id agam omnis evertitur eum. Affert laboramus repudiandae nec et. Inciderint efficiantur his ad. Eum no molestiae voluptatibus.</p>
                                <p>Some text to enable scrolling.. Lorem ipsum dolor sit amet, illum definitiones no quo, maluisset concludaturque et eum, altera fabulas ut quo. Atqui causae gloriatur ius te, id agam omnis evertitur eum. Affert laboramus repudiandae nec et. Inciderint efficiantur his ad. Eum no molestiae voluptatibus.</p>
                                <p>Some text to enable scrolling.. Lorem ipsum dolor sit amet, illum definitiones no quo, maluisset concludaturque et eum, altera fabulas ut quo. Atqui causae gloriatur ius te, id agam omnis evertitur eum. Affert laboramus repudiandae nec et. Inciderint efficiantur his ad. Eum no molestiae voluptatibus.</p>
                                <p>Some text to enable scrolling.. Lorem ipsum dolor sit amet, illum definitiones no quo, maluisset concludaturque et eum, altera fabulas ut quo. Atqui causae gloriatur ius te, id agam omnis evertitur eum. Affert laboramus repudiandae nec et. Inciderint efficiantur his ad. Eum no molestiae voluptatibus.</p>
                            </div>
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
    )
}

export default EmployeeReservation;