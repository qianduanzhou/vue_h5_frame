//  设计稿设备宽度
const DEVICEWIDTH = 375;
//  设计稿设备宽度下对应比例
const RATIO = DEVICEWIDTH / 100;
// 设置 rem 函数
function setRem () {
  // 当前设备宽度
  let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
  // 得到html的Dom元素
  let htmlDom = document.getElementsByTagName('html')[0];
  // 设置根元素字体大小
  htmlDom.style.fontSize = htmlWidth / RATIO + 'px';
  console.log(htmlDom.style.fontSize)
}
// 初始化
setRem();
// 改变窗口大小时重新设置 rem
window.onresize = function () {
  setRem()
}