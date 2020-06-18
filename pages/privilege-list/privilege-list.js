var app = getApp();
const AV = require('../../libs/av-weapp.js');
var discountFormat = require('../../utils/discountFormat.js');
var util = require('../../utils/util.js');
const getDataForRender = discount =>({
  id: discount.get('objectId'),
  userid:discount.get('userid'),
  blog: discount.get('blog'),
  date: util.formatTime(discount.get('createdAt')),
  imgsrc:discount.get('imgSrc'),
  href: discount.get('href')
})

Page({
  data:{
    discounts:[],
    name:'world'
  },

  onReady(options){
    new AV.Query('Discount')
    .descending('createdAt')
    .find()
    .then(discounts=>this.setData({
      discounts: discounts.map(getDataForRender)
    }))
    .catch(console.error)
  },
  onLoad:function(){
   
  },
  // 下拉刷新
onPullDownRefresh: function(){
  //显示标题栏刷新图标
  // wx.showNavigationBarLoading();
  this.onReady()
  wx.stopPullDownRefresh()

}

 
 

})