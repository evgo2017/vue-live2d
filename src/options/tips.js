export default {
  copy: [{
    selector: 'document',
    texts: ['你都复制了些什么呀，转载要记得加上出处哦！']
  }],
  visibilitychange: [{
    selector: 'document',
    texts: ['哇，你终于回来了～']
  }],
  mouseover: [{
    selector: '.vue-live2d-tool .custom-fa-comment',
    texts: ['猜猜我要说些什么？', '欣赏一些有意思的短句？']
  }, {
    selector: '.vue-live2d-tool .custom-fa-user-circle',
    texts: ['想看看我的朋友们吗？']
  }, {
    selector: '.vue-live2d-tool .custom-fa-street-view',
    texts: ['变装！']
  }, {
    selector: '.vue-live2d-tool .custom-fa-camera-retro',
    texts: ['一起拍照留念？']
  }, {
    selector: '.vue-live2d-tool .custom-fa-info-circle',
    texts: ['(＾Ｕ＾)ノ~ＹＯ']
  }, {
    selector: '.vue-live2d-tool .custom-fa-times',
    texts: ['就要说再见了吗？']
  }]
}
