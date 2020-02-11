# vue-live2d

[![version](https://img.shields.io/npm/v/vue-live2d)](https://npm.js) ![license](https://img.shields.io/github/license/evgo2017/vue-live2d) [![downloads](https://img.shields.io/npm/dt/vue-live2d)](<https://www.npmjs.com/package/vue-live2d> ) [![fork](https://img.shields.io/github/forks/evgo2017/vue-live2d?style=social)](https://github.com/evgo2017/vue-live2d)

vue 看板娘

![logo](https://github.com/evgo2017/vue-live2d/blob/master/public/logo.png)

可直接在 vue 项目中直接引用此包，即可应用看板娘，目前包含简单的功能配置。

## 一、操作

### 1. 在线浏览

查看动态效果：https://evgo2017.com

### 2. 项目使用

```
npm install vue-live2d

// 组件中引入：
import live2d from 'vue-live2d'
import 'vue-live2d/dist/vue-live2d.css'

// 目前可配置项
<live2d :apiPath="" :zIndex="" :model="" :homePage="">
```
### 3. 本地预览

其中包含源码，`App.vue` 为使用示例。

```
$ git clone https://github.com/evgo2017/vue-live2d.git
$ cd ./vue-live2d
$ npm install
$ npm run serve
```

### 4. 重新打包

核心是 `src/components/live2d` 下的文件，可对其中的 `index.vue` 进行修改重新打包，生成的文件在 `dist` 文件夹内。

```
$ npm run build-bundle
```

## 二、配置参数

| 配置项   | 类型   | 含义                           | 默认                          |
| -------- | ------ | ------------------------------ | ----------------------------- |
| apiPath  | String | 更换模型的请求地址             | https://live2d.fghrsh.net/api |
| zIndex   | Number | z-index 属性                   | 1                             |
| model    | Array  | 默认显示的模型，[编码，衣服号] | () => [1, 53]                 |
| homePage | String | 可打开某页面的地址             | https://github.com/evgo2017   |

## 三、注意

现版本是参考资料中的项目进行修改的，改动较大，核心为 `live2d.min.js` ，因为其中有些方法直接注册至 `window`，所以之后计划使用 `live2d` 官网的 `SDK` 进行配置。

##　四、参考资料

[1] https://github.com/fghrsh/live2d_demo

[2] https://github.com/stevenjoezhang/live2d-widget
