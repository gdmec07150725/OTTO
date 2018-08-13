<template>
    <div>
        <global-title :pageTitle="title"></global-title>
        <div class="login_logo">
            <img src="../../static/img/user.jpg">
        </div>
        <div class="inputWrapper">
                <input type="tel" required maxlength="11" placeholder="手机号" v-model="phonenumber">
                <input type="password" required placeholder="密码" v-model="password">
                <input type="submit" value="登陆" class="sub" @click="login">
            <router-link :to="{name:'register'}">
                <div class="register">
                    <span>注册账号</span>
                </div>
            </router-link>
        </div>
    </div>
</template>
<script>
import { Toast } from "mint-ui"; //局部引入Toast，使他可以在js中使用

export default {
  data: function() {
    return {
      title: "登陆",
      phonenumber: "",
      password: ""
    };
  },
  methods: {
    login: function() {
        var vm = this;
      if (this.phonenumber && this.password) {
        this.$axios
          .post("users/login", {
            phonenumber: this.phonenumber,
            password: this.password
          })
          .then(function(response) {
            console.log(response);
            //显示弹出框，提示信息
            Toast({
              message: response.data.Msg,
              position: "bottom",
              duration: 3000
            });
             //登陆成功,将用户名保存到cookie
            if(response.data.Msg === '登陆成功'){
              //保存cookie的代码
              var exp = new Date();
              exp.setTime(exp.getTime() + 60 * 1000 * 60 * 24)//24小时
              //设置cookie的用户名和用户Id和过期时间
              document.cookie = "username="+response.data.Username+";expirse=" + exp.toUTCString();
              document.cookie = "userid="+response.data.Userid+";expirse=" + exp.toUTCString();
              //跳转到首页
              setTimeout(() => {
                 vm.$router.push({name:'Home'});
              }, 3000);
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    }
  }
};
</script>
<style scoped>
.login_logo {
  width: 100%;
  height: 150px;
  position: relative;
}
.login_logo img {
  display: block;
  width: 50px;
  height: 50px;
  line-height: 150px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -25px;
  margin-left: -25px;
  border-radius: 5px;
}
.sub {
  width: 100%;
  height: 40px;
  background-color: #26a2ff;
  border-color: #26a2ff;
}
.register {
  margin-top: 10px;
  position: absolute;
  right: 10px;
  color: #26a2ff;
}
</style>