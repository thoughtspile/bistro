const getterCache = {};

function compile(path) {
  const pathArray = path.split('.');
  const pathTail = pathArray.pop();

  let truthyCheckItem = 'obj';
  let truthyCheckExpr = truthyCheckItem;
  for (var i = 0; i < pathArray.length; i++) {
    truthyCheckItem += '["' + pathArray[i] + '"]';
    truthyCheckExpr += ' && ' + truthyCheckItem;
  }
  const itemGetExpr = `${truthyCheckItem}["${pathTail}"]`;

  return new Function('obj', 'defaultValue', `
    if (${truthyCheckExpr} && ${itemGetExpr} !== undefined) {
      return ${itemGetExpr};
    }
    return defaultValue;`);
}

function once(obj, path, defaultValue) {
  return (getterCache[path] || compile(path))(obj, defaultValue);
}

function get(obj, path, defaultValue, useCache) {
  if (!getterCache[path]) {
    const getter = compile(path);
    getterCache[path] = getter;
  }
  return getterCache[path](obj, defaultValue);
}


get.once = once;
get.compile = compile;
module.exports = get;
