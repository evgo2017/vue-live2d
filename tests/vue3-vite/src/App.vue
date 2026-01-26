<template>
  <div>
    <div style="margin: 2px 0">注意：如果有时候按钮不能点击，是因为模型 zIndex 挡住了按钮。</div>
    <div>
      <span>position style：</span>
      <button @click="style = 'position: fixed; top: calc(50% - 250px); left: calc(50% - 200px)'">呆在中间</button>
      <button @click="style = 'position: fixed; top: 0; left: 0; zIndex: 1'">呆在左上角</button>
      <button @click="style = 'position: fixed; top: 0; right: 0; zIndex: 1'">呆在右上角</button>
      <button @click="style = 'position: fixed; bottom: 0; left: 0; zIndex: 1'">呆在左下角</button>
      <button @click="style = 'position: fixed; bottom: 0; right: 0;'">呆在右下角</button>
      <button @click="style = ''">跟随流</button>
    </div>
    <div>
      <span>direction：</span>
      <button @click="direction = 'right'">呆在右边</button>
      <button @click="direction = 'left'">呆在左边</button>
    </div>
    <div>
      <span>size：</span>
      <button @click="size = size - 100; width = width - 100; height = height - 100;">减小</button>
      <button @click="size = size + 100; width = width + 100; height = height + 100;">增大</button>
    </div>
    <live2d
      :style="style"
      :model="['Potion-Maker/Pio', 'school-2017-costume-yellow']"
      :direction="direction"
      :size="size"
    ></live2d>
  </div>
</template>

<script>
import live2d from 'vue-live2d'

export default {
  name: 'App',
  components: {
    live2d
  },
  data () {
    return {
      direction: 'right',
      style: '',
      width: 500,
      height: 500,
      size: 350,
      tips: {
        mouseover: [{
          selector: '.vue-live2d',
          texts: ['这样可以修改默认语句']
        }]
      }
    }
  },
  created () {
    this.tips = this.customTips
  }
}
</script>

<style>
body {
  margin: 20px;
  padding: 0;
}
</style>
