<template>
  <div
    id="live2d"
    ref="live2d"
    :style="{ width: width + 'px', height: height + 'px' }"
    @mouseover="toolShow = true"
    @mouseout="toolShow = false">
    <div v-show="mainShow">
      <div id="live2d-tip" v-html="tipText" v-show="tipShow"></div>
      <canvas id="live2d-main" :width="width" :height="height"></canvas>
      <div
        id="live2d-tool"
        ref="live2d-tool"
        v-show="toolShow">
        <span
          class="fa fa-lg"
          v-for="(tool, index) in tools"
          :key="index"
          :class="tool.name"
          @click="tool.click"/>
      </div>
    </div>
    <div id="live2d-toggle" ref="live2d-toggle" v-show="!mainShow" @click="mainShow = true">
      <span>看板娘</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import './lib/live2d.min.js'
import 'font-awesome/css/font-awesome.min.css'
import './src/live2d.css'
import tips from './src/tips'

export default {
  name: 'live2d',
  props: {
    position: {
      default: 'right',
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
      default: 255,
      type: Number
    },
    height: {
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
        name: 'fa-comment',
        click: this.showHitokoto
      }, {
        name: 'fa-user-circle',
        click: this.loadRandModel
      }, {
        name: 'fa-street-view',
        click: this.loadRandTextures
      }, {
        name: 'fa-camera-retro',
        click: this.takePhoto
      }, {
        name: 'fa-info-circle',
        click: this.openHomePage
      }, {
        name: 'fa-times',
        click: this.close
      }]
    }
  },
  mounted () {
    this.modelId = this.model[0]
    this.modelTexturesId = this.model[1]
    this.setPosition()
    this.loadModel()
    this.$nextTick(function () {
      this.loadEvent()
    })
  },
  computed: {
    positionName () {
      return this.position === 'right' ? 'right' : 'left'
    }
  },
  watch: {
    mainShow () {
      const containers = ["live2d"]
      const refs = this.$refs
      containers.forEach(containerName => {
        refs[containerName].classList.toggle(`${containerName}-on-${this.positionName}`)
      })
    }
  },
  methods: {
    setPosition () {
      const containers = ["live2d", "live2d-tool", "live2d-toggle"]
      const refs = this.$refs
      containers.forEach(containerName => {
        refs[containerName].classList.add(`${containerName}-on-${this.positionName}`)
      })
    },
    loadModel () {
      const { apiPath, modelId, modelTexturesId } = this
      const url = `${apiPath}/get/?id=${modelId}-${modelTexturesId}`
      window.loadlive2d('live2d-main', url)
      console.log(`Live2D 模型 ${modelId}-${modelTexturesId} 加载完成`)
    },
    loadRandModel () {
      const url = `${this.apiPath}/rand/?id=${this.modelId}`
      axios.get(url).then((res) => {
        const { id, message } = res.data.model
        this.modelId = id
        this.showMessage(message, 4000)
        this.loadRandTextures(true)
      }).catch(function (err) {
        console.log(err)
      })
    },
    loadRandTextures (isAfterRandModel = false) {
      const url = `${this.apiPath}/rand_textures/?id=${this.modelId}-${this.modelTexturesId}`
      axios.get(url).then((res) => {
        const { id } = res.data.textures
        this.modelTexturesId = id
        this.loadModel()
        if (!isAfterRandModel) {
          this.showMessage("我的新衣服好看嘛？", 4000)
        }
      }).catch(function (err) {
        console.log(err)
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
      const url = 'https://v1.hitokoto.cn'
      axios.get(url).then((res) => {
        const { hitokoto, id, creator } = res.data
        this.showMessage(`${hitokoto} <br> - by <a href="https://hitokoto.cn?id=${id}">${creator}</a> from 《${res.data.from} 》`)
      }).catch(function (err) {
        console.log(err)
      })
    },
    openHomePage () {
      open(this.homePage)
    },
    close () {
      this.showMessage('下次见~', 2000)
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
    }
  }
}
</script>

<style scoped>
  
</style>
