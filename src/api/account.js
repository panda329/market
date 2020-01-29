import $http from "@/utils/request.js"
import qs from "qs"
//以下为配置接口请求，并导出
//账号列表
export const accountList = data => {
    return $http.get('/account/list', {
        params: data
    }).then(data => data.data)
}

//账号增加
export const accountAdd = data => {
    return $http.post('/account/add', qs.stringify(data)).then(data => data.data)
}

//账号修改
export const accountEdit = data => {
    return $http.post('/account/edit', qs.stringify(data)).then(data => data.data)
}

//账号删除
export const accountDel = data => {
    return $http.get(`/account/del?id=${data}`).then(data => data.data)
}

//账号查询
export const accountSearch = data => {
    return $http.post('/account/search', qs.stringify(data)).then(data => data.data)
}

//账号分页
export const accountPage = data => {
    return $http.post('/account/page', qs.stringify(data)).then(data => data.data)
}

//密码修改接口
export const dochangePwd = data => $http.post('/changePassword', qs.stringify(data)).then(data => data.data)