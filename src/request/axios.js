import axios from 'axios'
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

// 创建axios实例
const service = axios.create({
  baseURL: process.env.NODE_ENV == 'development' ? '/api' : process.env.VUE_APP_BASE_API, // api 的 BASE_API
  timeout: 30000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    // if (store.getters.token) {
    //   config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    // }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    return res
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export {service, source} 
