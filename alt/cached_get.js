module.exports = function compileGetter(pathArray) {
  const pathTail = pathArray[pathArray.length - 1];

  let truthyCheckExpr = 'obj';
  for (var i = 0; i < pathArray.length - 1; i++) {
    truthyCheckExpr += ' && (obj = obj["' + pathArray[i] + '"])';
  }
  const itemGetExpr = `obj["${pathTail}"]`;

  const body = `
    if (${truthyCheckExpr} && ${itemGetExpr} !== undefined) {
      return ${itemGetExpr};
    }
    return defaultValue;`;
  console.log(body);
  return new Function('obj', 'defaultValue', body);
};
