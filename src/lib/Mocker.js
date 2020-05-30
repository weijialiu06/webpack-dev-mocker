const globby = require('globby');
const chalk = require('chalk');
const axios = require('axios');
const mkdirp = require('mkdirp');
const parseRequestBody = require('../utils/parseRequestBody');
const { createFile, cleanDirRequireCache } = require('../utils/utils');

module.exports = class Mocker {
  constructor(config) {
    this.dataPath = config.dataPath;
    this.routesHandler = config.routesHandler;
  }

  async getData(req, res) {
    const request = await parseRequestBody(req, res);
    return this.getMockData(request);
  }

  async getMockData(request) {
    await cleanDirRequireCache(this.dataPath);
    const mockResult = await this.loadMockDataByUrl(request).catch((e) => {
      console.log(chalk.red(e));
      return {};
    });
    return Promise.resolve(mockResult);
  }

  async getOnlineData(request) {
    const requestPath = request.req.path;
    const { query, body, headers, method } = request.req;
    const baseURL = this.routesHandler.getHostByPath(requestPath);
    const response = await axios
      .request({
        method,
        baseURL,
        url: requestPath,
        params: method === 'GET' ? query : body,
        withCredentials: true,
        headers: {
          Cookie: headers.cookie,
        },
      })
      .catch((e) => {
        const { status } = e.response;
        return this.getDefaultData({
          errCode: status,
          baseURL,
          url: requestPath,
        });
      });
    return response.data;
  }

  async loadMockDataByUrl(request) {
    const url = request.req.path;
    const { dataPath } = this;
    let result = {};
    const mockDatas = {};

    const mockFiles = globby.sync([
      `${dataPath}/**/*.mock.js`,
      `${dataPath}/**/*.mock.json`,
    ]);
    for (let file of mockFiles) {
      let data = {};
      try {
        data = require(file);
        Object.assign(mockDatas, data);
      } catch (e) {
        console.log(chalk.red(e));
        continue;
      }
    }
    result = mockDatas[url];
    console.log(url);
    if (!result) {
      result = await this.getOnlineData(request);
      mkdirp.sync(dataPath);
      const thisMockObj = {
        [url]: result,
      };
      const fileName =  `${dataPath}/${url.split('/').sort(() => -1)
        .join('-').substr(1)}.mock.js`
      await createFile(fileName, `module.exports = ${JSON.stringify(thisMockObj, null, 2)}`
      );
    }
    return Promise.resolve(result);
  }

  getDefaultData(data) {
    return {
      data: {
        ec: 200,
        em: 'OK',
        timesec: Date.now(),
        data: {
          msg: 'mock抓取线上数据失败',
          ...data,
        },
      },
    };
  }
};
