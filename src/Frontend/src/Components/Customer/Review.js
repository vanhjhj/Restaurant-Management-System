import React, { useEffect, useState } from 'react';
import style from '../../Style/CustomerStyle/Review.module.css';
import { FaStar, FaRegStar, FaStarHalfAlt, FaStarHalf } from 'react-icons/fa';
import QRCodeGenerator from './QRReview';
import { fetchFeedbacksData } from '../../API/ReviewAPI';
import StarDisplay from './StarDisplay';


function Review({ iID }) {
    const [feedbacks, setFeedbacks] = useState([]); 

    const totalStars = 5;
    const point = 5;
    const fullStars = Math.floor(point); // Số sao đầy đủ
    const hasHalfStar = point % 1 >= 0.5; // Kiểm tra có sao nửa không
    const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0); // Số sao trống
    const fetchData = async () => {
            try {
                const data = await fetchFeedbacksData();
                console.log(data);
                setFeedbacks(data.results);
            }
            catch (error) {
                console.log(error);
            }
    }
    
    useEffect(() => {
        fetchData();
        setFeedbacks([{id:1, name: 'Trần Anh Tú', point: 5, comment: 'Bầu trời thật đẹp' },
            {id:2, name: 'Trần Anh Tú', point: 5, comment: 'Bầu trời thật đẹp' }]);
    }, []);
    
    return (
        <div className={style['review-info-ctn']}>
            <div className={'container'}>
                <div className={'row'}>
                    {feedbacks.map((item) => (
                                  <div
                                    key={item.id}
                                    className={style["col-lg-6"]}
                                  >
                                    <div className={style["feedback-item"]}>
                                <div className={style['name-star']}>
                                    <p>{item.name}</p>  
                                    <StarDisplay point={item.point}></StarDisplay>
                                </div>
                                <p>{item.comment}</p>
                                    </div>
                                  </div>
                                ))}
                </div>
            </div>
        </div>
    )
}

export default Review;