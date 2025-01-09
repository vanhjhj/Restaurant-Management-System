import React, { useEffect, useState } from "react";
import style from "./EmployeeReservation.module.css";
import { MdTableRestaurant } from "react-icons/md"; // Sử dụng icon chỉnh sửa từ react-icons
import {
  fetchTablesData,
  fetchReservationData,
  assignTableAPI,
  markDoneReservationAPI,
  markCancelReservationAPI,
  unsignTableAPI,
  createOrder,
  fetchDateData,
} from "../../../API/EE_ReservationAPI";
import { useAuth } from "../../Auth/AuthContext";
import { isTokenExpired } from "../../../utils/tokenHelper.mjs";
import { refreshToken } from "../../../API/authAPI";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai"; // Import biểu tượng chỉnh sửa
import TableIcon from "./tableIcon";
import Invoice from "./Invoice";
import EditReservation from "./EditReservation";

import Select from "react-select";
import { useNavigate } from "react-router-dom";

function EmployeeReservation() {
  const { accessToken, setAccessToken } = useAuth();
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchStatus, setSearchStatus] = useState("Tất cả");
  const [inputTable, setInputTable] = useState({ id: null, value: "" });
  const [errorMessage, setErrorMessage] = useState();
  const [errorPos, setErrorPos] = useState();
  const [editReservation, setEditReservation] = useState();
  const [filterStatus, setFilterStatus] = useState("0");
  const navigate = useNavigate();
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")}`;

  const [filterDate, setFilterDate] = useState(today);

  function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  }

  const options = [
    { value: "0", label: <>Tất cả</> },
    { value: "P", label: <>Chờ</> },
    { value: "A", label: <>Gán</> },
    { value: "C", label: <>Hủy</> },
    { value: "D", label: <>Xong</> },
  ];
  const ensureActiveToken = async () => {
    const refresh = localStorage.getItem("refreshToken");
    if (!refresh || isTokenExpired(refresh)) {
              navigate('/', { replace: true });
              window.location.reload();
              throw 'Phiên đăng nhập hết hạn';
            }
    let activeToken = accessToken;

    if (!accessToken || isTokenExpired(accessToken)) {
      const refreshed = await refreshToken(refresh);
      activeToken = refreshed.access;
      setAccessToken(activeToken);
    }
    return activeToken;
  };

  const getTableColor = (status) => {
    if (status === "A") {
      return "#000000";
    } else if (status === "R") {
      return "#FFC107";
    } else if (status === "S") {
      return "#007BFF";
    } else if (status === "D") {
      return "#28A745";
    }
  };

  const checkReservationStatus = (status) => {
    if (status === "P") {
      return "yellow";
    } else if (status === "A") {
      return "blue";
    } else if (status === "C") {
      return "red";
    } else if (status === "D") {
      return "green";
    }
  };

  const fetchData = async () => {
    try {
      const activeToken = await ensureActiveToken();
      const tablesData = await fetchTablesData(activeToken);
      setTables(
        tablesData.map((table) => ({
          ...table,
          isShowInvoice: false,
        }))
      );

      const reservationsData = await fetchReservationData(activeToken);
      setReservations(
        reservationsData.map((reser) => ({
          ...reser,
          isEditing: false,
        }))
      );
      setFilterDate(today);
    } catch (error) {
      console.error(error);
    }
  };

  const getDateData = async (date) => {
    try {
      const activeToken = await ensureActiveToken();

      const reservationsData = await fetchDateData(activeToken, filterDate);
      setReservations(
        reservationsData.map((reser) => ({
          ...reser,
          isEditing: false,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDateData();
  }, [filterDate]);

  useEffect(() => {
    fetchData();
  }, []);

  function formatInputDate(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const handleEdit = (id) => {
    setReservations((preReser) =>
      preReser.map((r) => (r.id === id ? { ...r, isEditing: true } : r))
    );
  };

  const handleCancelEdit = (id) => {
    setInputTable({ id: null, value: "" });
    setReservations((preReser) =>
      preReser.map((r) => (r.id === id ? { ...r, isEditing: false } : r))
    );
    setErrorMessage();
  };

  const handleSave = (id) => {
    const hasIdInTablesData = () => {
      return tables.some(
        (table) => table.id == inputTable.value && table.status === "A"
      );
    };
    const assignTable = async () => {
      if (!hasIdInTablesData()) {
        setErrorPos(id);
        setErrorMessage("Lỗi: Bàn trên không tồn tại hoặc không thể gán.");
        return;
      }
      
      try {
        const activeToken = await ensureActiveToken();
        const result = await assignTableAPI(
          activeToken,
          inputTable.id,
          inputTable.value
        );
        fetchData();
        setInputTable({ id: null, value: "" });
        setErrorMessage();
      } catch (error) {
        setErrorPos(id);
        setErrorMessage("Lỗi: Bàn trên không tồn tại hoặc không thể gán.");
      }
    };
    assignTable();
  };

  const handleEraseTable = async (id) => {

    try {
      const activeToken = await ensureActiveToken();
      const result = await unsignTableAPI(activeToken, id);
      fetchData();
      setInputTable({ id: null, value: "" });
    } catch (error) {
      setErrorPos(id);
      setErrorMessage("Lỗi: Không tìm thấy bàn để xóa.");
    }
  };

  const handleDoneReservation = async (id, tID) => {

    try {
      const activeToken = await ensureActiveToken();
      const result = await markDoneReservationAPI(activeToken, id);
      createOrder(accessToken, tID);
      fetchData();
      setInputTable({ id: null, value: "" });
      setErrorMessage();
    } catch (error) {
      setErrorPos(id);
      setErrorMessage("Lỗi: Không tìm thấy phiếu đặt.");
    }
  };

  const handleCancelReservation = async (id) => {

    try {
      const activeToken = await ensureActiveToken();
      const result = await markCancelReservationAPI(activeToken, id);
      fetchData();
      setInputTable({ id: null, value: "" });
      setErrorMessage();
    } catch (error) {
      setErrorPos(id);
      setErrorMessage("Lỗi: Không tìm thấy phiếu đặt.");
    }
  };

  const filterReservation = (r, name, date, status) => {
    const formattedDate = new Date(r.date).toISOString().split("T")[0];

    // Kiểm tra theo ngày (nếu filterDate được cung cấp)
    const isDateMatch = !filterDate || formattedDate === filterDate;

    if (status == "0")
      return (
        r.guest_name.toLowerCase().includes(name.toLowerCase()) && isDateMatch
      );
    return (
      r.guest_name.toLowerCase().includes(name.toLowerCase()) &&
      r.status === status &&
      isDateMatch
    );
  };

  const handleShowInvoice = (id, status) => {
    setTables((preTable) =>
      preTable.map((table) =>
        table.id === id ? { ...table, isShowInvoice: status } : table
      )
    );
    if (!status) fetchData();
  };

  const reservationFilered = reservations.filter((r) =>
    filterReservation(r, searchName, filterReservation, filterStatus)
  );

  const calNumberOfEmptyTable = (t) => {
    return t.filter((table) => table.status === "A").length;
  }
  const checkDisableStatus = (status) => {
    return status !== 'P' && status !== 'A'
  }

    return (
      <div className={style['EER-container']}>
            <div className={style['body-EER']}> 
                <div className={style['sidebar-container']}>
                    <div className={style['container']}>
                        <div className={style['row']}>
                            <div className={style['col-lg-12']}>
                                <div className={style["section-r-title"]}>
                                  <div>
                                    <h2>Danh sách các phiếu đặt</h2>
                                  </div>
                                    <div className={style['status-reservation-info']}>
                                        <section className={style['section-reservation-info']}>
                                            <div className={style['my-square'] + ' ' + style['yellow']}></div>
                                            <p>Chờ</p>
                                        </section>
                                        <section className={style['section-reservation-info']}>
                                            <div className={style['my-square'] + ' ' + style['blue'] }></div>
                                            <p>Gán</p>
                                        </section>
                                        <section className={style['section-reservation-info']}>
                                            <div className={style['my-square'] + ' ' + style['green']}></div>
                                            <p>Xong</p>
                                        </section>
                                        <section className={style['section-reservation-info']}>
                                            <div className={style['my-square'] + ' ' + style['red']}></div>
                                            <p>Hủy</p>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={style["search-row"]}>
                            <div className={style['col-lg-12']}>
                                <div className={style['search-cus']}>
                                    <input type='text'  
                                        placeholder="Tìm theo tên..."
                                        value={searchName}
                                        onChange={e => setSearchName(e.target.value)}
                                        className={style['input-search-cus']} />
                                    <button type="button" className={style["input-search-btn"]}>
                                        <i className="fas fa-search"></i>
                                    </button>
                                </div>
                </div>
                
              </div>    
              <div className={style['row'] + ' '+ style['my-input-row']}>
                <div className={style['col-lg-6']}>
                    <label><input type="date" id="date-input" name="date" className={style['my-input-date']} value={filterDate} defaultValue={today} onChange={(e) => setFilterDate(e.target.value)}/></label>
                </div>
                <div className={style['col-lg-6']}>
                  <div className={style['filter-category']}>
                              <Select options={options} onChange={(selectedOption) => setFilterStatus(selectedOption.value)}  defaultValue={options[0]} />
                </div>
              </div>
            </div>

            <div className={style["row"]}>
              {reservationFilered.map((r) => (
                <div key={r.id} className={style["col-lg-12"]}>
                  <div className={style["reservation-info"]}>
                    <div
                      className={
                        style[checkReservationStatus(r.status)] +
                        " " +
                        style["reservation-header"]
                      }
                    >
                      <h5>Mã phiếu đặt: {r.id}</h5>
                      <button
                        className={style["edit-reservation"]}
                        title='Chỉnh sửa phiếu đặt'
                        disabled={checkDisableStatus(r.status)}
                        onClick={() => setEditReservation(r)}
                      >
                        <AiOutlineEdit size={20} />
                      </button>
                    </div>
                    <p>Tên KH: {r.guest_name}</p>
                    <p>Số điện thoại: {r.phone_number}</p>
                    <p>Số lượng khách:{r.number_of_guests} </p>
                    <p>Ngày: {formatDate(r.date)}</p>
                    <p>Thời gian: {r.time}</p>
                    <p className={style["my-note"]}>Ghi chú: {r.note}</p>
                    <div className={style[""]}>
                      {errorMessage && r.id === errorPos ? (
                        <p className={style["error-message"]}>{errorMessage}</p>
                      ) : (
                        <p></p>
                      )}
                    </div>
                    <div className={style["input-table-ctn"]}>
                      {r.isEditing ? (
                        <div className={style["input-table-input"]}>
                          <p className={style["input-table-text"]}>Bàn số: </p>
                          <input
                            type="text"
                            value={r.isEditing ? inputTable.value : r.table}
                            onChange={(e) =>
                              setInputTable({ id: r.id, value: e.target.value })
                            }
                            autoFocus
                          />
                        </div>
                      ) : (
                        <p className={style["input-table-text"]}>
                          Bàn số: {r.table}
                        </p>
                      )}
                      <div className={style["input-table-btn"]}>
                        <button
                          className={style["input-table-edit-btn"] + ' ' +  style[(r.status === "A" || r.status === "P") ? "" : "inactive-btn"]}
                          disabled={checkDisableStatus(r.status)}
                          title={r.isEditing ? "Lưu bàn" : "Chỉnh sửa phiếu đặt"}
                          onClick={() =>
                            r.isEditing ? handleSave(r.id) : handleEdit(r.id)
                          }
                        >
                          {r.isEditing ? "Lưu" : <AiOutlineEdit size={20} />}
                        </button>
                        <button
                          className={style["input-table-erase-btn"] + ' ' +  style[(r.status === "A" || r.status === "P") ? "" : "inactive-btn"]}
                          title={r.isEditing ? "Hủy chỉnh sửa" : "Xóa bàn"}
                          disabled={checkDisableStatus(r.status)}
                          onClick={() =>
                            r.isEditing
                              ? handleCancelEdit(r.id)
                              : handleEraseTable(r.id)
                          }
                        >
                          {r.isEditing ? "Hủy" : <AiOutlineDelete size={20} />}
                        </button>
                      </div>
                    </div>
                    <div className={style["status-btn-ctn"]}>
                      <button
                        className={
                          style["status-btn"] +
                          " " +
                          style[r.status === "A" ? "" : "inactive-btn"]
                        }
                        title='Xong'
                        onClick={() => {
                          if (r.status === "A") {
                            handleDoneReservation(r.id, r.table);
                          }
                        }}
                      >
                        Xong
                      </button>
                      <button
                        className={
                          style["status-btn"] +
                          " " +
                          style[
                            r.status !== "D" && r.status !== "C"
                              ? ""
                              : "inactive-btn"
                          ]
                        }
                        title='Hủy phiếu đặt'
                        onClick={() => {
                          if (r.status !== "D" && r.status !== "C") {
                            handleCancelReservation(r.id);
                          }
                        }}
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={style["Table-container"]}>
          <div className={style["container"]}>
            <div className={style["row"]}>
              <div className={style["col-lg-12"]}>
                <div className={style["section-title"]}>
                  <div>
                    <h2>Danh sách các bàn</h2>
                    <p className={[style["empty-number-table"]]}>
                      Số lượng bàn trống: {calNumberOfEmptyTable(tables)} /{" "}
                      {tables.length}
                    </p>
                  </div>
                  <div className={style["table-status-info"]}>
                    <section className={style["section-status-info"]}>
                      <TableIcon
                        w={64}
                        h={64}
                        c={getTableColor("A")}
                      ></TableIcon>
                      <p>Bàn trống</p>
                    </section>
                    <section className={style["section-status-info"]}>
                      <TableIcon
                        w={64}
                        h={64}
                        c={getTableColor("R")}
                      ></TableIcon>
                      <p>Bàn đã được đặt</p>
                    </section>
                    <section className={style["section-status-info"]}>
                      <TableIcon
                        w={64}
                        h={64}
                        c={getTableColor("S")}
                      ></TableIcon>
                      <p>Bàn đang phục vụ</p>
                    </section>
                    <section className={style["section-status-info"]}>
                      <TableIcon
                        w={64}
                        h={64}
                        c={getTableColor("D")}
                      ></TableIcon>
                      <p>Bàn phục vụ xong</p>
                    </section>
                  </div>
                </div>
              </div>
            </div>
            {editReservation && (
              <EditReservation
                setShow={setEditReservation}
                info={editReservation}
              ></EditReservation>
            )}
            <div className={style["table-info-ctn"]}>
              <div className={style["row"]}>
                {tables.map((table) => (
                  <div key={table.id} className={style["col-lg-2"]}>
                    <div
                      className={style["table-info"]}
                      onClick={() =>
                        handleShowInvoice(table.id, !table.isShowInvoice)
                      }
                    >
                      <TableIcon
                        w={64}
                        h={64}
                        c={getTableColor(table.status)}
                      />
                      <p>Bàn số: {table.id}</p>
                      <p>Số lượng ghế: {table.number_of_seats}</p>
                    </div>
                    {table.isShowInvoice && (
                      <Invoice
                        tableID={table.id}
                        setShowInvoice={handleShowInvoice}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeReservation;
