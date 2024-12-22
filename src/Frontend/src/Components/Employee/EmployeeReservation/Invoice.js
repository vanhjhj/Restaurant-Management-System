import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { isTokenExpired } from '../../../utils/tokenHelper.mjs';
import { refreshToken } from '../../../API/authAPI';
import style from './Invoice.module.css';
import { addFood, createOrder, fetchOrderData, fetchOrderItemData, removeItem, updateItem, updateItemStatus } from '../../../API/EE_ReservationAPI';
import { getFoodItems, getMenuTabs } from '../../../API/MenuAPI';

function Invoice({ tableID, setShowInvoice }) {
    const { accessToken, setAccessToken } = useAuth();
    const [invoiceData, setInvoiceData] = useState({id: 0, datetime: '', total_price: '', total_discount: '', final_price: '', status:'',table:0});
    const [itemsData, setItemsData] = useState([]);
    const [menuData, setMenuData] = useState([]);
    const [menuTabs, setMenuTabs] = useState([]);
    const [noteData, setNoteData] = useState('');
    const [quantity, setQuantity] = useState(0)
    
    const [searchItem, setSearchItem] = useState('');
    const [searchPriceMin, setSearchPriceMin] = useState('');
    const [searchPriceMax, setSearchPriceMax] = useState('');
    const [searchTab, setSearchTab] = useState(0);
    const [errorTableMessage, setErrorTableMessage] = useState();
    const [errorType, setErrorType] = useState();

    const handleError = (error, type) => {
        if (error === 404) {
            return 'Không tìm thấy hóa đơn';
        }
        if (error === 400) {
            if (type === 'addItem') {
                return 'Không tìm thấy hóa đơn';
            }
            if (type === 'editItem') {
                return 'Chỉnh sửa không hợp lệ';
            }
        }
        return ''
    }

    const errorMessage = handleError(errorTableMessage, errorType);

    const NumberWithSpaces = ({ number }) => {
        const formattedNumber = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(number).replace(/,/g, ' ');
      
        return <p>{formattedNumber} .VNĐ</p>;
    };
    
    const handlePriceMin = (value) => {
        // Allow only positive numbers or empty string (to handle backspacing)
        if (/^\d*$/.test(value)) {
          setSearchPriceMin(value);
        }
      } 
    
      const handlePriceMax = (value) => {
        // Allow only positive numbers or empty string (to handle backspacing)
        // if (value === '' || /^[+]?\d+(\.\d+)?$/.test(value)) {
        //   setSearchPriceMax(value);
        // }
        if (/^\d*$/.test(value)) {
          setSearchPriceMax(value);
        }
    }

    const filterMenu = (item, name, category, priceMin, priceMax) => {
        let addCondition = item.name.toLowerCase().includes(name.toLowerCase())
          && item.price >= priceMin;
        if (priceMax > 0) {
            addCondition = addCondition && item.price <= priceMax;
        }
        if (category != 0) {
            addCondition = addCondition && item.category == category;
        }
        return addCondition;
      }
    
    const filteredItems = menuData.filter(item => filterMenu(item, searchItem, searchTab, searchPriceMin, searchPriceMax));    
    
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

    const fetchMenuData = async () => {
        try {
            const menu = await getFoodItems();
            setMenuData(menu);
            const tab = await getMenuTabs();
            setMenuTabs(tab);
        }
        catch (error) {
            setErrorTableMessage(error.response.status);
            setErrorType('menu');
        }
    }
    const fetchData = async () => {
        const activeToken = await ensureActiveToken();
        try {
            const orderData = await fetchOrderData(activeToken, tableID);
            setInvoiceData(orderData);

            const itemData = await fetchOrderItemData(activeToken, orderData.id);
            setItemsData(itemData.results.map((item) => ({
                ...item,
                isEditing: false,
                changeQuantity: false,
            })));
        }
        catch (error) {
            setErrorTableMessage(error.response.status);
        }
    }

    useEffect(() => {
        fetchData();
        fetchMenuData();
    }, [])
    
    const handleAddFood = async (oID, fID) => {
        const activeToken = await ensureActiveToken();
        try {
            if (errorTableMessage === 404) {
                await createOrder(activeToken, tableID);
                setErrorTableMessage(0);
                const orderData = await fetchOrderData(activeToken, tableID);
                setInvoiceData(orderData);

                const tablesData = await addFood(activeToken, orderData.id, fID, 1, "");

                const itemData = await fetchOrderItemData(activeToken, orderData.id);
                setItemsData(itemData.results.map((item) => ({
                    ...item,
                    isEditing: false,
                    changeQuantity: false,
                })));

            }
            else {
                const tablesData = await addFood(activeToken, oID, fID, 1, "");
                fetchData();
            }
        }
        catch (error) {
            setErrorTableMessage(error.response.status);
            setErrorType('addItem');
        }
    }

    const handleEditing = (itemID, itemNote) => {
        setItemsData((preItem) => (
            preItem.map((i) => i.id === itemID ? { ...i, isEditing: true } : i)
        ))
        setNoteData(itemNote);
    }

    const handleErase = async (itemID, fID) => {
        const activeToken = await ensureActiveToken();
        try {
            const result = await removeItem(activeToken, itemID);
            setItemsData((preItem) => (
                preItem.filter((i) => i.id !== itemID)
            ))
            const orderData = await fetchOrderData(activeToken, tableID);
            setInvoiceData(orderData);
        }
        catch (error) {
            setErrorTableMessage(error.response.status);
        }
    }

    const handleCancel = () => {

    }

    const handleChangeQuantity = (value) => {
        if (value === "" || /^[1-9]\d*$/.test(value)) {
            setQuantity(value);
          }
    }

    const handleEditingQuantity = (itemQuantity, itemID) => {
        setItemsData((preItem) => (
            preItem.map((i) => i.id === itemID ? { ...i, changeQuantity: true } : i)
        ))
        setQuantity(itemQuantity);
    }

    const handleSave = async (itemID, q, note, change) => {
        const activeToken = await ensureActiveToken();
            try {
                const result = await updateItem(activeToken, itemID, q, note);
                setItemsData((preItem) => (
                    preItem.map((i) => i.id === itemID ? {
                        ...result.data,
                        changeQuantity: change === 'quantity' ? false : i.changeQuantity,
                        isEditing: change === 'note' ? false : i.isEditing,
                    } : i)
                ))
                change === 'quantity' ? setQuantity(0) : setNoteData('');
                const orderData = await fetchOrderData(activeToken, tableID);
                setInvoiceData(orderData);
            }
            catch (error) {
                setErrorTableMessage(error.response.status);
                setErrorType('editItem');
            }
    }

    const handleKeyDown = async (event, itemID, q, note, change) => {
        if (event.key === 'Enter') {
            const activeToken = await ensureActiveToken();
            handleSave(itemID, q, note, change);
        }
    };

    const handleChangeStatus = async (itemID) => {
        const activeToken = await ensureActiveToken();
        try {
            const result = await updateItemStatus(activeToken, itemID);
            setItemsData((preItem) => (
                preItem.map((i) => i.id === itemID ? result.data : i)
            ));
        }
        catch (error) {
            if (error.response.status === 404) {
                setErrorTableMessage('Mất kết nối')
            }
        }
    }

    return (
        <div className={style['ctn']}>
            <div className={style['container']}>
                <div className={style['invoice-ctn']}>
                    <div className={style['close-ctn']}>
                        <button className={style["close-modal"]} onClick={() => setShowInvoice(tableID, false)}>
                            &times;
                        </button>
                    </div>
                    
                    <div className={style['row']}>
                        <div className={style['col-lg-6']}>
                            <div className={style['invoice-info-ctn']}>
                                <div className={style['invoice-info-title']}>
                                    <h2>Thông tin bàn số: {tableID}</h2>
                                    {errorTableMessage ? <p className={style['error-message']}>{errorMessage}</p> : <p></p>}
                                </div>
                                
                                <div className={style['ordered-food-ctn']}>
                                    <h4>Danh sách các món ăn:</h4>
                                    <div className={style['table-food']}>
                                        <div className={style["my-row"] + ' ' + style['my-title-row']}>
                                            <ul>
                                                <li>Tên món ăn</li>   
                                                <li>Số lượng</li>
                                                <li>Trạng thái</li>
                                                <li>Tổng tiền</li>
                                            </ul>
                                        </div>
                                        {itemsData.map(item => (
                                            <section className={style['content-row-section']} key={item.id}>
                                                <article className={style["my-row"] + ' ' + style['my-content-row'] +' ' +style[(item.isEditing || item.changeQuantity) ? 'new-height':'']}>
                                                    <ul>
                                                        <li>{item.menu_item_details.name}</li>   
                                                        {!item.changeQuantity ? <li
                                                            className={style['change-quantity']}
                                                            onClick={() => handleEditingQuantity(item.quantity,item.id)}>
                                                            {item.quantity}
                                                        </li>
                                                            : <li>
                                                                <div className={style['quantity-input-ctn']}>
                                                                    <label className={style['quantity-label']}>
                                                                    <input
                                                                    type='number'
                                                                    className={style['quantity-input']}
                                                                    min="1"
                                                                    step="1"
                                                                    value = {quantity}
                                                                    onChange={(e) => handleChangeQuantity(e.target.value)}
                                                                    onKeyDown={(e) => handleKeyDown(e, item.id, quantity, item.note, 'quantity')}
                                                                    autoFocus>
                                                                    </input>
                                                                    </label>
                                                                    
                                                                    <button
                                                                        className={style['confirm-button']}
                                                                        onClick={() => handleSave(item.id, quantity, item.note, 'quantity')}
                                                                    >
                                                                        ✔
                                                                    </button>
                                                                </div>
                                                            
                                                        </li>
                                                        }        
                                                        <li className={style['change-status']}
                                                        onClick={() => handleChangeStatus(item.id)}>{item.status}</li>
                                                        <li>{item.total}.VND</li>
                                                    </ul>
                                                    <div className={style['more-content']}>
                                                        <p className={style['mc-title']}>Note: </p>
                                                        {item.isEditing ? (
                                                            <div className={style['mc-note']}>
                                                                <textarea
                                                                    type='text'
                                                                    value={noteData}
                                                                    onChange={(e) => setNoteData(e.target.value)}
                                                                    rows="3" cols="55"
                                                                    onKeyDown={(e) => handleKeyDown(e, item.id, item.quantity, noteData, 'note')}
                                                                    autoFocus
                                                                />
                                                            </div>) : (
                                                                <div className={style['mc-note']}>
                                                                    <p>{item.note}</p>
                                                                </div>
                                                        )}
                                                        <div className={style['my-btn']}>
                                                            <button className={style['edit-btn']} onClick={() => item.isEditing ? handleSave(item.id, item.quantity, noteData, 'note') :
                                                                handleEditing(item.id, item.note)}>
                                                                {item.isEditing ? 'Lưu': 'Chỉnh sửa'}</button>
                                                            <button className={style['erase-btn']} onClick={()=>handleErase(item.id)}>Xóa</button>
                                                        </div>
                                                    </div>
                                                </article>    
                                            </section>
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
                                <div className={style['btn-ctn']}>
                                    <button className={style['edit-btn']}>Thêm ưu đãi</button>
                                    <button className={style['edit-btn']}>Xuất hóa đơn</button>    
                                </div>
                            </div>
                        </div>
                        <div className={style['col-lg-6']}>
                            <div className={style['menu-info-ctn']}>
                                    <div className={style['menu-title']}>
                                        <h2>Thực đơn</h2>
                                </div>
                                <div className={style["search-row"]}>
                                          <div className={style['col-lg-9']}>
                                            <div className={style['search-menuitem']}>
                                              <input type='text'  
                                                placeholder="Tìm kiếm theo tên..."
                                                value={searchItem}
                                                onChange={e => setSearchItem(e.target.value) }
                                                className={style['input-search-menuitem']} />
                                              <button type="button" className={style["input-search-btn"]}>
                                                <i className="fas fa-search"></i>
                                              </button>
                                            </div>
                                          </div>
                                    <div className={style['col-lg-3']}>
                                        <div className={style['search-tab']}>
                                            <select value={searchTab} onChange={(e) => setSearchTab(e.target.value)} >
                                                <option value={0}>All</option>
                                                {menuTabs.map(item => (
                                                    <option value={item.id} key={item.id}>{item.name}</option>
                                                ))}
                                            </select>
                                        </div> 
                                    </div>
                                        </div>
                                <div className={style['menu-list']}>
                                    <div className={style['row']}>
                                        {filteredItems.map(item => (
                                                <div key={item.id} className={style["col-lg-4"]}>
                                                    <div className={style["menu-item"]}>
                                                        <img src={item.image} alt={item.name} />
                                                        <h3>{item.name}</h3>
                                                        <p>{item.price} .VND</p>
                                                        <button onClick={()=>handleAddFood(invoiceData.id, item.id)}>Add</button>
                                                    </div>
                                                </div>
                                                ))}
                                        </div>
                                    </div>  
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default Invoice;