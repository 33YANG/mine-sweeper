const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')  // 打包html 自动引入js文件到html 走自定义html模板
const { CleanWebpackPlugin } = require('clean-webpack-plugin')  // 每次编译打包时自动清空输出目录文件

module.exports = {
  entry: {
    index: './src/index.js',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src/'),
    },
  },
  optimization: {
    runtimeChunk: 'single', // 将webpack runtime代码与源代码分离打包 这样每次打包runtime改变不会影响到其他的包 用于缓存
    splitChunks: {  // 将导入的第三方包单独打包为一个文件 因为其不容易改变 用于缓存
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 20,
          maxSize: 1024000,
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/mineSweeper.html',
      favicon: './src/images/flag_icon.png',
    }),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(png|sv|jpg|jpeg|gif)$/,
        use:  {
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]',
            outputPath: 'img/',
          },

        }
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
    ],
  },
}
