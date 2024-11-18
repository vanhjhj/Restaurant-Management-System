import React, { useState, useEffect } from 'react';
import { GetInfoCus, ChangeInfoCus } from '../../../API/FixInfoAPI';
import { refreshToken } from '../../../API/authAPI';
import style from './Profile.module.css';

function Profile() {
    const [account, setAccount] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        phone_number: '',
        gender: '',
        email: ''
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: ''
    });
    let CusId = localStorage.getItem('userId');
    let accessToken =localStorage.getItem('accessToken');
    let refreshTokenValue = localStorage.getItem('refreshToken');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAccount = async () => {
            setLoading(true);
            try {
                // Làm mới token nếu cần thiết
                const newTokens = await refreshToken(refreshTokenValue,accessToken);
                accessToken = newTokens.access; // Cập nhật refresh token mới nếu có
                localStorage.setItem('accessToken', accessToken);

                const data = await GetInfoCus(CusId,accessToken); 
                setAccount(data);
                setFormData({
                    full_name: data.full_name || '',
                    gender: data.gender || ''
                });
            } catch (error) {
                alert('Lỗi khi lấy thông tin tài khoản!');
            } finally {
                setLoading(false);
            }
        };
        fetchAccount();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSaveChanges = async () => {
        setLoading(true);
        try {
            const updatedData = await ChangeInfoCus(formData); // Sử dụng đúng API đã import
            setAccount(updatedData);
            setIsEditing(false);
            alert('Cập nhật thông tin thành công!');
        } catch (error) {
            alert('Cập nhật thông tin thất bại: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleChangePassword = async () => {
        if (passwordData.new_password.length < 6) {
            alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
            return;
        }
        setLoading(true);
        try {
            // Giả sử có một API khác để đổi mật khẩu
            await ChangeInfoCus({ passwordData }); 
            alert('Đổi mật khẩu thành công!');
            setIsChangingPassword(false);
        } catch (error) {
            alert('Đổi mật khẩu thất bại: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Đang tải dữ liệu...</p>;
    }

    if (!account) {
        return <p>Đang tải thông tin tài khoản...</p>;
    }

    return (
        <div className={style['profile-container']}>
            <div className={style['profile-info']}>
                <h2>Thông tin tài khoản</h2>
                <div className={style['form-group']}>
                    <label>Họ và tên:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                        />
                    ) : (
                        <p>{account.full_name}</p>
                    )}
                </div>
                {/* <div className={style['form-group']}>
                    <label>Số điện thoại:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                        />
                    ) : (
                        <p>{account.phone_number}</p>
                    )}
                </div> */}
                <div className={style['form-group']}>
                    <label>Giới tính:</label>
                    {isEditing ? (
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                    ) : (
                        <p>{account.gender === 'male' ? 'Nam' : account.gender === 'female' ? 'Nữ' : 'Khác'}</p>
                    )}
                </div>
                {/* <div className={style['form-group']}>
                    <label>Email:</label>
                    {isEditing ? (
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    ) : (
                        <p>{account.email}</p>
                    )}
                </div> */}
                {isEditing ? (
                    <div>
                        <button className={style['save-button']} onClick={handleSaveChanges}>
                            Lưu thay đổi
                        </button>
                        <button className={style['cancel-button']} onClick={() => setIsEditing(false)}>
                            Hủy
                        </button>
                    </div>
                ) : (
                    <button className={style['edit-button']} onClick={() => setIsEditing(true)}>
                        Chỉnh sửa
                    </button>
                )}
                <button
                    className={style['change-password-button']}
                    onClick={() => setIsChangingPassword(!isChangingPassword)}
                >
                    {isChangingPassword ? 'Hủy đổi mật khẩu' : 'Đổi mật khẩu'}
                </button>
                {isChangingPassword && (
                    <div className={style['password-change-form']}>
                        <div className={style['form-group']}>
                            <label>Mật khẩu cũ:</label>
                            <input
                                type="password"
                                name="old_password"
                                value={passwordData.old_password}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <div className={style['form-group']}>
                            <label>Mật khẩu mới:</label>
                            <input
                                type="password"
                                name="new_password"
                                value={passwordData.new_password}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <button className={style['save-button']} onClick={handleChangePassword}>
                            Lưu mật khẩu mới
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile; 