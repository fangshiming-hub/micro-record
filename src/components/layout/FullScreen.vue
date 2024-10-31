<template>
  <div class="full-screen">
    <div class="app-header">
      标题栏
    </div>
    <div class="app-content">
      <router-view ></router-view>
    </div>
  </div>
</template>
<script setup lang="ts">
const { VITE_APP } = import.meta.env;
console.log(VITE_APP, 999);

</script>
<style scoped>
.full-screen{
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.app-header{
  height: 4em;
  background-color: rgba(71, 146, 230);
}
.app-content{
  flex: 1 1 0;
  /* overflow-y: auto; */
  overflow-y: hidden;
}
</style>