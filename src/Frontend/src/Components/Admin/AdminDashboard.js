import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import style from "./../../Style/AdminStyle/AdminLayout.module.css";

function AdminDashBoard() {
  return (
    <div className={style["content"]}>
      <h3>Chào mừng tới với trang của admin!</h3>
    </div>
  );
}

export default AdminDashBoard;
