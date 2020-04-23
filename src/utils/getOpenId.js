import { requestApi } from '../request/request'
import getQueryVariable from './getQueryVariable'
import store from "../store/index";
function getCode() {
  let data = {
    redirect_url: window.location.href.replace(/\?.*?#/gi, "#")
  }
  requestApi({
    name: 'getCode',
    data
  }).then((res) => {
    if (res.code == 1) {
      //关闭页面
      window.location = res.data.url
    }
  })
}
const getOpenId = function() {
  let openId = localStorage.getItem('openId')
  console.log('getOpenId', openId)
  if (openId) {
    store.commit('SET_OPENID', openId)
    return openId
  }
  return new Promise((resolve, reject) => {
    let code = getQueryVariable('code')
    if (!code) {
      getCode()
    } else {
      requestApi({
        name: 'getOpenId',
        data: {
          code
        }}).then((res) => {
          console.log(res)
          if (res.code == 1) {
            localStorage.setItem("openId", res.data.openid);
            store.commit('SET_OPENID', res.data.openid)
            resolve(res.data.openid)
          } else if (res.code == 40007 || res.code == 40004) {
            getCode()
          } else {
            resolve(false)
          }
      })
    }
  })
}

export default getOpenId