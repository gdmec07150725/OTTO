<template>
    <div>
        <!--底部内容-->
        <nav class="mui-bar mui-bar-tab">
            <router-link :to="{name:'Home'}" class="mui-tab-item">
                <span class="mui-icon icon-shouye"></span>
                <span class="mui-tab-label">首页</span>
            </router-link>
            <router-link :to="{name:'Search'}" class="mui-tab-item">
                <span class="mui-icon icon-chazhao"></span>
                <span class="mui-tab-label">发现</span>
            </router-link>
            <router-link :to="{name:'ShopCart'}" class="mui-tab-item">
                <span class="mui-icon icon-gouwuche">
                <span class="mui-badge">9</span>
                </span>
                <span class="mui-tab-label">购物车</span>
            </router-link>
            <router-link :to="{name:'Member'}" class="mui-tab-item">
                <span class="mui-icon icon-yonghu"></span>
                <span class="mui-tab-label">我</span>
            </router-link>
        </nav>
    </div>
</template>
<script>
export default{
    data:function(){
        return{
            
        }
    }
}
</script>
<style scoped>
</style>