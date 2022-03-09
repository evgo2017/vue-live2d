<template>
  <div
    class="vue-live2d"
    ref="vue-live2d"
    :style="{ width: live2dWidth + 'px', height: live2dHeight + 'px' }"
    @mouseover="toolShow = true"
    @mouseout="toolShow = false">
    <div v-show="mainShow" >
      <div class="vue-live2d-tip" v-html="tipText" v-show="tipShow"></div>
      <canvas :id="live2dMainId" ref="vue-live2d-main" :width="live2dWidth" :height="live2dHeight" class="vue-live2d-main"></canvas>
      <div
        class="vue-live2d-tool"
        ref="vue-live2d-tool"
        v-show="toolShow">
        <span
          class="fa fa-lg"
          v-for="(tool, index) in tools"
          :key="index"
          :class="tool.name"
          @click="tool.click"/>
      </div>
    </div>
    <div class="vue-live2d-toggle" ref="vue-live2d-toggle" v-show="!mainShow" @click="mainShow = true">
      <span>看板娘</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import './lib/live2d.min.js'
import 'font-awesome/css/font-awesome.min.css'

import tips from './options/tips'
import myModels from './options/myModels'
export default {
  name: 'live2d',
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
      default: 'https://github.com/Raxcl',
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
      myModelId: 0,
      myModelTexturesId: 0,
      isMyModels: true,
      tools: [{
        name: 'fa-comment',
        click: this.showHitokoto
      }, {
        name: 'fa-user-circle',
        click: this.chooseLoadRandModel
      }, {
        name: 'fa-street-view',
        click: this.chooseLoadRandTextures
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
    },
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
    myLoadModel () {
      const {  myModelId, myModelTexturesId, live2dMainId } = this
      const {myModel} = myModels
      //随机模型id，确保下次模型id不与当前重复
      console.log("myLoadModel")
      const url = myModel[myModelId][myModelTexturesId]
      console.log("url:"+url)
      window.loadlive2d(live2dMainId, url)
      console.log(`Live2D 模型 ${myModelId}-${myModelTexturesId} 加载完成`)
    },
    chooseLoadRandModel(){
      this.isMyModels ? this.myLoadRandModel() : this.loadRandModel()
    },
    loadRandModel () {
      const url = `${this.apiPath}/rand/?id=${this.modelId}`
      axios.get(url).then((res) => {
        const { id, message } = res.data.model
        this.modelId = id
        //调整高度
        //高度问题无法解决（调整高度后模型加载不出）
        // this.updateModelHeight();
        this.showMessage(message, 4000)
        this.loadRandTextures(true)
        //定义下次按钮触发为新接口
        this.isMyModels = true;
      }).catch(function (err) {
        console.log(err)
      })
    },
    myLoadRandModel () {
      const {myModel,myMessage} = myModels
      //随机模型id，确保下次模型id不与当前重复
      while(true){
        if(myModel.length <= 1){
          break;
        }
        const tempMyModelId = Math.floor(Math.random() * myModel.length + 1)-1;
        if(this.myModelId != tempMyModelId){
          this.myModelId = tempMyModelId;
          break;
        }
      }
      //调整高度
      // this.updateMyModelHeight();
      
      //出场语句
      this.showMessage(myMessage[0], 4000)
      //挑选随机模型皮肤
      this.myLoadRandTextures(true)
      //定义下次按钮触发为原接口
      this.isMyModels = false;
    },
    chooseLoadRandTextures(){
      this.isMyModels ? this.loadRandTextures() : this.myLoadRandTextures()
    },
    loadRandTextures (isAfterRandModel = false) {
      const url = `${this.apiPath}/rand_textures/?id=${this.modelId}-${this.modelTexturesId}`
      axios.get(url).then((res) => {
        const { id } = res.data.textures
        this.modelTexturesId = id
        this.loadModel()
        if (!isAfterRandModel) {
          this.showMessage('我的新衣服好看嘛？', 4000)
        }
      }).catch(function (err) {
        console.log(err)
      })
    },
    myLoadRandTextures (isAfterRandModel = false) {
      const {myModel} = myModels
      //随机皮肤id,确保下次皮肤不与当前重复(只有一个皮肤时不更换皮肤)
      while(myModel[this.myModelId].length != 1){
        const tempMyModelTexturesId = Math.floor(Math.random() * myModel[this.myModelId].length + 1)-1;
        if(this.myModelTexturesId != tempMyModelTexturesId){
          this.myModelTexturesId = tempMyModelTexturesId;
          break;
        }
      }
      //加载模型
      this.myLoadModel()
      if (!isAfterRandModel) {
        this.showMessage('我的新衣服好看嘛？', 4000)
      }

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
    updateModelHeight(){
        const n = this.modelId
        switch(n){
          case 1:case 2:case 3:case 4:case 5:
            this.height = 450
            this.height = this.height - 450;
            break;
          //模型6过高，特殊化
          case 6:
            this.height = 0;
            this.height = this.height +750;
            break;
          default:
            this.height = 0;
            this.height = this.height + 450;
        } 
    },
    updateMyModelHeight(){
      //小模型采用另外的高度,小模型id需手动添加
      const n = this.myModelId
      switch(n){
        case 2:
          this.height = 450
          this.height = this.height - 450;
          break;
        default:
          this.height = 0;
          this.height = this.height + 450;
      } 
    },
    takePhoto () {
      this.showMessage('照好了嘛，留个纪念吖~')
      window.Live2D.captureName = 'photo.png'
      window.Live2D.captureFrame = true
    },
    showHitokoto () {
      // n取0-2（2代表default）
      const n = Math.floor(Math.random() * 3 + 1)-1;
      switch(n){
        case 0 :
          console.log("接口0");
          axios.get('https://api.fghrsh.net/hitokoto/rand/?encode=jsc&uid=3335').then((res) => {
            const {hitokoto} = res.data
            console.log(res);
            this.showMessage(`${hitokoto}`)
          }).catch(function (err) {
            console.log(err)
          })
          break;
        case 1 :
          console.log("接口1");
          const jinrishici = require('jinrishici');
          jinrishici.load(result => {
            console.log(result);
            const {content} = result.data
            this.showMessage(`${content}`)
          });
          break;
        default :
          console.log("接口default");
          axios.get('https://v1.hitokoto.cn').then((res) => {
            const { hitokoto } = res.data
            console.log(res);
            this.showMessage(`${hitokoto}`)
          }).catch(function (err) {
            console.log(err)
          })
      }
      
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
  font-size: 13px;
  word-break: break-all;
  text-overflow: ellipsis;
	border: 1px solid rgba(255, 137, 255, 0.4);
  border-radius: 12px;
	background-color: rgba(255, 137, 255, 0.2);
	box-shadow: 0 3px 15px 2px rgba(255, 137, 255, 0.4);
  animation: shake 50s ease-in-out 5s infinite;
  font-family: 幼圆;
  color: rgb(56, 106, 197);

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
  width: 30px;
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
