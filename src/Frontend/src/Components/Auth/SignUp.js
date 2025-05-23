import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "../../Style/AuthStyle/SignUp.module.css";
import { account_check, sendOrResendOTP } from "../../API/authAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { checkPasswordRequirements } from "../../utils/checkPasswordRequirements";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [requirement, setRequirement] = useState(null);
  const [full_name, setfull_name] = useState("");
  const [gender, setgender] = useState("");
  const [phone_number, setphone_number] = useState("");

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const account_type = "Customer";

  const validatePhoneNumber = (phone) => {
    if (phone.length === 0) {
      return "Số điện thoại không được để trống.";
    }
    if (!/^[0-9]+$/.test(phone)) {
      return "Số điện thoại chỉ được chứa chữ số.";
    }
    if (phone.length !== 10) {
      return "Số điện thoại phải đủ 10 chữ số.";
    }
    if (!/^03/.test(phone)) {
      return "Số điện thoại phải bắt đầu bằng số 03.";
    }
    return null; // Hợp lệ
  };

  const handlePasswordChange = (e) => {
    const inputPassword = e.target.value;
    setPassword(inputPassword);

    if (inputPassword === "") {
      setRequirement(null);
      return;
    }

    const firstUnmetRequirement = checkPasswordRequirements(inputPassword);
    setRequirement(firstUnmetRequirement);
  };

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();

    // Reset lỗi trước khi kiểm tra
    setErrors({});
    // Kiểm tra tính hợp lệ của số điện thoại
    const phoneError = validatePhoneNumber(phone_number);
    if (phoneError) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone_number: phoneError,
      }));
      return; // Dừng nếu có lỗi
    }

    if (password !== confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Mật khẩu xác nhận không khớp.",
      }));
      return;
    }

    const signupData = {
      username,
      email,
      password,
      account_type,
    };

    const CusInfo = {
      full_name,
      email,
      gender,
      phone_number,
    };

    try {
      await account_check(signupData);
    } catch (err) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        ...err,
      }));
      return;
    }

    try {
      navigate("/verify-otp", {
        state: {
          mode: "register",
          signupData,
          CusInfo,
          email: signupData.email,
        },
      });
      await sendOrResendOTP({ email: signupData.email });
    } catch (err) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        message: "Lỗi gửi OTP: " + err.message,
      }));
      return;
    }
  };

  return (
    <div className={style["signup-container"]}>
      <div className={style["signup-box"]}>
        <h2 className={style["title"]}>ĐĂNG KÝ</h2>
        <form onSubmit={handleSignUpSubmit} className={style["signup-form"]}>
          {errors.message && (
            <p className={style["error-message"]}>{errors.message}</p>
          )}

          <div className={style["form-column"]}>
            <label htmlFor="username" className={style["form-title"]}>
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Nhập tài khoản"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && (
              <p className={style["error-message"]}>
                {"Tên đăng nhập đã tồn tại"}
              </p>
            )}
          </div>

          <div className={style["form-column"]}>
            <label htmlFor="email" className={style["form-title"]}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Nhập email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className={style["error-message"]}>{"Email da ton tai"}</p>
            )}
          </div>

          <div className={style["form-column"]}>
            <label htmlFor="password" className={style["form-title"]}>
              Mật khẩu
            </label>
            <div className={style["password-input-container"]}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Nhập mật khẩu"
                required
                value={password}
                onChange={handlePasswordChange}
              />
              <span
                className={style["password-toggle-icon"]}
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? "eye-slash" : "eye"} />
              </span>
            </div>

            {errors.password && (
              <p className={style["error-message"]}>{errors.password[0]}</p>
            )}
            {requirement && (
              <div className={style["password-requirement"]}>
                <p style={{ color: "red" }}>• {requirement.text}</p>
              </div>
            )}
          </div>

          <div className={style["form-column"]}>
            <label htmlFor="full_name" className={style["form-title"]}>
              Họ và Tên
            </label>
            <input
              type="text"
              id="full_name"
              name="Tên đầy đủ"
              placeholder="Nhập họ và tên"
              required
              value={full_name}
              onChange={(e) => setfull_name(e.target.value)}
            />
          </div>

          <div className={style["form-column"]}>
            <label htmlFor="confirm-password" className={style["form-title"]}>
              Xác nhận mật khẩu
            </label>
            <div className={style["password-input-container"]}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                name="confirm-password"
                placeholder="Xác nhận mật khẩu"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                className={style["password-toggle-icon"]}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <FontAwesomeIcon
                  icon={showConfirmPassword ? "eye-slash" : "eye"}
                />
              </span>
            </div>
            {errors.confirmPassword && (
              <p className={style["error-message"]}>{errors.confirmPassword}</p>
            )}
          </div>

          <div className={style["form-column"]}>
            <label htmlFor="gender" className={style["form-title"]}>
              Giới tính
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setgender(e.target.value)}
              required
            >
              <option value="" disabled>
                Chọn giới tính
              </option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>

          <div className={style["form-column"]}>
            <label htmlFor="phone-number" className={style["form-title"]}>
              Số Điện Thoại
            </label>
            <input
              id="phone-number"
              type="text"
              value={phone_number}
              onChange={(e) => setphone_number(e.target.value)}
              required
            />
            {errors.phone_number && (
              <p className={style["error-message"]}>{errors.phone_number}</p>
            )}
          </div>

          <button type="submit" className={style["signup-btn"]}>
            Đăng ký
          </button>
        </form>
        <button
          type="button"
          className={style["login-btn"]}
          onClick={() => navigate("/login")}
        >
          Đã có tài khoản? Đăng nhập
        </button>
      </div>
    </div>
  );
}

export default SignUp;
