import React, { useEffect, useState } from 'react';
import style from '../../Style/CustomerStyle/Rating.module.css';
import { FaStar, FaRegStar, FaStarHalfAlt, FaStarHalf } from 'react-icons/fa';
import { createFeedBack } from '../../API/ReviewAPI';


function Rating() {
    const totalStars = 5;
    const pathParts = window.location.pathname.split('/');
    const invoiceID = pathParts[pathParts.length - 1]; // Lấy phần cuối của URL
    const [name, setName] = useState();
    const [ratingServices, setRatingServices] = useState(0);
    const [hoverServices, setHoverServices] = useState(0);

    const [ratingFood, setRatingFood] = useState(0);
    const [hoverFood, setHoverFood] = useState(0);

    const [ratingPrice, setRatingPrice] = useState(0);
    const [hoverPrice, setHoverPrice] = useState(0);

    const [ratingSpace, setRatingSpace] = useState(0);
    const [hoverSpace, setHoverSpace] = useState(0);

    const [comment, setComment] = useState();

    const [success, setSuccess] = useState(false);

    const handleSubmit = async() => {
        try {
            await createFeedBack(invoiceID, name, ratingServices, ratingFood, ratingPrice, ratingSpace, comment);
            setSuccess(true);
        }
        catch(error) {
            console.log(error);
        }
    }  

    if (success) {
        return (
            <div>
                <h2>Đánh giá của bạn đã được chúng tôi ghi nhận</h2>
            </div>

        )
    }
    return (
        <div className={style['review-ctn']}>
            <div className={style['container']}>
                <div className={style['row']}>
                    <div className={style['col-lg-12']}>
                        <div className={style['review-info-ctn']}>
                            <div className={style['title']}>
                                <h2>Đánh giá</h2>
                            </div>
                            <div className={style['review-title']}>
                                <p>Cảm ơn bạn đã đùng bữa tại nhà hàng của chúng tôi</p>    
                                <p>Chúng tôi rất mong nhận được ý kiến đóng góp từ bạn để cải thiện dịch vụ tốt hơn</p>
                            </div>
                            <div >
                                <section className={style['point-section']}>
                                    <p>Đánh giá phục vụ</p>
                                    {Array.from({ length: totalStars }, (_, index) => {
                                        const starValue = index + 1;
                                        return (
                                        <FaStar
                                            key={index}
                                            size={24}
                                            color={starValue <= (hoverServices || ratingServices) ? '#FFD700' : '#E4E5E9'}
                                            style={{ cursor: 'pointer' }}
                                            onMouseEnter={() => setHoverServices(starValue)}
                                            onMouseLeave={() => setHoverServices(0)}
                                            onClick={() => setRatingServices(starValue)}
                                        />
                                        );
                                    })}
                                </section>
                                <section className={style['point-section']}>
                                    <p>Đánh giá chất lượng món ăn</p>
                                    {Array.from({ length: totalStars }, (_, index) => {
                                        const starValue = index + 1;
                                        return (
                                        <FaStar
                                            key={index}
                                            size={24}
                                            color={starValue <= (hoverFood || ratingFood) ? '#FFD700' : '#E4E5E9'}
                                            style={{ cursor: 'pointer' }}
                                            onMouseEnter={() => setHoverFood(starValue)}
                                            onMouseLeave={() => setHoverFood(0)}
                                            onClick={() => setRatingFood(starValue)}
                                        />
                                        );
                                    })}
                                </section>
                                <section className={style['point-section']}>
                                    <p>Đánh giá giá cả</p>
                                    {Array.from({ length: totalStars }, (_, index) => {
                                        const starValue = index + 1;
                                        return (
                                        <FaStar
                                            key={index}
                                            size={24}
                                            color={starValue <= (hoverPrice || ratingPrice) ? '#FFD700' : '#E4E5E9'}
                                            style={{ cursor: 'pointer' }}
                                            onMouseEnter={() => setHoverPrice(starValue)}
                                            onMouseLeave={() => setHoverPrice(0)}
                                            onClick={() => setRatingPrice(starValue)}
                                        />
                                        );
                                    })}
                                </section>
                                <section className={style['point-section']}>
                                    <p>Đánh giá không gian nhà hàng</p>
                                    {Array.from({ length: totalStars }, (_, index) => {
                                        const starValue = index + 1;
                                        return (
                                        <FaStar
                                            key={index}
                                            size={24}
                                            color={starValue <= (hoverSpace || ratingSpace) ? '#FFD700' : '#E4E5E9'}
                                            style={{ cursor: 'pointer' }}
                                            onMouseEnter={() => setHoverSpace(starValue)}
                                            onMouseLeave={() => setHoverSpace(0)}
                                            onClick={() => setRatingSpace(starValue)}
                                        />
                                        );
                                    })}
                                </section>
                            </div>
                            <div className={style['input-name']}>
                                <label></label>
                                <input type='text' onChange={(e) => setName(e.target.value)} placeholder='Tên của bạn' className={style['my-input-name']}></input>
                            </div>
                            <div className={style['rating-text-ctn']}>                                
                                <label for='text-rating'></label>
                                <textarea  cols={40} rows={4} id='text-rating' onChange={(e) => setComment(e.target.value)} placeholder='Nhận xét...'></textarea>   
                            </div>
                            <div className={style['col-lg-12']}>
                                                            <div className={style['error-ctn']}>
                                                                                            {/* {errorMessage ? <p className={style['error']}>{errorMessage}</p> : <p></p>} */}
                                                                                        </div>
                                                            <div className={style['btn-ctn']}>
                                                                <button className={style['my-btn']} onClick={() => handleSubmit()}>Thanh toán</button>
                                                            </div>
                                                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Rating;