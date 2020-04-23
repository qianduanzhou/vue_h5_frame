module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 100, //结果为：100px -> 1rem
      propList: ['*']
    }
  }
}