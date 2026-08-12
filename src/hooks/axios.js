import axios from 'axios'
export const api = axios.create({
  baseURL: 'https://6a607c54b1933e9d25fd54f0.mockapi.io/1v/:users',
  timeout: 2000,
})
