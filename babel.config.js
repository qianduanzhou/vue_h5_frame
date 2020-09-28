module.exports = {
  presets: [
    '@vue/app',
    ["@babel/preset-env", {modules: "commonjs"}]
  ],
  plugins: [
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant'],
    ["transform-class-properties"]
  ]
}
