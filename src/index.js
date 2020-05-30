const RoutesHandler = require('./lib/RoutesHandler');
const Mocker = require('./lib/Mocker');
const { isMockerPage } = require('./utils/utils');

module.exports = function (app, config) {
  const routeHandler = new RoutesHandler({
    proxy: config.proxy || {},
  });
  const mocker = new Mocker({
    dataPath: config.dataPath,
    routesHandler: routeHandler,
  });

  app.all('/*', async (req, res, next) => {
    const { headers } = req;
    const { referer = '' } = headers; // 页面地址
    const requestPath = req.path;
    const needToMock =
      isMockerPage(referer, 'mock') && routeHandler.ifNeedToMock(requestPath);
    if (needToMock) {
      const data = await mocker.getData(req, res);
      res.send(data);
    } else {
      return next();
    }
  });
};
