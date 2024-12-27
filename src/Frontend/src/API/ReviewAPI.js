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
