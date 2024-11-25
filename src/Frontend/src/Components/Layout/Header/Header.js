// src/components/Header.js
import React, { useState, useRef, useEffect } from 'react';
import style from './Header.module.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

function Header({ isLoggedIn, onLogout, userRole }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null); // Tham chiếu đến dropdown menu

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
                                            <button onClick={toggleMenu} className="user-icon">
                                                <FontAwesomeIcon icon={faUser} size="lg" />
                                            </button>
                                            {isMenuOpen && (
                                                <div className={style["user-dropdown"]}>
                                                    {/* Show only the Logout option for admin */}
                                                    {userRole === 'admin' ? (
                                                        <button onClick={onLogout}>Đăng xuất</button>
                                                    ) : userRole === 'Employee' ? (
                                                        <>
                                                            {/* Nhân viên chỉ có Chỉnh sửa thông tin cá nhân và Đăng xuất */}
                                                            <Link to="/profile">Thông tin cá nhân</Link>
                                                            <button onClick={onLogout}>Đăng xuất</button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Link to="/profile">Thông tin cá nhân</Link>
                                                            <Link to="/purchasehistory">Tra cứu lịch sử mua hàng</Link>
                                                            <button onClick={onLogout}>Đăng xuất</button>
                                                        </>
                                                    )}
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
