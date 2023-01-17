<script setup lang="ts">

</script>

<template>
  <div id="app">
    <router-view />
    <van-tabbar route>
      <van-tabbar-item replace to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/classify" icon="apps-o">分类</van-tabbar-item>
      <van-tabbar-item replace to="/bookself" icon="star-o">收藏</van-tabbar-item>
      <van-tabbar-item replace to="/user" icon="contact">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>


<style >

.router-enter-from,
.router-leave-to {
  transform: translateX(100%);
}

.router-enter-active,
.router-leave-active {
  transition: all 0.3s ease-out;
}

.router-enter-to,
.router-leave-from {
  transform: translateX(0);
}
.night {
  background-color: rgb(32, 31, 31) !important;
  color: rgb(170, 170, 170) !important;
}
.nightItem {
  background-color: rgba(0,0,0,.5) !important;
  color: rgb(226, 250, 212) !important;
}
.nightModel{
  background-color: rgb(40, 47, 40)!important;
  color: rgb(226, 250, 212) !important;
}
</style>
