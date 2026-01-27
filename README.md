![vue-live2d](https://socialify.git.ci/evgo2017/vue-live2d/image?custom_description=%E4%B8%80%E4%B8%AA%E9%80%82%E7%94%A8%E4%BA%8E+Vue+2+%E5%92%8C+Vue+3+%E9%A1%B9%E7%9B%AE%E7%9A%84+Live2D+%E7%9C%8B%E6%9D%BF%E7%BB%84%E4%BB%B6&description=1&forks=1&language=1&name=1&owner=1&stargazers=1&theme=Light)

## 🚀 效果预览

### 在线预览
*   **私有部署示例**：[https://live2d.evgo2017.com/](https://live2d.evgo2017.com/)
*   **GitHub Pages**：[示例展示](https://evgo2017.github.io/vue-live2d/page/index.html)

### 本地预览
```bash
git clone https://github.com/evgo2017/vue-live2d.git
cd ./vue-live2d
npm install
npm run serve
```

## 📦 安装与使用

```bash
# 1. 安装组件
npm install vue-live2d

# 2. 在组件中引入
import vueLive2d from 'vue-live2d'
export default {
  components: { vueLive2d }
}
```

本组件同时支持 **Vue 2** (`^2.7.x`) 和 **Vue 3** (Options/Composition API)，并提供了测试用例。

---

## ⚙️ 配置参数 (Props)

| 配置项 | 含义 | 类型 | 默认值 |
| :--- | :--- | :--- | :--- |
| [**apiPath**](#核心参数-apipath) | **核心地址**，请求此 API 加载模型数据 | String | `https://cdn.jsdelivr.net/npm/live2d-static-api@latest/indexes` |
| [model](#其它参数说明) | 默认显示的 [模型号, 服装ID] | Array | `['Potion-Maker/Pio', 'school-2017-costume-yellow']` |
| [width/height/size](#其它参数说明) | 模型的宽度/高度/宽度和高度 | Number | `0 / 0 / 255` |
| [direction](#其它参数说明) | 模型停靠方位 (`left` / `right`) | String | `right` |
| [tipPosition](#其它参数说明) | 提示框位置 (`top` / `bottom`) | String | `top` |
| [tips](#其它参数说明) | 自定义交互提示语配置 | Object | 详见 `/src/options/tips.js` |
| [**speechApi**](#💬-语音对话-speech) | **语音接口**，点击对话图标时请求的 API 地址 | String | `https://v1.hitokoto.cn` |
| [**speechContentFormat**](#💬-语音对话-speech) | **内容格式化函数**，解析 API 返回的数据 | Function | 接收 API 返回的原始数据对象，并返回一个字符串 |
| homePage | 点击主页链接跳转的地址 | String | 本项目主页地址 |
| [customId](#其它参数说明) | 同一页面加载多个模型时的识别 ID | String | `vue-live2d-main` |

### 📡 核心参数 apiPath

1. **方法一：项目本地集成（避开第三方接口失效）**
   将 [live2d-static-api](https://github.com/evgo2017/live2d-static-api) 的 `indexes` 放入项目的 `public` 目录，你可以彻底告别后端维护，实现极致的加载和稳定性：
   ```js
   apiPath="./live2d-static-api/indexes"
   ```
   ![apiPath](https://raw.githubusercontent.com/evgo2017/live2d-static-api/main/assets/apiPath.png)

2. **方法二：NPM / CDN 模式（推荐，极致稳定）**
   利用 NPM 公用 CDN 加速，实现零环境依赖的静态分发：
   ```js
   apiPath="https://cdn.jsdelivr.net/npm/live2d-static-api@latest/indexes" // 推荐 JSdelivr
   apiPath="https://unpkg.com/live2d-static-api@latest/indexes"          // 国内 Unpkg
   apiPath="https://raw.githubusercontent.com/evgo2017/live2d-static-api/main/indexes" // GitHub
   ```

### 其它参数说明

- **model**：切换模型或换装时，控制台会输出相关编码信息，直接复制即可。
- **宽高控制**：`width` 和 `height` 的优先级高于 `size`。建议使用 `size` 统一缩放，以减少模型重新加载的次数。
- **多模型同屏**：通过 `customId` 可以在同一页面渲染多个组件。但受限于核心库逻辑，同一时间通常只有一个模型支持动态交互。

- 💬 **语音对话 (Speech)**：你可以通过自定义接口和格式化函数，让看板接入任何内容源（如：诗词、名言、甚至 AI 回复）：

```js
<!-- 自定义用法 -->
<vue-live2d 
  speechApi="https://api.xxx.com/api" 
  :speechContentFormat="(content) => `自定义解析和返回内容 ${content}`" 
/>
```

---

## 📈 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=evgo2017/vue-live2d&type=date&legend=bottom-right)](https://www.star-history.com/#evgo2017/vue-live2d&type=date&legend=bottom-right)

##  参考资料与核心库

[1] [fghrsh/live2d_demo](https://github.com/fghrsh/live2d_demo)
[2] [stevenjoezhang/live2d-widget](https://github.com/stevenjoezhang/live2d-widget)
[3] [fghrsh/live2d_api](https://github.com/fghrsh/live2d_api)

> 尝试过基于 Live2D 官网发布的 Live2D_SDK_WEBGL_2.1 SDK 中的 `live2d.min.js`、`Live2DFramework.js` 和 `sampleApp1`，和 `live2d.min.js` 代码进行二次梳理。技术链路遵循：`Core -> Framework -> App -> vue-live2d`。

## 联系方式

若遇到问题，请提交 [issue](https://github.com/evgo2017/vue-live2d/issues)。或访问 [evgo2017.com/about](https://evgo2017.com/about)。
