<template>
  <div id="app">
    <!--头部内容-->
    <mt-header title="OTTO"></mt-header>
    <router-view></router-view>
    <!--
          <ul>
          <li v-for="(todo,index) in todoList" :key="index">
          {{todo.title}}-->
    <!--query查询字符串方式传递参数，路由配置中的path不需要改动，在跳转的组件中获取参数的时候，使用this.$route.query.id-->
    <!--<router-link :to="{name:'HelloWorld',query:{id:todo.id}}"><button @click="showDetail">查看</button></router-link>-->
    <!--params方式传递参数，路由配置信息的path，需要改成path: '/home/:id'这样的方式,在跳转的组件中获取参数的时候，使用this.$route.params.id-->
    <!--<router-link :to="{name:'HelloWorld',params:{id:todo.id}}"><button @click="showDetail">查看</button></router-link>
          </li>
      </ul>-->
      <lg-preview></lg-preview>
  </div>
</template>

  <script>
export default {
  name: 'App',
  data: function() {
    return {
      swiperImages:[],
      todoList: [
        { id: '1', title: 'new' },
        { id: '2', title: 'travel' }
      ]
    }
  },
  methods: {
    // showTip: function() {
    //   Toast("提示信息")
    // },
    showDetail: function() {

    }
  },
  created:function(){
     
  }
}
</script>

<style scoped>

</style>
