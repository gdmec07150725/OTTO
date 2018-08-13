<template>
<div>
    <global-title :pageTitle="title"></global-title>
    <div class="search">
        <input type="search" class="searchInput" maxlength="50" placeholder="请输入文章标题" required v-model="search"/>
        <ul class="mui-table-view mui-table-view-chevron">
				<li class="mui-table-view-cell mui-media" v-for="allData in allDatas" :key="allData._id">
					<router-link :to="{name:'shareDetail',params:{id:allData._id}}" class="mui-navigate-right" >
						<img class="mui-media-object mui-pull-left" :src="allData.first_picture">
						<div class="mui-media-body">
							{{allData.title}}  
						</div>
					</router-link>
				</li>
        </ul>
    </div>
    <!-- 底部导航组件 -->
    <nav-footer></nav-footer>
</div>
</template>
<script>
export default {
  data: function() {
    return {
      title: "文章搜索",
      search: "",
      allDatas: []
    };
  },
  watch: {
    //监听输入框的值，如果发生改变就请求数据
    search: function() {
        this.allDatas = [];
      //将输入框的值通过模糊查询文章标题,查找文章
      var data = {
        qs: this.search
      };
      var vm = this;
      this.$axios
        .post("/blurrysearch", data)
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
<style scoped>
.searchInput{
    margin-bottom:0px;
    
}
</style>