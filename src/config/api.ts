import axios from 'axios';

const APIUrl = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export default APIUrl;
