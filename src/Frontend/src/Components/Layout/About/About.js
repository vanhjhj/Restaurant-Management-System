// src/Components/About.js
import React from 'react';
import './About.css';

function About() {
    return (
        <section className="about-sec" id="about">
            <div className="text-content">
            <h2>Thương Hiệu</h2>
                <p>Với hơn 10 năm kinh nghiệm và tọa lạc tại vị trí đắc địa nhất nhì Sài Gòn, chúng tôi tự tin sẽ đem đến cho bạn trải nghiệm tuyệt vời nhất.

                    Phương châm của chúng tôi: Tất cả vì khách hàng.

                    Từ chính mong muốn của khách hàng là được thưởng thức các món ăn trong một không gian thoải mái, lịch sự, sang trọng và ấm cúng, được trải nghiệm những món ăn đặc sản chính thống của Thái với mức giá hợp lý nhất.

                    Sự diễn tả rõ nét ẩm thực Thái Lan thể hiện từ cách trình bày độc đáo các món ăn đến hương vị của từng món.</p>
                
                {/* Thông tin địa chỉ có liên kết đến Google Maps */}
                <div className="location-info">
                    <img src="/assets/images/locationicon.jpg" alt="location icon" />
                    <a 
                        href="https://www.google.com/maps/place/Tr%C6%B0%E1%BB%9Dng+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+Khoa+h%E1%BB%8Dc+T%E1%BB%B1+nhi%C3%AAn,+%C4%90HQG-HCM,+C%C6%A1+s%E1%BB%9F+Linh+Trung./@10.8756514,106.796595,17z/data=!3m1!4b1!4m6!3m5!1s0x3174d8a1768e1d03:0x38d3ea53e0581ae0!8m2!3d10.8756461!4d106.7991699!16s%2Fg%2F1tj5hn2m?hl=vi-VN&entry=ttu&g_ep=EgoyMDI0MTEwNi4wIKXMDSoASAFQAw%3D%3D"
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        Địa chỉ: Citrus Royale Restaurant
                    </a>
                </div>

                <div className="contact-info">
                    <img src="/assets/images/phoneicon.jpg" alt="phone icon" />
                    <span>Liên hệ: 0123456789</span>
                </div>
            </div>
            
            <div className="image-content">
                <img src="/assets/images/nhahang.jpg" alt="Restaurant" />
            </div>
        </section>
    );
}

export default About;
