import React, { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { isTokenExpired } from "../../../utils/tokenHelper.mjs";
import { refreshToken } from "../../../API/authAPI";
import style from "./ExportInvoice.module.css";
import QRCodeGenerator from "../../Customer/QRReview";


function ExportInvoice({ setShow, foodData, invoiceData }) {
    const NumberWithSpaces = ({ number }) => {
        const formattedNumber = new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
          .format(number)
          .replace(/,/g, " ");
    
        return <p>{formattedNumber} .VNĐ</p>;
      };
    return (
        <div className={style['ctn']}>
            <div className={style['container']}>
                <div className={style['export-invoice-ctn']}>
                    <div className={style['row']}>
                        <div className={style['col-lg-12']}>
                            <div>
                                <h2>Hóa đơn</h2>    
                            </div>
                            <div className={style['order-food-ctn']}>
                                <h4>Danh sách các món ăn</h4>
                                <div className={style['table-food']}>
                                    <div className={style["my-row"] + ' ' + style['my-title-row']}>
                                        <ul>
                                            <li>Tên món ăn</li> 
                                            <li>Số lượng</li>   
                                            <li>Tổng tiền</li>
                                        </ul>
                                    </div>
                                    {foodData.map(item => (
                                        <div className={style['content-row-section']} key={item.id}>
                                            <article className={style["my-row"] + ' ' + style['my-content-row']}>
                                                <ul>
                                                    <li>{item.menu_item_details.name}</li>
                                                    <li>{item.quantity}</li>
                                                    <li>{item.total}</li>
                                                </ul>
                                            </article>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={style['total-money-ctn']}>
                                <div className={style['width-50']}>
                                    <div className={style['money-format']}>
                                        <label>Tổng tiền:</label>
                                            <NumberWithSpaces number={invoiceData.total_price}></NumberWithSpaces>
                                    </div>
                                    <div className={style['money-format']}>
                                        <label>Ưu đãi:</label>
                                        <NumberWithSpaces number={invoiceData.total_discount}></NumberWithSpaces>    
                                    </div>
                                    <div className={style['money-format'] +' ' + style['final_price']}>
                                        <label>Tổng thanh toán:</label>
                                        <NumberWithSpaces number={invoiceData.final_price}></NumberWithSpaces>    
                                    </div>
                                </div> 
                            </div>
                            <div>
                                <QRCodeGenerator invoiceID={invoiceData.id}></QRCodeGenerator>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExportInvoice