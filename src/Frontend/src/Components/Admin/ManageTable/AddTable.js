import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./../../../Style/AdminStyle/AddTable.module.css";
import { addTable } from "../../../API/AdminAPI";
import { ModalGeneral } from "../../ModalGeneral";
import { useAuth } from "../../Auth/AuthContext";
import { isTokenExpired } from "../../../utils/tokenHelper.mjs";
import { refreshToken } from "../../../API/authAPI";

function AddTable() {
  const navigate = useNavigate();
  const [table, setTable] = useState({
    number_of_seats: "",
    status: "A",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const { accessToken, setAccessToken } = useAuth();
  const [modal, setModal] = useState({
    isOpen: false,
    text: "",
    type: "", // "confirm" hoặc "success"
    onConfirm: null, // Hàm được gọi khi xác nhận
  });

  const ensureActiveToken = async () => {
    let activeToken = accessToken;
    if (isTokenExpired(accessToken)) {
      try {
        const refreshed = await refreshToken(
          localStorage.getItem("refreshToken")
        );
        activeToken = refreshed.access;
        setAccessToken(activeToken);
      } catch (error) {
        console.error("Error refreshing token:", error);
        navigate("/login"); // Điều hướng đến login nếu refresh thất bại
        throw error;
      }
    }
    return activeToken;
  };

  const handleCloseModal = () => {
    setModal({ isOpen: false }); // Đóng modal
    navigate("/admin-dashboard/manage-table"); // Điều hướng
  };

  const handleAddTable = async () => {
    if (!table.status || !table.number_of_seats) {
      setErrorMessage("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    try {
      const activeToken = await ensureActiveToken();
      await addTable(table, activeToken);
      setModal({
        isOpen: true,
        text: "Thêm bàn thành công!",
        type: "success",
      });
      setTimeout(() => {
        handleCloseModal();
      }, 15000);
    } catch (error) {
      setErrorMessage("Không thể thêm bàn. Vui lòng thử lại!");
      console.error("Error adding table:", error);
    }
  };

  return (
    <div className={style["AddTable-container"]}>
      <h2>Thêm bàn mới</h2>
      <label htmlFor="table-seats">Số lượng ghế: </label>
      <input
        type="number"
        placeholder="Số ghế"
        value={table.number_of_seats}
        onChange={(e) =>
          setTable({ ...table, number_of_seats: e.target.value })
        }
      />
      <label htmlFor="table-status">Tình trạng bàn:</label>
      <select
        value={table.status}
        onChange={(e) => setTable({ ...table, status: e.target.value })}
      >
        <option value="A">Trống</option>
        <option value="R">Đã đặt</option>
        <option value="OP">Đang phục vụ</option>
        <option value="OFS">Hoàn tất</option>
      </select>

      {errorMessage && <p className={style["error-message"]}>{errorMessage}</p>}

      <button className={style["submit-button"]} onClick={handleAddTable}>
        Thêm bàn
      </button>

      {modal.isOpen && (
        <ModalGeneral
          isOpen={modal.isOpen}
          text={modal.text}
          type={modal.type}
          onClose={handleCloseModal}
          onConfirm={modal.onConfirm}
        />
      )}
    </div>
  );
}

export default AddTable;
