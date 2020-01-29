import $http from "@/utils/request.js"
import qs from "qs"

//商品列表
export const productList = data => $http.get('/product/list', { params: data }).then(data => data.data)

//商品删除
export const productDel = data => $http.get(`/product/del?id=${data}`).then(data => data.data)

//商品添加
export const productAdd = data => $http.post('/product/add', qs.stringify(data)).then(data => data.data)

//图片上传请求地址
export const productUpload = $http.defaults.baseURL + '/product/upload'

//图片存储服务器地址
export const uploadDir = $http.defaults.baseURL + '/upload/product/'

//商品查询
export const productSearch = data => $http.post('/product/search', qs.stringify(data)).then(data => data.data)

//商品修改
export const productEdit = data => $http.post('/product/edit', qs.stringify(data)).then(data => data.data)