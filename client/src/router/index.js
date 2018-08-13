import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'//首页
import Member from '@/components/member'//会员页面
import ShopCart from '@/components/shopcart'//购物车页面
import Search from '@/components/search'//查询页面
import newsList from '@/components/newslist'//新闻列表页面
import newsDetail from '@/components/newsdetail'//新闻详情页
import Share from '@/components/share'//图文分享页
import ShareDetail from '@/components/sharedetail'//图文分享详情页
import Comment from '@/components/comment'//评论组件
import Login from '@/components/login' //登陆组件
import Register from '@/components/register'//注册组件
import modifyData from '@/components/modifyData' //修改资料组件
import searchArticle from '@/components/searcharticle' //文章搜索组件

Vue.use(Router)//挂载属性

export default new Router({
  //全局设置链接激活的css类名
  linkActiveClass: 'mui-active',
  routes: [
    {
      path: '/',
      redirect: { name: 'Home' }//路由重定向
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/member',
      name: 'Member',
      component: Member
    },
    {
      path: '/shopcart',
      name: 'ShopCart',
      component: ShopCart
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    },
    {
      path: '/news/newslist',
      name: 'newsList',
      component: newsList
    },
    {
      path: '/news/newsdetail',
      name: 'newsDetail',
      component: newsDetail
    },
    {
      path: '/share',
      name: 'Share',
      component: Share
    },
    {
      path: '/sharedetail/:id',
      name: 'shareDetail',
      component: ShareDetail
    },
    {
      path: '/comment/:id',
      name: 'comment',
      component: Comment
    },
    {
      path: '/users/login',
      name: 'login',
      component: Login
    },
    {
      path: '/users/register',
      name: 'register',
      component: Register
    },
    {
      path: '/users/modify',
      name: 'modify',
      component: modifyData,
      beforeEnter: (to, from, next) => {
        //定义获取cookie方法
        var getCookie = function (name) {
          var strCookie = document.cookie;
          var arrCookie = strCookie.split("; "); //通过'; '分隔字符串
          for (var i = 0; i < arrCookie.length; i++) {
            var arr = arrCookie[i].split("=");
            if (arr[0] == name) return arr[1];
          }
          return "";
        }
        //如果当前有cookie的话，就直接跳转到修改资料页面
        if (to.name === 'modify' && getCookie("username") != "" ) {
          next();
        } else {
          //如果没有cookie，则跳转到登陆页面
          next({ name: 'login' })
        }
      }
    },
    {
      path:'/searcharticle',
      name:'searcharticle',
      component: searchArticle
    }
  ]
})
