// src/components/Header.js
import React, { useState, useRef, useEffect } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

function Header({ isLoggedIn, onLogout, account_type }) {
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
        <header className="site-header">
            <div className="container">
                <div className="header-logo">
                    <Link to="/" className="logo-text">Citrus Royale</Link>
                </div>
                <nav className="header-menu">
                    <ul>
                        <li><Link to="/about">Giới Thiệu</Link></li>
                        <li><Link to="/menu">Thực Đơn</Link></li>
                        <li><Link to="/reservation">Đặt Bàn</Link></li>

                        {/* Điều kiện hiển thị các trang dựa trên account_type */}
                        {account_type === 'Admin' && (
                            <li><Link to="/admin-dashboard">Quản Trị</Link></li>
                        )}
                        {account_type === 'Employee' && (
                            <>
                                <li><Link to="/employee-dashboard">Trang Nhân Viên</Link></li>
                                <li><Link to="/order-food">Đặt Món</Link></li> {/* Nút Đặt Món cho nhân viên */}
                            </>
                        )}
                        {account_type === 'Customer' && (
                            <li><Link to="/"></Link></li>
                        )}

                        {isLoggedIn ? (
                            <li className="user-menu" ref={menuRef}>
                                <button onClick={toggleMenu} className="user-icon">
                                    <FontAwesomeIcon icon={faUser} size="lg" />
                                </button>
                                {isMenuOpen && (
                                    <div className="user-dropdown">
                                        {/* Show only the Logout option for admin */}
                                        {account_type === 'admin' ? (
                                            <button onClick={onLogout}>Đăng xuất</button>
                                        ) : (
                                            <>
                                                <Link to="/profile">Cập nhật thông tin cá nhân</Link>
                                                <Link to="/purchasehistory">Tra cứu lịch sử mua hàng</Link>
                                                <button onClick={onLogout}>Đăng xuất</button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </li>
                        ) : (
                            <li>
                                <Link to="/login" className="login-btn">Đăng Nhập</Link>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
