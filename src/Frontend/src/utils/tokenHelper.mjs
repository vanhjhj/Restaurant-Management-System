import {jwtDecode} from "jwt-decode";

export const decodeToken = (token) => {
    try {
        const decoded = jwtDecode(token); // Decode token
        return {
            user_id: decoded.user_id,
            account_type: decoded.account_type,
        };
    } catch (error) {
        console.error("Lỗi khi decode token:", error.message);
        return null;
    }
};

export const isTokenExpired = (token) => {
    try {
        const decoded = jwtDecode(token); // Giải mã token
        const currentTime = Date.now() / 1000; // Thời gian hiện tại tính bằng giây
        if (decoded.exp < currentTime) {
            // Token đã hết hạn
            return true;
        }
        // Token còn hiệu lực
        return false;
    } catch (error) {
        console.error("Lỗi khi kiểm tra token:", error.message);
        return true; // Token không hợp lệ hoặc không giải mã được
    }
};

