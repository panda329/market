import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            // 路由地址懒加载
            component: () =>
                import ('../views/Login.vue')
        },
        {
            path: '/home',
            name: 'home',
            component: () =>
                import ('../views/Home.vue'),
            meta: { requiresAuth: true },
            children: [{ //配置首页路由
                    path: 'dashboard',
                    component: () =>
                        import ('../views/Dashboard/dashboard.vue'),
                    meta: { requiresAuth: true }
                },
                { //配置首页路由
                    path: 'personal',
                    component: () =>
                        import ('../views/Dashboard/personal.vue'),
                    meta: {
                        requiresAuth: true,
                        title: "个人中心"
                    }
                },
                {
                    path: 'producttype-list',
                    component: () =>
                        import ('../views/ProductType/ProductTypeList.vue'),
                    meta: {
                        requiresAuth: true,
                        title: "商品分类列表"
                    }
                },
                {
                    path: 'producttype-add',
                    component: () =>
                        import ('../views/ProductType/ProductTypeAdd.vue'),
                    meta: {
                        requiresAuth: true,
                        title: "商品分类增加"
                    }
                },
                {
                    path: 'product-list',
                    component: () =>
                        import ('../views/Product/ProductList.vue'),
                    meta: {
                        requiresAuth: true,
                        title: "商品列表"
                    }
                },
                {
                    path: 'product-add',
                    component: () =>
                        import ('../views/Product/ProductAdd.vue'),
                    meta: { requiresAuth: true, title: "商品增加" }
                },
                {
                    path: 'account-list',
                    component: () =>
                        import ('../views/Account/AccountList.vue'),
                    meta: { requiresAuth: true, title: "用户列表" }
                },
                {
                    path: 'account-add',
                    component: () =>
                        import ('../views/Account/AccountAdd.vue'),
                    meta: { requiresAuth: true, title: "用户增加" }
                },
                {
                    path: 'passwordchange',
                    component: () =>
                        import ('../views/Account/AccountPwdChange.vue'),
                    meta: { requiresAuth: true, title: "密码修改" }
                },
                {
                    path: 'sta',
                    component: () =>
                        import ('../views/Report/SaleSta.vue'),
                    meta: { requiresAuth: true, title: "销售统计" }
                },
                {
                    path: 'stocksta',
                    component: () =>
                        import ('../views/Report/StockSta.vue'),
                    meta: { requiresAuth: true, title: "进货统计" }
                },
                {
                    path: 'menulist',
                    component: () =>
                        import ('../views/SystemMenu/MenuList.vue'),
                    meta: { requiresAuth: true, title: "菜单列表" }
                },
                {
                    path: 'menuadd',
                    component: () =>
                        import ('../views/SystemMenu/MenuAdd.vue'),
                    meta: { requiresAuth: true, title: "菜单增加" }
                },
            ]
        },
        {
            path: '*', //除以上所有地址外的地址跳转登录页面
            redirect: '/login'
        }
    ]
    //根据路线创建路由
const router = new VueRouter({
    routes
})

// 配置全局路由"前置"守卫
// 参数1：to，下一个路由对象
// 参数2：from，上一个路由对象
// 参数3：next，回调函数
//  放行   next()
//  拦截   next(‘/login’)
// router.beforeEach((to, from, next) => {
//     if (to.path === "/login") { //如果去的是登录页面则放行，否则拦截所有页面只去登录页面
//         next()
//     } else {
//         next('/login')
//     }
// })一般是不会直接通过地址去判断拦截
router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) { //根据meta上的requiresAuth的标识确认是否验证，要验证则拦截去login
        if (localStorage.getItem('token')) {
            next();
        } else {
            next('/login')
        }
    } else { //否则放行
        next();
    }

})

export default router