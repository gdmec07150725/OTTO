<template>
    <div class="pageContent">
        <global-title :pageTitle="title"></global-title>
        <!--新闻列表-->
        <ul class="mui-table-view mui-table-view-chevron">
				<li class="mui-table-view-cell mui-media" v-for="(newsList,index) in newsLists" :key="index">
					<a class="mui-navigate-right" :href="newsList.url">
						<img class="mui-media-object mui-pull-left" :src="newsList.img_url">
						<div class="mui-media-body">
							{{newsList.title}}  
						</div>
					</a>
				</li>
        </ul>
    </div>
</template>
<script>
export default {
  data: function() {
    return {
      newsLists: [],
      title: "新闻列表"
    };
  },
  created: function() {
    var vm = this;
    //请求新闻列表数据
    this.$axios
      .get("/getNewsList")
      .then(function(response) {
        console.log(response);
        vm.newsLists = response.data;
      })
      .catch(function(error) {
        console.log(error);
      });
  }
};
</script>
<style scoped>
.mui-table-view .mui-media-body{
    text-overflow: ellipsis
}
</style>