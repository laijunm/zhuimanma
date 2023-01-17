import axios, {type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

class Http  {
    instance:AxiosInstance
    config:AxiosRequestConfig
    constructor(option:AxiosRequestConfig) {
        this.config = option
        this.instance = axios.create(this.config)
        this.interceptors()
    }

    interceptors(){
        this.instance.interceptors.request.use(
            function (config) {
                // 在发送请求之前做些什么
                return config
            },
            function (error) {
                // 对请求错误做些什么
                return Promise.reject(error)
            }
        )
         
        // 添加响应拦截器
        this.instance.interceptors.response.use(
            function (response) {
            
                // 2xx 范围内的状态码都会触发该函数。
                // 对响应数据做点什么
                // dataAxios 是 axios 返回数据中的 data
                const dataAxios = response.data
                // 这个状态码是和后端约定的
                const code = dataAxios.reset
                return dataAxios
            },
            function (error) {
                // 超出 2xx 范围的状态码都会触发该函数。
                // 对响应错误做点什么
             
                return Promise.reject(error)
            }
        )
    }

     request<T>(config:AxiosRequestConfig):Promise<AxiosResponse<T,any>> {
        return this.instance.request(config)
    }
}

const http = new Http({
    // baseURL:'https://apis.netstart.cn/bcomic',
    timeout:0 * 1000
})

export default http
