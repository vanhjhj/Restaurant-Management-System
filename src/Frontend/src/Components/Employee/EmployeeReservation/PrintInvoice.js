import React, { useContext, useState ,useRef, useEffect } from "react";
import { RestaurantContext } from "../../../Config/RestaurantContext";
import { useAuth } from "../../Auth/AuthContext";
import { isTokenExpired } from "../../../utils/tokenHelper.mjs";
import { refreshToken } from "../../../API/authAPI";
import { markPaid } from "../../../API/EE_ReservationAPI";
import SuccessMessage from "./SuccessMessage";
import InvoicePrintable from "./InvoicePrintable";
import style from "./PrintInvoice.module.css";
import { createPaymentRequest } from "../../../API/MoMoAPI";
import axios from "axios";

function PrintInvoice({ setShow, foodData, invoiceData, pID, iID, setShowInvoice }) {
    const [momoQRUrl, setMomoQRUrl] = useState(""); 
    const { restaurantInfo } = useContext(RestaurantContext);
    const { accessToken, setAccessToken } = useAuth();
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const printRef = useRef();

    // Hàm gọi API MoMo để tạo URL thanh toán
    const handleGenerateMomoPayment = async () => {
        if (!invoiceData) return;
    
        const amount = invoiceData?.final_price || 0; // Amount to be paid
        const orderId = `HD-${invoiceData?.id || "N/A"}`; // Unique order ID
        const orderInfo = `Thanh toán hóa đơn ${invoiceData?.id}`; // Order details
    
        try {
          // Send request to the backend server to create a MoMo payment URL
          const response = await axios.post("http://localhost:5000/api/momo/create", {
            amount,
            orderId,
            orderInfo,
          });
    
          if (response.data.resultCode === 0) {
            console.log("Pay URL:", response.data.payUrl);
            setMomoQRUrl(response.data.payUrl); // Set the MoMo QR URL for rendering
          } else {
            console.error("Error from MoMo API:", response.data);
            setErrorMessage("Có lỗi xảy ra từ MoMo. Vui lòng thử lại.");
          }
        } catch (error) {
          console.error("Error calling MoMo API:", error.message);
          setErrorMessage("Không thể tạo URL thanh toán. Vui lòng thử lại.");
        }
      };
    

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

  const handlePrint = () => {
    const printContent = printRef.current; // Lấy nội dung cần in từ ref
    const printWindow = window.open("", "_printInvoice"); // Tạo cửa sổ in mới

    // Lấy style hiện tại từ tài liệu gốc
    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join("");
        } catch (err) {
          console.error("Error reading CSS rules", err);
          return "";
        }
      })
      .join("");

    // Viết nội dung cần in vào tài liệu của cửa sổ mới
    printWindow.document.write(`
      <html>
        <head>
          <title>Hóa Đơn</title>
          <style>${styles}</style> <!-- Thêm CSS vào tài liệu in -->
        </head>
        <body>
          ${printContent.outerHTML} <!-- Chèn nội dung cần in -->
        </body>
      </html>
    `);

    printWindow.document.close(); // Đóng tài liệu mới
    printWindow.print(); // Kích hoạt lệnh in
  };

  const handlePay = async () => {
    try {
      const activeToken = await ensureActiveToken();
      await markPaid(activeToken, iID); // API đánh dấu thanh toán
      setSuccess(true); // Hiển thị thông báo thành công
      setShow(false); // Đóng modal sau khi thanh toán
    } catch (error) {
      setErrorMessage("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại!");
    }
  };

  useEffect(() => {
    if (invoiceData) {
      handleGenerateMomoPayment();
    }
  }, [invoiceData]);

  return (
    <div className={style["Invoice-modal"]}>
      <div className={style["Invoice-modal-content"]}>
        <button className={style["Invoice-close-modal"]} onClick={() => setShow(false)}>
          &times;
        </button>

        <div ref={printRef}>
          <InvoicePrintable
            restaurantInfo={restaurantInfo}
            foodData={foodData}
            invoiceData={invoiceData}
            momoQRUrl={momoQRUrl}
          />
        </div>

        <div className={style["Invoice-action-buttons"]}>
          <button className={style["Invoice-btn"]} onClick={handlePrint}>
            In hóa đơn
          </button>
          <button className={style["Invoice-btn"]} onClick={handlePay}>
            Thanh toán
          </button>
        </div>

        {errorMessage && <p className={style["Invoice-error"]}>{errorMessage}</p>}
        {success && (
          <SuccessMessage
            setShow={setSuccess}
            setShowExInvoice={setShow}
            setShowInvoice={setShowInvoice}
          />
        )}
      </div>
    </div>
  );
}

export default PrintInvoice;
