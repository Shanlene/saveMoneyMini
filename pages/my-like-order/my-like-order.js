// pages/my-like-order/my-like-order.js
//获取应用实例
var app = getApp();
//查询用户信息
const AV = require('../../libs/av-weapp.js');
var orderFormat = require('../../utils/orderFormat.js');
var userFormat = require('../../utils/userFormat.js');

function orderRefresh(that)
{
 
  var orders = new AV.Query('orders');
  var user = new AV.Query('user');
  const openid = wx.getStorageSync('openid');
  orders.matches('likeUserList',openid)
  orders.descending('createdAt').find().then(function (results) {
    results = results.map((curvalue) => {
      return orderFormat.orderFormat(curvalue);
    });
    that.setData({
      orders: results
    });
  });
  user.descending('createdAt').equalTo('openid',openid).find().then(function (results) {
    results = results.map((curvalue) => {
      return userFormat.userFormat(curvalue);
    });
    that.setData({
      user: results
    });  });
    
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    user:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    orderRefresh(that)
   
  },
  navToDetail: function(event) {
    var objId = event.currentTarget.dataset.id;
    console.log(objId)
    wx.navigateTo({

      url: '../detail/detail?objId=' + objId 
    });
  },
  QRCodeTap: function(e) {
    this.setData({
      QRCodeShow: e.target.dataset.qrcode,
      QRCodeShowFlag: true
    });
  },
  hideQRCode: function(e){
    if(e.target.id === 'QRCode-container') {
      this.setData({
        QRCodeShow: '',
        QRCodeShowFlag: false
      });
    }
  },
  clickLike : function(e){
    var that = this;
    let tem_orders = that.data.orders;
    let tem_user = that.data.user;
    var id = e.currentTarget.dataset.id;
  

    var change=0;
    var orderid="";
    var userid=tem_user[0].id;
    const openid = wx.getStorageSync('openid');

    var i=0
    for(;i<tem_orders.length;i++)
    {
      if(id==tem_orders[i]._id)
      {
        orderid = tem_orders[i].id;
        if(tem_orders[i].like==false)
        {
         tem_orders[i].like=true;
         change=1;
        }
        else
         tem_orders[i].like=false;
        break;
      }
 
    }  
    
   if(change==1)
   {
     if(tem_user[0].likeList==null)
       tem_user[0].likeList=[id];
     else
       tem_user[0].likeList.push(id);
     if(tem_orders[i].likeUserList==null)
       tem_orders[i].likeUserList=[openid];
     else    
       tem_orders[i].likeUserList.push(openid);
     tem_orders[i].likeCount=tem_orders[i].likeCount+1;
     console.log( tem_orders[i].userLikeList)
   }
   else{
     tem_user[0].likeList.pop(id);
     tem_orders[i].likeCount-=1;
     tem_orders[i].likeUserList.pop(openid);
   }
 
   var orderObj = AV.Object.extend('orders');
   var order = orderObj.createWithoutData('orders',orderid);
  
   order.set("likeCount",tem_orders[i].likeCount);
   order.set("likeUserList",tem_orders[i].likeUserList);
   order.save();
   
   var userObj = AV.Object.extend('user');
   var user = orderObj.createWithoutData('user',userid)
   user.set("likeList", tem_user[0]["likeList"]);
   user.save().then(function () {
     // 成功保存之后，执行其他逻辑.
     if (getCurrentPages().length != 0) {
       //刷新当前页面的数据
       getCurrentPages()[getCurrentPages().length - 1].onLoad()}
     //wx.navigateBack();
   }, function (error) {
     // 异常处理
     console.log(error);
   });

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

  }
})