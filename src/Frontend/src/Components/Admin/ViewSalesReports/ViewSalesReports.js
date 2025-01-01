import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { getInvoice } from "../../../API/AdminAPI";
import { refreshToken } from "../../../API/authAPI";
import { isTokenExpired } from "../../../utils/tokenHelper.mjs";
import { useAuth } from "../../Auth/AuthContext";
import style from "./../../../Style/AdminStyle/ViewSalesReports.module.css"; // Import file CSS

function ViewSalesReports() {
  const { accessToken, setAccessToken } = useAuth();
  const [reportType, setReportType] = useState("Tháng"); // Loại báo cáo: Tháng, Quý, Năm
  const [chartData, setChartData] = useState({}); // Dữ liệu biểu đồ
  const [error, setError] = useState(null); // Lưu lỗi nếu có
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const navigate = useNavigate();

  useEffect(() => {
    const refresh = localStorage.getItem("refreshToken");
    const fetchInvoices = async () => {
      const ensureActiveToken = async () => {
        let activeToken = accessToken;
        if (isTokenExpired(accessToken)) {
          try {
            const refreshed = await refreshToken(refresh);
            activeToken = refreshed.access;
            setAccessToken(activeToken);
          } catch (error) {
            console.error("Error refreshing token:", error);
            throw error;
          }
        }
        return activeToken;
      };

      try {
        setLoading(true); // Đặt trạng thái đang tải
        const token = await ensureActiveToken(); // Gọi hàm để lấy token
        let response = await getInvoice(token); // Truyền token vào hàm getInvoice
        const data = response;

        // Lọc hóa đơn đã thanh toán
        const paidInvoices = data.filter((invoice) => invoice.status === "P");

        // Xử lý dữ liệu theo loại báo cáo
        if (paidInvoices.length === 0) {
          setError(null); // Không có lỗi
          setChartData({}); // Không có dữ liệu
        } else if (reportType === "Tháng") {
          generateMonthlyData(paidInvoices);
        } else if (reportType === "Quý") {
          generateQuarterlyData(paidInvoices);
        } else if (reportType === "Năm") {
          generateYearlyData(paidInvoices);
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError("Không thể tải dữ liệu hóa đơn. Vui lòng thử lại sau.");
      } finally {
        setLoading(false); // Kết thúc tải
      }
    };

    fetchInvoices();
  }, [reportType]);

  const generateMonthlyData = (invoices) => {
    const revenueByMonth = Array(12).fill(0);
    invoices.forEach((invoice) => {
      const month = new Date(invoice.datetime).getMonth();
      revenueByMonth[month] += invoice.final_price;
    });

    setChartData({
      labels: [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ],
      datasets: [
        {
          label: "Doanh thu (VNĐ)",
          data: revenueByMonth,
          borderColor: "#3e95cd",
          backgroundColor: "rgba(62, 149, 205, 0.4)",
          fill: true,
        },
      ],
    });
  };

  const generateQuarterlyData = (invoices) => {
    const revenueByQuarter = Array(4).fill(0);
    invoices.forEach((invoice) => {
      const month = new Date(invoice.datetime).getMonth();
      const quarter = Math.floor(month / 3);
      revenueByQuarter[quarter] += invoice.final_price;
    });

    setChartData({
      labels: ["Quý 1", "Quý 2", "Quý 3", "Quý 4"],
      datasets: [
        {
          label: "Doanh thu (VNĐ)",
          data: revenueByQuarter,
          borderColor: "#8e5ea2",
          backgroundColor: "rgba(142, 94, 162, 0.4)",
          fill: true,
        },
      ],
    });
  };

  const generateYearlyData = (invoices) => {
    const revenueByYear = {};
    invoices.forEach((invoice) => {
      const year = new Date(invoice.datetime).getFullYear();
      if (!revenueByYear[year]) {
        revenueByYear[year] = 0;
      }
      revenueByYear[year] += invoice.final_price;
    });

    setChartData({
      labels: Object.keys(revenueByYear),
      datasets: [
        {
          label: "Doanh thu (VNĐ)",
          data: Object.values(revenueByYear),
          borderColor: "#3cba9f",
          backgroundColor: "rgba(60, 186, 159, 0.4)",
          fill: true,
        },
      ],
    });
  };

  return (
    <div className={style["viewsalesreport-container"]}>
      <h2 className={style["viewsalesreport-title"]}>Báo cáo doanh thu</h2>
      <div className={style["viewsalesreport-button-group"]}>
        <button
          className={`${style["button"]} ${
            reportType === "Tháng" ? style["selected"] : ""
          }`}
          onClick={() => setReportType("Tháng")}
        >
          Tháng
        </button>
        <button
          className={`${style["button"]} ${
            reportType === "Quý" ? style["selected"] : ""
          }`}
          onClick={() => setReportType("Quý")}
        >
          Quý
        </button>
        <button
          className={`${style["button"]} ${
            reportType === "Năm" ? style["selected"] : ""
          }`}
          onClick={() => setReportType("Năm")}
        >
          Năm
        </button>
      </div>

      {loading ? (
        <p className={style["viewsalesreport-error-message"]}>
          Đang tải dữ liệu...
        </p>
      ) : error ? (
        <p className={style["viewsalesreport-error-message"]}>{error}</p>
      ) : chartData.labels &&
        chartData.datasets &&
        chartData.datasets[0].data.some((value) => value > 0) ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: "bottom",
              },
            },
            scales: {
              y: {
                title: {
                  display: true,
                  text: "Doanh thu (VNĐ)",
                },
                ticks: {
                  callback: (value) =>
                    value.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }),
                },
              },
            },
          }}
        />
      ) : (
        <p className={style["viewsalesreport-message"]}>
          Cửa hàng chưa có doanh thu.
        </p>
      )}
    </div>
  );
}

export default ViewSalesReports;
