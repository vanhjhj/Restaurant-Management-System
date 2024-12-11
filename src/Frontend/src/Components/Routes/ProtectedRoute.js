import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isLoggedIn, allowedRoles, userRole }) => {
    // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
    console.log(isLoggedIn);
    if (!isLoggedIn) {
        return <Navigate to="/" />;
    }

    // Nếu vai trò của người dùng không được phép, chuyển hướng về trang chủ
    console.log(userRole);
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/" />;
    }

    // Hiển thị nội dung được bảo vệ nếu tất cả điều kiện được đáp ứng
    return children;
};

export default ProtectedRoute;
