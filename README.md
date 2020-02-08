# vue-live2d
vue 看板娘

![logo](https://github.com/evgo2017/vue-live2d/blob/master/public/logo.png)

可直接在 vue 项目中直接引用此包，即可应用看板娘，目前包含简单的功能配置。`App.vue` 即为使用示例。

## 操作

### 在线浏览

查看动态效果：https://evgo2017.com

### 本地预览

```
npm install
npm serve
```

### 项目使用

```
npm install vue-live2d

// 组件中引入：
import live2d from 'vue-live2d'
import 'vue-live2d/dist/vue-live2d.css'
```

## 注意

现版本是参考资料中的项目进行修改的，改动较大，核心为 `live2d.min.js` ，因为其中有些方法直接注册至 `window`，所以之后计划使用 `live2d` 官网的 `SDK` 进行配置。

##　参考资料

[1] https://github.com/fghrsh/live2d_demo

[2] https://github.com/stevenjoezhang/live2d-widget
