import React from 'react';
import {QRCodeSVG} from 'qrcode.react';

const QRCodeGenerator = ({ invoiceID }) => {
  const qrData = `${window.location.origin}/review/rating/${invoiceID}`;

  return (
    <div>
      <h1>QR Code for Invoice</h1>
      <QRCodeSVG value={qrData} size={256} />
      <p>Scan this QR code to review the invoice</p>
    </div>
  );
};

export default QRCodeGenerator;
