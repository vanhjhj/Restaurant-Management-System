import React, { useEffect, useState } from 'react';
import style from '../../Style/CustomerStyle/Review.module.css';
import { BsFilterLeft } from 'react-icons/bs';
import {FaRegCalendarAlt} from 'react-icons/fa'
import QRCodeGenerator from './QRReview';
import { fetchFeedbacksData } from '../../API/ReviewAPI';
import StarDisplay from './StarDisplay';


function Review({ iID }) {
    const [feedbacks, setFeedbacks] = useState([]); 
    const [filterType, setFilterType] = useState('Tất cả'); // State để lưu loại lọc

    const handleFilterChange = (event) => {
        setFilterType(event.target.value);
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
    
    useEffect(() => {
        setFeedbacks([{id:1, name: 'Trần Anh Tú', point: 5, comment: 'Bầu trời thật đẹp' },
            { id: 2, name: 'Đỗ Thái Học', point: 4.6, comment: 'Cũng được' },
            { id: 3, name: 'Sick Duck', point: 1.2, comment: 'Nhưng giờ đây tôi đã biết, Thái Lan mà những kẻ lữ hành say mê nhắc đến là mái nhà gỗ với mấy hoa văn nối tiếp nhau, những con phố chật kín tiếng rao của mấy cô hàng quán, những lũ lượt của dòng xe Tuk Tuk bấm còi inh ỏi,..Là đĩa Pad Thai trong cái chảo to con mà ông nội để lại, tô hủ tiếu sóng sánh theo nhịp chèo của chiếc thuyền đang dập dềnh nơi chợ nổi, đĩa TomYum xào khô của cô Jay Fai bán mấy chục năm vẫn không chịu mở thêm chi nhánh.' },
            { id: 2, name: 'Đỗ Thái Học', point: 4.6, comment: 'Cũng được' },
            { id: 2, name: 'Đỗ Thái Học', point: 4.6, comment: 'Cũng được' },
            { id: 2, name: 'Đỗ Thái Học', point: 4.6, comment: 'Cũng được' }]);
    }, []);
    
    return (
        <div className={style['review-info-ctn']}>
            <div className={style['container']}>
                <div className={style['row']}>
                    <div className={style['review-title-ctn'] + ' ' +style['col-lg-12']}>
                        <h4>Bài đánh giá</h4>
                    </div>
                </div>
                <div className={style['row'] + ' ' +style['display-end']}>
                    <div className={style['col-lg-3'] + ' ' + style['filter-ctn']}>
                        <div className={style['filter-category']}>
                        <select
                            id="filter-type"
                            value={filterType}
                            onChange={handleFilterChange}
                            className={style['filter-select']}
                        >
                            <option value="Tất cả">Tất cả</option>
                            <option value="Tích cực">Tích cực</option>
                            <option value="Tiêu cực">Tiêu cực</option>
                        </select>
                            <BsFilterLeft size={30}></BsFilterLeft>
                        </div>
                        <div className={style['filter-date']}>
                            <input type="date" id="date-input" name="date" className={style['my-input-date']} />
                        </div>
                    </div>
                </div>
                <div className={style['row']}>
                    {feedbacks.map((item) => (
                                  <div
                                    key={item.id}
                                    className={style["col-lg-6"]}
                                  >
                                    <div className={style["feedback-item"]}>
                                        <div className={style['name-star']}>
                                            <h4>{item.name}</h4>  
                                            <StarDisplay point={item.point}></StarDisplay>
                                </div>
                                <div className={style['comment-ctn']}>
                                    <p>{item.comment}</p>
                                </div>
                                        
                                    </div>
                                  </div>
                                ))}
                </div>
            </div>
        </div>
    )
}

export default Review;