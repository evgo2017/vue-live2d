<template>
  <live2d
    :style="style"
    :model="[1, 53]"
    :direction="direction"
    :size="size"
    :homePage="homePage"
  ></live2d>
</template>

<script>
/*
 * 项目中引用包时，将 import 内容替换
 * import live2d from 'vue-live2d'
 */
import live2d from "./vueLive2d";
export default {
  name: "Live2d",
  components: {
    live2d,
  },
  data() {
    return {
      direction: "right",
      // style: '',
      style: "position: fixed; bottom: 0; right: 0; zIndex: 1",
      // width: 500,
      // height: 500,
      size: 350,
      homePage: "https://github.com/Raxcl",
      
    };
  },
  created() {
    // tips 未使用，可自行在组件绑定此参数，注意此参数只会初始化一次
    // this.tips = this.tips;
  },
};
</script>

<style>
body {
  margin: 20px;
  padding: 0;
  /* position: fixed; */
  /* right: 40; */
  /* bottom: 40; */
}
</style>
