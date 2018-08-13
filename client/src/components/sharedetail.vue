<template>
    <!-- 图文详情 -->
    <div class="article_content">
        <global-title :pageTitle="title"></global-title>
        <!-- 文章标题 -->
        <div class="article_title">
          <h3>{{article_title}}</h3>
        </div>
        <ul class="mui-table-view mui-grid-view mui-grid-9">
            <li v-for="(image,index) in images" :key="index" class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3">
                <!-- <img :src="image"> -->
                <img  v-preview="image" :src="image"  preview-title-enable="true" preview-nav-enable="true">
            </li>
        </ul>
        <!-- 文章内容 -->
        <div class="photo-desc">
             <p v-html="content_desc"></p> 
        </div>
        <!-- 底部区域 -->
        <div class="footerWrapper">
          <div class="footerLeft">
            <!-- 为文章点赞 -->
            <span :class="classObject" @click="praise"></span>
            <router-link :to="{name:'comment',params:{id:article_id}}">
              <span class="mui-icon icon-pinglun icon"></span>
            </router-link>
          </div>
          <div class="footerRight">
            <span class="text">喜欢{{love}}</span>
               <span class="text">评论{{commentCounts}}</span>
          </div>
        </div>
    </div>
</template>
<script>
export default {
  data: function() {
    return {
      title: "图文详情",
      article_title:'',
      images: [],
      content_desc: "",
      classObject: {
        //爱心样式
        "mui-icon": true,
        "icon-aixin": true, //空心爱心
        icon: true,
        aixin: true,
        "icon-aixin1-copy": false //实心爱心
      },
      status: 0, //0表示该用户这篇文章未点赞，1表示点赞了，确定爱心的样式，等于数据库返回的status
      love: "261",
      commentCounts: "3",
      article_id: ""
    };
  },
  created: function() {
    var vm = this;
    //获取查询字符串中的id值
    this.article_id = this.$route.params.id;
    //用这个id去查询datadetails数据库中文章的详细信息
    var getArticleDetail = function() {
      return vm.$axios.get("/sharedetail/" + vm.article_id);
    };
    //当前用户是否已经点赞了这篇文章
    var getArticlePraise = function() {
      // 获取文章的id和用户id
      var data = {
        article_id: vm.article_id,
        user_id: vm.GLOBAL.getCookie("userid"),
        type: 1 //1表示为文章点赞，2表示评论点赞
      };
      return vm.$axios.post("/getarticlepraise", data);
    };
    //合并两个请求
    this.$axios
      .all([getArticleDetail(), getArticlePraise()])
      .then(
        vm.$axios.spread(function(responseDetail, resopnsePraise) {
          //当这两个请求都完成的时候会触发这个函数，两个参数分别代表返回的结果
          console.log(responseDetail);
          console.log(resopnsePraise);
          vm.article_title = responseDetail.data[0].article_title;
          vm.images = responseDetail.data[0].all_pictureUrl;
          vm.content_desc = responseDetail.data[0].content_desc;

          if (resopnsePraise.data[0].status) {
            //将服务器返回的status值赋值给status
            vm.status = resopnsePraise.data[0].status;
            //如果该用户赞了这篇文章
            if (vm.status === 1) {
              //则修改爱心变为实心
              vm.classObject = {
                "mui-icon": true,
                "icon-aixin": false, //空心爱心
                icon: true,
                aixin: true,
                "icon-aixin1-copy": true //实心爱心
              };
              //如果该用户没有赞这篇文章
            } else {
              //则修改爱心变为空心
              vm.classObject = {
                "mui-icon": true,
                "icon-aixin": true, //空心爱心
                icon: true,
                aixin: true,
                "icon-aixin1-copy": false //实心爱心
              };
            }
          }
        })
      )
      .catch(function(error) {
        console.log(error);
      });
  },
  methods: {
    // 文章点赞方法
    praise() {
      //如果用户还没登陆就跳到登陆页
      if (
        this.GLOBAL.getCookie("userid") === "undefined" ||
        !this.GLOBAL.getCookie("userid")
      ) {
        // this.username = this.GLOBAL.getCookie("username");
        this.$router.push({ name: "login" });
      } else {
        //发送文章点赞信息传给服务器方法
        var vm = this;
        var postParise = function(status) {
          // 获取文章的id和用户id
          var data = {
            article_id: vm.article_id,
            user_id: vm.GLOBAL.getCookie("userid"),
            type: 1, //1表示为文章点赞，2表示评论点赞,
            status: status
          };
          vm.$axios
            .post("/articlepraise", data)
            .then(function(response) {
              console.log(response);
            })
            .catch(function(error) {
              console.log(error);
            });
        };
        // 改变status的值，如果是0,就改为1,如果是1,就改为0
        if (this.status === 0) {
          this.status = 1;
          //则修改爱心变为实心
          this.classObject = {
            "mui-icon": true,
            "icon-aixin": false, //空心爱心
            icon: true,
            aixin: true,
            "icon-aixin1-copy": true //实心爱心
          };
          postParise(this.status);
        } else {
          this.status = 0;
          //则修改爱心变为空心
          this.classObject = {
            "mui-icon": true,
            "icon-aixin": true, //空心爱心
            icon: true,
            aixin: true,
            "icon-aixin1-copy": false //实心爱心
          };
          postParise(this.status);
        }
      }
    }
  }
};
</script>
<style scoped>
.article_content {
  margin-bottom: 30px;
}
/* 标题样式 */
.article_title{
  border-bottom:1px solid #eee;
  padding:10px;

}
li {
  list-style: none;
}

ul {
  margin: 0;
  padding: 0;
}

.photo-desc {
  margin-bottom: 5px;
  padding:8px;
}

.mui-table-view.mui-grid-view.mui-grid-9 {
  background-color: white;
  border: 0;
}

.mui-table-view.mui-grid-view.mui-grid-9 li {
  border: 0;
}

.photo-desc p {
  font-size: 18px;
  text-indent: 1em;
}

.mui-table-view-cell.mui-media.mui-col-xs-4.mui-col-sm-3 {
  padding: 2 2;
}
.mui-grid-view.mui-grid-9 .mui-table-view-cell {
  padding: 11px;
}
img {
  max-width: 120px;
  max-height: 120px;
}
.footerWrapper {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 30px;
  background: #eee;
  text-align: center;
}
.footerWrapper .footerLeft {
  float: left;
  width: 50%;
}
.footerWrapper .footerRight {
  float: left;
  width: 50%;
}
.footerWrapper span {
  line-height: 30px;
  color: #999;
  margin: 0 10px 0 10px;
}
.footerWrapper .icon {
  font-size: 20px;
}
.footerWrapper .aixin {
  color: #43ad89;
}
.footerWrapper .text {
  font-size: 14px;
  letter-spacing: 2px;
}
</style>
