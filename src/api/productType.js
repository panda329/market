import $http from '@/utils/request.js'
import qs from "qs"

//商品分类列表
export const productTypeList = data => $http.get('/productType/list', { params: data }).then(data => data.data)

//商品分类增加
export const productTypeAdd = data => $http.post('/productType/add', qs.stringify(data)).then(data => data.data)

//商品分类修改
export const productTypeEdit = data => $http.post('/productType/edit', qs.stringify(data)).then(data => data.data)

//商品分类删除
export const productTypeDel = data => $http.get(`/productType/del?id=${data}`).then(data => data.data)

//商品分类分页
export const productTypePage = data => $http.post('/productType/page', qs.stringify(data)).then(data => data.data)

//商品分类查询
export const productTypeSearch = data => $http.post('/productType/search', qs.stringify(data)).then(data => data.data)