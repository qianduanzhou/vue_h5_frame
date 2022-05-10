const path = require('path')
const { name } = require('./package');
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  // assetsDir: 'static'
  //eslint-loader 将 lint 错误输出为编译错误
  publicPath: process.env.NODE_ENV !== 'production' ? "/" : process.env.VUE_APP_BASE_PATH,
  lintOnSave: process.env.NODE_ENV !== 'production' ? 'error' : true,
  devServer: {
    port: 8080,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
  },
  configureWebpack: {
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd', // 把微应用打包成 umd 库格式
      jsonpFunction: `webpackJsonp_${name}`,
    },
  },
}
