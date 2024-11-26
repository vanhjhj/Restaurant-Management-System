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
import FillFormInfo from './Components/Auth/FillFormInfo/FillFormInfo';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import Profile from './Components/Customer/Profile';
import ManageEmployees from './Components/Admin/ManageEmployee/ManageEmployees';
import ManageMenu from './Components/Admin/ManageMenu/ManageMenu';
import ManagePromotions from './Components/Admin/ManagePromotion/ManagePromotions';
import RegisterEmployeeAccount from './Components/Admin/RegisterEmployeeAccout/RegisterEmployeeAccount';
import ViewSalesReports from './Components/Admin/ViewSalesReports/ViewSalesReports';
import ManageRestaurantInfo from './Components/Admin/ManagerRestaurantInfo/ManageRestaurantInfo';
import PurchaseHistory from './Components/Customer/PurchaseHistory';
import AdminDashboard from './Components/Admin/AdminDashboard/AdminDashboard';
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

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // Chuyển từ chuỗi về boolean
    const storedUserRole = localStorage.getItem('userRole') || 'Customer';
    setIsLoggedIn(storedIsLoggedIn);
    setUserRole(storedUserRole);
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
        <Route path ='/FillFormInfo' element={<FillFormInfo/>}/>
        <Route path='/Profile' isLoggedIn={isLoggedIn} onLogout={handleLogout} userRole={userRole} element ={<Profile/>}/>
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </Router>
  );
}
export default App;
