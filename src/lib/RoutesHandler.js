module.exports = class RoutesHandler {
  constructor(config) {
    this.config = config;
    this.proxy = {};
    console.log(this.config.proxy);
    Object.keys(this.config.proxy).forEach((key) => {
      let newKey = key;
      if (newKey.startsWith('/') && newKey.endsWith('/')) {
        this.proxy[newKey] = this.config.proxy[key];
      } else {
        if (!newKey.startsWith('/')) {
          newKey = `/${newKey}`;
        }
        if (!newKey.endsWith('/')) {
          newKey = `${newKey}/`;
        }
        this.proxy[newKey] = this.config.proxy[key];
        delete this.proxy[key];
      }
    });
  }

  ifNeedToMock(path) {
    return !!this.getHostByPath(path);
  }

  getHostByPath(path) {
    let _path = path;
    if (!_path.startsWith('/')) {
      _path = `/${_path}`;
    }
    const key = `/${_path.split('/')[1]}/`;
    return this.proxy[key];
  }
};
