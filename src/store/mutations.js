import * as types from './mutation-types'

const mutations = {
  //  数据上报公参
  [types.SET_DATE_DATE](state, value) {
    state.data_date = value
  },
  [types.SET_APPID](state, value) {
    state.appid = value
  },
  [types.SET_OPENID](state, value) {
    state.openid = value
  },
  [types.SET_UNIONID](state, value) {
    state.unionid = value
  },
  [types.SET_PLATFORM_](state, value) {
    state.platform_ = value
  },
  [types.SET_SYSTEM_VERSION](state, value) {
    state.system_version = value
  },
  [types.SET_BROWSER_VERSION](state, value) {
    state.browser_version = value
  },
  [types.SET_BRAND](state, value) {
    state.brand = value
  },
  [types.SET_MODEL](state, value) {
    state.model = value
  },
  [types.SET_WXVERSION](state, value) {
    state.wxversion = value
  },
  [types.SET_WX_LANGUAGE](state, value) {
    state.wx_language = value
  },
  [types.SET_APP_VERSION](state, value) {
    state.app_version = value
  },
  [types.SET_NETWORK_](state, value) {
    state.network_ = value
  },
  [types.SET_TIMESTAMP_](state, value) {
    state.timestamp_ = value
  },
  [types.SET_CREATED_AT](state, value) {
    state.created_at = value
  },
  [types.SET_SERVER_TYPE](state, value) {
    state.server_type = value
  },
  //  全局loading
  [types.SET_LOADING](state, value) {
    state.loading = value
  },
  //  监控错误组件
  [types.SET_MONITOR](state, value) {
    state.monitor = value
  }
}

export default mutations