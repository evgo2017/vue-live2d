<template>
  <div
    class="vue-live2d"
    ref="vue-live2d"
    :style="{ width: live2dWidth + 'px', height: live2dHeight + 'px' }"
    @mouseover="toolShow = true"
    @mouseout="toolShow = false">
    <div v-show="mainShow">
      <div class="vue-live2d-tip" v-html="tipText" v-show="tipShow"></div>
      <canvas :id="live2dMainId" ref="vue-live2d-main" :width="live2dWidth" :height="live2dHeight" class="vue-live2d-main"></canvas>
      <div
        class="vue-live2d-tool"
        ref="vue-live2d-tool"
        v-show="toolShow">
        <span
          v-for="(tool, index) in tools"
          :key="index"
          v-html="tool.icon"
          @click="tool.click"/>
      </div>
    </div>
    <div class="vue-live2d-toggle" ref="vue-live2d-toggle" v-show="!mainShow" @click="mainShow = true">
      <span>看板娘</span>
    </div>
  </div>
</template>

<script>
import './lib/live2d.min.js'

import tips from './options/tips'

const icons = {
  comment: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"/></svg>',
  'user-circle': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" fill="currentColor"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"/></svg>',
  'street-view': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path d="M367.9 329.76c-4.62 5.3-9.78 10.1-15.9 13.65v22.94c66.52 9.34 112 28.05 112 49.65 0 30.93-93.12 56-208 56S48 446.93 48 416c0-21.6 45.48-40.3 112-49.65v-22.94c-6.12-3.55-11.28-8.35-15.9-13.65C58.87 345.34 0 378.05 0 416c0 53.02 114.62 96 256 96s256-42.98 256-96c0-37.95-58.87-70.66-144.1-86.24zM256 128c35.35 0 64-28.65 64-64S291.35 0 256 0s-64 28.65-64 64 28.65 64 64 64zm-64 192v96c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32v-96c17.67 0 32-14.33 32-32v-96c0-26.51-21.49-48-48-48h-11.8c-11.07 5.03-23.26 8-36.2 8s-25.13-2.97-36.2-8H208c-26.51 0-48 21.49-48 48v96c0 17.67 14.33 32 32 32z"/></svg>',
  'camera-retro': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path d="M48 32C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48H48zm0 32h106c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H38c-3.3 0-6-2.7-6-6V80c0-8.8 7.2-16 16-16zm426 96H38c-3.3 0-6-2.7-6-6v-36c0-3.3 2.7-6 6-6h138l30.2-45.3c1.1-1.7 3-2.7 5-2.7H464c8.8 0 16 7.2 16 16v74c0 3.3-2.7 6-6 6zM256 424c-66.2 0-120-53.8-120-120s53.8-120 120-120 120 53.8 120 120-53.8 120-120 120zm0-208c-48.5 0-88 39.5-88 88s39.5 88 88 88 88-39.5 88-88-39.5-88-88-88zm-48 104c-8.8 0-16-7.2-16-16 0-35.3 28.7-64 64-64 8.8 0 16 7.2 16 16s-7.2 16-16 16c-17.6 0-32 14.4-32 32 0 8.8-7.2 16-16 16z"/></svg>',
  'info-circle': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"/></svg>',
  times: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-40 -40 432 592" fill="currentColor"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/></svg>'
}

