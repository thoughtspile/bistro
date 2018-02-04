module.exports = function compileGetter(pathArray) {
  const pathTail = pathArray[pathArray.length - 1];
  const intermidDepth = pathArray.length - 1;

  return function (obj, defaultValue) {
    for (var i = 0; i < intermidDepth; i++) {
      obj = obj[pathArray[i]];
      if (obj === undefined) return defaultValue;
    }
    return obj[pathTail];
  };
};
