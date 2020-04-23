/**
 * 监控上报的相关配置
 */
const monitorConfig = {
  monitorUrl: "http://blackhole.heywoodsminiprogram.com/report",
  monitorItems: {
    //  webPayError
    webPayError: "/Z5nofhKWz/1",
    //  支付接口调用失败
    getPayError: "/Z5nofhKWz/2",
    //  电商首页列表拉取失败
    indexListError: "/jH_L41KWk/1",
    //  详情数据请求失败
    detailError: "/jH_L41KWk/2",
    //  电商图片加载失败
    imgLoadError: "/jH_L41KWk/3",
    //  电商页面路径错误
    pathError: "/jH_L41KWk/4",
    //  用户信息录入失败
    userInfoInputError: "/kHRs4JFWz/1",
    //  用户信息获取请求失败
    getUserInfoError: "/kHRs4JFWz/2",
    //  用户登录失败
    userLoginError: "/kHRs4JFWz/3",
    //  提交订单失败
    putOrderError: "/waryV1KWz/1",
    //  获取用户收货地址失败
    getAddressError: "/waryV1KWz/2",
    //  获取用户订单列表失败
    getOrderListError: "/waryV1KWz/3",
    //  购买人信息获取失败
    getBuyerError: "/waryV1KWz/4",
    //  物流信息获取失败
    getShipError: "/waryV1KWz/5",
    //  修改用户收货地址失败
    editAddressError: "/waryV1KWz/6"
  }
};

function errorReport(name) {
  let errorOptions = monitorConfig.monitorItems[name]
  if (!errorOptions) {
    throw SyntaxError('请在monitors注册错误类型')
  }
  let img = document.createElement('img')
  img.src = monitorConfig.monitorUrl + errorOptions
  document.body.appendChild(img)
  document.body.removeChild(img)
}

export default errorReport;
