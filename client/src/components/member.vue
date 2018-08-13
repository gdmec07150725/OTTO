<template>
    <div class="userWrapper">
        <global-title :pageTitle="title"></global-title>
        <router-link :to="{name:'modify'}">
            <div class="user_message">
                <div class="user_picture">
                    <img :src="imgUrl"/>
                </div>
                <div class="user_desc">
                    <span v-if="username">{{username}}</span>
                    <span v-else>登陆/注册</span>
                </div>
                <div class="arrow">
                    <span style="fontSize:20px;">></span>
                </div>
            </div>
        </router-link>
        
        <div class="user_data">
            <ul class="user_data_ul">
                <li class="user_data_li">
                    <div class="data_icon mui-icon icon-xiaoxi" style="color: #1E90FF;font-size:25px;"></div>
                    <div class="data_name">消息中心</div>
                    <div class="data_go"></div>
                </li>   
                 <li class="user_data_li">
                    <div class="data_icon mui-icon icon-aixin1-copy" style="color: #43AD89"></div>
                    <div class="data_name">我喜欢的</div>
                    <div class="data_go"></div>
                </li>
                 <li class="user_data_li">
                    <div class="data_icon mui-icon icon-zan" style="color: #FF4500"></div>
                    <div class="data_name">赞过的文章</div>
                    <div class="data_go"></div>
                </li>
                <li class="user_data_li">
                    <div class="data_icon mui-icon icon-yanjing-"></div>
                    <div class="data_name">阅读过的文章</div>
                    <div class="data_go"></div>
                </li>
            </ul>
        </div>
         <div class="user_data">
            <ul class="user_data_ul">
                <li class="user_data_li">
                    <div class="data_icon mui-icon icon-gear" style="color: #999;"></div>
                    <div class="data_name">设置</div>
                    <div class="data_go"></div>
                </li>   
            </ul>
        </div>
        <!-- 底部导航组件 -->
    <nav-footer></nav-footer>
    </div>
</template>
<script>
export default {
  name: "Member",
  data() {
    return {
      title: "我",
      username: "",
      imgUrl:'../../static/img/user.jpg'
    };
  },
  created: function() {
    var vm = this;
    //进入我的页面的时候判断是否有cookie
    if (this.GLOBAL.getCookie("userid") || this.GLOBAL.getCookie("userid") !== 'undefined') {
      //获取cookie值,发起请求，获取用户信息
      this.username = this.GLOBAL.getCookie("username");
      //获取除名字外的其他数据
      this.$axios
        .post("/users/getuserdetail", {
          username: this.username 
        })
        .then(function(response) {  
          console.log(response.data[0]);
          //如果有头像
          if(response.data[0].picture_url){
            vm.imgUrl = response.data[0].picture_url;
          }
        })
        .catch(function(error){
          console.log(error);
        })
    }
  },
  methods: {
    
  }
};
</script>
<style scoped>
body {
  background: #eee;
}
.userWrapper {
  width: 100%;
  height: 100%;
  background: #fff;
}
.user_message {
  width: 100%;
  height: 60px;
  margin-top: 20px;
  /* border: 1px solid #ff0000; */
  background: #eee;
  position: relative;
}
.user_message .user_picture {
  width: 50px;
  height: 50px;
  /* border:1px solid #ff0000; */
  line-height: 50px;
  position: absolute;
  top: 50%;
  margin-top: -25px;
  border-radius: 50%;
  overflow: hidden;
  margin-left: 20px;
  text-align: center;
}
.user_message .user_picture img {
  width: 100%;
  height: 100%;
}
.user_message .user_desc {
  position: absolute;
  left: 15%;
  right: 10%;
  height: 49px;
  top: 50%;
  margin-top: -25px;
  line-height: 49px;
  font-size: 16px;
}
.user_desc span {
  margin-left: 30px;
  color: #777;
}
.user_message .arrow {
  width: 10%;
  height: 49px;
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -25px;
  text-align: center;
  line-height: 49px;
  font-size: 20px;
  color: #777;
}

.user_data_ul {
  margin-top: 20px;
}
.user_data_li {
  list-style-type: none;
  display: flex;
  width: 100%;
  height: 35px;
  border: 1px solid #eee;
}
.data_icon {
  width: 10%;
  height: 35px;
  /* background: green; */
  text-align: center;
  line-height: 35px;
  font-size: 20px;
}
.data_name {
  width: 90%;
  height: 35px;
  /* background: red; */
  line-height: 35px;
  font-size: 16px;
}
</style>