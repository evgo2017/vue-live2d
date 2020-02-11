<template>
  <div
    id="live2d"
    :style="{ zIndex }"
    @mouseover="toolShow=true"
    @mouseout="toolShow=false">
    <div v-show="mainShow">
      <div id="live2d-tip" v-html="tipText" v-show="tipShow"/>
      <canvas id="live2d-main" width="250" height="250"/>
      <div id="live2d-tool" v-show="toolShow">
        <span
          class="fa fa-lg"
          v-for="(tool, index) in tools"
          :key="index"
          :class="tool.name"
          @click="tool.click"/>
      </div>
    </div>
    <div id="live2d-toggle" v-show="!mainShow" @click="mainShow=true">
      <span>看板娘</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import './live2d.min.js'

// TODO: 各配置独立文件
const tips = {
  copy: [{
    selector: 'document',
    text: ['你都复制了些什么呀，转载要记得加上出处哦！']
  }],
  visibilitychange: [{
    selector: 'document',
    text: ['哇，你终于回来了～']
  }],
  click: [{
    selector: '.veditor',
    text: ['要吐槽些什么呢？', '一定要认真填写喵～', '有什么想说的吗？']
  }, {
    selector: '.vsubmit',
    text: ['输入验证码就可以提交评论啦～']
  }],
	mouseover: [{
		selector: '#live2d #live2d-main',
		text: ['(ノ≧∇≦)ノ','biubiu / / /']
	}, {
    selector: '#live2d-tool .fa-comment',
    text: ['猜猜我要说些什么？', '欣赏一些有意思的短句？']
  }, {
    selector: '#live2d-tool .fa-user-circle',
    text: ['想看看我的朋友们吗？']
  }, {
    selector: '#live2d-tool .fa-street-view',
    text: ['变装！']
  }, {
    selector: '#live2d-tool .fa-camera-retro',
    text: ['一起拍照留念？']
  }, {
    selector: '#live2d-tool .fa-info-circle',
    text: ['(＾Ｕ＾)ノ~ＹＯ']
  }, {
    selector: '#live2d-tool .fa-times',
    text: ['就要说再见了吗？']
  }]
}

export default {
  name: 'live2d',
  props: {
    apiPath: {
      default: 'https://live2d.fghrsh.net/api',
      type: String
    },
    zIndex: {
      default: 1,
      type: Number
    },
    model: {
      default: () => [1, 53],
      type: Array
    },
    homePage: {
      default: 'https://github.com/evgo2017',
      type: String
    }
  },
  data () {
    return {
      messageTimer: null,
      mainShow: true,
      tips: tips,
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
        click: this.loadOtherModel
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
    this.loadModel()
    this.$nextTick(function () {
      this.loadEvent()
    })
  },
  methods: {
    loadModel () {
      const url = `${this.apiPath}/get/?id=${this.modelId}-${this.modelTexturesId}`
      const callback = console.log(`Live2D 模型 ${this.modelId}-${this.modelTexturesId} 加载完成`)
      window.loadlive2d('live2d-main', url, callback)
    },
    loadOtherModel () {
      const url = `${this.apiPath}/switch/?id=${this.modelId}`
      axios.get(url).then((res) => {
        let { id, message } = res.data.model
        if (id === 5) id = 7
        this.modelId = id
        this.showMessage(message, 4000)
        this.loadOtherTextures()
        this.loadModel()
      }).catch(function (err) {
        console.log(err)
      })
    },
    loadOtherTextures () {
      const url = `${this.apiPath}/rand_textures/?id=${this.modelId}-${this.modelTexturesId}`
      axios.get(url).then((res) => {
        const { id } = res.data.textures
        this.modelTexturesId = id
        this.loadModel()
      }).catch(function (err) {
        console.log(err)
      })
    },
    loadRandTextures () {
      this.loadOtherTextures()
      this.showMessage('我的新衣服好看嘛？', 4000)
    },
    loadEvent () {
      for (const event in this.tips) {
        for (const obj of this.tips[event]) {
          const selector = obj.selector
          let dom = null

          if (selector === 'document') {
            dom = document
          } else if (document.querySelector(selector)) {
            dom = document.querySelector(selector)
          }

          if (dom == null) continue
          dom.addEventListener(event, () => {
            const arr = obj.text
            const msg = arr[Math.floor(Math.random() * arr.length)]
            this.showMessage(msg, 2000)
          })
        }
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
      open(this.openHomePage)
    },
    close () {
      this.showMessage('下次见~', 2000)
      this.mainShow = false
    }
  }
}
</script>

<style scoped>
  #live2d {
    position: fixed;
    width: 250px;
    height: 250px;
    bottom: 0;
    right: 0;
    transition: transform .3s ease-in-out;
    transform: translateY(3px);
  }
  #live2d:hover {
    width: 280px;
    transform: translateY(0);
  }
  #live2d-tip {
    position: absolute;
    width: 220px;
    min-height: 3rem;
    margin-top: -20px;
    padding: 5px 10px;
    font-size: .9rem;
    line-height: 1.5rem;
    word-break: break-all;
    text-overflow: ellipsis;
    border: 1px solid rgba(224, 186, 140, 0.62);
    border-radius: 12px;
    background-color: rgba(236, 217, 188, 0.5);
    box-shadow: 0 3px 15px 2px rgba(191, 158, 118, 0.2);
    animation: shake 50s ease-in-out 5s infinite;
  }
  #live2d-main {
    cursor: grab;
    cursor: -webkit-grab;
    cursor: -o-grab;
    cursor: -ms-grab;
  }
  #live2d-main:active {
    cursor: grabbing;
    cursor: -webkit-grabbing;
    cursor: -o-grabbing;
    cursor: -ms-grabbing;
  }
  #live2d-tool {
    position: absolute;
    bottom: 10px;
    right: 0;
    color: #aaa;
    transition: opacity 1s;
  }
  #live2d-tool span {
    display: block;
    cursor: pointer;
    line-height: 30px;
    text-align: center;
    color: #5b6c7d;
    transition: color .3s;
  }
  #live2d-tool span:hover {
    color: #0684bd;
  }
  #live2d-toggle {
    width: 1.7rem;
    position: absolute;
    bottom: 2rem;
    right: 0;
    padding: .3rem 0;
    writing-mode: vertical-lr;
    color: #fff;
    background-color: #fa0;
    border-radius: .5rem 0 0 .5rem;
    font-size: 1rem;
    cursor: pointer;
  }
  #live2d-toggle:hover {
    width: 2rem;
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
