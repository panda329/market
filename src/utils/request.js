//企业级封装

//引入已经安装的axios
import axios from "axios";


//配置axios实例
const axiosInstance = axios.create({
    // 公共的请求地址配置在这里
    // baseURL: 'http://172.16.14.200:666', //学校请求地址
    baseURL: 'http://192.168.1.10:666', //家里请求地址
    // baseURL: 'http://192.168.1.7:666', //小姨家里请求地址
    // 请求超时时间（单位ms）
    timeout: 5000
});


//暴露出去
export default axiosInstance;