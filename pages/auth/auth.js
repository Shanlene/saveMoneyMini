// pages/auth/auth.js
//获取应用实例
var app = getApp();
//查询用户信息
const AV = require('../../libs/av-weapp.js');



Page({
  // mixins: [require('../../mixin/themeChanged')],
  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // userlogin( this);
    // 读取缓存
    const isLogin = wx.getStorageSync('isLogin')
    console.log(isLogin)
    if (isLogin){ 
      wx.switchTab({
        url: '../index/index',
      })
    }

    wx.checkSession({
      success () {
        //session_key 未过期，并且在本生命周期一直有效
        wx.switchTab({
          url: '../index/index',
        })
      },
      fail () {
        // session_key 已经失效，需要重新执行登录流程
        wx.login() //重新登录
      }
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  handleGetUserInfo: function (e){
   // console.log("获取用户信息回调："+e)
   // console.log(e.detail.userInfo)
    var isLogin=false ;
    // 一键登录接口
    var obj;
    AV.User.loginWithMiniApp().then(user => {
      app.globalData.user = user._hashedJSON.authData;
      
      // 字符串转为json
      var obj = JSON.parse(app.globalData.user);
      //console.log("获取id"+ obj.lc_weapp.openid)
      app.globalData.userOpenId = obj.lc_weapp.openid ;
      // 进行本地缓存存储
      wx.setStorageSync('openid', app.globalData.userOpenId)
      if (isLogin){ 
        const openid = wx.getStorageSync('openid');
        var user = new AV.Query('user');
        user.matches('openid',openid);
        user.descending('createdAt').find().then(function (results) {
          results = results.map((curvalue) => {
            return userFormat.userFormat(curvalue);
          });
           console.log(results);
           if(results.length==0)
           {
            var orderObj = AV.Object.extend('user'),
            user = new orderObj();
            user.set('openid',openid);
            user.save();
           }
        },);
       
        wx.switchTab({
          url: '../index/index',
        })
      }
    }).catch(console.error);
    


    wx.getSetting({
      success: (res) => {
        console.log("success")
        console.log('是否授权', res.authSetting['scope.userInfo'] !== undefined);
        isLogin = res.authSetting['scope.userInfo'] !== undefined ;
        console.log(app.globalData.weixinLogin)
        app.globalData.weixinLogin = isLogin ;
        // 进行本地缓存存储
        wx.setStorageSync('isLogin', isLogin)

        // 如果已经登录
         //console.log(isLogin)
        // if (isLogin){ 
        //  wx.switchTab({
        //    url: '../index/index',
        // })
       // }
          }
        })

  },
})