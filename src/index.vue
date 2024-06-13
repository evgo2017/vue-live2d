<template>
  <div
    :class="{
      'vue-live2d': true,
      'vue-live2d-on-left': direction === 'left',
      'vue-live2d-on-right': direction === 'right',
    }"
    :style="{
      width: `${live2dWidth}px`,
      height: `${live2dHeight}px`,
    }"
    @mouseover="openLive2dTool"
    @mouseout="closeLive2dTool">
    <div
      v-show="tipShow"
      v-html="tipText"
      :class="{
        'vue-live2d-tip': true,
        'vue-live2d-tip-on-top': tipPosition === 'top',
        'vue-live2d-tip-on-bottom': tipPosition === 'bottom',
      }">
    </div>
    <canvas
      :id="customId"
      v-show="mainShow"
      :class="{
        'vue-live2d-main': true,
        'vue-live2d-main-on-left': direction === 'left',
        'vue-live2d-main-on-right': direction === 'right',
      }"
      :width="live2dWidth"
      :height="live2dHeight">
    </canvas>
    <div v-show="toolShow" class="vue-live2d-tool">
      <span
        v-for="(tool, index) in tools"
        :key="index"
        :class="tool.className"
        v-html="tool.svg"
        @click="tool.click"/>
    </div>
    <div
      v-show="toggleShow"
      @click="openLive2dMain"
      :class="{
        'vue-live2d-toggle': true,
        'vue-live2d-toggle-on-left': direction === 'left',
        'vue-live2d-toggle-on-right': direction === 'right',
      }">
      <span>看板娘</span>
    </div>
  </div>
</template>

<script>
// import './lib/live2d.min.js' // [fix: [Github-22]不能被vite构建的问题](https://github.com/evgo2017/vue-live2d/pull/22)
import Live2dLibURL from './lib/live2d.min.js?url'

import tips from './options/tips'

