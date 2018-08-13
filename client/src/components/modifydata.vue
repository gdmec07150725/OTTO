<template>
    <div class="modifyPage">
        <!-- 修改用户资料组件 -->
        <global-title :pageTitle="title"></global-title>
        <div class="pictureWrapper">
            <input type="file" class="fileInput" ref="upload" name="picture" capture="camera" accept="image/*" @change="getImg"/>
            <div class="text">头像</div>
            <div class="picture">
                <img :src="imgUrl">
            </div>
        </div>
        <div class="usernameWrapper">
            <div class="text">姓名</div>
            <!-- 可编辑的内容 contenteditable=“true” -->
            <input type="text" class="username editable" v-model="username">
        </div>
        <div class="jobWrapper">
            <div class="text">职位</div>
            <input type="text" class="job editable" v-model="job">
        </div>
        <div class="companyWrapper">
            <div class="text">公司</div>
            <input type="text" class="company editable" v-model="company">
        </div>
        <div class="IntroductionWrapper">
            <div class="text">简介</div>
            <input type="text" class="Introduction editable" v-model="Introduction">
        </div>
        <div class="buttonWrapper">
            <input type="submit" value="保存" class="submitButton" @click="submitContent">
            <input type="reset"  value="清除" class="resetButton" @click="resetContent">
        </div>
    </div>
</template>
<script>
import { Toast } from "mint-ui"; //局部引入Toast，使他可以在js中使用

export default {
  data: function() {
    return {
      title: "修改资料",
      imgUrl: "../../static/img/user.jpg",
      username: "聊男",
      job: "前端开发",
      company: "腾讯",
      Introduction: "越自律,越自由",
      userdetail: {
        username: null,
        picture: null
      }
    };
  },
  created: function() {
    var vm = this;
    //初始化数据
    this.username = this.GLOBAL.getCookie("username");
    //获取除名字外的其他数据
    this.$axios
      .post("/users/getuserdetail", {
        username: this.username
      })
      .then(function(response) {
        console.log(response.data[0]);
        //如果有头像
        if (response.data[0].picture_url) {
          vm.imgUrl = response.data[0].picture_url;
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  methods: {
    //文件上传方法
    getImg: function() {
      var vm = this;
      var formData = new FormData();
      //获取上传的图片
      let files = this.$refs.upload.files;
      let file = files[0];
      let size = file.size; //获取文件的大小,单位为byte
      let kb = size / 1024; //将byte转为kb
      console.log(kb);
      //当前文件大于5M的时候拒绝上传
      if (kb > 5000) {
        //提示信息
        Toast({
          message: "图片大于5M",
          position: "middle",
          duration: 3000
        });
        return;
      } else {
        this.userdetail.picture = file;
        this.userdetail.username = this.username;
        //读取userdetail中所要上传的内容循环append到formdata中
        for (var key in this.userdetail) {
          if (key) {
            formData.append(key, this.userdetail[key]);
          }
        }
        this.$axios
          .post("/users/userpicture", formData, {
            //在上传图片时,切记一定要将请求头中的Content-Type改为multipart/form-data否则node端获取到的将是一个字符串
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(function(response) {
            console.log(response);
            vm.imgUrl = response.data.picture_url;
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    submitContent: function() {
      //保存用户的除图片外的其他数据
    },
    resetContent: function() {
      //清除除图片外的信息,只是在前端清空,为保存到数据库
      this.username = "";
      this.job = "";
      this.company = "";
      this.Introduction = "";
    }
  }
};
</script>
<style scoped>
.pictureWrapper {
  width: 100%;
  height: 60px;
  margin-top: 10px;
  border-bottom: 1px solid #eee;
  position: relative;
}
.fileInput {
  width: 100%;
  height: 100%;
  border: 1px solid #ff0000;
  /* 隐藏文件上传框 */
  opacity: 0;
}
.usernameWrapper,
.jobWrapper,
.companyWrapper,
.IntroductionWrapper {
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #eee;
  position: relative;
}
.text {
  position: absolute;
  top: 50%;
  margin-top: -10px;
  margin-left: 10px;
  font-size: 14px;
}
.picture {
  position: absolute;
  right: 10px;
  width: 50px;
  height: 50px;
  top: 50%;
  margin-top: -25px;
  border-radius: 50%;
  overflow: hidden;
}
.picture img {
  width: 100%;
  height: 100%;
}
.editable {
  position: absolute;
  display: block;
  font-size: 14px;
  width: 85%;
  height: 20px;
  right: 0;
  top: 50%;
  margin-top: -10px;
  text-align: right;
  color: #999;
  padding: 10px;
  border: none;
}
.buttonWrapper {
  text-align: right;
  margin-top: 10px;
  margin-right: 10px;
}
</style>