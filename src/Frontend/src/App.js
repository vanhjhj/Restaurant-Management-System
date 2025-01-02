import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Components/Layout/Header/Header";
import Footer from "./Components/Layout/Footer/Footer";
import HomePage from "./Components/Layout/HomePage/HomePage";
import About from "./Components/Layout/About/About";
import Menu from "./Components/Layout/Menu/Menu";
import FoodDetail from "./Components/Layout/Menu/FoodDetail";
import Promotion from "./Components/Layout/Promotion/Promotion";
import PromotionDetail from "./Components/Layout/Promotion/PromotionDetail";
import BookingTable from "./Components/Layout/BookingTable/BookingTable";
import Login from "./Components/Auth/Login";
import SignUp from "./Components/Auth/SignUp";
import VerifyOTP from "./Components/Auth/VerifyOTP";
import ForgotPassword from "./Components/Auth/ForgotPassword";
import ResetPassword from "./Components/Auth/ResetPassword";
import ProtectedRoute from "./Components/Routes/ProtectedRoute";
import Profile from "./Components/Auth/Profile";
import ManageEmployees from "./Components/Admin/ManageEmployee/ManageEmployees";
import ManageMenu from "./Components/Admin/ManageMenu/ManageMenu";
import AddFoodItem from "./Components/Admin/ManageMenu/AddFoodItem";
import EditFoodItem from "./Components/Admin/ManageMenu/EditFoodItem";
import ManagePromotions from "./Components/Admin/ManagePromotion/ManagePromotions";
import AddPromotion from "./Components/Admin/ManagePromotion/AddPromotion";
import EditPromotion from "./Components/Admin/ManagePromotion/EditPromotion";
import RegisterEmployeeAccount from "./Components/Admin/RegisterEmployeeAccout/RegisterEmployeeAccount";
import ViewSalesReports from "./Components/Admin/ViewSalesReports/ViewSalesReports";
import ManageRestaurantInfo from "./Components/Admin/ManageRestaurantInfo/ManageRestaurantInfo";
import ReservationHistory from "./Components/Customer/ReservationHistory";
import AddDepartment from "./Components/Admin/ManageDepartment/AddDepartment";
import EditDepartment from "./Components/Admin/ManageDepartment/EditDepartment";
import FillInfoEmployee from "./Components/Admin/RegisterEmployeeAccout/FillInfoEmployee";
import ManageDepartment from "./Components/Admin/ManageDepartment/ManageDepartment";
import ScrollToTop from "./Style/scrollToTop";
import "./App.css";
import { isTokenExpired } from "./utils/tokenHelper.mjs";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { AuthProvider } from "./Components/Auth/AuthContext";
import EmployeeReservation from "./Components/Employee/EmployeeReservation/EmployeeReservation";
import ManageTable from "./Components/Admin/ManageTable/ManageTable";
import AdminLayout from "./Components/Admin/AdminLayout";
import VerifyOtpAccount from "./Components/Admin/RegisterEmployeeAccout/VerifyOtpAccount";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import Review from "./Components/Customer/Review";
import Rating from "./Components/Customer/Rating";
import SnowEffect from "./Components/UI/SnowEffect";
import HotlineIcon from "./Components/UI/HotLineIcon";

