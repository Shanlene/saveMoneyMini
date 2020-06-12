// pages/kindquery/kindquery.js
//获取应用实例
var app = getApp();
//查询用户信息
const AV = require('../../libs/av-weapp.js');
var orderFormat = require('../../utils/orderFormat.js');

function orderRefresh(e, that) {
//查询多个数据，即首页数据列表查询
  // 显示正在加载中
  wx.showLoading({
    title: '正在加载中...',
    mask: true,
  })
  // console.log(e.target.dataset.id)
  var orders = new AV.Query('orders');
  orders.equalTo('mallKinds', that.data.kindid)
    if(e.hasOwnProperty('user')){
      orders.equalTo('author.nickName', e.user);
      that.setData({
        manage: {
          user:e.user,
          display:false
          }
      });
    }
    orders.descending('createdAt').find().then(function (results) {
      results = results.map((curvalue) => {
        return orderFormat.orderFormat(curvalue);
      });
      that.setData({
        orders: results
      });
      // console.log(that.data.orders)
      // for (var item in that.data.orders){
      //   console.log(that.data.orders[item])
      // }
      wx.hideLoading( )
    }, function (error) {
      
    });
}
//  查询搜索的订单
function orderSearch (e, that, inputVal) {
    wx.showLoading({
      title: '正在加载中...',
      mask: true,
    })
  //查询多个数据，即首页数据列表查询
    var orders_title = new AV.Query('orders');
    var orders_desc = new AV.Query('orders');
    var orders_content = new AV.Query('orders');
    var orders_kind = new AV.Query('orders');

    // 大小写不敏感查询
    var RegExp_str = new RegExp(inputVal, 'i'); 
    orders_title.matches('title', RegExp_str);
    orders_desc.matches('description', RegExp_str)
    orders_content.matches('content', RegExp_str)
    // 混合条件查询
    orders_kind.equalTo('mallKinds', that.data.kindid)

    var orders_or = AV.Query.or(orders_title, orders_desc, orders_content);
    var orders = AV.Query.and(orders_or, orders_kind)

    // console.log(orders)
      if(e.hasOwnProperty('user')){
        orders.equalTo('author.nickName', e.user);
        that.setData({
          manage: {
            user:e.user,
            display:false
            }
        });
      }
      orders.descending('createdAt').find().then(function (results) {
        results = results.map((curvalue) => {
          return orderFormat.orderFormat(curvalue);
        });
        that.setData({
          orders: results
        });
        console.log(that.data.orders)
        // for (var item in that.data.orders){
        //   console.log(that.data.orders[item])
        // }
        wx.hideLoading( )
      }, function (error) {
        
      });
  }

Page({
  data: {
    userInfo: {},
    orders: [],
    manage:{},
    QRCodeShow: '',
    QRCodeShowFlag: false,
    inputShowed: false,
    inputVal: "" ,
    kindid: "",
    title: ""
  },
  //事件处理函数
  navToPost: function() {
    wx.navigateTo({
      url: '../post/post'
    });
  },
  onLoad: function (e) {
    console.log(e)
    var that = this
    // 存入选项值
    that.setData({
      kindid : e.kindid,
      title : e.title
    })
    // 设置标题
    wx.setNavigationBarTitle({
      title: that.data.title,
    })
    console.log(that.data.kindid)
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      });
    });
    orderRefresh(e, that);
    // orderSearch(e,that);
  },
  onShow: function(){
    // orderRefresh({}, this);
  },
  navToDetail: function(event) {
    var objId = event.currentTarget.dataset.id;
    console.log(objId)
    wx.navigateTo({

      url: '../detail/detail?objId=' + objId 
    });
  },
  manageOrder:function(e){
    var that =this
    that.data.manage.display = !that.data.manage.display;
    that.data.manage.orderId = e.currentTarget.id;
    if(that.data.manage.display){
      that.data.manage.do = ['删除','分享']
    }else{
      delete that.data.manage.do
    }   
    that.setData({
      manage:that.data.manage
    });
  },
  deleteOrder:function(e){
  // var order = AV.Object.createWithoutData('orders', e.id)
  // order.destroy().then(function (success) {
  //   cossole.log(success)
  //   // 删除成功
  // }, function (error) {
  //   cossole.log(error)
  //   // 删除失败
  // });
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
  chooseCircle: function(){
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28
        });
      },
      fail: function(e) {
        console.log(e);
      }
    });
    
  },
  showInput: function () {
    this.setData({
        inputShowed: true
    });
},
hideInput: function () {
    this.setData({
        inputVal: "",
        inputShowed: false
    });
    // 点击取消重新刷新
    orderRefresh({},  this);
},
clearInput: function () {
    this.setData({
        inputVal: ""
    });
    // 点击清空重新刷新
    orderRefresh({},  this);
},
inputTyping: function (e) {
  console.log(e.detail.value)
    this.setData({
        inputVal: e.detail.value
        

    });
    // orderSearch(e,this,this.data.inputVal);
},
searchConfirm: function(e){
 
  this.setData({
      inputVal: e.detail.value

  });
  orderSearch(e,this,this.data.inputVal);
  // console.log(this.data.orders)

},
tapnavigator: function(e){
  console.log(e)
}
  
})
