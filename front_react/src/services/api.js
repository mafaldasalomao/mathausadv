import axios from 'axios';


const baseURLprod= 'http://104.248.32.80:5000/api/v1/user/'
const baseURLdev= 'http://localhost:5000/api/v1/user/'

const api = axios.create({
    baseURL: baseURLdev
});

export const api_private = axios.create({
    baseURL: baseURLprod,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true

})

export default api;