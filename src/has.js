const compileGetter = require('./get');

module.exports = function compileHas(pathArray) {
  const get = compileGetter(pathArray);
  return function (obj, path) {
    return get(obj) !== undefined;
  };
};
