//app.js
//初始化leancloud服务
const AV = require('./libs/av-weapp.js');
let {WeToast} = require('./libs/wetoast/wetoast.js');

App({
  WeToast,
  onLaunch: function () {
    AV.init({ 
      appId: 'LlAl3q0N0kvyPSMQkvWyH6Yj-gzGzoHsz',
      appKey: 'dfkDjS4Cx1sIxLwAyWaoK6I3',
      serverURLs: 'https://llal3q0n.lc-cn-n1-shared.com',
      });

    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
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
    userInfo:null
  }
})