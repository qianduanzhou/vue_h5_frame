import store from "../store/index";
import { isObject, stringToBytes } from "./utils";
import { requestApi } from "../request/request";
const qqtea = require("../lib/qqtea.js");
const TEA_KEY = "";
// 队列锁
let lock = false;
// 请求队列
let queue = [];

/**
 * 上报数据
 * @param data 默认数据包括(client_version,openid,channel)
 * @returns {Promise<void>}
 */
function sendkv(data) {
  if (lock) {
    //存在锁,此时直接将数据丢入队列
    _pushDataToQueue(data);
  } else {
    //不存在锁,开始上锁
    lock = true;
    if (queue.length === 0) {
      //请求队列为空,直接发送请求
      _sendReport(data);
    } else {
      //请求队列不为空，请求队列添加一个元素
      _pushDataToQueue(data);
      // 发起请求
      _sendReport(queue);
    }
  }
}

// ------ 以下是内置方法，不对外暴露 ------

async function _pushDataToQueue(data) {
  _emptyToNull(data);
  queue.push(data);
}

async function _sendReport(report) {
  let data = {
    data: []
  };
  _emptyToNull(report);
  // let data = {};
  if (isObject(report)) {
    //单条请求
    // data = report;
    data.data.push(report);
    await _addCommonParams(data);
    // REPORT_URL = '/api/v3/kv';
  } else {
    //多条请求
    report.forEach(item => {
      data.data.push(item);
    });
    await _addCommonParams(data);
    //迅速置空队列
    queue = [];
  }
  console.log("数据上报结果", data);
  data = qqtea.encrypt(JSON.stringify(data), TEA_KEY);
  data = stringToBytes(data.toString());
  requestApi({ name: "dataReport", data: data, headerType: "json" }).then(
    _onCompleted,
    _onRejected
  );
}

/**
 * 添加上报的公共参数
 * @param data 外面传入的参数
 * @private
 *   data_date openid unionid platform_ app_version
 *   system_version  brand  model  wxversion  wx_language
 *    network_  timestamp_  appid server_type
 */
async function _addCommonParams(data) {
  if (!store.getters.openid || !store.getters.data_date) {
    console.log("getter");
    await store.dispatch("getPublic");
  }
  //  添加appid到data
  data.data.forEach((item) => {
    item.appid = store.getters.appid
  })
  Object.assign(data, {
    data_date: store.getters.data_date,
    appid: store.getters.appid,
    openid: store.getters.openid,
    unionid: store.getters.unionid,
    platform_: store.getters.platform_,
    system_version: store.getters.system_version,
    browser_version: store.getters.browser_version,
    brand: store.getters.brand,
    model: store.getters.model,
    wxversion: store.getters.wxversion,
    wx_language: store.getters.wx_language,
    app_version: store.getters.app_version,
    network_: store.getters.network_,
    timestamp_: store.getters.timestamp_,
    created_at: store.getters.created_at,
    server_type: store.getters.server_type
  });
  _emptyToNull(data);
}

function _onCompleted(res) {
  // console.log('sendkv上报结果 ', res);
  if (queue.length === 0) {
    //_sendReport请求过程中，外部没有调用sendkv接口 所以queue为空数组
    lock = false;
  } else {
    //_sendReport请求过程中,外部有调用sendkv接口 queue不为空数组
    _sendReport(queue);
  }
}

function _onRejected() {
  // console.log('_onRejected');
  lock = false;
}

/**
 * 遍历obj 将obj中的属性中值 空 => "NULL"
 * @param{Object} obj
 * @private
 */
function _emptyToNull(obj) {
  Object.keys(obj).forEach(key => {
    if (obj[key] === "" || obj[key] == null) {
      obj[key] = "NULL";
    }
  });
}

export { sendkv };
