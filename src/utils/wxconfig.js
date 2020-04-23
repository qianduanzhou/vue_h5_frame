// var wx = require('weixin-js-sdk')
import { requestApi } from '@/request/request'
import store from "../store/index";
import getOpenId from "@/utils/getOpenId";
export default async function wxconfig({shareData = {}, link = '', getAddr = false}) {
  let openId = store.getters.openid
  if (!openId) {
    openId = await getOpenId()
    console.log('openid', openId)
  }
  if (link.split('#')[1].includes('?')) {
    link = `${link}&from_userId=${openId}`
  } else {
    link = `${link}?from_userId=${openId}`
  }
  console.log('link', link)
  return new Promise((resolve, reject) => {
    let url = window.location.href.split('#')[0];
    requestApi({
      name: 'wxconfig',
      data: {
        share_url: url
      }
    }).then((res) => {
      console.log(res.data, "api/h5_order/share")
      wx.config({
        debug: false, //生产环境需要关闭debug模式
        appId: res.data.appId, //appId通过微信服务号后台查看
        timestamp: res.data.timestamp, //生成签名的时间戳
        nonceStr: res.data.nonceStr, //生成签名的随机字符串
        signature: res.data.signature, //签名
        jsApiList: [
          'onMenuShareAppMessage', //旧的接口，即将废弃
          'onMenuShareTimeline', //旧的接口，即将废弃
          'updateAppMessageShareData', //新的接口
          'updateTimelineShareData', //新的接口
          'openAddress' // 获取微信地址
        ]
      });
      wx.ready(async function () {
        if (getAddr) {
          let res = await openAddress()
          console.log(res, '地址')
          resolve(res)
        } else {
          shareConfig({
            title: shareData.title || '', // 分享标题
            desc: shareData.desc || '', // 分享描述
            imgUrl: shareData.imgUrl || '', // 分享图标
            link: link
          })
          resolve(true)
        }
      })
      wx.error(function(res) {
        console.error("错误", res)
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      });
    })
  })
}

  export function shareConfig(shareData) {
    console.log(shareData)
      // wx.hideAllNonBaseMenuItem();
      // wx.showMenuItems({
      //   menuList: [
      //     'menuItem:share:appMessage',
      //     'menuItem:share:timeline',
      //     'menuItem:favorite'
      //   ] // 要显示的菜单项，所有menu项见附录3
      // });

      //分享给朋友
      wx.onMenuShareAppMessage({
        title: shareData.title, // 分享标题
        desc: shareData.desc, // 分享描述
        link: shareData.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: shareData.imgUrl, // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
        // 用户点击了分享后执行的回调函数
          console.log('shareFriend')
        }
      });

      ///分享到朋友圈
      wx.onMenuShareTimeline({
        title: shareData.title, // 分享标题
        link: shareData.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: shareData.imgUrl, // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
          // 用户点击了分享后执行的回调函数
          console.log('shareFriendCircle')
        }
      })
  }
  export function openAddress() {
    console.log('获取微信地址')
    return new Promise((resolve, reject) => {
      wx.openAddress({
        success: function (res) {
          console.log('微信地址', res)
          resolve(res)
        },
        cancel: function (errMsg) {
          // 用户取消拉出地址 //
          console.log('失败', errMsg)
          resolve(errMsg)
        }
      });
    })
}
