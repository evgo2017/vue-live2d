# vue-live2d

[![version](https://img.shields.io/npm/v/vue-live2d)](https://npm.js) ![license](https://img.shields.io/github/license/evgo2017/vue-live2d) [![downloads](https://img.shields.io/npm/dt/vue-live2d)](<https://www.npmjs.com/package/vue-live2d> ) [![fork](https://img.shields.io/github/forks/evgo2017/vue-live2d?style=social)](https://github.com/evgo2017/vue-live2d)

![logo](https://github.com/evgo2017/vue-live2d/raw/master/public/logo.png)

一个适用于 Vue 2 和 Vue 3 项目的 Live2D 看板娘组件。

## 效果预览

### 在线预览

| 类型 | 地址 |
| ---- | ---- |
| 个人部署 | https://vue-live2d.demo.evgo2017.com/ |
| GitHub 部署 | https://evgo2017.github.io/vue-live2d/page/index.html |

### 本地预览

```shell
git clone https://github.com/evgo2017/vue-live2d.git
cd ./vue-live2d
npm install
npm run serve
```

## 安装与使用

```shell
# 1. 安装包
npm install vue-live2d

# 2. 在组件中引入
import vueLive2d from 'vue-live2d' // 使用方式请参考项目中的 `example/App.vue` 文件

# 3. 根据需要配置 apiPath 参数，详见下文。
```

## 配置参数

| 配置项    | 含义                           | 类型   | 默认值                                   |
| --------- | ------------------------------ | ------ | -------------------------------------- |
| [**apiPath**](#核心参数-apipath) | 请求此 API 地址加载模型数据 | String | `./live2d-static-api/indexes`        |
| [model](#其它参数)     | 默认显示的模型，格式：[模型号，服装号] | Array  | ['Potion-Maker/Pio', 'school-2017-costume-yello'] |
| [width/height/size](#其它参数) | 模型的宽度/高度/宽度和高度             | Number | 0/0/255                                |
| [direction](#其它参数) | 模型的方位 | String | left/right    |
| [tipPosition](#其它参数) | 模型的提示框位置 | String | top/bottom |
| [tips](#其它参数)      | 触发事件时模型说出的话   | Object | 详见 /src/options/tips.js         |
| homePage  | 可打开某页面的地址             | String | https://github.com/evgo2017/vue-live2d |
| [customId](#其它参数)  | 自定义模型 ID                      | String | vue-live2d-main                        |

### 核心参数 apiPath

1. **方法一**：使用 [live2d-static-api](https://github.com/evgo2017/live2d-static-api) 静态 API。将模型文件放置在项目的 `public` 目录下。参考下图：

   ![apiPath](https://github.com/evgo2017/vue-live2d/raw/master/public/apiPath.png)

2. **方法二**：使用 [live2d-static-api](https://github.com/evgo2017/live2d-static-api) 静态 API。将文件部署到其他可访问的静态地址，例如：`apiPath="https://raw.githubusercontent.com/evgo2017/live2d-static-api/refs/heads/main/indexes"`。

3. **方法三**：使用 [fghrsh/live2d_api](https://github.com/fghrsh/live2d_api) 动态 API。

> **常见错误**：`Uncaught SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON`，详见 [Issue #25](https://github.com/evgo2017/vue-live2d/issues/25)。
>
> **原因**：apiPath 配置错误。请参考上述方法调整配置。

### 其它参数

| 参数名   | 备注                                                         |
| -------- | ------------------------------------------------------------ |
| model    | 第一个值表示模型编码，第二个值表示该模型的皮肤号。每次切换模型或换装时，控制台会输出相关信息，便于获取喜欢的模型信息。 |
| width/height/size | width 只调整宽度，height 只调整高度，size 调整宽高为同一值。<br />width 和 height 参数会覆盖 size 参数设置的对应值。size 是为了减少重新加载模型的次数。 |
| direction          | 当为 left 时，工具栏会置于左侧，鼠标经过模型时，模型会整体向右移动。right 反之。 |
| tipPosition        | 当为 top 时，提示框会显示在模型区域上方。当为 bottom 时，提示框会显示在模型区域下方。 |
| tips               | 此参数只可初始化一次，若使用插件定义的默认值则不要绑定此参数。 |
| customId | 此参数用于在同一页面加载多个模型。可以成功加载，但通常最初只会显示一个模型，需要手动触发其他模型，同时原本显示的模型成为静态，触发的其他模型变为动态。<br />例如，页面有 A 和 B 两个模型。A 正确显示，但 B 只有工具栏。此时手动点击 B 的切换模型或换装，B 正确显示，同时 A 成为静态，不再随鼠标移动。再次点击 A 重复操作。<br />此切换应与核心库有关，综合考虑不继续完善此功能。 |

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=evgo2017/vue-live2d&type=date&legend=bottom-right)](https://www.star-history.com/#evgo2017/vue-live2d&type=date&legend=bottom-right)

## 核心库

核心库 `live2d.min.js` 基于 Live2D 官网发布的 Live2D_SDK_WEBGL_2.1 SDK 中的 `live2d.min.js`、`Live2DFramework.js` 和 `sampleApp1`，以及库作者的代码。库已梳理，但作者未知。

在梳理核心库代码的过程中，我整理了一份从 Framework 到 App 的代码，加载来看没有什么大问题，但剩余工作量仍然较大。

> 从库代码层次来看：core -> framework -> app -> vue-live2d（看板娘）。vue-live2d 目前属于定制内容。

## 参考资料

[1] https://github.com/fghrsh/live2d_demo

[2] https://github.com/stevenjoezhang/live2d-widget

[3] https://github.com/fghrsh/live2d_api
