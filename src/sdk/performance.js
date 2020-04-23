/* eslint-disable camelcase */
import {sendkv} from './statistics'
/**
 * 性能监控
 * dns_time DNS查询时间
 * tcp_time tcp连接时间
 * firstpacket_time 首包时间
 * request_time request请求耗时
 * white_time 白屏时间
 * firstscreen_time 首屏时间
 * dom_time DOM树解析时间
 * loadPage_time 页面加载完成时间
 */
const performance = function() {
  let imgs = document.querySelectorAll('img')
  let fsItems = [];
  console.log('imgs', imgs)
  for (let i = 0; i < imgs.length; i++) {
    imgs[i].onload = () => {
      let time = new Date().getTime()
      fsItems.push({
        img: imgs[i],
        time: time
      })
    }
  }
  //获取元素在dom中的位置
  function getOffsetTop(elem) {
    let top = 0;
    top = window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop;
    top += elem.getBoundingClientRect().top;
    return top;
  }
  function findMaxTime() {
      let sh = document.documentElement.clientHeight;
        let maxTime = 0;
      for (let i = 0; i < fsItems.length; i++) {
        let item = fsItems[i];
        let img = item['img'];
        let time = item['time'];
        let top = getOffsetTop(img);
        if (top > 0 && top < sh) { //找首屏中的图片
          maxTime = time > maxTime ? time : maxTime;
        }
      }
      return maxTime;
  }

  window.addEventListener('load', function() {
    let performance = window.performance || window.msPerformance || window.webkitPerformance;
    if (performance && performance.timing) {
      let t = performance.timing;
      let imgTime = findMaxTime();
      let firstscreenTime = imgTime > 0 ? imgTime : t.domInteractive; //如果没有图片，直接取dom时间
      let firstscreen_time = firstscreenTime - t.navigationStart; // 首屏时间
      console.log('首屏时间', firstscreen_time, firstscreenTime)
      setTimeout(() => {
        console.log('performance', performance, performance.timing.domInteractive)
        sendkv({
          key: 90075,
          dns_time: t.domainLookupEnd - t.domainLookupStart,
          tcp_time: t.connectEnd - t.connectStart,
          firstpacket_time: t.responseStart - t.navigationStart,
          request_time: t.responseEnd - t.requestStart,
          white_time: t.domLoading - t.navigationStart,
          firstscreen_time: firstscreen_time,
          dom_time: t.domComplete - t.domLoading,
          loadPage_time: t.loadEventEnd - t.navigationStart
        })
       }, 0)
    }
  });
}

export default performance

