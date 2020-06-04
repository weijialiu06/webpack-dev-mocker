# webpack-dev-mocker
一个非常轻量且简单易用的基于webpack-dev-server的mock工具，它能让你快速的切换mock环境和线上环境。

## 特点
1. webpack-dev-server 不用手动创建mock文件，只要开启mock状态，它就能自动给你创建mock文件
2. webpack-dev-server 能直接将线上的数据拉到为本地作为mock数据，如果线上数据不存在，也会给你创建出一个mock文件
3. 随时随地切换线上数据和本地mock数据
5. 能在mock文件中无缝对接如mockjs等其它mock工具
6. 不用再 ```npm run mock``` 了,
## install
```sh
npm i webpack-dev-mocker --save-dev
```

## usage
1. 在webpack-dev-server的before钩子中启动mocker工具；
```js
  before(app) {
    mocker(app, config);
  }
```
2. 在页面的url中添加一个mock=1的参数，开启mock模式

如：
```
http://localhost/demo.html
```
改成
```
http://localhost/demo.html?mock=1
```
## usage
```
const mocker = require('webpack-dev-mocker');
module.exports = {
  ...
  devServer: {
    ...
    before(app) {
      mocker(app, {
        proxy: {
          '/sug/': 'http://suggest.taobao.com',
        },
        dataPath: path.resolve(__dirname, '__mock__'),
      });
    },
    port: 9000,
  }
};
```

## config options
|  option   | desc  |
|  ----  | ----  |
| proxy  | proxy Map; 接口及host的对应关系 |
| dataPath  |the target directory to save mock data; 用于保存mock数据的目标文件夹 |

## webpack-dev-mocker 工作流程
<img src="https://raw.githubusercontent.com/weijialiu06/webpack-dev-mocker/master/images/1.png" width="500" />

## todo
- [x] 接入[ts-interface-faker](https://github.com/weijialiu06/ts-interface-faker.git)

## demo

[webpack-dev-mocker](https://github.com/weijialiu06/webpack-dev-mocker-demo.git)