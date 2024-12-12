const TableWithChairsTopView = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width="200"
      height="200"
    >
      {/* Bàn (hình vuông) */}
      <rect
        x="50"
        y="50"
        width="100"
        height="100"
        fill="#c69c6d"
        transform="rotate(45 100 100)"
      />
  
      {/* Ghế trên */}
      <rect x="90" y="20" width="20" height="30" fill="#8b5e3c" />
      {/* Ghế dưới */}
      <rect x="90" y="150" width="20" height="30" fill="#8b5e3c" />
      {/* Ghế trái */}
      <rect x="20" y="90" width="30" height="20" fill="#8b5e3c" />
      {/* Ghế phải */}
      <rect x="150" y="90" width="30" height="20" fill="#8b5e3c" />
    </svg>
  );
  
  export default TableWithChairsTopView;
  