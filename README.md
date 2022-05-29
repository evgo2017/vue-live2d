# vue-live2d

[![version](https://img.shields.io/npm/v/vue-live2d)](https://npm.js) ![license](https://img.shields.io/github/license/evgo2017/vue-live2d) [![downloads](https://img.shields.io/npm/dt/vue-live2d)](<https://www.npmjs.com/package/vue-live2d> ) [![fork](https://img.shields.io/github/forks/evgo2017/vue-live2d?style=social)](https://github.com/evgo2017/vue-live2d)

vue 看板娘

![logo](https://github.com/evgo2017/vue-live2d/blob/master/public/logo.png)

可直接在 vue 项目中直接引用此包，即可应用看板娘，目前包含不少功能配置。

## 一、使用

### 1. 在线浏览效果

#### 个人网站应用

访问速度快：

https://evgo2017.com/repo/vue-live2d

#### 使用示例

部署在 github 上:

https://evgo2017.github.io/vue-live2d/page/index.html

### 2. 项目引入

```shell
npm install vue-live2d

// 在组件中引入
import vueLive2d from 'vue-live2d'

// 组件中的使用方法具体参考 `example/App.vue` 文件
```

### 3. 本地浏览

其中包含源码，`example/App.vue` 为使用示例。

```shell
git clone https://github.com/evgo2017/vue-live2d.git
cd ./vue-live2d
npm install
npm run serve
```

## 二、配置参数

### 1. 参数说明

> 注意 apiPath 是我服务器的地址，提供模型和服装支持，若更新服务地址会在 README.md 说明。
>
> 同时此 api 服务是我的 [ive2d-static-api](https://github.com/evgo2017/live2d-static-api) 项目，liv2d 静态 API。欢迎使用和 star。 

| 配置项    | 含义                           | 类型   | 默认                                   |
| --------- | ------------------------------ | ------ | -------------------------------------- |
| size      | 模型宽度和高度                 | Number | 255                                    |
| width     | 模型宽度                       | Number | 0                                      |
| height    | 模型高度                       | Number | 0                                      |
| apiPath   | 更换模型的请求地址             | String | https://evgo2017.com/api/live2d-static-api/indexes         |
| model     | 默认显示的模型，[模型号，服装号] | Array  | ['Potion-Maker/Pio', 'school-2017-costume-yello'] |
| direction | 模型方位（left 或者 right） | String | left（其他字符串均表示 right）         |
| tipPosition | 提示框位置（top 或者 bottom） | String | top |
| tips      | 在触发某些事件时模型说出的话   | Object | 格式查看 /src/src/tips.js         |
| homePage  | 可打开某页面的地址             | String | https://github.com/evgo2017/vue-live2d |
| customId  | 自定义 id                      | String | vue-live2d-main                        |

### 2. 部分具体说明

#### width height size

这三个参数放在一起说，它们都是用来调整模型宽高的。width 只调整宽度，height 只调整高度，size 同时调整宽高为同一值。

优先级：width = height > size。可以说 width 和 height 参数会覆盖 size 参数设置的对应值。

设置 size 是为了减少重新加载模型的次数。

#### apiPath

加载模型时是通过请求此 API 地址获得数据，也可[自行搭建](https://github.com/fghrsh/live2d_api)，进而进一步设置模型。

#### model

默认显示的模型，为数组，第一个值代表具体模型编码，第二个值代表该模型的皮肤号。

插件每次切换模型或者换装时候，都会在控制台 console 这此信息，可通过此方便获得自己喜欢的模型信息。

#### direction

模型方位，仅支持左（left）或者右（right）。

当为 left 时，工具栏会置于左侧，同时鼠标经过模型时，模型会整体向右移动。right 反之。

#### tipPosition

提示框位置，仅支持上（top）或者下（bottom）。

当为 top 时，提示框会显示在模型区域上方。当为 right 时，提示框会显示在模型区域下方。

#### tips

在页面上触发某些事件时，模型会说出的话。

注意：此参数只可初始化一次，若使用插件定义的默认值则不要绑定此参数。

#### customId

插件中只有显示模型的 canvas 必须有 id ，可自定义其 id 值。

此参数是我在尝试一个页面上加载多个模型时增加，可以成功，但通常最初只会显示一个模样，需要手动触发其他模型，同时原本显示的模型成为静态，触发的其他模型变为动态。

比如页面有一个 A 模型，和一个 B 模型。A 正确显示，但 B 只有工具栏等内容。此时手动点击 B 模型的切换模型或者换装，B 模型正确显示，同时 A 模型成为静态，不再随着鼠标移动而动。再次点击 A 模型重复操作同理。

这部分切换应该是与核心库有关，综合考虑不继续完善此功能。

## 三、核心库

核心库 `live2d.min.js` 的文件内容，是 Live2D 官网发布的 Live2D_SDK_WEBGL_2.1 SDK 中的`live2d.min.js` + `Live2DFramework.js` + `sampleApp1` ，以及该库作者代码。库已梳理明白，但库作者未知。

在梳理核心库代码的过程中，我整理了一份从 Framework 到 App 的代码，加载来看没有什么大问题，但剩余工作量仍然较大。

> 从库代码层次来看：core -> framework -> app -> vue-live2d（看板娘）。vue-live2d 目前属于定制内容。

## 四、参考资料

[1] https://github.com/fghrsh/live2d_demo

[2] https://github.com/stevenjoezhang/live2d-widget

[3] https://github.com/fghrsh/live2d_api
