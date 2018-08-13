<template>
  <div class="home">
    <!--轮播图内容-->
    <mt-swipe :auto="4000" class="my-swiper">
      <mt-swipe-item v-for="(image,index) in swiperImages" :key="index">
        <a :href="image.url">
          <img :src="image.img_url">
          <span class="desc">{{image.title}}</span>
        </a>
      </mt-swipe-item>
    </mt-swipe>
    <!--九宫格内容-->
    <div class="mui-content">
      <ul class="mui-table-view mui-grid-view mui-grid-9">
        <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3">
          <router-link :to="{name:'newsList'}">
            <span class="mui-icon mui-icon-home"></span>
            <div class="mui-media-body">新闻资讯</div>
          </router-link>
        </li>
        <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3">
          <router-link :to="{name:'Share'}">
            <span class="mui-icon mui-icon-email"></span>
            <div class="mui-media-body">图文分享</div>
          </router-link>
        </li>
        <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3">
          <a href="#">
            <span class="mui-icon mui-icon-chatbubble"></span>
            <div class="mui-media-body">技术小册</div>
          </a>
        </li>
        <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3">
          <a href="#">
            <span class="mui-icon mui-icon-location"></span>
            <div class="mui-media-body">留言反馈</div>
          </a>
        </li>
        <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3">
          <router-link :to="{name:'searcharticle'}">
            <span class="mui-icon mui-icon-search"></span>
            <div class="mui-media-body">文章搜索</div>
          </router-link>
        </li>
        <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3">
          <a href="#">
            <span class="mui-icon mui-icon-phone"></span>
            <div class="mui-media-body">联系我们</div>
          </a>
        </li>
      </ul>
    </div>
    <!-- 底部导航组件 -->
    <nav-footer></nav-footer>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      swiperImages: []
    }
  },
  created: function() {
    // 发送get请求，获取轮播图数据
    var vm = this;
    this.$axios.get('/getlunbo')
      .then(function(response) {
        console.log(response)
        vm.swiperImages = response.data;
      })
      .catch(function(error) {
        console.log(error);
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*设置轮播图的高度，使他可以显示*/
.my-swiper {
  height: 187px;
}
.my-swiper img {
  width: 100%;
  height: 100%;
}
/* 定义图片描述区域样式 */
 .desc {
  font-weight: 600;
  opacity: .8;
  padding: 5px;
  height: 30px;
  line-height: 20px;
  width: 100%;
  color: #fff;
  background-color: gray;
  position: absolute;
  bottom: 0;
  text-align: center;
  text-overflow:ellipsis;
  overflow:hidden;
  white-space: nowrap;
 }
/*清除九宫格的背景*/
.mui-grid-view.mui-grid-9{
  background-color:#FFF;
  margin-top:0;
}
/*清除九宫格每个li的边框*/
.mui-grid-view.mui-grid-9 .mui-table-view-cell{
  border:0;
}
/*清除九宫格默认的图标*/
.mui-icon-home:before,
.mui-icon-email:before,
.mui-icon-chatbubble:before,
.mui-icon-location:before,
.mui-icon-search:before,
.mui-icon-phone:before{
  content:'';
}
/*设置九宫格图标*/
.mui-icon{
  width:40px;
  height:40px;
}
.mui-icon-home{
  background-image: url('../../static/img/news.png');
  background-repeat: round;
 
}
.mui-icon-email{
  background-image: url('../../static/img/picShare.png');
  background-repeat: round;
}
.mui-icon-chatbubble{
  background-image: url('../../static/img/goodShow.png');
  background-repeat: round;
}
.mui-icon-location{
  background-image: url('../../static/img/feedback.png');
  background-repeat: round;
}
.mui-icon-search{
  background-image: url('../../static/img/search.png');
  background-repeat: round;
}
.mui-icon-phone{
  background-image: url('../../static/img/callme.png');
  background-repeat: round;
}
</style>
