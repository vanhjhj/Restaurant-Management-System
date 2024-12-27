import React, { useEffect, useState } from 'react';
import style from '../../Style/CustomerStyle/Review.module.css';
import { FaStar, FaRegStar, FaStarHalfAlt, FaStarHalf } from 'react-icons/fa';
import QRCodeGenerator from './QRReview';
import { fetchFeedbacksData } from '../../API/ReviewAPI';


function Review({ iID }) {
    const [feedbacks, setFeedbacks] = useState(); 
    const fetchData = async () => {
            try {
                const data = await fetchFeedbacksData();
                console.log(data);
                setFeedbacks(data);
            }
            catch (error) {
                console.log(error);
            }
    }
    
    useEffect(() => {
            fetchData()
    }, []);
    
    return (
        <div className={style['review-info-ctn']}>
            <div className={'container'}>
                <div className={'row'}>
                    
                </div>
            </div>
        </div>
    )
}

export default Review;