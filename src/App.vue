<template>
  <!-- 使用示例 -->
  <live2d />
</template>

<script>
/*
 * 项目中引用包时，将 import 内容替换，同时引入 css 文件：
 * import live2d from 'vue-live2d'
 * import 'vue-live2d/dist/vue-live2d.css'
 */
import live2d from '@/components/live2d'

export default {
  name: 'App',
  components: {
    live2d 
  }
}
</script>

<style scoped>
</style>
