import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Layout/Header/Header'
import Footer from './Components/Layout/Footer/Footer';
import HomePage from './Components/Layout/HomePage/HomePage';
import About from './Components/Layout/About/About';
import Menu from './Components/Layout/Menu/Menu';
import Reservation from './Components/Layout/Reservation/Reservation';
import Login from './Components/Auth/Login/Login';
import SignUp from './Components/Auth/SignUp/SignUp';
import ForgotPassword from './Components/Auth/ForgotPassword/ForgotPassword';
import Profile from './Components/Customer/Profile/Profile';
import ManageEmployees from './Components/Admin/ManageEmployee/ManageEmployees';
import ManageMenu from './Components/Admin/ManageMenu/ManageMenu';
import ManagePromotions from './Components/Admin/ManagePromotion/ManagePromotions';
import RegisterEmployeeAccount from './Components/Admin/RegisterEmployeeAccout/RegisterEmployeeAccount';
import ViewSalesReports from './Components/Admin/ViewSalesReports/ViewSalesReports';
import ManageRestaurantInfo from './Components/Admin/ManagerRestaurantInfo/ManageRestaurantInfo';
import PurchaseHistory from './Components/Customer/Purchase History/PurchaseHistory';
import AdminDashboard from './Components/Admin/AdminDashboard/AdminDashboard';
// import EmployeeDashboard from './Components/EmployeeDashboard';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [userRole, setUserRole] = useState('khach hang');
  
  // Gọi API để lấy vai trò người dùng khi đăng nhập
  const fetchUserRole = async () => {
    try {
      const response = await fetch('/api/user-role', {
        method: 'GET',
        credentials: 'include', // Đảm bảo cookie được gửi nếu cần
      });
      const data = await response.json();
      setUserRole(data.role); // Ví dụ: { role: 'admin' } hoặc { role: 'nhan vien' } hoặc { role: 'khach hang' }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };


   // Hàm cập nhật trạng thái khi đăng nhập thành công
  const handleLogin = async() => {
    setIsLoggedIn(true);
    await fetchUserRole();
  };

   // Hàm đăng xuất
   const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('guest'); 
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserRole(); // Lấy vai trò nếu người dùng đã đăng nhập
    }
  }, [isLoggedIn]);


  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} userRole={userRole} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/reservation" element={<Reservation isLoggedIn={isLoggedIn}/>}
        />

        {/* Phân quyền cho admin */}
        {userRole === 'admin' && (
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        )}

        {/* Phân quyền cho nhân viên */}
        {userRole === 'nhan vien' && (
          <Route path="/" element={<AdminDashboard />} />
        )}

        {/* Phân quyền cho khách hàng */}
        {userRole === 'khach hang' && (
          <Route path="/" element={<HomePage />} />
        )}

        {/* Đăng nhập và đăng ký */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/purchasehistory" element={<PurchaseHistory/>}/>
        <Route path="/manage-restaurant-info" element={<ManageRestaurantInfo />} />
        <Route path="/manage-promotions" element={<ManagePromotions />} />
        <Route path="/manage-menu" element={<ManageMenu />} />
        <Route path="/view-sales-reports" element={<ViewSalesReports />} />
        <Route path="/register-employee-account" element={<RegisterEmployeeAccount />} />
        <Route path="/manage-employees" element={<ManageEmployees />} />
      </Routes>
      <Footer />
    </Router>
  );
}
export default App;
