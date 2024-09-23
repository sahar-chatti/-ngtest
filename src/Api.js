import axios from 'axios';

const API_URL = 'http://192.168.1.170:3300/api';

export const fetchData = async () => {
    const response = await fetch(`${API_URL}/data`);
    const data = await response.json();
    return data;
};

export const getArticleById = async (articleId, base) => {
    try {
        return (await axios.get(`${API_URL}/articles/${base}/${encodeURIComponent(articleId)}`)).data;
    } catch (error) {
        console.error(error);
        return {};
    }
};
