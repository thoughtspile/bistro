var randomstring = require("randomstring");
const assert = require('assert');

const bistroGet = require('../src/get');
const bistroSet = require('../src/set');
const bistroHas = require('../src/has');

const PATH_LEN = 5;

const pathArray = [];
for (var i = 0; i < PATH_LEN; i++) {
  pathArray.push(randomstring.generate({ length: 12, charset: 'alphabetic' }));
}
const pathStr = pathArray.join('.');
const populate = (obj, path, val) => {
  if (path.length === 0) return val;
  const head = path.shift();
  obj[head] = populate({}, path, val);
  return obj;
};
const yes = populate({}, pathArray.slice(), 234);
const no = populate({}, pathArray.slice(0, -1), 234);
console.log(JSON.stringify(yes), JSON.stringify(no));

const get = bistroGet(pathArray);
const set = bistroSet(pathArray);
const has = bistroHas(pathArray);

assert(get(yes) === 234);
assert(has(yes) === true);
assert(get(no) === undefined);
assert(has(no) === false);
assert(get(no, 'hello') === 'hello');

assert(set(no, 345) === no);
console.log(JSON.stringify(no));
assert(get(no) === 345);
