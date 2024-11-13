import React from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate(); // Khởi tạo hook useNavigate

  const handleNavigate = () => {
    navigate('/menu'); // Điều hướng đến trang menu
  };

  return (
    <div className="home-container">
      <div className="text-section">
        <h1>Welcome To <span>Citrus Royale</span> Restaurant.</h1>
        <button onClick={handleNavigate} className="cta-button">Check Our Menu</button>
      </div>
      <div className="image-section">
        <img src="/assets/images/main-b.jpg" alt="Sushi" />
      </div>
    </div>
  );
}

export default HomePage;
