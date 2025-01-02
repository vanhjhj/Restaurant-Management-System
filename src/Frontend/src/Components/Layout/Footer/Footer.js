// src/Components/Footer.js
import React from "react";
import style from "./Footer.module.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className={style["site-footer"]} id="contact">
      <div className={style["top-footer"] + " " + style["section"]}>
        <div className={style["sec-wp"]}>
          <div className={style["container"]}>
            <div className={style["row"]}>
              <div className={style["col-lg-4"]}>
                <div className={style["footer-info"]}>
                  <div className={style["footer-logo"]}>
                    <Link to="/">
                      <img src="assets/images/logo.png" alt="Home" />
                    </Link>
                  </div>
                  <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Mollitia, tenetur.
                  </p>
                  <div className={style["social-icon"]}>
                    <ul>
                      <li>
                        <p>Facebook</p>
                      </li>
                      <li>
                        <p>Instagram</p>
                      </li>
                      <li>
                        <p>Github</p>
                      </li>
                      <li>
                        <p>Youtube</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className={style["col-lg-8"]}>
                <div className={style["footer-flex-box"]}>
                  <div className={style["footer-table-info"]}>
                    <h3 className={style["h3-title"]}>open hours</h3>
                    <ul>
                      <li>
                        <i className={style["clock"]}></i> Mon-Thurs : 9am -
                        22pm
                      </li>
                      <li>
                        <i className={style["clock"]}></i> Fri-Sun : 11am - 22pm
                      </li>
                    </ul>
                  </div>
                  <div
                    className={
                      style["footer-menu"] + " " + style["food-nav-menu"]
                    }
                  >
                    <h3 className={style["h3-title"]}>Links</h3>
                    <ul className={style["column-2"]}>
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
                      <li>
                        <Link to="/review">Đánh giá</Link>
                      </li>
                    </ul>
                  </div>
                  <div className={style["footer-menu"]}>
                    <h3 className={style["h3-title"]}>Company</h3>
                    <ul>
                      <li>
                        <p>Terms & Conditions</p>
                      </li>
                      <li>
                        <p>Privacy Policy</p>
                      </li>
                      <li>
                        <p>Cookie Policy</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={style["bottom-footer"]}>
        <div className={style["container"]}>
          <div className={style["row"]}>
            <div className={style["col-lg-12"] + " " + style["text-center"]}>
              <div className={style["copyright-text"]}>
                <p>
                  Copyright &copy; 2024{" "}
                  <span className={style["name"]}>Citrus Royale.</span> All
                  Rights Reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
