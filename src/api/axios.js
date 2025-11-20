import axios from 'axios'

// create api axious for easy use 
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
})

// every time a request send ftech token and add authentication header to the request
api.interceptors.request.use(config => {
  // take token from local storage
  const token = localStorage.getItem('token')
  if (token) { // if token exist add to header
    config.headers.Authorization = `Bearer ${token}`
  }
  // return config
  return config
}, error => {
  return Promise.reject(error)
})

export default api
