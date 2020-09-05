export default {
  copy: [{
    selector: 'document',
    texts: ['你都复制了些什么呀，转载要记得加上出处哦！']
  }],
  visibilitychange: [{
    selector: 'document',
    texts: ['哇，你终于回来了～']
  }],
  click: [{
    selector: '.veditor',
    texts: ['要吐槽些什么呢？', '一定要认真填写喵～', '有什么想说的吗？']
  }, {
    selector: '.vsubmit',
    texts: ['输入验证码就可以提交评论啦～']
  }],
  mouseover: [{
    selector: '#live2d-tool .fa-comment',
    texts: ['猜猜我要说些什么？', '欣赏一些有意思的短句？']
  }, {
    selector: '#live2d-tool .fa-user-circle',
    texts: ['想看看我的朋友们吗？']
  }, {
    selector: '#live2d-tool .fa-street-view',
    texts: ['变装！']
  }, {
    selector: '#live2d-tool .fa-camera-retro',
    texts: ['一起拍照留念？']
  }, {
    selector: '#live2d-tool .fa-info-circle',
    texts: ['(＾Ｕ＾)ノ~ＹＯ']
  }, {
    selector: '#live2d-tool .fa-times',
    texts: ['就要说再见了吗？']
  }]
}
  