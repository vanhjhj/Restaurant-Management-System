import React from "react";
import style from "./../../Style/AdminStyle/AdminDashboard.module.css";

function AdminDashboard() {
  return (
    <div className={style["content"]}>
      <h3>Chào mừng tới với trang của admin!</h3>
      <p>Hãy chọn một chức năng từ menu bên trái để bắt đầu.</p>
    </div>
  );
}

export default AdminDashboard;
