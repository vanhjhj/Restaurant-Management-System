import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Layout/Header/Header'
import Footer from './Components/Layout/Footer/Footer';
import HomePage from './Components/Layout/HomePage/HomePage';
import About from './Components/Layout/About/About';
import Menu from './Components/Layout/Menu/Menu';
import Reservation from './Components/Layout/Reservation/Reservation';
import Login from './Components/Auth/Login/Login';
import SignUp from './Components/Auth/SignUp/SignUp';
import VerifyOTP from './Components/Auth/VerifyOTP/VerifyOTP'
import ForgotPassword from './Components/Auth/ForgotPassword/ForgotPassword';
import ResetPassword from './Components/Auth/ResetPassword/ResetPassword';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import Profile from './Components/Customer/Profile/Profile';
import ManageEmployees from './Components/Admin/ManageEmployee/ManageEmployees';
import ManageMenu from './Components/Admin/ManageMenu/ManageMenu';
import ManagePromotions from './Components/Admin/ManagePromotion/ManagePromotions';
import RegisterEmployeeAccount from './Components/Admin/RegisterEmployeeAccout/RegisterEmployeeAccount';
import ViewSalesReports from './Components/Admin/ViewSalesReports/ViewSalesReports';
import ManageRestaurantInfo from './Components/Admin/ManagerRestaurantInfo/ManageRestaurantInfo';
import PurchaseHistory from './Components/Customer/Purchase History/PurchaseHistory';
import AdminDashboard from './Components/Admin/AdminDashboard/AdminDashboard';
import EmployeeDashboard from './Components/Employee/EmployeeDashboard/EmployeeDashboard';
import './App.css';
import { logout, refreshToken } from './API/authAPI';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

library.add(faEye, faEyeSlash);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [userRole, setUserRole] = useState('Customer');

   // Hàm được gọi khi đăng nhập thành công từ Login.js
  const handleLogin = (accountType) => {
    setIsLoggedIn(true);
    setUserRole(accountType);
    localStorage.setItem('isLoggedIn', true);
    localStorage.setItem('userRole', accountType);
  };

  const handleLogout = async () => {
    let refreshToken = localStorage.getItem('refreshToken'); // Lấy refresh token từ localStorage

    if (!refreshToken) {
        console.error('Không tìm thấy refresh token. Đăng xuất thủ công.');
        setIsLoggedIn(false);
        setUserRole('Customer');
        localStorage.clear();
        return;
    }

    try {
        // Làm mới token nếu cần thiết
        const newTokens = await refreshToken(refreshToken);
        refreshToken = newTokens.refresh; // Cập nhật refresh token mới nếu có
        localStorage.setItem('refreshToken', refreshToken);

        // Gọi API logout
        await logout(refreshToken);

        // Xóa trạng thái đăng nhập
        setIsLoggedIn(false);
        setUserRole('Customer');
        localStorage.clear();
    } catch (error) {
        console.error('Đăng xuất thất bại:', error.message);
        alert('Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại.');
    }
};


  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} userRole={userRole} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/reservation" element={<Reservation isLoggedIn={isLoggedIn}/>}/>

        <Route>
          {/* Trang chỉ dành cho Admin */}
          <Route
              path="/admin-dashboard"
              element={
                  <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={['Admin']} userRole={userRole}>
                      <AdminDashboard />
                      <ManageRestaurantInfo/>
                      <ManageEmployees/>
                      <ManagePromotions/>
                      <ManageMenu/>
                      <ViewSalesReports/>
                      <RegisterEmployeeAccount/>
                  </ProtectedRoute>
              }
          />

              {/* Trang chỉ dành cho Nhân viên */}
          <Route
              path="/employee-dashboard"
              element={
                  <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={['Employee']} userRole={userRole}>
                      <EmployeeDashboard />
                  </ProtectedRoute>
              }
          />

              {/* Trang chỉ dành cho Khách hàng */}
          <Route
              path="/purchase-history"
              element={
                  <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={['Customer']} userRole={userRole}>
                      <PurchaseHistory />
                  </ProtectedRoute>
              }
          />
        </Route>;

        {/* Đăng nhập và đăng ký */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-otp" element={<VerifyOTP/>}/>
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword/>}/>
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </Router>
  );
}
export default App;
