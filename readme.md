# bistro — lightning-fast \_.get alternative

Bistro safely extracts deeply nested object properties. Works 7 times
as fast as Lodash `get`, dwarfs `fast-get` and `object-path`.

Under the hood, `bistro` compiles array paths into good old `object && object.prop && object.prop.prop2...` checks, making your code both concise _and_ efficient. `Lodash.get` is fast enough, but why waste CPU cycles on property access? `bistro` is safe to use in performance-critical applications, like data analysis and visualization.

## Usage
```js
// Load the full module
const bistro = require('bistro');
// Or use component-based imports
const bistroGet = require('bistro/lib/get');
// Or use the ES6 syntax
import bistro from bistro;

// Compile the getter - do it once, or the magic is gone!
const getUsername = bistro.get(['user', 'name']);

// securely access
getUsername(undefined) // => undefined
getUsername({}) // => undefined
getUsername({ user: 'Ivan' }) // => undefined
getUsername({ user: { name: 'Ivan' } }) // => "Ivan"

// Or provide a default value
getUsername({}, 'anonymous') // => "anonymous"
```


## Install using npm
```sh
$ npm i --save bistro
```

## Benchmarks

The chart summarizes the performance of successful property access by array path at various depths. In all implementations misses are slightly slower. String paths (`user.name`) require parsing and memory allocation, with disastrous performance effect.

* Default `bistro.get` implementation is the fat orange line.
* `lodash.get` is red.
* The other `bistro-*` lines are alternative implementations not included in the bundle, for me to watch out for changes.
* `fast-get` and `object-path` are there in the bottom.
<div style="width: 50%; float: right">
  <img src="https://github.com/thoughtspile/bistro/raw/master/web-asset/chart.png"></img>
</div>

Made by [Vladimir Klepov](https://github.com/thoughtspile).
