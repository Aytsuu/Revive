import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://192.168.120.131:8000',
  headers: {
    'Content-Type': 'application/json', // Ensure JSON is used for requests
  },
})