library.add(faEye, faEyeSlash);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );
  const [refreshAlert, setRefreshAlert] = useState(false);
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  useEffect(() => {
    function checkLoginStatus() {
      if (localStorage.getItem("isLoggedIn") === "false") {
        return;
      }
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        localStorage.clear();
        localStorage.setItem("isLoggedIn", false);
        setRefreshAlert(true);
        return;
      }
      if (isTokenExpired(refreshToken)) {
        localStorage.clear();
        localStorage.setItem("isLoggedIn", false);
        setRefreshAlert(true);
        return;
      }
      setUserRole(localStorage.getItem("userRole"));
    }
    checkLoginStatus();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <SnowEffect />
        <HotlineIcon/>
        <Routes>
          {/* Trang công khai */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:id" element={<FoodDetail />} />
          <Route path="/review" element={<Review />} />
          <Route path="/review/rating/:invoiceID" element={<Rating />} />
          <Route
            path="/reservation"
            element={<BookingTable isLoggedIn={isLoggedIn} />}
          />
          <Route path="/promotion" element={<Promotion />} />
          <Route path="/promotion/:code" element={<PromotionDetail />} />

          {/* Đăng nhập và đăng ký */}
          <Route
            path="/login"
            element={
              <Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />
            }
          />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Trang khách hàng */}
          <Route
            path="/reservation-history"
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                allowedRoles={["Customer"]}
                userRole={userRole}
              >
                <ReservationHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                allowedRoles={["Customer", "Admin", "Employee"]}
                userRole={userRole}
              >
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Trang admin */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                allowedRoles={["Admin"]}
                userRole={userRole}
              >
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="main"
              element={
                <ProtectedRoute
                  isLoggedIn={isLoggedIn}
                  allowedRoles={["Admin"]}
                  userRole={userRole}
                >
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="manage-restaurant-info"
              element={
                <ProtectedRoute
                  isLoggedIn={isLoggedIn}
                  allowedRoles={["Admin"]}
                  userRole={userRole}
                >
                  <ManageRestaurantInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="manage-employees"
              element={
                <ProtectedRoute
                  isLoggedIn={isLoggedIn}
                  allowedRoles={["Admin"]}
                  userRole={userRole}
                >
                  <ManageEmployees />
                </ProtectedRoute>
              }
            />
            <Route
              path="manage-menu"
              element={
                <ProtectedRoute
                  isLoggedIn={isLoggedIn}
                  allowedRoles={["Admin"]}
                  userRole={userRole}
                >
                  <ManageMenu />
                </ProtectedRoute>
              }
            />
            <Route
              path="add-food"
              element={
                <ProtectedRoute
                  isLoggedIn={isLoggedIn}
                  allowedRoles={["Admin"]}
                  userRole={userRole}
                >
                  <AddFoodItem />
                </ProtectedRoute>
              }
            />
            <Route
              path="edit-fooditem/:id"
              element={
                <ProtectedRoute
                  isLoggedIn={isLoggedIn}
                  allowedRoles={["Admin"]}
                  userRole={userRole}
                >
                  <EditFoodItem />
                </ProtectedRoute>
              }
            />
            <Route
              path="manage-promotions"
              element={
                <ProtectedRoute
                  isLoggedIn={isLoggedIn}
                  allowedRoles={["Admin"]}
                  userRole={userRole}
                >
                  <ManagePromotions />
                </ProtectedRoute>
              }
            />
            <Route
              path="add-promotion"
              element={
                <ProtectedRoute
                  isLoggedIn={isLoggedIn}
                  allowedRoles={["Admin"]}
                  userRole={userRole}
                >
                  <AddPromotion />
                </ProtectedRoute>
              }
            />
            <Route
              path="edit-promotion/:code"
              element={
                <ProtectedRoute
                  isLoggedIn={isLoggedIn}
                  allowedRoles={["Admin"]}
                  userRole={userRole}
                >
                  <EditPromotion />
                </ProtectedRoute>
              }
            />

            <Route
              path="fill-info-Emp"
              element={
                <ProtectedRoute
                  isLoggedIn={isLoggedIn}
                  allowedRoles={["Admin"]}
                  userRole={userRole}
                >
                  <FillInfoEmployee />
                </ProtectedRoute>
              }
            />

            <Route
              path="verify-otp-employee"
              element={
                <ProtectedRoute
                  isLoggedIn={isLoggedIn}
                  allowedRoles={["Admin"]}
                  userRole={userRole}
                >
                  <VerifyOtpAccount />
                </ProtectedRoute>
              }
            />

            <Route
              path="register-employee-account"
              element={
                <ProtectedRoute
                  isLoggedIn={isLoggedIn}
                  allowedRoles={["Admin"]}
                  userRole={userRole}
                >
                  <RegisterEmployeeAccount />
                </ProtectedRoute>
              }
            />
            <Route
              path="view-sales-reports"
              element={
                <ProtectedRoute
                  isLoggedIn={isLoggedIn}
                  allowedRoles={["Admin"]}
                  userRole={userRole}
                >
                  <ViewSalesReports />
                </ProtectedRoute>
              }
            />

            <Route
              path="manage-department"
              element={
                <ProtectedRoute
                  isLoggedIn={isLoggedIn}
                  allowedRoles={["Admin"]}
                  userRole={userRole}
                >
                  <ManageDepartment />
                </ProtectedRoute>
              }
            />

            <Route
              path="add-department"
              element={
                <ProtectedRoute
                  isLoggedIn={isLoggedIn}
                  allowedRoles={["Admin"]}
                  userRole={userRole}
                >
                  <AddDepartment />
                </ProtectedRoute>
              }
            />

            <Route
              path="edit-department/:id"
              element={
                <ProtectedRoute
                  isLoggedIn={isLoggedIn}
                  allowedRoles={["Admin"]}
                  userRole={userRole}
                >
                  <EditDepartment />
                </ProtectedRoute>
              }
            />

            <Route
              path="manage-table"
              element={
                <ProtectedRoute
                  isLoggedIn={isLoggedIn}
                  allowedRoles={["Admin"]}
                  userRole={userRole}
                >
                  <ManageTable />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Trang nhân viên */}
          <Route
            path="/employee-dashboard"
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                allowedRoles={["Employee", "Admin"]}
                userRole={userRole}
              >
                <EmployeeReservation />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}
export default App;
