import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Line } from "react-chartjs-2";
import { getInvoice } from "../../../API/AdminAPI";
import { refreshToken } from "../../../API/authAPI";
import { isTokenExpired } from "../../../utils/tokenHelper.mjs";
import { useAuth } from "../../Auth/AuthContext";

function ViewSalesReports() {
  const { accessToken, setAccessToken } = useAuth();
  const [reportType, setReportType] = useState("Tháng"); // Loại báo cáo: Tháng, Quý, Năm
  const [chartData, setChartData] = useState({}); // Dữ liệu biểu đồ
  const [error, setError] = useState(null); // Lưu lỗi nếu có
  const navigate = useNavigate();

  useEffect(() => {
    const refresh= localStorage.getItem('refreshToken');
    const fetchInvoices = async () => {
      // Đảm bảo token hợp lệ
      const ensureActiveToken = async () => {
        let activeToken = accessToken;
        if (isTokenExpired(accessToken)) {
            try {
                const refreshed = await refreshToken(refresh);
                activeToken = refreshed.access;
                setAccessToken(activeToken);
            } catch (error) {
                console.error('Error refreshing token:', error);
                navigate('/login'); // Điều hướng nếu refresh token thất bại
                throw error;
            }
        }
        return activeToken;
      };
      
      try {
        let response= await getInvoice(ensureActiveToken);
        
        const data = response.data;

        // Lọc hóa đơn đã thanh toán
        const paidInvoices = data.filter((invoice) => invoice.status === "paid");

        // Xử lý dữ liệu theo loại báo cáo
        if (reportType === "Tháng") {
          generateMonthlyData(paidInvoices);
        } else if (reportType === "Quý") {
          generateQuarterlyData(paidInvoices);
        } else if (reportType === "Năm") {
          generateYearlyData(paidInvoices);
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError("Không thể tải dữ liệu hóa đơn. Vui lòng thử lại sau.");
      }
    };

    fetchInvoices();
  }, [reportType]);

  // Tạo dữ liệu doanh thu theo Tháng
  const generateMonthlyData = (invoices) => {
    const revenueByMonth = Array(12).fill(0);
    invoices.forEach((invoice) => {
      const month = new Date(invoice.datetime).getMonth(); // Lấy tháng (0-11)
      revenueByMonth[month] += invoice.final_price; // Cộng dồn doanh thu
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

  // Tạo dữ liệu doanh thu theo Quý
  const generateQuarterlyData = (invoices) => {
    const revenueByQuarter = Array(4).fill(0);
    invoices.forEach((invoice) => {
      const month = new Date(invoice.datetime).getMonth(); // Lấy tháng (0-11)
      const quarter = Math.floor(month / 3); // Xác định quý (0-3)
      revenueByQuarter[quarter] += invoice.final_price; // Cộng dồn doanh thu
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

  // Tạo dữ liệu doanh thu theo Năm
  const generateYearlyData = (invoices) => {
    const revenueByYear = {};
    invoices.forEach((invoice) => {
      const year = new Date(invoice.datetime).getFullYear(); // Lấy năm
      if (!revenueByYear[year]) {
        revenueByYear[year] = 0;
      }
      revenueByYear[year] += invoice.final_price; // Cộng dồn doanh thu
    });

    setChartData({
      labels: Object.keys(revenueByYear), // Danh sách năm
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
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Báo cáo doanh thu</h2>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {/* Nút chọn loại báo cáo */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <button
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            backgroundColor: reportType === "Tháng" ? "#f0ad4e" : "#ddd",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => setReportType("Tháng")}
        >
          Tháng
        </button>
        <button
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            backgroundColor: reportType === "Quý" ? "#f0ad4e" : "#ddd",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => setReportType("Quý")}
        >
          Quý
        </button>
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: reportType === "Năm" ? "#f0ad4e" : "#ddd",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => setReportType("Năm")}
        >
          Năm
        </button>
      </div>

      {/* Biểu đồ */}
      {chartData.labels ? (
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
                    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
                },
              },
            },
          }}
        />
      ) : (
        <p style={{ textAlign: "center" }}>Đang tải dữ liệu...</p>
      )}
    </div>
  );
}

export default ViewSalesReports;
