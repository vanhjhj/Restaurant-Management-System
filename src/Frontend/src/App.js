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
import ScrollToTop from './Style/scrollToTop';
import './App.css';
import { logout, refreshToken } from './API/authAPI';
import { isTokenExpired } from './utils/tokenHelper.mjs';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ShowAlert } from './Components/Auth/TokenExpiredAlert';
import { AuthProvider } from './Components/Auth/AuthContext';

library.add(faEye, faEyeSlash);

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
    const [refreshAlert, setRefreshAlert] = useState(false);
    const [userRole, setUserRole] = useState('Customer');
  
    useEffect(() => {
        function checkLoginStatus() {
            if (localStorage.getItem('isLoggedIn') === 'false') {
                return;
            }
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                localStorage.clear();
                localStorage.setItem('isLoggedIn', false);
                setRefreshAlert(true);
                return;
            }
            if (isTokenExpired(refreshToken)) {
                localStorage.clear();
                localStorage.setItem('isLoggedIn', false);
                setRefreshAlert(true);
                return;
            }
        }
        checkLoginStatus()
    }, []);

    const handleAlert = () => {
        setRefreshAlert(false);
    }

    return (
      <AuthProvider>
            <Router>
                <ScrollToTop />
                {refreshAlert && <ShowAlert handleAlert = {handleAlert} />}
                <Header isLoggedIn={isLoggedIn}  setIsLoggedIn={setIsLoggedIn}/>
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
                    <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path="/signup" element={<SignUp />} />
                    
                    <Route path="/verify-otp" element={<VerifyOTP/>}/>
                    <Route path="/forgotpassword" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword/>}/>
                    <Route path="/profile" element={<Profile />} />
                </Routes>
                <Footer />
            </Router>
      </AuthProvider>
    
  );
}
export default App;
