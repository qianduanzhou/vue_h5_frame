import {service as request, CancelToken} from "./axios";
import qs from "qs";
import api from "./api";
const apiList = api.getApiList()
const MODEL_NORMAL = "normal";
const MODEL_WAIT = "wait";
const MODEL_QUEUE = "queue";
const MODEL_BREAK = "break";
let cancel = null
function requestApi({ name, data, header, headerType, isCancel }) {
  (cancel && isCancel) && cancel()
  if (Object.keys(apiList).indexOf(name) === -1) {
    //action不在reqConfig配置中
    throw new SyntaxError(`请在apiList文件注册路由:  ${name}`);
  }
  const options = apiList[name];
  options.method = options.method || "get";
  getHooks(name, options);
  let hooks = {};
  if (options.model) {
    hooks = getHooks(name, options);
  }
  return new Promise(async (resolve, reject) => {
    let next = true;
    if (hooks.pre) {
      next = hooks.pre({
        resolve,
        reject,
        name,
        hooks,
        options,
        data,
        header,
        headerType
      });
    }
    if (next) {
      let res = await Request(options, data, header, hooks, headerType, isCancel);
      resolve(res);
    }
  });
}

// 发起请求
function Request(options, data, header, hooks = {}, headerType, isCancel) {
  return new Promise(function(resolve, reject) {
    request({
      url: options.url,
      method: options.method,
      // withCredentials: true,
      params: options.method == "get" ? data : "",
      data:
        options.method != "get"
          ? headerType == "json"
            ? data
            : qs.stringify(data)
          : "",
      headers: {
        'Content-Type': headerType && headerType == 'json' ? 'application/json' : 'application/x-www-form-urlencoded',
        ...header
      },
      cancelToken: isCancel ? new CancelToken((c) => { cancel = c }) : null // new CancelToken((c) => {cancel = c;})  cancel()
    }).then(
      function(res) {
        resolve(res);
        hooks.afterSuc && hooks.afterSuc(res);
      },
      function(error) {
        reject(error);
        hooks.afterSuc && hooks.afterSuc(error);
      }
    );
  });
}

//  判断模式
function getHooks(name, options) {
  switch (options.model) {
    case MODEL_NORMAL:
      return {};
    case MODEL_WAIT:
      // 等待模式
      return getWaitModelHooks(name);
    case MODEL_QUEUE:
      // 队列模式
      return getQueueModelHooks(name);
    case MODEL_BREAK:
      // 中断模式
      return getBreakModelHooks(name);
    default:
      return {};
  }
}

//  队列模式：依次请求
function getQueueModelHooks(name) {
  let pre = ({ resolve, reject, name, hooks, options, data }) => {
    // console.log('进入到pre过程', name);
    if (!window.singleton) window.singleton = {};
    window.singleton[name + "lock"] = window.singleton[name + "lock"] || false;
    if (window.singleton[name + "lock"]) {
      window.singleton[name].push({
        resolve,
        reject,
        name,
        hooks,
        options,
        data
      });
      return false;
    } else {
      window.singleton[name + "lock"] = true;
      window.singleton[name] = [];
      return true;
    }
  };
  let afterSuc = async res => {
    for (let i = 0; i < window.singleton[name].length; i++) {
      let item = window.singleton[name][i];
      try {
        item.resolve(await Request(item.options, item.data, item.header, {}));
      } catch (e) {
        item.reject(e);
      }
    }
    window.singleton[name + "lock"] = false;
  };
  return {
    pre,
    afterSuc
  };
}

// 等待模式：后请求的结果返回之前的结果
function getWaitModelHooks(name) {
  let pre = ({ resolve, reject }) => {
    // console.log('进入到pre过程', name);
    if (!window.singleton) window.singleton = {};
    window.singleton[name + "lock"] = window.singleton[name + "lock"] || false;
    if (window.singleton[name + "lock"]) {
      window.singleton[name].push(resolve);
      return false;
    } else {
      window.singleton[name + "lock"] = true;
      window.singleton[name] = [];
      return true;
    }
  };
  let afterSuc = res => {
    // console.log('进入到after过程', window.singleton[name]);
    let func = null;
    while ((func = window.singleton[name].shift())) {
      func(res);
    }
    window.singleton[name + "lock"] = false;
  };
  return {
    pre,
    afterSuc
  };
}

// 中断模式：拿最后一个的结果
function getBreakModelHooks(name) {
  let pre = ({ resolve, reject, name, hooks, options, data }) => {
    // console.log('进入到pre过程', name);
    if (!window.singleton) window.singleton = {};
    window.singleton[name + "lock"] = window.singleton[name + "lock"] || true;
    window.singleton[name] = window.singleton[name] || [];
    window.singleton[name].push({
      resolve,
      reject,
      name,
      hooks,
      options,
      data
    });
    return false;
  };
  setTimeout(async () => {
    if (window.singleton[name].length <= 0) return
    let item = window.singleton[name].pop()
    window.singleton[name] = []
    window.singleton[name + "lock"] = false;
    try {
      item.resolve(await Request(item.options, item.data, item.header, {}));
    } catch (e) {
      item.reject(e);
    }
  }, 0);
  return {
    pre
  };
}
export { requestApi };
