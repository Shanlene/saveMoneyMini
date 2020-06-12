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


    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
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

