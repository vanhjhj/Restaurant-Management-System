import React, { useState, useEffect } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import "./About.css"; // Import CSS để định dạng

const About = () => {
  useEffect(() => {
    // Thêm lớp `header-over-banner` khi vào trang About
    const header = document.querySelector("header");
    if (header) {
      header.classList.add("header-over-banner");
    }

    // Loại bỏ lớp khi rời khỏi trang About
    return () => {
      if (header) {
        header.classList.remove("header-over-banner");
      }
    };
  }, []);

  const imageCount = 41; // Số lượng ảnh
  const images = Array.from({ length: imageCount }, (_, index) => {
    return `${process.env.PUBLIC_URL}/assets/images/Restaurant/${
      index + 1
    }.jpg`;
  });

  const overviewImages = images.slice(0, 20); // 10 ảnh cho tab "Overview"
  const foodImages = images.slice(20, 41); // 12 ảnh cho tab "Food"

  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // "all", "overview", "food"

  const getActiveImages = () => {
    if (activeTab === "overview") return overviewImages;
    if (activeTab === "food") return foodImages;
    return images; // Tab "All"
  };

  return (
    <div className="about-container">
      {/* Ảnh lớn phía trên */}
      <div className="about-banner">
        <img
          src={`${process.env.PUBLIC_URL}/assets/images/Restaurant/Banner.jpg`}
          alt="About Us Banner"
          className="banner-image"
        />
      </div>

      {/* Phần Gallery */}
      <div className="gallery-section">
        <h1>ABOUT US</h1>
        <div className="gallery-tabs">
          <button
            className={`tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All photos & videos
          </button>
          <button
            className={`tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overviews
          </button>
          <button
            className={`tab ${activeTab === "food" ? "active" : ""}`}
            onClick={() => setActiveTab("food")}
          >
            Food
          </button>
        </div>

        <div className="gallery-grid">
          {getActiveImages().map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Gallery Image ${index + 1}`}
              className="gallery-thumbnail"
              onClick={() => {
                setPhotoIndex(index);
                setIsOpen(true);
              }}
            />
          ))}
        </div>

        {isOpen && (
          <Lightbox
            mainSrc={getActiveImages()[photoIndex]}
            nextSrc={
              getActiveImages()[(photoIndex + 1) % getActiveImages().length]
            }
            prevSrc={
              getActiveImages()[
                (photoIndex + getActiveImages().length - 1) %
                  getActiveImages().length
              ]
            }
            onCloseRequest={() => setIsOpen(false)}
            onMovePrevRequest={() =>
              setPhotoIndex(
                (photoIndex + getActiveImages().length - 1) %
                  getActiveImages().length
              )
            }
            onMoveNextRequest={() =>
              setPhotoIndex((photoIndex + 1) % getActiveImages().length)
            }
          />
        )}
      </div>
    </div>
  );
};

export default About;
