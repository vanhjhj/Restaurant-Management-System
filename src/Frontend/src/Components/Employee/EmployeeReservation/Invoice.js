import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { isTokenExpired } from '../../../utils/tokenHelper.mjs';
import { refreshToken } from '../../../API/authAPI';
import style from './Invoice.module.css';
import { fetchOrderData, fetchOrderItemData } from '../../../API/EE_ReservationAPI';
import { getFoodItems } from '../../../API/MenuAPI';

function Invoice({ tableID, setShowInvoice }) {
    const { accessToken, setAccessToken } = useAuth();
    const [invoiceData, setInvoiceData] = useState();
    const [itemsData, setItemsData] = useState([]);
    const [menuData, setMenuData] = useState();
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
    const fetchData = async () => {
        const activeToken = await ensureActiveToken();
        try {
            const orderData = await fetchOrderData(activeToken, tableID);
            setInvoiceData(orderData);

            const itemData = await fetchOrderItemData(activeToken, orderData.id);
            setItemsData(itemData.results);

            const menu = await getFoodItems();
            setMenuData(menu.results);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
    },[])
    return (
        <div className={style['ctn']}>
            <div className={style['container']}>
                <div className={style['invoice-ctn']}>
                    <button className={style["close-modal"]} onClick={() => setShowInvoice(tableID, false)}>
                        &times;
                    </button>
                    <div className={style['row']}>
                        <div className={style['col-lg-6']}>
                            <div className={style['invoice-info-ctn']}>
                                <div className={style['invoice-info-title']}>
                                    <h2>Thông tin bàn số: {tableID}</h2>
                                </div>
                                
                                <div className={style['ordered-food-ctn']}>
                                    <h4>Danh sách các món ăn:</h4>
                                    <div className={style['table-food']}>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Tên món ăn</th>
                                                    <th>Số lượng</th>
                                                    <th>Trạng thái</th>
                                                    <th>Tổng tiền</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {itemsData.map(item => (
                                                    <tr>
                                                        <td>{item.id}</td>  
                                                        <td>{item.quantity}</td>
                                                        <td>status</td>
                                                        <td>{item.total}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                </div>
                                <div className={style['total-money-ctn']}>
                                    <h4>Tổng tiền:</h4>
                                </div>
                                <div className={style['btn-ctn']}>
                                    <button>Tạo hóa đơn</button>    
                                </div>
                            </div>
                        </div>
                        <div className={style['col-lg-6']}>
                            <div className={style['menu-info-ctn']}>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default Invoice;