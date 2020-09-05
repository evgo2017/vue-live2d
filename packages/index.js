import live2d from './index.vue'

live2d.install = function (Vue) {
  Vue.component('live2d', live2d)
}

export default live2d
