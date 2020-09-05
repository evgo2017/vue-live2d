<template>
  <!-- 使用示例 -->
  <div>
    <!-- <live2d
      style="position: fixed; bottom: 0; right: 0; zIndex: 1"
      :width="300"
      :height="300"
    ></live2d> -->
    <live2d
      :model="[1, 53]"
      position="left"
    ></live2d>
  </div>
</template>

<script>
/*
 * 项目中引用包时，将 import 内容替换，同时引入 css 文件：
 * import live2d from 'vue-live2d'
 * import 'vue-live2d/dist/vue-live2d.css'
 */
import live2d from '../packages/index.vue'
// import live2d from '../dist/vue-live2d.common.js'
// import '../dist/vue-live2d.css'

export default {
  name: 'App',
  components: {
    live2d 
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
