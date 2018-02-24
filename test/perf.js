var randomstring = require("randomstring");
var Benchmark = require('benchmark');

const _get = require('lodash.get');
const fastGet = require('fast-get').default;
const bistroGet = require('../src/get');
const bistroCachedGet = require('../alt/cached_get');
const bistroLoopGet = require('../alt/loop_get');
const objectPath = require('object-path');

function runBench(PATH_LEN) {
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

  const getters = {
    'lodash.get': (o, p) => () => _get(o, p),
    'fast-get': (o, p) => () => fastGet(o, p),
    'object-path': (o, p) => () => objectPath.get(o, p),
    'bistro.get': (o, p) => () => bistroGetter(o),
    'bistro.cached_get': (o, p) => () => bistroCachedGetter(o),
    'bistro.loop_get': (o, p) => () => bistroLoopGetter(o),
  };

  return new Promise((ok) => {
    const stats = [];
    const bench = new Benchmark.Suite();
    Object.keys(getters).forEach(getName => {
      bench.add(`${getName}, ok, ${PATH_LEN}`, getters[getName](yes, pathArray));
      bench.add(`${getName}, miss, ${PATH_LEN}`, getters[getName](no, pathArray));
    });
    bench.on('cycle', function(event) {
        console.log(String(event.target));
        const [name, status, depth] = event.target.name.split(',').map(s => s.trim());
        stats.push({
          name,
          status,
          depth: Number(depth),
          opsPerSec: event.target.hz,
          rme: event.target.stats.rme
        });
      })
      .on('complete', function() {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
        ok(stats);
      })
      .run({ 'async': false });
    });
}

Promise.all([1,2,3,4,5,6,7,8,9,10].map(c => runBench(c))).then(stats => {
  console.log('---START---');
  console.log(JSON.stringify(stats.reduce((acc, stats) => acc.concat(stats), [])));
  console.log('---END---');
});