export default {
  name: 'vue-live2d',
  props: {
    direction: {
      default: 'right',
      validator: function (value) {
        return new Set(['left', 'right']).has(value)
      },
      type: String
    },
    tipPosition: {
      default: 'top',
      validator: function (value) {
        return new Set(['top', 'top']).has(value)
      },
      type: String
    },
    customId: {
      default: 'vue-live2d-main',
      type: String
    },
    apiPath: {
      // 注意：这是我服务器目前部署的 api 服务，若更新服务地址会在 README.md 说明
      default: 'https://evgo2017.com/api/live2d-static-api/indexes',
      type: String
    },
    model: {
      default: () => ['Potion-Maker/Pio', 'school-2017-costume-yellow'],
      type: Array
    },
    homePage: {
      default: 'https://github.com/evgo2017/vue-live2d',
      type: String
    },
    tips: {
      default: () => tips,
      type: Object
    },
    width: {
      default: 0,
      type: Number
    },
    height: {
      default: 0,
      type: Number
    },
    size: {
      default: 255,
      type: Number
    }
  },
  data () {
    return {
      messageTimer: null,
      containerDisplay: {
        tip: false,
        main: true,
        tool: false,
        toggle: false
      },
      tipText: 'vue-live2d 看板娘',
      modelPath: '',
      modelTexturesId: '',
      tools: [{
        className: 'custom-fa-comment',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" height="20px" width="20px"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"/></svg>',
        click: this.showHitokoto
      }, {
        className: 'custom-fa-user-circle',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" fill="currentColor" height="20px" width="20px"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"/></svg>',
        click: this.loadRandModel
      }, {
        className: 'custom-fa-street-view',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" height="20px" width="20px"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path d="M367.9 329.76c-4.62 5.3-9.78 10.1-15.9 13.65v22.94c66.52 9.34 112 28.05 112 49.65 0 30.93-93.12 56-208 56S48 446.93 48 416c0-21.6 45.48-40.3 112-49.65v-22.94c-6.12-3.55-11.28-8.35-15.9-13.65C58.87 345.34 0 378.05 0 416c0 53.02 114.62 96 256 96s256-42.98 256-96c0-37.95-58.87-70.66-144.1-86.24zM256 128c35.35 0 64-28.65 64-64S291.35 0 256 0s-64 28.65-64 64 28.65 64 64 64zm-64 192v96c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32v-96c17.67 0 32-14.33 32-32v-96c0-26.51-21.49-48-48-48h-11.8c-11.07 5.03-23.26 8-36.2 8s-25.13-2.97-36.2-8H208c-26.51 0-48 21.49-48 48v96c0 17.67 14.33 32 32 32z"/></svg>',
        click: this.loadRandTextures
      }, {
        className: 'custom-fa-camera-retro',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" height="20px" width="20px"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path d="M48 32C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48H48zm0 32h106c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H38c-3.3 0-6-2.7-6-6V80c0-8.8 7.2-16 16-16zm426 96H38c-3.3 0-6-2.7-6-6v-36c0-3.3 2.7-6 6-6h138l30.2-45.3c1.1-1.7 3-2.7 5-2.7H464c8.8 0 16 7.2 16 16v74c0 3.3-2.7 6-6 6zM256 424c-66.2 0-120-53.8-120-120s53.8-120 120-120 120 53.8 120 120-53.8 120-120 120zm0-208c-48.5 0-88 39.5-88 88s39.5 88 88 88 88-39.5 88-88-39.5-88-88-88zm-48 104c-8.8 0-16-7.2-16-16 0-35.3 28.7-64 64-64 8.8 0 16 7.2 16 16s-7.2 16-16 16c-17.6 0-32 14.4-32 32 0 8.8-7.2 16-16 16z"/></svg>',
        click: this.takePhoto
      }, {
        className: 'custom-fa-info-circle',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" height="20px" width="20px"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"/></svg>',
        click: this.openHomePage
      }, {
        className: 'custom-fa-times',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-40 -40 432 592" fill="currentColor" height="20px" width="20px"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/></svg>',
        click: this.closeLive2dMain
      }]
    }
  },
  async mounted () {
    await import(Live2dLibURL);
    [this.modelPath, this.modelTexturesId] = this.model
    this.loadModel()
    this.$nextTick(() => {
      this.loadEvent()
    })
  },
  computed: {
    live2dWidth () {
      return this.width ? this.width : this.size
    },
    live2dHeight () {
      return this.height ? this.height : this.size
    },
    tipShow () {
      return this.mainShow && this.containerDisplay.tip
    },
    mainShow () {
      return this.containerDisplay.main
    },
    toolShow () {
      return this.mainShow && this.containerDisplay.tool
    },
    toggleShow () {
      return !this.mainShow
    }
  },
  watch: {
    width () {
      this.changeLive2dSize()
    },
    height () {
      this.changeLive2dSize()
    },
    size () {
      this.changeLive2dSize()
    }
  },
  methods: {
    changeLive2dSize () {
      // 针对当前这份 live2d.min.js 来说，更改宽高就是这样。更好的方案是调用重绘方法，但是需要改 lib 源码。
      document.querySelector(`#${this.customId}`).outerHTML = `<canvas id=${this.customId} width="${this.live2dWidth}" height="${this.live2dHeight}" class="vue-live2d-main"></canvas>`
      this.loadModel()
    },
    loadModel () {
      window.loadlive2d(this.customId, `${this.apiPath}/${this.modelPath}/${this.modelTexturesId}.json`)
      console.log(`Live2D 模型 ${this.modelPath}，服装 ${this.modelTexturesId} 加载完成`)
    },
    loadRandModel () {
      this.http({
        url: `${this.apiPath}/models.json`,
        success: (data) => {
          const models = data.filter(({ modelPath }) => modelPath !== this.modelPath)
          const { modelPath, modelIntroduce } = models[Math.floor(Math.random() * models.length)]
          this.modelPath = modelPath
          this.showMessage(`${modelIntroduce}`, 4000)
          this.loadRandTextures(true)
        }
      })
    },
    loadRandTextures (isAfterRandModel = false) {
      this.http({
        url: `${this.apiPath}/${this.modelPath}/textures.json`,
        success: (data) => {
          const modelTexturesIds = data.filter(modelTexturesId => modelTexturesId !== this.modelTexturesId)
          this.modelTexturesId = modelTexturesIds[Math.floor(Math.random() * modelTexturesIds.length)]
          this.loadModel()
          if (!isAfterRandModel) {
            this.showMessage('我的新衣服好看嘛？', 4000)
          }
        }
      })
    },
    showMessage (msg = '', timeout = 6000) {
      if (this.messageTimer) {
        clearTimeout(this.messageTimer)
        this.messageTimer = null
      } else {
        this.containerDisplay.tip = true
      }
      this.tipText = msg
      this.messageTimer = setTimeout(() => {
        this.containerDisplay.tip = false
        this.messageTimer = null
      }, timeout)
    },
    takePhoto () {
      this.showMessage('照好了嘛，留个纪念吖~')
      window.Live2D.captureName = 'photo.png'
      window.Live2D.captureFrame = true
    },
    showHitokoto () {
      this.http({
        url: 'https://v1.hitokoto.cn',
        success: ({ hitokoto, id, creator, from }) => {
          this.showMessage(`${hitokoto} <br> - by <a href="https://hitokoto.cn?id=${id}">${creator}</a> from 《${from} 》`)
        }
      })
    },
    openHomePage () {
      open(this.homePage)
    },
    closeLive2dMain () {
      this.containerDisplay.main = false
    },
    openLive2dMain () {
      this.containerDisplay.main = true
    },
    closeLive2dTool () {
      this.containerDisplay.tool = false
    },
    openLive2dTool () {
      this.containerDisplay.tool = true
    },
    loadEvent () {
      for (const event in this.tips) {
        for (const { selector, texts } of this.tips[event]) {
          const dom = selector === 'document' ? document : document.querySelector(selector)
          if (dom == null) {
            continue
          }

          dom.addEventListener(event, () => {
            const msg = texts[Math.floor(Math.random() * texts.length)]
            this.showMessage(msg, 2000)
          })
        }
      }
    },
    http ({ url, success }) {
      const xhr = new XMLHttpRequest()
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if ((xhr.status >= 200 || xhr.status < 300) || xhr.status === 304) {
            success && success(JSON.parse(xhr.response))
          } else {
            console.error(xhr)
          }
        }
      }
      xhr.open('GET', url)
      xhr.send(null)
    }
  }
}
</script>

