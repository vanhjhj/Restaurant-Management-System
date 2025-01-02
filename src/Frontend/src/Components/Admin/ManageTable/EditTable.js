import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import style from "./../../../Style/AdminStyle/EditTable.module.css";
import { GetTableById, UpdateTable } from "../../../API/AdminAPI";
import { ModalGeneral } from "../../ModalGeneral";
import { useAuth } from "../../Auth/AuthContext";
import { isTokenExpired } from "../../../utils/tokenHelper.mjs";
import { refreshToken } from "../../../API/authAPI";

function EditTable() {
  const { id } = useParams(); // Lấy ID bàn từ URL
  const { accessToken, setAccessToken } = useAuth();
  const navigate = useNavigate();
  const [table, setTable] = useState(null); // Khởi tạo `null` để kiểm tra
  const [errorMessage, setErrorMessage] = useState("");
  const [modal, setModal] = useState({
    isOpen: false,
    text: "",
    type: "",
    onConfirm: null,
  });

  // Ensure token is valid
  const ensureActiveToken = async () => {
    let activeToken = accessToken;
    const refresh = localStorage.getItem("refreshToken");
    if (!accessToken || isTokenExpired(accessToken)) {
      const refreshed = await refreshToken(refresh);
      activeToken = refreshed.access;
      setAccessToken(activeToken);
    }
    return activeToken;
  };

  useEffect(() => {
    const fetchTable = async () => {
      try {
        const token = await ensureActiveToken();
        const data = await GetTableById(id, token);
        setTable(data); // Gán dữ liệu từ API
      } catch (error) {
        console.error("Error fetching table:", error);
      }
    };
    fetchTable();
  }, [id]);

  const handleCloseModal = () => {
    setModal({ isOpen: false });
    navigate("/admin-dashboard/manage-table");
  };

  const handleUpdateTable = async () => {
    if (!table.number_of_seats || !table.status) {
      setErrorMessage("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    try {
      const token = await ensureActiveToken();
      await UpdateTable(
        table.id,
        {
          number_of_seats: table.number_of_seats,
          status: table.status,
        },
        token
      );
      setModal({
        isOpen: true,
        text: "Chỉnh sửa bàn thành công!",
        type: "success",
        onConfirm: handleCloseModal
      });
    } catch (error) {
      setErrorMessage("Không thể cập nhật bàn. Vui lòng thử lại!");
      console.error("Error updating table:", error);
    }
  };

  if (!table) {
    // Hiển thị "Đang tải..." nếu dữ liệu chưa được tải
    return <div className={style["EditTable-container"]}>Đang tải...</div>;
  }

  return (
    <div className={style["EditTable-container"]}>
      <h2>Chỉnh sửa bàn số {table.id}</h2>

      <label htmlFor="table-seats">Số lượng ghế:</label>
      <input
        id="table-seats"
        type="number"
        placeholder="Số lượng ghế"
        value={table.number_of_seats}
        onChange={(e) =>
          setTable({ ...table, number_of_seats: e.target.value })
        }
      />

      <label htmlFor="table-status">Tình trạng bàn:</label>
      <select
        id="table-status"
        value={table.status}
        onChange={(e) => setTable({ ...table, status: e.target.value })}
      >
        <option value="A">Trống</option>
        <option value="R">Đã đặt</option>
        <option value="OP">Đang phục vụ</option>
        <option value="OFS">Hoàn tất</option>
      </select>

      {errorMessage && <p className={style["error-message"]}>{errorMessage}</p>}

      <button className={style["submit-button"]} onClick={handleUpdateTable}>
        Lưu
      </button>

      {modal.isOpen && (
        <ModalGeneral
          isOpen={modal.isOpen}
          text={modal.text}
          type={modal.type}
          onClose={modal.onConfirm || (() => setModal({ isOpen: false }))}
          onConfirm={modal.onConfirm}
        />
      )}
    </div>
  );
}

export default EditTable;
