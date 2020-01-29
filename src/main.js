import Vue from 'vue'
import App from './App.vue'
import router from './router'
//引入elementui核心库
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import './theme/element/index.css'; //自定义主体修改，先在elementui官网主题在线编辑，然后下载，把fonts和css下载引入
//引入echarts报表
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

//引入重置样式库
import 'normalize.css';
//引入公共样式
import "./assets/styles/common.less"
//引入字体图标
import "./assets/fonts/iconfont.css"

//创建总线
const bus = new Vue();
Vue.prototype.bus = bus;

Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')