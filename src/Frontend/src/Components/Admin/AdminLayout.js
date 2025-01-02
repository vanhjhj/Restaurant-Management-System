import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import style from "./../../Style/AdminStyle/AdminLayout.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStore,
  faTags,
  faUtensils,
  faUserPlus,
  faUsers,
  faBuilding,
  faTable,
  faChartLine,
  faBars,
} from "@fortawesome/free-solid-svg-icons";

function AdminLayout() {
  const navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className={style["admin-dashboard"]}>
      {/* Header */}
      <div className={style["dashboard-header"]}>
        <div className={style["header-content"]}>
          <button
            onClick={toggleSidebar}
            className={style["menu-toggle-button"]}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <h1
            onClick={() => navigate("/admin-dashboard/main")}
            className={style["admin-dashboard-title"]}
          >
            AdminDashboard
          </h1>
        </div>
      </div>

      <div className={style["dashboard-container"]}>
        {/* Sidebar Navigation */}
        <div
          className={`${style["sidebar"]} ${
            isSidebarVisible ? style["visible"] : style["hidden"]
          }`}
        >
          <ul className={style["menu-list"]}>
            <li
              onClick={() =>
                navigate("/admin-dashboard/manage-restaurant-info")
              }
              className={style["menu-item"]}
            >
              <FontAwesomeIcon icon={faStore} className={style.icon} />
              Thông tin nhà hàng
            </li>
            <li
              onClick={() => navigate("/admin-dashboard/manage-promotions")}
              className={style["menu-item"]}
            >
              <FontAwesomeIcon icon={faTags} className={style.icon} />
              Khuyến mãi
            </li>
            <li
              onClick={() => navigate("/admin-dashboard/manage-menu")}
              className={style["menu-item"]}
            >
              <FontAwesomeIcon icon={faUtensils} className={style.icon} />
              Thực đơn
            </li>
            <li
              onClick={() => navigate("/admin-dashboard/view-sales-reports")}
              className={style["menu-item"]}
            >
              <FontAwesomeIcon icon={faChartLine} className={style.icon} />
              Báo cáo doanh thu
            </li>
            <li
              onClick={() =>
                navigate("/admin-dashboard/register-employee-account")
              }
              className={style["menu-item"]}
            >
              <FontAwesomeIcon icon={faUserPlus} className={style.icon} />
              Đăng ký tài khoản nhân viên
            </li>
            <li
              onClick={() => navigate("/admin-dashboard/manage-employees")}
              className={style["menu-item"]}
            >
              <FontAwesomeIcon icon={faUsers} className={style.icon} />
              Nhân viên
            </li>
            <li
              onClick={() => navigate("/admin-dashboard/manage-department")}
              className={style["menu-item"]}
            >
              <FontAwesomeIcon icon={faBuilding} className={style.icon} />
              Bộ phận
            </li>
            <li
              onClick={() => navigate("/admin-dashboard/manage-table")}
              className={style["menu-item"]}
            >
              <FontAwesomeIcon icon={faTable} className={style.icon} />
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
