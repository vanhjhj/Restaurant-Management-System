// src/components/Header.js
import React, { useState, useRef, useEffect } from 'react';
import style from './Header.module.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

function Header({onLogout }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null); // Tham chiếu đến dropdown menu

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');

    const handleLogoutBtn = () => {
        setIsMenuOpen(false);
        onLogout();
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    
    return (
        <header className={style["site-header"]}>
            <div className={style['container']}>
                <div className={style['row']}>
                    <div className={style['col-lg-2']}>
                        <div className={style["header-logo"]}>
                            <Link to="/" className={style["logo-text"]}>Citrus Royale</Link>
                        </div>
                    </div>
                    <div className={style['col-lg-10']}>
                        <div className={style['main-navigation']}>
                            <nav className={style["header-menu"]}>
                                <ul className={style["food-nav-menu"]}>
                                    <li><Link to="/about">Giới Thiệu</Link></li>
                                    <li><Link to="/menu">Thực Đơn</Link></li>
                                    <li><Link to="/reservation">Đặt Bàn</Link></li>

                                    {/* Điều kiện hiển thị các trang dựa trên userRole */}
                                    {userRole === 'Admin' && (
                                        <li><Link to="/admin-dashboard">Quản Trị</Link></li>
                                    )}
                                    {userRole === 'Employee' && (
                                        <>
                                            <li><Link to="/employee-dashboard">Trang Nhân Viên</Link></li>
                                        </>
                                    )}
                                    {userRole === 'Customer' && (
                                        <li><Link to="/"></Link></li>
                                    )}

                                    {isLoggedIn ? (
                                        <li className={style["user-menu"]} ref={menuRef}>
                                            <button onClick={toggleMenu} title='user-icon'>
                                                <FontAwesomeIcon icon={faUser} size="lg" />
                                            </button>
                                            {isMenuOpen && (
                                                <div className={style["user-dropdown"]}>
                                                    <ul className={style["dropdown-list"]}>
                                                        {/* Show only the Logout option for admin */}
                                                        {userRole === 'admin' ? (
                                                            <li><button onClick={handleLogoutBtn}>Đăng xuất</button></li>
                                                        ) : userRole === 'Employee' ? (
                                                            <>
                                                            <li>
                                                                {/* Nhân viên chỉ có Chỉnh sửa thông tin cá nhân và Đăng xuất */}
                                                                <Link to="/profile">Thông tin cá nhân</Link>
                                                            </li>
                                                            <li> <button onClick={handleLogoutBtn}>Đăng xuất</button></li>
                                                            </>
                                                            
                                                        ) : (
                                                            <>
                                                                <li><Link to="/profile">Thông tin cá nhân</Link></li>
                                                                <li><Link to="/purchasehistory">Lịch sử mua hàng</Link></li>
                                                                <li>
                                                                    <div className={style['logout-section']}>
                                                                        <button onClick={handleLogoutBtn} className={style['logout-button']}>Đăng xuất</button>
                                                                    </div>      
                                                                </li>
                                                            </>
                                                                
                                                            
                                                        )}
                                                    </ul>
                                                    
                                                </div>
                                            )}
                                        </li>
                                    ) : (
                                            <li>
                                                <Link to="/login" className={style["login-btn"]}>Đăng Nhập</Link>
                                        </li>
                                        )}
                                </ul>
                            </nav>
                        </div>
                    </div> 
                </div>
            </div>
        </header>
    );
}

export default Header;
