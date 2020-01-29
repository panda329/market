import $http from "@/utils/request.js"
import qs from "qs"

//登录接口
export const dologin = data => $http.post('/login', qs.stringify(data)).then(data => data.data)

//注销退出登录接口
export const dologout = data => $http.post('/logout', qs.stringify(data)).then(data => data.data)

// 获取用户类型是否是超级管理员或者普通管理员
export const getRole = () => {
    const tokenValue = localStorage.getItem('token'); //请求时获取token值
    return $http.post('/getCurrentUserRole', qs.stringify({
            token: tokenValue
        }))
        .then(data => data.data)
}

//获取用户信息
export const getAccountInfo = () => {
    const token = localStorage.getItem('token'); //请求时获取token值
    return $http.post('/personalInfo', qs.stringify({
            token
        }))
        .then(data => data.data)
}

//用户头像上传请求地址
export const uploadAvatarUrl = $http.defaults.baseURL + '/uploadAvatar';

//用户头像服务器储存目录地址
export const avatarDir = $http.defaults.baseURL + '/upload/personal/'

//修改头像请求
export const avatarEdit = data => $http.post('/editAvatarImg', qs.stringify(data)).then(data => data.data)