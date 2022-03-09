# 由vue-live2d扩容后的vue-live2d

[![version](https://img.shields.io/npm/v/vue-live2d)](https://npm.js) ![license](https://img.shields.io/github/license/evgo2017/vue-live2d) [![downloads](https://img.shields.io/npm/dt/vue-live2d)](<https://www.npmjs.com/package/vue-live2d> ) [![fork](https://img.shields.io/github/forks/evgo2017/vue-live2d?style=social)](https://github.com/evgo2017/vue-live2d)

vue 看板娘

![logo](https://github.com/evgo2017/vue-live2d/blob/master/public/logo.png)

### 新增内容
新增76种live2d模型

新增3种一言接口（包含古诗词）

新增根据模型调整高度（弃用逻辑实力不足）

## 一.项目中引用
### 1. 将live2d文件夹放入自己项目的component文件夹下

### 2. 在view文件夹下的index.vue(需根据项目具体情况做出调整)中引入live2d
```
<!-- 引入live2d 看板娘 -->
import Live2d from '@/components/live2d/live2d'

<!-- 使用live2d 看板娘 -->
<Live2d/>
```

### 3. 安装诗词一言插件
```
npm install jinrishici(应该是这个命令，具体项目启动后缺少插件也会提示安装)
```

## 二. live2d看板娘维护
### 1. fork本项目，然后vscode或者其他编译器打开

### 2. 运行
```
npm install

npm run serve
```

### 3. 对src下的index.vue或者其他文件进行修改维护

### 三、目前存在的问题
#### 1. 部分模型显示不全
    根据不同模型调整高度的逻辑被弃用（频繁调整高度，导致模型加载不出），具体参见index.vue下的updateModelHeight方法
    希望大佬能够维护一下，为开源事业做出贡献，感激不尽
    
    
### 四、模型库
fghrsh-live2d: https://github.com/fghrsh/live2d_api

Raxcl-live2d: https://github.com/Raxcl/vue-live2d-models

### 五、参数说明([参考文档](https://github.com/evgo2017/vue-live2d))

### 1. 参数说明

| 配置项    | 含义                           | 类型   | 默认                                   |
| --------- | ------------------------------ | ------ | -------------------------------------- |
| size      | 模型宽度和高度                 | Number | 255                                    |
| width     | 模型宽度                       | Number | 0                                      |
| height    | 模型高度                       | Number | 0                                      |
| apiPath   | 更换模型的请求地址             | String | https://live2d.fghrsh.net/api          |
| model     | 默认显示的模型，[编码，衣服号] | Array  | [1, 53]                                |
| direction | 模型方位（左或者右）           | String | left（其他字符串均表示 right）         |
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

#### tips

在页面上触发某些事件时，模型会说出的话。

注意：此参数只可初始化一次，若使用插件定义的默认值则不要绑定此参数。

#### customId

插件中只有显示模型的 canvas 必须有 id ，可自定义其 id 值。

此参数是我在尝试一个页面上加载多个模型时增加，可以成功，但通常最初只会显示一个模样，需要手动触发其他模型，同时原本显示的模型成为静态，触发的其他模型变为动态。

比如页面有一个 A 模型，和一个 B 模型。A 正确显示，但 B 只有工具栏等内容。此时手动点击 B 模型的切换模型或者换装，B 模型正确显示，同时 A 模型成为静态，不再随着鼠标移动而动。再次点击 A 模型重复操作同理。

这部分切换应该是与核心库有关，综合考虑不继续完善此功能。

## 六、参考资料
[1] evgo2017的live2d模型示例: https://github.com/evgo2017/vue-live2d

[2] fghrsh的模型库api: https://github.com/fghrsh/live2d_api

[3] iCharlesZ的vscode模型库: https://github.com/iCharlesZ/vscode-live2d-models

[4] 一言接口 ：'hitokoto.cn', 'jinrishici.com'(古诗词), 'api.fghrsh.net'

感谢以上提到的所有创作者！！！如有好的灵感或想法，欢迎fork

( ˃ ˄ ˂̥̥ ) 都看到这了，点个 Star 吧 ~

