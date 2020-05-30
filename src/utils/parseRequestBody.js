const bodyParser = require('body-parser');
/**
 * 解析body体成Object格式
 * 相关资料：https://blog.csdn.net/yanyang1116/article/details/54847560
 * @param {*} req
 * @param {*} res
 */
module.exports = function parseBody(req, res) {
  return new Promise((resolve, reject) => {
    let parseBodyMethod = bodyParser.json();
    const contentType = req.get('Content-Type');
    if (contentType === 'text/plain') {
      parseBodyMethod = bodyParser.raw({ type: 'text/plain' });
    } else if (contentType === 'text/html') {
      parseBodyMethod = bodyParser.text({ type: 'text/html' });
    } else if (contentType === 'application/x-www-form-urlencoded') {
      parseBodyMethod = bodyParser.urlencoded({ extended: false });
    }
    parseBodyMethod(req, res, function () {
      resolve({
        req,
        res,
      });
    });
  });
};
