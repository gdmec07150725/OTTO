<template>
    <div>
        <global-title :pageTitle="title"></global-title>
        <!-- 底部导航组件 -->
        <nav-footer></nav-footer>
    </div>
</template>
<script>
export default {
  name: "Member",
  data() {
    return {
      title: "发现"
    };
  }
};
</script>
<style scoped>
</style>