export default {
  name: 'vue-live2d',
  props: {
    direction: {
      default: 'right',
      type: String
    },
    customId: {
      default: '',
      type: String
    },
    apiPath: {
      default: 'https://live2d.fghrsh.net/api',
      type: String
    },
    model: {
      default: () => [1, 53],
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
      mainShow: true,
      tipText: '',
      tipShow: false,
      toolShow: false,
      modelId: 1,
      modelTexturesId: 53,
      tools: [{
        icon: icons.comment,
        click: this.showHitokoto
      }, {
        icon: icons['user-circle'],
        click: this.loadRandModel
      }, {
        icon: icons['street-view'],
        click: this.loadRandTextures
      }, {
        icon: icons['camera-retro'],
        click: this.takePhoto
      }, {
        icon: icons['info-circle'],
        click: this.openHomePage
      }, {
        icon: icons.times,
        click: this.close
      }]
    }
  },
  mounted () {
    this.modelId = this.model[0]
    this.modelTexturesId = this.model[1]
    this.loadModel()
    this.setDirection()
    this.$nextTick(function () {
      this.loadEvent()
    })
  },
  computed: {
    live2dMainId () {
      const defaultId = 'vue-live2d-main'
      const customId = this.customId
      if (!customId) return defaultId
      return customId
    },
    live2dWidth () {
      return this.width ? this.width : this.size
    },
    live2dHeight () {
      return this.height ? this.height : this.size
    }
  },
  watch: {
    mainShow () {
      const containers = ['vue-live2d']
      const refs = this.$refs
      containers.forEach(containerName => {
        refs[containerName].classList.toggle(`${containerName}-on-${this.direction}`)
      })
    },
    direction () {
      this.setDirection()
    },
    width () {
      this.changeLive2dSize()
    },
    height () {
      this.changeLive2dSize()
    },
    size () {
      if (this.width || this.height) return
      this.changeLive2dSize()
    }
  },
  methods: {
    changeLive2dSize () {
      const { live2dMainId, live2dWidth: width, live2dHeight: height } = this
      // 不知还有调整宽高的好方法没？
      document.querySelector(`#${live2dMainId}`).outerHTML = `<canvas id=${live2dMainId} width="${width}" height="${height}" class="vue-live2d-main"></canvas>`
      this.loadModel()
    },
    setDirection () {
      const containers = ['vue-live2d', 'vue-live2d-tool', 'vue-live2d-toggle']
      const refs = this.$refs
      const addClassPostFix = this.direction
      const removeClassPostFix = this.direction === 'left' ? 'right' : 'left'
      containers.forEach(containerName => {
        refs[containerName].classList.remove(`${containerName}-on-${removeClassPostFix}`)
        refs[containerName].classList.add(`${containerName}-on-${addClassPostFix}`)
      })
    },
    loadModel () {
      const { apiPath, modelId, modelTexturesId, live2dMainId } = this
      const url = `${apiPath}/get/?id=${modelId}-${modelTexturesId}`
      window.loadlive2d(live2dMainId, url)
      console.log(`Live2D 模型 ${modelId}-${modelTexturesId} 加载完成`)
    },
    loadRandModel () {
      this.http({
        url: `${this.apiPath}/rand/?id=${this.modelId}`,
        success: ({ model: { id, message } }) => {
          this.modelId = id
          this.showMessage(message, 4000)
          this.loadRandTextures(true)
        }
      })
    },
    loadRandTextures (isAfterRandModel = false) {
      this.http({
        url: `${this.apiPath}/rand_textures/?id=${this.modelId}-${this.modelTexturesId}`,
        success: ({ textures: { id } }) => {
          this.modelTexturesId = id
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
        this.tipShow = true
      }
      this.tipText = msg
      this.messageTimer = setTimeout(() => {
        this.tipShow = false
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
    close () {
      this.mainShow = false
    },
    loadEvent () {
      for (const event in this.tips) {
        for (const obj of this.tips[event]) {
          const { selector, texts } = obj
          const dom = selector === 'document' ? document : document.querySelector(selector)
          if (dom == null) continue

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
  transform: translateY(0);
  transition: transform .3s ease-in-out;
}
.vue-live2d-on-left:hover {
  transform: translateX(21px);
}
.vue-live2d-on-right:hover {
  transform: translateX(-21px);
}
/* live2d-tip */
.vue-live2d-tip {
  position: absolute;
  width: 100%;
  min-height: 3rem;
  line-height: 1.5rem;
  margin-top: -20px;
  padding: 5px 10px;
  font-size: .9rem;
  word-break: break-all;
  text-overflow: ellipsis;
  border: 1px solid rgba(224, 186, 140, 0.62);
  border-radius: 12px;
  background-color: rgba(236, 217, 188, 0.5);
  box-shadow: 0 3px 15px 2px rgba(191, 158, 118, 0.2);
  animation: shake 50s ease-in-out 5s infinite;
}
/* live2d-main */
.vue-live2d-main {
  cursor: grab;
  cursor: -webkit-grab;
  cursor: -o-grab;
  cursor: -ms-grab;
}
/* live2d-tool */
.vue-live2d-tool {
  position: absolute;
  width: 20px;
  bottom: 10px;
  color: #5b6c7d;
  text-align: center;
  cursor: pointer;
}
.vue-live2d-tool-on-left {
  left: -18px;
}
.vue-live2d-tool-on-right {
  right: -18px;
}
.vue-live2d-tool span {
  display: block;
  line-height: 30px;
}
.vue-live2d-tool span:hover {
  color: #0684bd;
}
/* live2d-toggle */
.vue-live2d-toggle {
  width: 1.5rem;
  position: absolute;
  bottom: 1rem;
  padding: .3rem 0;
  writing-mode: vertical-lr;
  color: #fff;
  background-color: #fa0;
  font-size: 1rem;
  cursor: pointer;
}
.vue-live2d-toggle-on-left {
  left: 0;
  border-radius: 0 .5rem .5rem 0;
}
.vue-live2d-toggle-on-right {
  right: 0;
  border-radius: .5rem 0 0 .5rem;
}
.vue-live2d-toggle:hover {
  width: 1.7rem;
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
