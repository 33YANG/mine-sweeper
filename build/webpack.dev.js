const path = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    port: 7001,
    hot: true,
  },
  output: {
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].bundle.js',
    path: path.resolve(__dirname, '../dist'), // 注意dist的相对路径
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        include: path.resolve(__dirname, '../src/styles'),
        use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'], // 注意postcss自动加前缀 要配合autoprefix插件和browerslist 一起使用才生效
      },
    ],
  },
})
