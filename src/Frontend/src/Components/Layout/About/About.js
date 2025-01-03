import React, { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "./About.css";

const About = () => {
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      header.classList.add("header-over-banner");
    }

    return () => {
      if (header) {
        header.classList.remove("header-over-banner");
      }
    };
  }, []);

  const imageCount = 41;
  const images = Array.from({ length: imageCount }, (_, index) => {
    return `${process.env.PUBLIC_URL}/assets/images/Restaurant/${
      index + 1
    }.jpg`;
  });

  const overviewImages = images.slice(0, 20);
  const foodImages = images.slice(20, 41);

  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const getActiveImages = () => {
    if (activeTab === "overview") return overviewImages;
    if (activeTab === "food") return foodImages;
    return images;
  };

  // Chuyển đổi mảng ảnh thành định dạng slides cho lightbox
  const getSlides = () => {
    return getActiveImages().map((src) => ({ src }));
  };

  return (
    <div className="about-container">
      <div className="about-banner">
        <img
          src={`${process.env.PUBLIC_URL}/assets/images/Restaurant/Banner.jpg`}
          alt="About Us Banner"
          className="banner-image"
        />
      </div>

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

        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={getSlides()}
          index={photoIndex}
          on={{
            view: ({ index }) => setPhotoIndex(index)
          }}
        />
      </div>
    </div>
  );
};

export default About;