const path = require('path')
const optimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')  // 压缩css代码
const TerserPlugin = require('terser-webpack-plugin')           // 压缩js代码
const CompressionPlugin = require('compression-webpack-plugin') // 压缩文件为gzip格式 进一步减小大小 在服务器部署时可以解压缩
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 打包css，并以单独文件的形式挂载到html上，但不能使用HMR
const { merge } = require('webpack-merge')
// const webpack = require('webpack')
const common = require('./webpack.common.js')

module.exports = env => {
  return merge(common, {
    mode: 'production',
    // devtool: 'source-map',
    output: {
      filename: 'js/[name].[contenthash:8].js', //使用contenthash，只有该文件内容改变时 该文件打包的contenthash才会改变 1.用于缓存
      chunkFilename: 'js/[name].[contenthash:8].bundle.js', // 决定了非入口chunk的文件名称
      path: path.resolve(__dirname, '../dist'),  // 注意dist的相对路径
      // publicPath: '/mineSweeper/'
    },
    optimization: {
      minimize: true,
      minimizer: [
        new optimizeCssAssetsWebpackPlugin({}),
        new TerserPlugin({
          extractComments: false, // 不分离构建注释、license等信息
        }),
      ],
    },
    plugins: env.gzip ? [
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css', // 使用contenyhash 避免与js使用同一个hash 4.用户缓存
        chunkFilename: 'css/[name].[contenthash:8].bundle.css',
      }),
      new CompressionPlugin({
        test: /\.(js|css)$/,
      })
    ] : [
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css', // 使用contenyhash 避免与js使用同一个hash 4.用户缓存
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
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '../',
              },
            },
            'css-loader',
            'postcss-loader', // 注意postcss自动加前缀 要配合autoprefix插件和browserslist 一起使用才生效
            'less-loader',
          ]
        },
      ]
    },
  })
} 
