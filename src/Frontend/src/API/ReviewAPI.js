import axios from 'axios';
import { API_BASE_URL } from '../Config/apiConfig';

export const fetchFeedbacksData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/booking/feedbacks/`);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const getFeedBackFilter = async (positive, date) => {
    try {
        let rate = '';
        let isFilter = '?';
        if (positive === 'a' && date === 'a') {
            isFilter = '';
        }
        if (positive === 'a') {
            rate = '';
        }
        else if (positive === 'p') {
            rate = 'min_ovrpoint=3.5&'
        }
        else if (positive === 'n'){
            rate = 'max_ovrpoint=3&'
        }
        if (date === 'a') {
            date = '';
        }
        else {
            date = `date=${date}`;
        }
        const response = await axios.get(`${API_BASE_URL}/booking/feedbacks/${isFilter}${rate}${date}`);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const createFeedBack = async (oID, name, servep, foodp, pricep,spacep,comment) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/booking/feedbacks/`, {
            order: oID,
            name: name,
            serve_point: servep,
            food_point: foodp,
            price_point: pricep,
            space_point: spacep,
            comment: comment,
        });
        return response.data;
    }
    catch(error) {
        throw error;
    }
}
