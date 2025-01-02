import React, { useState } from "react";
import style from "./../../../Style/AdminStyle/AddTableModal.module.css";

function AddTableModal({ isOpen, onClose, onAddTable }) {
  const [numberOfSeats, setNumberOfSeats] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddTable = () => {
    if (!numberOfSeats) {
      setErrorMessage("Vui lòng nhập số ghế!");
      return;
    }
    onAddTable({ number_of_seats: numberOfSeats, status: "A" });
    setNumberOfSeats(""); // Reset input
    setErrorMessage(""); // Reset lỗi
    onClose(); // Đóng modal
  };

  if (!isOpen) return null;

  return (
    <div className={style.modal}>
      <div className={style["modal-content"]}>
        <button className={style.close} onClick={onClose}>
          &times;
        </button>
        <h3>THÊM BÀN MỚI</h3>
        <div className={style["form-group"]}>
          <label htmlFor="seats">Số lượng ghế:</label>
          <input
            type="number"
            id="seats"
            placeholder="Nhập số ghế"
            value={numberOfSeats}
            onChange={(e) => setNumberOfSeats(e.target.value)}
          />
        </div>
        {errorMessage && <p className={style.error}>{errorMessage}</p>}
        <div className={style["modal-actions"]}>
          <button className={style["add-button"]} onClick={handleAddTable}>
            Thêm bàn
          </button>
          <button className={style["cancel-button"]} onClick={onClose}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTableModal;
