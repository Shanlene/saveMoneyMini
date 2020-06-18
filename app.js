//app.js
//初始化leancloud服务
const AV = require('./libs/av-weapp.js');
const adapters = require('./libs/leancloud-adapters-weapp.js');

AV.setAdapters(adapters);
let {WeToast} = require('./libs/wetoast/wetoast.js');

App({
  WeToast,
  onLaunch: function () {
    AV.init({ 
      appId: 'LlAl3q0N0kvyPSMQkvWyH6Yj-gzGzoHsz',
      appKey: 'dfkDjS4Cx1sIxLwAyWaoK6I3',
      serverURLs: 'https://llal3q0n.lc-cn-n1-shared.com',
      });

    // 初始化云环境-内容检测
      wx.cloud.init({
        env: "letssavemoney-c7e4y",
        traceUser: true
      })

    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);

  },
  onload: function(){
        // 查看是否授权
        wx.getSetting({
          success: function(res){
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              wx.getUserInfo({
                success: function(res) {
                  console.log(res.userInfo)
                }
              })
            }
          }
        })
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{


      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },

  globalData:{
    userInfo:null,
    weixinLogin: false,
    userOpenId: null,
    user: null,
    kindArr : []
  }
})
/**
 * 全局分享配置，页面无需开启分享
 * 使用隐式页面函数进行页面分享配置
 * 使用隐式路由获取当前页面路由，并根据路由来进行全局分享、自定义分享
 */
! function () {
  //获取页面配置并进行页面分享配置
  var PageTmp = Page
  Page = function (pageConfig) {
    //1. 获取当前页面路由
    let routerUrl = ""
    wx.onAppRoute(function (res) {
      //app.js中需要在隐式路由中才能用getCurrentPages（）获取到页面路由
      let pages = getCurrentPages(),
        view = pages[pages.length - 1];
      routerUrl = view.route
    })

    //2. 全局开启分享配置
    pageConfig = Object.assign({
      onShareAppMessage: function () {
        //根据不同路由设置不同分享内容（微信小程序分享自带参数，如非特例，不需配置分享路径）
        let shareInfo={}
        let noGlobalSharePages=["index/index"]
        //全局分享配置，如部分页面需要页面默认分享或自定义分享可以单独判断处理
        if (!routerUrl.includes(noGlobalSharePages)){
          shareInfo = {
            title: "邀请您一起来拼单~！",
            // imageUrl: wx.getStorageSync("shareUrl")
            imageUrl:'/images/overShare.png'
          }
        }
        return shareInfo
      }
    }, pageConfig);
    // 配置页面模板
    PageTmp(pageConfig);
  }
}();

