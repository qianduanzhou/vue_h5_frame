
export function isObject(obj) {
  // 区分数组和对象的情况
  return Object.prototype.toString.call(obj) === '[object Object]';
}

// 判断浏览器类型
export function getExplorerInfo() {
var explorer = window.navigator.userAgent.toLowerCase();
var ver = ''
//ie
if (explorer.indexOf("msie") >= 0) {
  ver = explorer.match(/msie ([\d.]+)/)[1];
  return { type: "IE", version: ver };
} else if (explorer.indexOf("firefox") >= 0) {
  ver = explorer.match(/firefox\/([\d.]+)/)[1];
  return { type: "Firefox", version: ver };
} else if (explorer.indexOf("chrome") >= 0) {
  ver = explorer.match(/chrome\/([\d.]+)/)[1];
  return { type: "Chrome", version: ver };
} else if (explorer.indexOf("opera") >= 0) {
  ver = explorer.match(/opera.([\d.]+)/)[1];
  return { type: "Opera", version: ver };
} else if (explorer.indexOf("Safari") >= 0) {
  ver = explorer.match(/version\/([\d.]+)/)[1];
  return { type: "Safari", version: ver };
}
}

//  判断网络类型
export function getNetworkType() {
let ua = navigator.userAgent;
let networkStr = ua.match(/NetType\/\w+/) ? ua.match(/NetType\/\w+/)[0] : 'NetType/other';
networkStr = networkStr.toLowerCase().replace('nettype/', '');
console.log('networkStr', networkStr)
let networkType = '';
switch (networkStr) {
  case 'wifi':
      networkType = '0';
      break;
  case '4g':
      networkType = '4';
      break;
  case '3g':
      networkType = '3';
      break;
  case '3gnet':
      networkType = '3';
      break;
  case '2g':
      networkType = '2';
      break;
  default:
      networkType = '5';
}
return networkType
}

//  判断手机系统和型号
export function getPhoneModel(md) {
var os = md.os();//获取系统
// model:手机型号  ver:系统版本
var model = ""; var ver = '';
if (os == "iOS") { //ios系统的处理
  model = md.mobile();
  if (model == "iPhone") {
      ver = navigator.userAgent.toLocaleLowerCase().match(/cpu iphone os (.*?) like mac os/);
      ver = ver[1].replace(/_/g, ".");
  }
} else if (os == "AndroidOS") { //Android系统的处理
  var j; var sss = navigator.userAgent.split(";");
  for (var i = 0; i < sss.length; i++) {
      if (sss[i].indexOf("Build/") > 0) {
          j = i;
          break;
      }
  }
  if (j > -1) {
      model = sss[j].substring(0, sss[j].indexOf("Build/"));
  }
  ver = 'Android' + md.version("Android")
}
return {
  model,
  ver
}
}

/**
* string => array[]
* @param str
* @returns {Array}
*/
export function stringToBytes(str) {
let ch;
let st;
let re = [];
for (let i = 0; i < str.length; i++) {
  ch = str.charCodeAt(i); // get char
  st = []; // set up "stack"
  do {
    st.push(ch & 0xFF); // push byte to stack
    ch = ch >> 8; // shift value down by 1 byte
  }
  while (ch);
  re = re.concat(st.reverse());
}
return re;
}
