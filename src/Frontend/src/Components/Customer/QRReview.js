import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import style from "../Employee/EmployeeReservation/ExportInvoice.module.css";

const QRCodeGenerator = ({ invoiceID }) => {
  const qrData = `${window.location.origin}/review/rating/${invoiceID}`;

  return (
    <div className={style['qr-ctn']}>
      <p>Quét mã để đánh giá nhà hàng của chúng tôi</p>
      <QRCodeSVG value={qrData} size={128} />
    </div>
  );
};

export default QRCodeGenerator;
