import React from 'react';
import {QRCodeSVG} from 'qrcode.react';

const QRCodeGenerator = ({ invoiceID }) => {
  const qrData = `${window.location.origin}/review/rating/${invoiceID}`;

  return (
    <div>
      <QRCodeSVG value={qrData} size={128} />
    </div>
  );
};

export default QRCodeGenerator;
