const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')  // 打包html 自动引入js文件到html 自定义html模板
const { CleanWebpackPlugin } = require('clean-webpack-plugin')  // 每次编译打包时自动清空输出目录文件

module.exports = {
  entry: {
    index: './src/index.js',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src/'),
    }
  },
  optimization: {
    runtimeChunk: 'single',  // 将webpack runtime代码与源代码分离打包 这样每次打包runtime改变不会影响到其他的包 2.用于缓存
    splitChunks: { // 将导入的第三方包单独打包为一个文件 因为其不易改变 3.用于缓存
      cacheGroups: {
        asyncVendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors-async',
          chunks: 'async', // all时非异步和异步模块也会共用模块
          priority: 20,
          maxSize: 1024 * 1024,
        },
        allVendors: {
          test: /[\\/]node_modules[\\/]/,
          // name: function(module, chunks, cacheGroupKey) {
          //   const moduleFileName = module.identifier().split('/').reduceRight(item => item)
          //   const allChunksNames = chunks.map((item) => item.name).join('~')
          //   return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`
          // },
          name: 'vendors',
          chunks: 'all',
          priority: 10,
          maxSize: 1024 * 1024,
        }
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/mineSweeper.html',
      favicon: './src/icon/flag_icon.png',
    }),
    new CleanWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'img/',
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
    ]
  },
}
