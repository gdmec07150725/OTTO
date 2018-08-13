<template>
    <div>
        <header class="mui-bar mui-bar-nav">
			<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @click="goback"></a>
			<h1 class="mui-title">{{pageTitle}}</h1>
		</header>
    </div>
</template>
<script>
    export default{
        data:function(){
            return{

            }
        },
        props:["pageTitle"],
        methods:{
            goback:function(){
                //返回浏览器历史记录的上一页
                this.$router.go(-1);
            }
        }
    }
</script>
<style scoped>
.mui-bar-nav{
    background-color:#26a2ff;
}
.mui-icon-left-nav{
    color:#eee;
}
</style>