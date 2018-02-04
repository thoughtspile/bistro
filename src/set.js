module.exports = function compileSet(pathArray) {
  const pathTail = pathArray[pathArray.length - 1];

  let intermediateSet = '';

  let truthyCheckItem = 'obj';
  let truthyCheckExpr = truthyCheckItem;
  for (var i = 0; i < pathArray.length - 1; i++) {
    truthyCheckItem += '["' + pathArray[i] + '"]';
    intermediateSet += `
      if (!(${truthyCheckItem} instanceof Object)) {
        ${truthyCheckItem} = {};
      }
    `;
  }

  // TODO add root default
  const body = `
    ${intermediateSet}
    ${truthyCheckItem}["${pathTail}"] = value;
    return obj;`;
  return new Function('obj', 'value', body);
};
