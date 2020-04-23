import * as types from './mutation-types'
import {getExplorerInfo, getNetworkType, getPhoneModel} from '../sdk/utils'
import {baseConfig} from '../config/baseConfig'
import getOpenId from '../utils/getOpenId'

const MobileDetect = require('mobile-detect');
const md = new MobileDetect(navigator.userAgent);

/**
 * 获取数据上报公共参数
 * data_date 上报日期，示例：2019-01-05
 * appid 小程序appid
 * openid 用户id
 * unionid 用户unionid，可能空
 * platform_ 平台类型，示例：iOS
 * system_version 操作系统版本，如iOS的： 12.0.0
 * browser_version 浏览器版本
 * brand 手机品牌
 * model 手机机型
 * wxversion 微信版本
 * wx_language 微信语言
 * app_version 小程序版本
 * network_ 网络类型(0:wifi 2:2G 3:3G 4:4G 5:none)
 * timestamp_ 前端上报时间戳(一般是对应操作行为的发生时间)
 * created_at 后端收到数据的时间戳
 * server_type 0：测试服体验服，其他为正式服//常规统计时排除测试服数据
 */

let phoneModel = getPhoneModel(md)
export const getPublic = function ({commit, state}) {
  return new Promise(async (resolve, reject) => {
    let date = new Date();
    commit(types.SET_DATE_DATE, `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
    commit(types.SET_APPID, baseConfig.appId)
    console.log('actions', localStorage.getItem('openId'))
    let openId = await getOpenId()
    console.log('getOpenid', openId)
    commit(types.SET_OPENID, openId)
    commit(types.SET_UNIONID, '')
    commit(types.SET_PLATFORM_, md.os())
    commit(types.SET_SYSTEM_VERSION, phoneModel.ver)
    if (getExplorerInfo()) {
      commit(types.SET_BROWSER_VERSION, `${getExplorerInfo().type}/${getExplorerInfo().version}`)
    }
    commit(types.SET_BRAND, phoneModel.model)
    commit(types.SET_MODEL, phoneModel.model)
    commit(types.SET_WXVERSION, md.version('MicroMessenger') || 'none')
    commit(types.SET_WX_LANGUAGE, navigator.language || 'none')
    commit(types.SET_APP_VERSION, baseConfig.clientVersion || 'none')
    commit(types.SET_NETWORK_, getNetworkType())
    commit(types.SET_TIMESTAMP_, date.getTime().toString())
    commit(types.SET_CREATED_AT, date.getTime().toString())
    commit(types.SET_SERVER_TYPE, baseConfig.serverType)
    resolve(true)
  })
}
