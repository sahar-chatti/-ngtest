const API_URL = 'http://localhost:3200/api';

export const fetchData = async () => {
    const response = await fetch(`${API_URL}/data`);
    const data = await response.json();
    return data;
};
