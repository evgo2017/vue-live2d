<template>
  <!-- 使用示例 -->
  <div>
    <div style="margin: 2px 0">
      注意：如果有时候按钮不能点击，是因为模型 zIndex 挡住了按钮。
    </div>
    <div>
      <p>style：{{ style }}</p>
      <button
        v-text="'呆在左上角'"
        @click="style = { position: 'fixed', top: 0, left: 0, zIndex: 1 }"
      />
      <button
        v-text="'呆在右上角'"
        @click="style = { position: 'fixed', top: 0, right: 0, zIndex: 1 }"
      />
      <button
        v-text="'呆在左下角'"
        @click="style = { position: 'fixed', bottom: 0, left: 0, zIndex: 1 }"
      />
      <button
        v-text="'呆在右下角'"
        @click="style = { position: 'fixed', bottom: 0, right: 0 }"
      />
      <button
        v-text="'呆在中间'"
        @click="
          style = {
            position: 'fixed',
            left: `calc(50% - ${width / 2}px)`,
            top: `calc(50% - ${height / 2}px)`,
          }
        "
      />
      <button v-text="'跟随流'" @click="style = {}" />
    </div>
    <div>
      <p>isLeft：{{ isLeft }}</p>
      <button @click="isLeft = false">呆在右边</button>
      <button @click="isLeft = true">呆在左边</button>
    </div>
    <div>
      <p>resolution：</p>
      <input type="number" name="" id="" v-model.lazy="resolution" />
      <button @click="resolution -= 0.5">减小</button>
      <button @click="resolution += 0.5">增大</button>
    </div>
    <div>
      <p>width：</p>
      <input type="number" v-model.lazy="width" />
      <button @click="width -= 50">减小</button>
      <button @click="width += 50">增大</button>
    </div>
    <div>
      <p>height：</p>
      <input type="number" v-model.lazy="height" />
      <button @click="height -= 50">减小</button>
      <button @click="height += 50">增大</button>
    </div>
    <live2d
      class="live2d"
      v-model:width="width"
      v-model:height="height"
      v-model:resolution="resolution"
      :style="style"
      :model="['Potion-Maker/Pio', 'school-2017-costume-yellow']"
      :is-left="isLeft"
      :tips="tips"
    ></live2d>
  </div>
</template>

<script setup lang="ts">
/*
 * 项目中引用包时，将 import 内容替换
 * import live2d from 'vue-live2d'
 */
import live2d from "./index.vue";
import { ref } from "vue";
let isLeft = ref(false);
let style = ref({});
let width = ref(500);
let height = ref(500);
let resolution = ref(1);
let tips = ref({
  mouseover: [
    {
      selector: ".vue-live2d",
      texts: ["请查看源代码了解如何修改默认语句"],
    },
  ],
});
</script>

<style>
body {
  margin: 20px;
  padding: 0;
}
.live2d {
  border: 1px dashed gray;
}
</style>
