import request from "./axios";
import qs from "qs";
import apis from "./apis";

const MODEL_NORMAL = "normal";
const MODEL_WAIT = "wait";
const MODEL_QUEUE = "queue";

function requestApi({ name, data, header, headerType }) {
  if (Object.keys(apis).indexOf(name) === -1) {
    //action不在reqConfig配置中
    throw new SyntaxError(`请在apis文件注册路由:  ${name}`);
  }
  const options = apis[name];
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
      let res = await Request(options, data, header, hooks, headerType);
      resolve(res);
    }
  });
}

// 发起请求
function Request(options, data, header, hooks = {}, headerType) {
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
      }
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
    // eslint-disable-next-line
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

export { requestApi };
