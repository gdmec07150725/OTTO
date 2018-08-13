// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

//引入mint-ui
import Mint from 'mint-ui'
//引入mint-ui的css
import 'mint-ui/lib/style.css'
Vue.use(Mint);

//引入mui的css
import '../static/mui/dist/css/mui.css'

//引入axios
import Axios from 'axios'
//挂载属性，使$axios可以全局使用
Vue.prototype.$axios = Axios
//设置默认请求url地址
Axios.defaults.baseURL = 'http://localhost:3000'
//拦截器
Axios.interceptors.request.use(function(config){
  //请求发起之前，显示loading
  Mint.Indicator.open();
  return config;//不return，表示拦截这个请求  
})
Axios.interceptors.response.use(function(config){
  //响应回来之后，隐藏loading
  Mint.Indicator.close();
  return config;
})
//引入全局样式
import '../static/global.css'

//全局注册globalTitle组件
import GlobalTitle from './components/globalTitle'
Vue.component('globalTitle',GlobalTitle)

//全局注册footer组件
import navFooter from './components/navfooter'
Vue.component('navFooter',navFooter);

//引入moment时间处理插件
import Moment from 'moment'

//定义全局时间过滤器，大家都可以使用
Vue.filter('TimeFilter',function(value){
  return Moment(value).format('YYYY-MM-DD');
})
//引入picture-preview插件
import vuePicturePreview from 'vue-picture-preview'
Vue.use(vuePicturePreview)

//全局前置守卫，判断用户是否已经登陆
// router.beforeEach((to, from , next)=>{
  
// })
//引入全局方法(获取cookie)
import global_ from './components/global'
Vue.prototype.GLOBAL = global_ //挂载到Vue实例上面

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,//让Vue实例知道我们的路由规格
  components: { App },
  template: '<App/>'
})
