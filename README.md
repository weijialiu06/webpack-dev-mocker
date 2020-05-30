# webpack-dev-mocker
一个非常轻量且简单易用的基于webpack-dev-server的mock工具，它能让你快速的切换mock环境和线上环境。

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
![image](http://github.com/weijialiu06/webpack-dev-mocker/raw/master/images/1.png)

## demo

[webpack-dev-mocker](https://github.com/weijialiu06/webpack-dev-mocker-demo.git)