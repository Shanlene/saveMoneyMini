//index.js
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
  var orders = new AV.Query('orders');
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
      // console.log(that.data.orders)
      // for (var item in that.data.orders){
      //   console.log(that.data.orders[item])
      // }
      wx.hideLoading( )
    }, function (error) {
      wx.showToast({
        title: 'orderRefresh 出错',
      })
    });
}
//  查询搜索的订单
function orderSearch (e, that, inputVal) {

  // 显示正在加载中
  wx.showLoading({
    title: '正在加载中...',
    mask: true,
  })
  //查询多个数据，即首页数据列表查询
    var orders_title = new AV.Query('orders');
    var orders_desc = new AV.Query('orders');
    var orders_content = new AV.Query('orders');
    var RegExp_str = new RegExp(inputVal, 'i'); 
    // 大小写不敏感查询
    orders_title.matches('title', RegExp_str);
    orders_desc.matches('description', RegExp_str)
    orders_content.matches('content', RegExp_str)

    var orders = AV.Query.or(orders_title, orders_desc, orders_content);

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
        wx.showToast({
          title: 'orderRefresh 出错',
        })
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

    // 导航栏
    categoryList: {
      pageone: [{
          id: 0 ,
          name: "食品",
          src: "/icons/category/foods.png",
          url: "/pages/kindquery/kindquery"
      }, {
          id: 1 ,
          name: "洗护",
          src: "/icons/category/washcare.png",
          url: "/pages/kindquery/kindquery"
      }, {
          id: 2 ,
          name: "美妆",
          src: "/icons/category/beauty.png",
          url: "/pages/kindquery/kindquery"
      }, {
          id: 3 ,
          name: "服饰",
          src: "/icons/category/clusters.png",
          url: "/pages/kindquery/kindquery"
      }, {
          id: 4 ,
          name: "书籍",
          src: "/icons/category/books.png",
          url: "/pages/kindquery/kindquery"
      }, {
          id: 5 ,
          name: "百货",
          src: "/icons/category/goods.png",
          url: "/pages/kindquery/kindquery"
      }, {
          id: 6 ,
          name: "鞋靴",
          src: "/icons/category/shoes.png",
          url: "/pages/kindquery/kindquery"
      }, {
          id: 7 ,
          name: "其他",
          src: "/icons/category/other.png",
          url: "/pages/kindquery/kindquery"
      }]
      }
  },
  //事件处理函数
  navToPost: function() {
    wx.navigateTo({
      url: '../post/post'
    });
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
    orderRefresh(e, that);
    // orderSearch(e,that);
  },
  onShow: function(){
    orderRefresh({}, this);
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
},
// 下拉刷新

onPullDownRefresh: function(){
  //显示标题栏刷新图标
  // wx.showNavigationBarLoading();
  orderRefresh({},  this);
  wx.stopPullDownRefresh()

}
  
})
