import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react'
import style from './HomePage.css'

function HomePage() {
  const navigate = useNavigate(); // Khởi tạo hook useNavigate

  const handleNavigate = () => {
    navigate('/menu'); // Điều hướng đến trang menu
  };
  return (
    /*<div id="viewport">
      <div id="js-scroll-content">
        <section className="main-banner" id="home">
          <div className="js-parallax-scene">
            <div className="banner-shape-1 w-100" data-depth="0.30">
              <img src="assets/images/berry.png" alt="" />
            </div>
            <div className="banner-shape-2 w-100" data-depth="0.25">
              <img src="assets/images/leaf.png" alt="" />
            </div>
          </div>
          <div className="sec-wp">
            <div className="container">
              <div className="row">
                <div className="col-lg-6">
                  <div className="banner-text">
                    <h1 className="h1-title">
                      Welcome to <span>Citrus Royale</span> restaurant.
                    </h1>
                    <div className="banner-btn mt-4">
                      <button onClick={handleNavigate} className="sec-btn">
                        Check our Menu
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="banner-img-wp">
                    <div
                      className="banner-img"
                      style={{ backgroundImage: "url(assets/images/main-b.jpg)" }}
                    ></div>
                  </div>
                  <div className="banner-img-text mt-4 m-auto">
                    <h5 className="h5-title">Sushi</h5>
                    <p>
                      this is Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>*/
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
