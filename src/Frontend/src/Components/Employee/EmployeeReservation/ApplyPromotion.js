import React, { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { isTokenExpired } from "../../../utils/tokenHelper.mjs";
import { refreshToken } from "../../../API/authAPI";
import style from "./ApplyPromotion.module.css";
import { fetchValidPromotions } from "../../../API/PromotionAPI";
import {IoAdd, IoRemove} from 'react-icons/io5';

function ApplyPromotion({setShow}) {
      const { accessToken, setAccessToken } = useAuth();
    const [promotionData, setPromotionData] = useState([]);
    const [choosenPromotion, setChoosenPromotion] = useState([]);
    const ensureActiveToken = async () => {
        let activeToken = accessToken;
        const refresh = localStorage.getItem("refreshToken");
        if (!accessToken || isTokenExpired(accessToken)) {
          const refreshed = await refreshToken(refresh);
          activeToken = refreshed.access;
          setAccessToken(activeToken);
        }
        return activeToken;
      };
    const fetchData = async () => {
        try {
            const data = await fetchValidPromotions();
            console.log(data);
            setPromotionData(data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchData();
    }, [])
    
    const handleAddPromotion = (item) => {
        setChoosenPromotion([...choosenPromotion, item])
    }

    const handleRemovePromotion = (code) => {
        setChoosenPromotion(choosenPromotion.filter((item) => item.code != code));
    }

    return (
        <div className={style['ctn']}>
            <div className={style['container']}>
                <div className={style['promotion-ctn']}>
                    <div className={style['row']}>
                        <div className={style['col-lg-12']}>
                            <div className={style['promotion-list']}>
                                <h2>Khuyễn mãi</h2>
                                <p>Danh sách các khuyễn mãi</p>   
                                <div className={style['promotion-table']}>
                                    <div className={style['my-row'] + ' ' + style['my-title-row']}>
                                        <ul>
                                            <li className={style['my-col-1']}>Mã KH</li>   
                                            <li className={style['my-col-2']}>Tên khuyễn mãi</li>
                                            <li className={style['my-col-3']}>Loại</li>
                                            <li className={style['my-col-4']}>Ngày kết thúc</li>
                                            <li className={style['my-col-5']}>Điều kiện</li>
                                        </ul>
                                    </div>
                                    {promotionData.map(item => (
                                        <div className={style['my-row']} key={item.code}>
                                            <ul>
                                                <li className={style['my-col-1']}>{item.code}</li>   
                                                <li className={style['my-col-2']}>{item.title}</li>
                                                <li className={style['my-col-3']}>{item.type}</li>
                                                <li className={style['my-col-4']}>{item.enddate}</li>
                                                <li className={style['my-col-5']}>{item.min_order}</li>
                                                <li className={style['add-button']}><button onClick={() => handleAddPromotion(item)}><IoAdd/></button></li>
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className={style['col-lg-12']}>
                            <div className={style['promotion-list']}>
                                <p>Các khuyễn mãi đã chọn: </p>
                                <div className={style['choosen-promotion-table']}>
                                    <div className={style['my-row'] + ' ' + style['my-title-row']}>
                                        <ul>
                                            <li className={style['my-col-1']}>Mã KH</li>   
                                            <li className={style['my-col-2']}>Tên khuyễn mãi</li>
                                            <li className={style['my-col-3']}>Loại</li>
                                            <li className={style['my-col-4']}>Ngày kết thúc</li>
                                            <li className={style['my-col-5']}>Điều kiện</li>
                                        </ul>
                                    </div>
                                    {choosenPromotion.map(item => (
                                        <div className={style['my-row']} key={item.code}>
                                            <ul>
                                                <li className={style['my-col-1']}>{item.code}</li>   
                                                <li className={style['my-col-2']}>{item.title}</li>
                                                <li className={style['my-col-3']}>{item.type}</li>
                                                <li className={style['my-col-4']}>{item.enddate}</li>
                                                <li className={style['my-col-5']}>{item.min_order}</li>
                                                <li className={style['add-button']}><button onClick={() => {handleRemovePromotion(item.code)}}><IoRemove/></button></li>
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className={style['col-lg-12']}>
                            <div className={style['sdt-input']}>
                                <label for="sdt">Nhập số điện thoại:</label>
                                <input type="text" name="sdt" id="sdt"></input>
                            </div>
                        </div>
                        <div className={style['col-lg-12']}>
                            <div className={style['btn-ctn']}>
                                <button className={style['my-btn']}>Lưu</button>
                                <button className={style['my-btn']} onClick={() => setShow(false)}>Thoát</button>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default ApplyPromotion;