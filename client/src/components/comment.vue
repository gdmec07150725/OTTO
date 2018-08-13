<!-- 评论组件 -->
<template>
    <div class="pageContent">
        <global-title :pageTitle="'评论('+commentCounts+')'"></global-title>
        <!-- 如果没有评论，则显示快来抢沙发图片 -->
        <div class="nocomment" v-if="commentCounts==0">
            <img src="../../static/img/nocomment.jpg">
        </div>
        <ul class="commentWrapper" v-else>
            <li class="comment_li" v-for="commentContent in commentContents" :key="commentContent._id" @click="replyThiscomment(commentContent._id,commentContent.comment_userId.user_name)">
                <!-- 评论者头像 -->
                <div class="picture" v-if="commentContent.comment_userId.picture_url">
                    <img :src="commentContent.comment_userId.picture_url"/>
                </div>
                <div class="picture" v-else>
                    <img src="../assets/logo.png">
                </div>
                <div class="commentContent">
                    <div class="comment_firstline">
                        <div class="commentDetail">
                            <!-- 评论者名称 -->
                            <div class="comment_name">{{commentContent.comment_userId.user_name}}</div>
                            <!-- 评论时间 -->
                            <div class="comment_time">{{commentContent.create_time | TimeFilter }}</div>
                        </div>
                        <!-- 点赞 -->
                        <div class="praise">
                            <!-- 点赞数 -->
                            49598<span class="mui-icon icon-zan"></span>
                            <!-- 点赞图标 -->
                        </div>
                    </div>
                    <!-- 评论内容 -->
                    <div class="comment_text">
                        <div class="comment_parent">
                            {{commentContent.comment_content}}
                        </div>
                        <!-- 如果回复字段部位空 -->
                        <div class="comment_children" v-if="commentContent.reply.length > 0">
                            <span>@{{commentContent.reply[0].comment_user}}</span>: {{commentContent.reply[0].comment_content}}
                        </div>
                    </div>
                </div>
            </li> 
        </ul>
        <!-- 发送评论 -->
        <div class="send_comment">
            <input type="text" maxlength="100" required v-bind:placeholder="placeholder" v-model="sendMessage" class="sendInput" @click="replyInput">
            <button class="mui-icon icon-send sendIcon" :disabled="disabled" @click="send"></button>
        </div>
    </div>
</template>
<script>
import { Toast } from "mint-ui"; //局部引入Toast，使他可以在js中使用

export default {
  data: function() {
    return {
      commentCounts: "",
      articleComment_id: "",
      commentContents: [],
      reply_id: [], //保存回复别人评论的id
      placeholder: "说出你的心声...",
      username: "",
      sendMessage: "",
      disabled: true
    };
  },
  created: function() {
    var vm = this;
    //获取文章的id，用于请求该文章的评论
    this.articleComment_id = this.$route.params.id;
    //获取评论
    this.$axios
      .get("/getcomments/" + this.articleComment_id)
      .then(function(response) {
        console.log(response.data);
        vm.commentContents = response.data;
        //评论条数
        vm.commentCounts = response.data.length;
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  methods: {
    replyInput: function() {
      console.log(this.GLOBAL.getCookie("userid"));
      //当点击输入框的时候,如果用户还没登陆，则跳到登陆页面
      if (
        this.GLOBAL.getCookie("userid") === "undefined" ||
        !this.GLOBAL.getCookie("userid")
      ) {
        // this.username = this.GLOBAL.getCookie("username");
        this.$router.push({ name: "login" });
      }
    },
    //点击发送信息
    send: function() {
      var vm = this;
      //获取输入框的值，文章id和用户名称
      let comment_data = {
        article_id: this.articleComment_id,
        comment_userId: this.GLOBAL.getCookie("userid"),
        comment_user: this.GLOBAL.getCookie("username"),
        comment_content: this.sendMessage,
        reply: this.reply_id
      };
      //发送评论数据给服务器
      this.$axios
        .post("/postcomments", {
          comment_data
        })
        .then(function(response) {
          console.log(response);
          //重新获取一次评论数据
          vm.$axios
            .get("/getcomments/" + vm.articleComment_id)
            .then(function(response) {
              console.log(response.data);
              vm.commentContents = response.data;
              //评论条数
              vm.commentCounts = response.data.length;
            })
            .catch(function(error) {
              console.log(error);
            });
        })
        .catch(function(error) {
          console.log(error);
        });
      //将reply_id清空
      this.reply_id = [];
      //还原输入框和placeholder的值
      this.sendMessage = '';
      this.placeholder = '说出你的心声...';
    },
    //获取当前点击评论的id和评论者名称
    replyThiscomment: function(comment_id, comment_user) {
      //判断是否要评论自己的评论
      if (comment_user === this.GLOBAL.getCookie("username")) {
        //显示弹出框，提示信息
        Toast({
          message: "不能评论自己的评论喔!",
          position: "middle",
          duration: 3000
        });
        return;
      } else {
        //修改输入框placeholder的值
        this.placeholder = "@" + comment_user + ":";
        //修改回复别人评论的id
        this.reply_id = [];
        this.reply_id.push(comment_id);
      }
    }
  },
  watch: {
    //监听输入框的值，如果为空，这发送按钮不能被点击，否则可以被点击
    sendMessage: function() {
      if (this.sendMessage) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    }
  }
};
</script>
<style scoped>
.nocomment {
  position: absolute;
  width: 120px;
  height: 120px;
  top: 50%;
  left: 50%;
  margin-left: -60px;
  margin-top: -60px;
}
.nocomment img {
  width: 100%;
  height: 100%;
}
.commentWrapper {
  box-sizing: border-box;
  width: 100%;
  padding: 10px;
}
.comment_li {
  list-style-type: none;
}
.picture {
  float: left;
  width: 36px;
  height: 36px;
  /* border: 1px solid red; */
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}
.picture img {
  text-align: center;
  display: block;
  width: 100%;
  height: 100%;
}
.commentContent {
  margin-left: 46px;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 10px;
  /* border: 1px solid yellowgreen; */
}
.comment_firstline {
  margin-bottom: 8px;
}
.comment_firstline:after {
  content: "";
  display: block;
  height: 0;
  clear: both;
}
.commentDetail {
  float: left;
}
.commentDetail .comment_name {
  font-size: 14px;
}
.commentDetail .comment_time {
  font-size: 12px;
  color: #777;
}
.praise {
  float: right;
  font-size: 13px;
  color: #777;
}
.praise span {
  font-size: 18px;
  margin-left: 2px;
}
.comment_text {
  font-size: 14px;
  letter-spacing: 2px;
}
.comment_parent {
  margin-bottom: 5px;
}
.comment_children {
  background: #eee;
  color: #999;
  padding: 5px;
  border-radius: 2px;
  margin-bottom: 10px;
}
.comment_children span {
  color: #26a2ff;
}
.send_comment {
  position: fixed;
  width: 100%;
  bottom: 0;
  color: #777;
  margin-bottom: 0;
  font-size: 0;
}
input[type="text"] {
  height: 30px;
  border: 1px solid #eee;
}
.sendInput {
  width: 90%;
  margin-bottom: 0;
  display: inline-block;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.sendIcon {
  display: inline-block;
  width: 10%;
  height: 30px;
  padding: 0;
  vertical-align: top;
  border-left: 0 !important;
  border: 1px solid #eee;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
input::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #999;
}
input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #999;
}
input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #999;
}
input:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #999;
}
</style>
