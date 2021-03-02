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
    stats: 'errors-only',
  },
  output: {
    filename: 'js/[name].js', //使用contenthash，只有该文件内容改变时 该文件打包的contenthash才会改变 1.用于缓存
    chunkFilename: 'js/[name].bundle.js',
    path: path.resolve(__dirname, '../dist')  // 注意dist的相对路径
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        include: path.resolve(__dirname, "../src/styles"),
        use: [
          'style-loader',
          'css-loader',
          // 'postcss-loader', // 注意postcss自动加前缀 要配合autoprefix插件和browserslist 一起使用才生效
          'less-loader',
        ]
      },
    ]
  }
})
