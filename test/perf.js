var randomstring = require("randomstring");
var Benchmark = require('benchmark');

const _get = require('lodash.get');
const fastGet = require('fast-get').default;
const bistroGet = require('../src/get');
const bistroCachedGet = require('../alt/cached_get');
const bistroLoopGet = require('../alt/loop_get');

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

const bistroGetter = bistroGet(pathArray);
const bistroCachedGetter = bistroCachedGet(pathArray);
const bistroLoopGetter = bistroLoopGet(pathArray);
var suite = new Benchmark.Suite();
suite
  .add('lodash.get, ok,   array path', () => _get(yes, pathArray))
  .add('lodash.get, miss, array path', () => _get(no, pathArray))
  .add('lodash.get, ok,   string path', () => _get(yes, pathStr))
  .add('lodash.get, miss, string path', () => _get(no, pathStr))

  .add('fast-get, ok,   array path', () => fastGet(yes, pathArray))
  .add('fast-get, miss, array path', () => fastGet(no, pathArray))
  .add('fast-get, ok,   string path', () => fastGet(yes, pathStr))
  .add('fast-get, miss, string path', () => fastGet(no, pathStr))

  .add('bistro.get, ok,   string path', () => bistroGetter(yes))
  .add('bistro.get, miss, string path', () => bistroGetter(no))
  .add('bistro.cached_get, ok,   string path', () => bistroCachedGetter(yes))
  .add('bistro.cached_get, miss,   string path', () => bistroCachedGetter(no))
  .add('bistro.loop_get, ok,   string path', () => bistroLoopGetter(yes))
  .add('bistro.loop_get, miss,   string path', () => bistroLoopGetter(no))
  // add listeners
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  // run async
  .run({ 'async': false });