<style scoped>
/* live2d */
.vue-live2d {
  display: flex;
  position: relative;
  align-items: flex-end;
}
.vue-live2d-on-left {
  flex-direction: row;
}
.vue-live2d-on-right {
  flex-direction: row-reverse;
}
/* live2d-tip */
.vue-live2d-tip {
  box-sizing: border-box;
  position: absolute;
  width: 100%;
  line-height: 1.5rem;
  padding: 15px 20px;
  font-size: .9rem;

  word-break: break-all;
  text-overflow: ellipsis;
  border: 1px solid rgba(224, 186, 140, 0.62);
  border-radius: 12px;
  background-color: rgba(236, 217, 188, 0.5);
  box-shadow: 0 3px 15px 2px rgba(191, 158, 118, 0.2);
  animation: shake 50s ease-in-out 5s infinite;
}
.vue-live2d-tip-on-top {
  top: 0;
}
.vue-live2d-tip-on-bottom {
  bottom: 0;
}
/* live2d-main */
.vue-live2d-main {
  transition: padding .3s ease-in-out;
  cursor: grab;
}
.vue-live2d-main-on-left:hover {
  padding-left: 21px;
}
.vue-live2d-main-on-right:hover {
  padding-right: 21px;
}
/* live2d-tool */
.vue-live2d-tool {
  position: absolute;
  width: 20px;
  bottom: 10px;
  color: #5b6c7d;
  text-align: center;
  cursor: pointer;
  padding: 0 10px;
}
.vue-live2d-tool span {
  line-height: 30px;
}
.vue-live2d-tool span:hover {
  color: #0684bd;
}
/* live2d-toggle */
.vue-live2d-toggle {
  width: 1.5rem;
  bottom: 1rem;
  padding: .3rem 0;
  writing-mode: vertical-lr;
  color: #fff;
  background-color: #fa0;
  font-size: 1rem;
  cursor: pointer;
  right: 0;
}
.vue-live2d-toggle:hover {
  width: 1.7rem;
}
.vue-live2d-toggle-on-left {
  border-radius:  0 .5rem .5rem 0;
}
.vue-live2d-toggle-on-right {
  border-radius:  .5rem 0 0 .5rem;
}
@keyframes shake {
  2% {
    transform: translate(0.5px, -1.5px) rotate(-0.5deg);
  }
  4% {
    transform: translate(0.5px, 1.5px) rotate(1.5deg);
  }
  6% {
    transform: translate(1.5px, 1.5px) rotate(1.5deg);
  }
  8% {
    transform: translate(2.5px, 1.5px) rotate(0.5deg);
  }
  10% {
    transform: translate(0.5px, 2.5px) rotate(0.5deg);
  }
  12% {
    transform: translate(1.5px, 1.5px) rotate(0.5deg);
  }
  14% {
    transform: translate(0.5px, 0.5px) rotate(0.5deg);
  }
  16% {
    transform: translate(-1.5px, -0.5px) rotate(1.5deg);
  }
  18% {
    transform: translate(0.5px, 0.5px) rotate(1.5deg);
  }
  20% {
    transform: translate(2.5px, 2.5px) rotate(1.5deg);
  }
  22% {
    transform: translate(0.5px, -1.5px) rotate(1.5deg);
  }
  24% {
    transform: translate(-1.5px, 1.5px) rotate(-0.5deg);
  }
  26% {
    transform: translate(1.5px, 0.5px) rotate(1.5deg);
  }
  28% {
    transform: translate(-0.5px, -0.5px) rotate(-0.5deg);
  }
  30% {
    transform: translate(1.5px, -0.5px) rotate(-0.5deg);
  }
  32% {
    transform: translate(2.5px, -1.5px) rotate(1.5deg);
  }
  34% {
    transform: translate(2.5px, 2.5px) rotate(-0.5deg);
  }
  36% {
    transform: translate(0.5px, -1.5px) rotate(0.5deg);
  }
  38% {
    transform: translate(2.5px, -0.5px) rotate(-0.5deg);
  }
  40% {
    transform: translate(-0.5px, 2.5px) rotate(0.5deg);
  }
  42% {
    transform: translate(-1.5px, 2.5px) rotate(0.5deg);
  }
  44% {
    transform: translate(-1.5px, 1.5px) rotate(0.5deg);
  }
  46% {
    transform: translate(1.5px, -0.5px) rotate(-0.5deg);
  }
  48% {
    transform: translate(2.5px, -0.5px) rotate(0.5deg);
  }
  50% {
    transform: translate(-1.5px, 1.5px) rotate(0.5deg);
  }
  52% {
    transform: translate(-0.5px, 1.5px) rotate(0.5deg);
  }
  54% {
    transform: translate(-1.5px, 1.5px) rotate(0.5deg);
  }
  56% {
    transform: translate(0.5px, 2.5px) rotate(1.5deg);
  }
  58% {
    transform: translate(2.5px, 2.5px) rotate(0.5deg);
  }
  60% {
    transform: translate(2.5px, -1.5px) rotate(1.5deg);
  }
  62% {
    transform: translate(-1.5px, 0.5px) rotate(1.5deg);
  }
  64% {
    transform: translate(-1.5px, 1.5px) rotate(1.5deg);
  }
  66% {
    transform: translate(0.5px, 2.5px) rotate(1.5deg);
  }
  68% {
    transform: translate(2.5px, -1.5px) rotate(1.5deg);
  }
  70% {
    transform: translate(2.5px, 2.5px) rotate(0.5deg);
  }
  72% {
    transform: translate(-0.5px, -1.5px) rotate(1.5deg);
  }
  74% {
    transform: translate(-1.5px, 2.5px) rotate(1.5deg);
  }
  76% {
    transform: translate(-1.5px, 2.5px) rotate(1.5deg);
  }
  78% {
    transform: translate(-1.5px, 2.5px) rotate(0.5deg);
  }
  80% {
    transform: translate(-1.5px, 0.5px) rotate(-0.5deg);
  }
  82% {
    transform: translate(-1.5px, 0.5px) rotate(-0.5deg);
  }
  84% {
    transform: translate(-0.5px, 0.5px) rotate(1.5deg);
  }
  86% {
    transform: translate(2.5px, 1.5px) rotate(0.5deg);
  }
  88% {
    transform: translate(-1.5px, 0.5px) rotate(1.5deg);
  }
  90% {
    transform: translate(-1.5px, -0.5px) rotate(-0.5deg);
  }
  92% {
    transform: translate(-1.5px, -1.5px) rotate(1.5deg);
  }
  94% {
    transform: translate(0.5px, 0.5px) rotate(-0.5deg);
  }
  96% {
    transform: translate(2.5px, -0.5px) rotate(-0.5deg);
  }
  98% {
    transform: translate(-1.5px, -1.5px) rotate(-0.5deg);
  }
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
}
</style>
