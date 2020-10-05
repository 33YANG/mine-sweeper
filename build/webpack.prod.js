const path = require('path')
const optimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')  // 压缩css代码
const TerserPlugin = require('terser-webpack-plugin')  // 压缩js代码
const CompressionPlugin = require('compression-webpack-plugin') // 压缩文件为gzip格式 进一步缩小大小 在服务器部署时可以解压缩
const MiniCssExtratPlugin = require('mini-css-extract-plugin') // 打包css 并以单独文件的形式挂载到html上 但不支持CSS HMR
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = (env) => {
  return merge(common, {
    mode: 'production',
    // devtool: 'source-map',
    output: {
      filename: 'js/[name].[contenthash:8].js', // 使用contenthash 只有在文件内容改变时 该文件打包的contenthash才会改变 用于缓存
      chunkFilename: 'js/[name].[contenthash:8].bundle.js', // 决定了非入口chunk的文件名称
      path: path.resolve(__dirname, '../dist'), // 注意dist的相对路径
    },
    optimization: {
      minimize: true,
      minimizer: [
        new optimizeCssAssetsWebpackPlugin({}),
        new TerserPlugin({
          cache: true,
          parallel: true,
        }),
      ],
    },
    plugins: env.gzip
      ? [
          new MiniCssExtratPlugin({
            filename: 'css/[name].[contenthash:8].css', // 使用contenthash 避免与js使用同一个hash 用于缓存
            chunkFilename: 'css/[name].[contenthash:8].bundle.css',
          }),
          new CompressionPlugin({
            test: /\.(js|css)$/,
          }),
        ]
      : [
          new MiniCssExtratPlugin({
            filename: 'css/[name].[contenthash:8].css',
            chunkFilename: 'css/[name].[contenthash:8].bundle.css',
          }),
        ],
    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.resolve(__dirname, '../src'),
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        {
          test: /\.less$/,
          include: path.resolve(__dirname, '../src/styles'),
          use: [
            {
              loader: MiniCssExtratPlugin.loader,
              options: {
                publicPath: '../',
              },
            },
            'css-loader',
            'postcss-loader', // 注意postcss自动加前缀 要配合autoprefix插件和browerslist 一起使用才生效
            'less-loader',
          ],
        },
      ],
    },
  })
}
