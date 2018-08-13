<template>
    <!-- 图文列表 -->
    <div class="pageContent">
        <global-title :pageTitle="title"></global-title>
        <div class="photo-header">
            <ul>
                <li v-for="category in categorys" :key="category.category_id" @click="searchCategory(category.category_id)">
                    <a href="javascript:;" >{{category.category_name}}</a>
                </li>
            </ul>
        </div>
        <router-link :to="{name:'shareDetail', params:{id:allData._id}}" v-for="allData in allDatas" :key="allData._id">
                <div class="mui-card" >
                    <div class="mui-card-header mui-card-media" :style="{height:'40vw',backgroundImage:'url('+allData.first_picture+')'}"></div>
                    <div class="mui-card-content">
                        <div class="mui-card-content-inner">
                            <p>{{allData.title}}</p>
                            <div v-html="allData.content_desc" class="desc_content"></div>
                        </div>
                    </div>
                    <div class="mui-card-footer">
                        <a class="mui-card-link" style="color:#999">Time: {{allData.creat_time | TimeFilter }}</a>
                        <a class="mui-card-link">Read More</a>
                    </div>
                </div>
        </router-link>
        <!-- 底部导航组件 -->
        <nav-footer></nav-footer>
    </div>
</template>
<script>
export default {
  data: function() {
    return {
      title: "图文分享",
      categorys: [],
      allDatas: []
    };
  },
  created: function() {
    var vm = this;
    //获取分类数据
    this.$axios
      .get("/share")
      .then(function(response) {
        console.log(response.data);
        vm.categorys = response.data.categoryTitle;
        vm.allDatas = response.data.allData;
        //增加一项‘全部’在数组前面
        var all = {
          category_id: 0,
          category_name: "全部"
        };
        vm.categorys.unshift(all);
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  methods: {
    searchCategory: function(category_id) {
      var vm = this;
      //获取分类id，并请求对应的文章
      console.log(category_id);
      var data = {
        category_id :category_id
      }
      this.$axios
        .post("/searchcategory", data)
        .then(function(response) {
          console.log(response);
          vm.allDatas = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>
<style>
.photo-header ul {
  /*强制不换行*/
  white-space: nowrap;
  width: 100%;
  font-size: 0;
}
.photo-header li {
  list-style: none;
  display: inline-block;
  line-height: 38px;
  width: 25%;
  text-align: center;
  font-size: 16px;
}
.photo-header li a {
  color: #777;
}
/*修改描述区域样式*/
.desc_content {
  height: 41px;
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;
}
.desc_content p {
  color: #333;
}
</style>
