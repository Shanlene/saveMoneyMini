// pages/detail/detail.js
//获取应用实例
var app = getApp();
//查询用户信息
const AV = require('../../libs/av-weapp.js');
var orderFormat = require('../../utils/orderFormat.js'),
  util = require('../../utils/util.js');
Page({
  data:{
    url: "http://wx.qlogo.cn/mmhead/kpUbvkMbNAdpQbvZBgncDWcRg7m4Dfkvy1cpIVNhdt8/132",
    scrollX: true,
    scrollY: true,
    userInfo: {},
    order: {},
    comments: [],
    commentObj: {},
    QRCodeShowFlag: false,
    QRCodeShow: '',
    array: ['食品', '洗护', '美妆', '服饰','书籍', '百货','凑单','其他']
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      });
      // 查询单个对象
    var orders = new AV.Query('orders');
    wx.showLoading({
      title: '正在加载中...',
      mask: true,
    })
    orders.get(options.objId).then(order => {
      order = orderFormat.orderFormat(order);
      that.setData({
        order: order
      });
      if( that.data.order.comments && that.data.order.comments.length > 0) {
        that.data.comments = that.data.order.comments;
      }
      wx.hideLoading( )
    }, error => console.log(error));
    });
  },
  previewImg:function(e){
        
    var current = e.target.dataset.src;
    var index = e.currentTarget.dataset.index;
    var listarray = this.data.order.pictures;
    console.log(current);
    wx.previewImage({
      current:listarray[index],
      urls:this.data.order.pictures
    })
},
previewQRCode: function(e) {
  var current = e.target.dataset.src;
  console.log(current)
  wx.previewImage({
    current:current,
    urls: [current]
  })
},
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  commentInput: function(e){
    this.data.commentObj.author = this.data.userInfo;
    this.data.commentObj.commentStr = e.detail.value;
    this.data.commentObj.createAt = new Date();
    this.data.commentObj.formatDate = util.formatTime(this.data.commentObj.createAt);
  },
  commentSubmit: function(e) {
    if(!this.data.commentObj.commentStr || this.data.commentObj.commentStr === ''){
      wx.showToast({
        title: '当前评论为空哦~',
        icon: "none",
        duration: 1500
      });
      return false;
    }
    // 在集合开头添加一个或更多元素
    this.data.comments.unshift(this.data.commentObj);

    var order = AV.Object.createWithoutData('orders', this.data.order.id);
    console.log("当前的订单id"+ this.data.order.id);
    console.log("当前的data:  " + this.data);
    console.log("当前的评论列表" + this.data.comments);
    order.set('comments', this.data.comments);
    order.save().then(order => {
      wx.redirectTo({
        url: './detail?objId=' + this.data.order.id 
      });
    }, (error) => {
      console.log(error)
        throw error;
    });
  },
  showQRCode: function(e) {
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
  onShareAppMessage: function (res) {
    return {
      title: "我发现了一个不错的拼单，来看看吧！" ,
      path: '/pages/detail/detail?objId=' + this.data.order.id, 
      // imageUrl: './icons/welcome.png'//这个是分享的图片
    }
  },
})