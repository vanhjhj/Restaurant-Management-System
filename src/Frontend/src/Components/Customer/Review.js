import React, { useEffect, useState } from 'react';
import style from '../../Style/CustomerStyle/Review.module.css';
import { BsFilterLeft } from 'react-icons/bs';
import {FaArrowLeft, FaArrowRight} from 'react-icons/fa'
import QRCodeGenerator from './QRReview';
import { fetchFeedbacksData, getFeedBackFilter } from '../../API/ReviewAPI';
import StarDisplay from './StarDisplay';


function Review({ iID }) {
    const itemsPerPage = 10; // Số món ăn trên mỗi trang
    const [currentPage, setCurrentPage] = useState(1);

    const [feedbacks, setFeedbacks] = useState([]); 
    const [filterType, setFilterType] = useState('Tất cả');
    const [positive, setPositive] = useState('a');
    const [date, setDate] = useState('a');
    const totalPages = Math.ceil(feedbacks.length / itemsPerPage);
    function formatDate(isoString) {
        const date = new Date(isoString); // Chuyển đổi chuỗi ISO thành đối tượng Date
        const day = String(date.getDate()).padStart(2, '0'); // Lấy ngày và thêm số 0 nếu cần
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Lấy tháng (tháng bắt đầu từ 0) và thêm số 0 nếu cần
        const year = date.getFullYear(); // Lấy năm
        return `${day}-${month}-${year}`; // Trả về chuỗi định dạng dd-mm-yyyy
      }

    const handleFilterStatusChange = (event) => {
        const selectedValue = event.target.value;
        setFilterType(selectedValue);

        let newPositive = '';
        if (selectedValue === 'Tất cả') {
            newPositive = 'a';
        } else if (selectedValue === 'Tích cực') {
            newPositive = 'p';
        } else {
            newPositive = 'n';
        }

        setPositive(newPositive);
        fetchFilterData(newPositive, date);
    };

    const handleFilterDateChange = (event) => {
        let selectedValue = event.target.value;
        if (!selectedValue) {
            selectedValue = 'a';
        }
        console.log(selectedValue);
        setDate(selectedValue);
        fetchFilterData(positive, selectedValue);
    };
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

    const fetchFilterData = async (p, d) => {
        try {
            const data = await getFeedBackFilter(p, d);
            setFeedbacks(data.results);
        }
        catch (error) {
            console.log(error);
        }
}
    
    useEffect(() => {
        fetchData();
    }, []);

    const currentItems = feedbacks.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );
    
    return (
        <div className={style['review-info-ctn']}>
            <div className={style['container']}>
                <div className={style['row']}>
                    <div className={style['review-title-ctn'] + ' ' +style['col-lg-12']}>
                        <h4>BÀI ĐÁNH GIÁ</h4>
                    </div>
                </div>
                <div className={style['row'] + ' ' +style['display-end']}>
                    <div className={style['col-lg-3'] + ' ' + style['filter-ctn']}>
                        <div className={style['filter-category']}>
                        <select
                            id="filter-type"
                            value={filterType}
                            onChange={handleFilterStatusChange}
                            className={style['filter-select']}
                        >
                            <option value="Tất cả">Tất cả</option>
                            <option value="Tích cực">Tích cực</option>
                            <option value="Tiêu cực">Tiêu cực</option>
                        </select>
                            <BsFilterLeft size={30}></BsFilterLeft>
                        </div>
                        <div className={style['filter-date']}>
                            <input type="date" id="date-input" name="date" className={style['my-input-date']} onChange={handleFilterDateChange}/>
                        </div>
                    </div>
                </div>
                <div className={style['row']}>
                    {currentItems.map((item) => (
                                  <div
                                    key={item.id}
                                    className={style["col-lg-6"]}
                                  >
                                <div className={style["feedback-item"]}>
                                    <div className={style['name-star']}>
                                        <div>
                                            <h4>{item.name}</h4>  
                                            <p>{formatDate(item.date)}</p>
                                        </div>
                                            <StarDisplay point={item.overall_point}></StarDisplay>
                                    </div>
                                        <div className={style['comment-ctn']}>
                                            <p>{item.comment}</p>
                                        </div>
                                        
                                    </div>
                                  </div>
                                ))}
                </div>
                <div className={style['row']}>
                        <div className={style['btn-ctn']}>
                <button 
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                >
                <FaArrowLeft></FaArrowLeft>
                </button>

                <button 
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                >
                <FaArrowRight></FaArrowRight>
                </button>
                    </div>
                </div>
                <div className={style['page-num']}>
                <span>
                Trang {currentPage}/{totalPages}
                </span>
                </div>
            </div>
        </div>
    )
}

export default Review;