// src/Components/PurchaseHistory.js
import React, { useEffect, useState } from 'react';
import style from '../../Style/CustomerStyle/PurchaseHistory.module.css';

function PurchaseHistory() {
    const [historyData, setHistoryData] = useState([]);

    // Simulate fetching data from an API
    useEffect(() => {
        // Replace with actual API call
        const fetchData = async () => {
            // Placeholder data
            const data = [
                { date: '2023-11-01', orderId: '12345', amount: '500,000 VND', status: 'Hoàn thành', details: 'Chi tiết' },
                { date: '2023-11-05', orderId: '67890', amount: '750,000 VND', status: 'Đang xử lý', details: 'Chi tiết' },
                // Add more rows as needed
            ];
            setHistoryData(data);
        };

        fetchData();
    }, []);

    return (
        <div className="history-container">
            <h2>Lịch sử mua hàng</h2>
            <table className="history-table">
                <thead>
                    <tr>
                        <th>Ngày đặt</th>
                        <th>Mã hóa đơn</th>
                        <th>Thành tiền</th>
                        <th>Tình trạng</th>
                        <th>Chi tiết</th>
                    </tr>
                </thead>
                <tbody>
                    {historyData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.date}</td>
                            <td>{item.orderId}</td>
                            <td>{item.amount}</td>
                            <td>{item.status}</td>
                            <td><button className="details-button">Xem</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PurchaseHistory;
