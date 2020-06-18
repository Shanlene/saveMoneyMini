// pages/kindquery/kindquery.js
//获取应用实例
var app = getApp();
//查询用户信息
const AV = require('../../libs/av-weapp.js');
var orderFormat = require('../../utils/orderFormat.js');
var userFormat = require('../../utils/userFormat.js');
 
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
  var user = new AV.Query('user');
  let tem_orders;

    orders.descending('createdAt').find().then(function (results) {
      results = results.map((curvalue) => {
        return orderFormat.orderFormat(curvalue);
      });
 
      that.setData({
        orders: results
      });
      tem_orders = that.data.orders;
   
      const openid = wx.getStorageSync('openid');
      user.descending('createdAt').equalTo('openid',openid).find().then(function (results) {
        results = results.map((curvalue) => {
          return userFormat.userFormat(curvalue);
        });
        that.setData({
          user: results
        });
        
       
      let islike = false;
     
      for(var i=0;i<tem_orders.length;i++)
      {
         
        if(that.data.user[0].likeList.indexOf(tem_orders[i]._id)!=-1)
        {
            islike = true;
        }   
        else
            islike=false;
        tem_orders[i]["like"]=islike;
      }
      that.setData({
        orders:tem_orders
      })
      
    }, function (error) {
      console.log(error)
      wx.showToast({
        title: 'orderRefresh 出错',
      })
    });
    
      // }
      // 进行本地缓存存储
      wx.setStorageSync('likeOrderList', that.data.userLikeList)
      wx.hideLoading( )
    }, function (error) {
      console.log(error)
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
    var orders_kind = new AV.Query('orders');
    var RegExp_str = new RegExp(inputVal, 'i'); 
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
        wx.showToast({
          title: 'orderRefresh 出错',
        })
      });
  }

Page({
  data: {
    userInfo: {},
    orders: [],
    user:[],
    manage:{},
    QRCodeShow: '',
    QRCodeShowFlag: false,
    inputShowed: false,
    inputVal: "" ,
    likeStatus: false,
    userLikeList : [],
    tem_order:[],
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
    var that = this
    if(that.data.kindid == ""){
        // 存入选项值
        that.setData({
          kindid : e.kindid,
          title : e.title
        })
      // 设置标题
      wx.setNavigationBarTitle({
        title: that.data.title,
      })

    }
   

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
},
// 下拉刷新

onPullDownRefresh: function(){
  //显示标题栏刷新图标
  // wx.showNavigationBarLoading();
  orderRefresh({},  this);
  wx.stopPullDownRefresh()

},
previewImage: function(e) {
  var current = e.target.dataset.src;
  console.log(current)
  wx.previewImage({
    current:current,
    urls: [current]
  })
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

}

  
})
