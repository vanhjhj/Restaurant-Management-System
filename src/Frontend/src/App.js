import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Layout/Header/Header'
import Footer from './Components/Layout/Footer/Footer';
import HomePage from './Components/Layout/HomePage/HomePage';
import About from './Components/Layout/About/About';
import Menu from './Components/Layout/Menu/Menu';
import Reservation from './Components/Layout/Reservation/Reservation';
import Login from './Components/Auth/Login';
import SignUp from './Components/Auth/SignUp';
import VerifyOTP from './Components/Auth/VerifyOTP'
import ForgotPassword from './Components/Auth/ForgotPassword';
import ResetPassword from './Components/Auth/ResetPassword';
import ProtectedRoute from './Components/Routes/ProtectedRoute';
import Profile from './Components/Customer/Profile';
import ManageEmployees from './Components/Admin/ManageEmployee/ManageEmployees';
import ManageMenu from './Components/Admin/ManageMenu/ManageMenu';
import ManagePromotions from './Components/Admin/ManagePromotion/ManagePromotions';
import RegisterEmployeeAccount from './Components/Admin/RegisterEmployeeAccout/RegisterEmployeeAccount';
import ViewSalesReports from './Components/Admin/ViewSalesReports/ViewSalesReports';
import ManageRestaurantInfo from './Components/Admin/ManagerRestaurantInfo/ManageRestaurantInfo';
import PurchaseHistory from './Components/Customer/PurchaseHistory';
import AdminDashboard from './Components/Admin/AdminDashboard';
import EmployeeDashboard from './Components/Employee/EmployeeDashboard/EmployeeDashboard';
import './App.css';
import { logout, refreshToken } from './API/authAPI';
import { isTokenExpired } from './utils/tokenHelper.mjs';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

library.add(faEye, faEyeSlash);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [userRole, setUserRole] = useState('Customer');

  // Khôi phục trạng thái đăng nhập từ localStorage
  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedUserRole = localStorage.getItem('userRole') || 'Customer';

    // Cập nhật trạng thái nếu dữ liệu trong localStorage hợp lệ
    if (storedIsLoggedIn && storedUserRole) {
        setIsLoggedIn(storedIsLoggedIn);
        setUserRole(storedUserRole);
    } else {
        // Nếu không hợp lệ, reset trạng thái
        setIsLoggedIn(false);
        setUserRole('Customer');
        localStorage.clear();
    }
  }, []);

   // Hàm được gọi khi đăng nhập thành công từ Login.js
  const handleLogin = (accountType) => {
    setIsLoggedIn(true);
    setUserRole(accountType);
    localStorage.setItem('isLoggedIn', true);
    localStorage.setItem('userRole', accountType);
  };

  const handleLogout = async () => {
    let refreshTokenValue = localStorage.getItem('refreshToken'); // Lấy refresh token từ localStorage
    let token = localStorage.getItem('accessToken');

    if (!refreshTokenValue) {
        console.error('Không tìm thấy refresh token. Đăng xuất thủ công.');
        setIsLoggedIn(false);
        setUserRole('Customer');
        localStorage.clear();
        return;
    }

    try {
        if(isTokenExpired(token))
        {
            const newTokens = await refreshToken(refreshTokenValue, token);
                token = newTokens.access; // Cập nhật access token mới
                localStorage.setItem('accessToken', token);

        }
        // Gọi API logout
        await logout(refreshTokenValue, token);

        // Xóa trạng thái đăng nhập
        setIsLoggedIn(false);
        setUserRole('Customer');
        localStorage.clear();
    } catch (error) {
        console.error('Đăng xuất thất bại:', error.message);
    }
};


  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} userRole={userRole} />
      <Routes>
            {/* Trang công khai */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/reservation" element={<Reservation isLoggedIn={isLoggedIn} />} />

            {/* Đăng nhập và đăng ký */}
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Trang khách hàng */}
            <Route
                path="/purchase-history"
                element={
                    <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={['Customer']} userRole={userRole}>
                        <PurchaseHistory />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={['Customer', 'Admin', 'Employee']} userRole={userRole}>
                        <Profile />
                    </ProtectedRoute>
                }
            />

            {/* Trang admin */}
            <Route
                path="/admin-dashboard"
                element={
                    <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={['Admin']} userRole={userRole}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/manage-restaurant-info"
                element={
                    <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={['Admin']} userRole={userRole}>
                        <ManageRestaurantInfo />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/manage-employees"
                element={
                    <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={['Admin']} userRole={userRole}>
                        <ManageEmployees />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/manage-menu"
                element={
                    <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={['Admin']} userRole={userRole}>
                        <ManageMenu />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/manage-promotions"
                element={
                    <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={['Admin']} userRole={userRole}>
                        <ManagePromotions />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/register-employee-account"
                element={
                    <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={['Admin']} userRole={userRole}>
                        <RegisterEmployeeAccount />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/view-sales-reports"
                element={
                    <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={['Admin']} userRole={userRole}>
                        <ViewSalesReports />
                    </ProtectedRoute>
                }
            />

            {/* Trang nhân viên */}
            <Route
                path="/employee-dashboard"
                element={
                    <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={['Employee']} userRole={userRole}>
                        <EmployeeDashboard />
                    </ProtectedRoute>
                }
            />
        </Routes>
      <Footer />
    </Router>
  );
}
export default App;
