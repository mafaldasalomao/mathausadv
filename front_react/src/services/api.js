import axios from 'axios';


const baseURLprod= 'https://cidtec-api-flask-ee0e74cde317.herokuapp.com/api/'
const baseURLdev= 'http://localhost:5000/api/v1/user/'

const api = axios.create({
    baseURL: baseURLdev
});

export const api_private = axios.create({
    baseURL: baseURLdev,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true

})

export default api;