var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: {
      index: './lib/index.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'index.js',
        library: 'bistro',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        output: { comments: false, beautify: true },
        compress: false,
        mangle: false
      })
    ]
}
