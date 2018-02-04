module.exports = function compileGetter(pathArray) {
  const pathTail = pathArray[pathArray.length - 1];

  let truthyCheckItem = 'obj';
  let truthyCheckExpr = truthyCheckItem;
  for (var i = 0; i < pathArray.length - 1; i++) {
    truthyCheckItem += '["' + pathArray[i] + '"]';
    truthyCheckExpr += ' && ' + truthyCheckItem;
  }
  const itemGetExpr = `${truthyCheckItem}["${pathTail}"]`;

  return new Function('obj', 'defaultValue', `
    if (${truthyCheckExpr} && ${itemGetExpr} !== undefined) {
      return ${itemGetExpr};
    }
    return defaultValue;`);
};
