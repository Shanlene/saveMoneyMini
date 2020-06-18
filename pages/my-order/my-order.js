//index.js
//获取应用实例
var app = getApp();
//查询用户信息
const AV = require('../../libs/av-weapp.js');
var orderFormat = require('../../utils/orderFormat.js');
var util = require('../../utils/util.js');
const getDataForRender = orders =>({
  author: orders.get('author'),
  id : orders.id,
  title:orders.get('title'),
  content:orders.get('content'),
  url : orders.get('url'),
  pictures : orders.get('pictures'),
  comments : orders.get('comments'),
  description : orders.get('description'),
  updatedAt : orders.updatedAt,
  createdAt : orders.createdAt,
  formatDate : util.formatTime(orders.updatedAt),
  QRCode : orders.get('QRCode')
})
 

Page({
  data: {
    userInfo: {},
    orders: [],
    manage:{},
    QRCodeShow: '',
    QRCodeShowFlag: false
  },
 
  onLoad: function (e) {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      });
    });
    const openid = wx.getStorageSync('openid');
    new AV.Query('orders')
    .equalTo('openid',openid).descending('createdAt')
    .find()
    .then(orders=>this.setData({
      orders: orders.map(getDataForRender)
    }))
    .catch(console.error)
  },

  onReady(){
    
},
// 下拉刷新
onPullDownRefresh: function(){
  //显示标题栏刷新图标
  // wx.showNavigationBarLoading();
  orderRefresh({},  this);
  wx.stopPullDownRefresh()

},
navToDetail: function(event) {
  var objId = event.currentTarget.dataset.id;
  wx.navigateTo({
    url: '../detail/detail?objId=' + objId 
  });
},
navToEdit: function(event) {
  var objId = event.currentTarget.dataset.id;
  console.log(objId)
  wx.navigateTo({
    url: '../Edit/Edit?objId=' + objId 
  });
},
navToDelete: function(event) {
  var objId = event.currentTarget.dataset.id;
  wx.showModal({
   title:'提示',
   content:'确认要删除该拼单？',
   success:function(res){
      if(res.confirm){
        console.log('用户点击确定')
        var orderObj = AV.Object.extend('orders');
        var order = orderObj.createWithoutData('orders',  objId);
        order.destroy();
        wx.navigateTo({
          url: '../my-order/my-order'
      })
       wx.showToast({
         title: '删除成功！',
       })
      }
   }
  })

},
onShow()
{
  this.onLoad();
},
// 下拉刷新

onPullDownRefresh: function(){
  //显示标题栏刷新图标
  // wx.showNavigationBarLoading();
  orderRefresh({},  this);
  wx.stopPullDownRefresh()

}

})
