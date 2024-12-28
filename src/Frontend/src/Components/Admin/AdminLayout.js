// src/Components/AdminLayout.js
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import style from "./../../Style/AdminStyle/AdminLayout.module.css";

function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className={style["admin-dashboard"]}>
      {/* Header */}
      <div className={style["dashboard-header"]}>
        <div className={style["header-content"]}>
          <h1>Administration</h1>
        </div>
      </div>

      <div className={style["dashboard-container"]}>
        {/* Sidebar Navigation */}
        <div className={style["sidebar"]}>
          <ul className={style["menu-list"]}>
            <li
              onClick={() =>
                navigate("/admin-dashboard/manage-restaurant-info")
              }
              className={style["menu-item"]}
            >
              Thông tin nhà hàng
            </li>
            <li
              onClick={() => navigate("/admin-dashboard/manage-promotions")}
              className={style["menu-item"]}
            >
              Khuyến mãi
            </li>
            <li
              onClick={() => navigate("/admin-dashboard/manage-menu")}
              className={style["menu-item"]}
            >
              Thực đơn
            </li>
            <li
              onClick={() => navigate("/admin-dashboard/view-sales-reports")}
              className={style["menu-item"]}
            >
              Báo cáo doanh thu
            </li>
            <li
              onClick={() =>
                navigate("/admin-dashboard/register-employee-account")
              }
              className={style["menu-item"]}
            >
              Đăng ký tài khoản nhân viên
            </li>
            <li
              onClick={() => navigate("/admin-dashboard/manage-employees")}
              className={style["menu-item"]}
            >
              Nhân viên
            </li>
            <li
              onClick={() => navigate("/admin-dashboard/manage-department")}
              className={style["menu-item"]}
            >
              Bộ phận
            </li>
            <li
              onClick={() => navigate("/admin-dashboard/manage-table")}
              className={style["menu-item"]}
            >
              Bàn
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className={style["main-content"]}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
