// pages/discount-detail/disocunt-detail.js
var app = getApp();
const AV = require('../../libs/av-weapp.js');
var discountFormat = require('../../utils/discountFormat.js');
var util = require('../../utils/util.js');


Page({
  data:{
    discount: [],
 
  },
  onLoad:function(options){
  
       // 页面初始化 options为页面跳转所带来的参数
       // 查询单个对象
     new AV.Query('Discount')
     .get(options.id)
     .then(discount=>{
      discount = discountFormat.discountFormat(discount);
       this.setData({
        discount: discount
      });
    }, error => console.log(error));
    
 },
 onShow:function(){

       // 页面初始化 options为页面跳转所带来的参数
       // 查询单个对象
       new AV.Query('Discount')
       .get(options.id)
       .then(discount=>{
        discount = discountFormat.discountFormat(discount);
         this.setData({
          discount: discount
        });
      }, error => console.log(error));

 },
 previewImg:function(e){
        
       var current = e.target.dataset.src;
       var index = e.currentTarget.dataset.index;
       var listarray = this.data.discount.imgsrc;
       console.log(current);
       wx.previewImage({
         current:listarray[index],
         urls:this.data.discount.imgsrc
       })
 },
  onReady(){
 
  },
  onShareAppMessage: function (res) {
    return {
      title: "我发现了一个拼单优惠，快来看看吧！" ,
      path: '/pages/discount-detail/disocunt-detail?id=' + this.data.discount.id, 
    }
  },
 


})