const fs = require('fs');
const walk = require('walk');
const chalk = require('chalk');
const querystring = require('querystring');

// 根据mockParam参数选择路由机制
module.exports.isMockerPage = function isMockerPage(pageUrl, mockParam) {
  const pageQueryString = pageUrl.split('?')[1] || '';
  const queryObj = querystring.parse(pageQueryString);
  const param = queryObj[mockParam];
  return param === undefined ? false : true;
};

/**
 *
 * 检测是否是需要组装的mock文件
 * 只有是.mock.js或.mock.json结尾的文件被看作是mock文件
 * @param {String 文件名} fileName
 */
module.exports.checkIsMockFile = function checkIsMockFile(fileName) {
  const mockFileSuffixs = ['.mock.js', '.mock.json'];
  const notMatch = mockFileSuffixs.every((item) => {
    return fileName.indexOf(item) === -1;
  });
  return !notMatch;
};

/**
 * @param  {[String]} 文件路径
 * @param  {String} 写入内容
 *
 */
module.exports.createFile = function createFile(filePath, data) {
  return new Promise((resolve, reject) => {
    if (!filePath) {
      reject('文件路径未指定');
    }
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        console.log(chalk.red(`${filePath} 创建失败`));
        reject({
          code: 0,
          msg: err,
        });
      } else {
        console.log(chalk.blue(`${filePath} 创建成功`));
        resolve({
          code: 1,
          msg: `${filePath} 创建成功`,
        });
      }
    });
  });
};

module.exports.cleanDirRequireCache = function cleanDirRequireCache(dir) {
  const walker = walk.walk(dir);
  return new Promise((resolve, reject) => {
    walker.on('file', (roots, stat, next) => {
      try {
        const filePath = `${roots}/${stat.name}`;
        delete require.cache[filePath];
      } catch (e) {
        next();
      }
      next();
    });
    walker.on('end', function () {
      resolve({
        res: 'success',
      });
    });
  });
};
