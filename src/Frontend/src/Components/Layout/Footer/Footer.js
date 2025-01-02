import React from "react";
import style from "./Footer.module.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className={style["site-footer"]} id="contact">
      <div className={style["top-footer"] + " " + style["section"]}>
        <div className={style["sec-wp"]}>
          <div className={style["container"]}>
            <div className={style["footer-flex-box"]}>
              {/* Logo & Social Icons */}
              <div className={style["footer-info"]}>
                <div className={style["footer-logo"]}>
                  <Link to="/">
                    <img src="assets/images/logo.png" alt="Home" />
                  </Link>
                </div>
                <div className={style["social-icon"]}>
                  <ul>
                    <li>
                      <a href="#">
                        <i className="uil uil-facebook-f"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="uil uil-instagram"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="uil uil-github-alt"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="uil uil-youtube"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Open Hours */}
              <div className={style["footer-table-info"]+ " " + style["footer-open"]}>
                <h3 className={style["h3-title"]}>Open Hours</h3>
                <ul>
                  <li>
                    <i className="uil uil-clock"></i> Mon-Thurs : 9am - 22pm
                  </li>
                  <li>
                    <i className="uil uil-clock"></i> Fri-Sun : 11am - 22pm
                  </li>
                </ul>
              </div>

              {/* Links */}
              <div className={style["footer-menu"]+ " " + style["footer-links"]}>
                <h3 className={style["h3-title"]}>Links</h3>
                <ul>
                  <li>
                    <Link to="/about">Giới Thiệu</Link>
                  </li>
                  <li>
                    <Link to="/menu">Thực Đơn</Link>
                  </li>
                  <li>
                    <Link to="/reservation">Đặt Bàn</Link>
                  </li>
                  <li>
                    <Link to="/promotion">Khuyến Mãi</Link>
                  </li>
                </ul>
              </div>

              {/* Contact Us */}
              <div className={style["footer-menu"]}>
                <h3 className={style["h3-title"]}>Contact Us</h3>
                <ul>
                  <li>
                    <a
                      href="https://maps.app.goo.gl/tVjxCtjfyR5DkKXL8"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="uil uil-location-point"></i>
                      227 Đ. Nguyễn Văn Cừ, Phường 4, Quận 5, Hồ Chí Minh
                    </a>
                  </li>
                  <li>
                    <a href="tel:0123456789">
                      <i className="uil uil-phone"></i>
                      0123456789
                    </a>
                  </li>
                  <li>
                    <a href="mailto:citrusroyale.restaurant@gmail.com">
                      <i className="uil uil-envelope"></i>
                      citrusroyale.restaurant@gmail.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={style["bottom-footer"]}>
        <div className={style["container"]}>
          <div className={style["text-center"]}>
            <div className={style["copyright-text"]}>
              <p>
                Copyright &copy; 2024{" "}
                <span className={style["name"]}>Citrus Royale.</span> All Rights
                Reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
