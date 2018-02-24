module.exports = function compileGetter(pathArray) {
  const pathTail = pathArray[pathArray.length - 1];

  let truthyCheckExpr = 'obj';
  for (var i = 0; i < pathArray.length - 1; i++) {
    truthyCheckExpr += ' && (obj = obj["' + pathArray[i] + '"])';
  }
  const itemGetExpr = `obj["${pathTail}"]`;

  return new Function('obj', 'defaultValue', `
    if (${truthyCheckExpr} && ${itemGetExpr} !== undefined) {
      return ${itemGetExpr};
    }
    return defaultValue;`);
};
