// pages/detail/detail.js
//获取应用实例
var app = getApp();

var warnImg = '/icons/warning.png';
//查询用户信息
const AV = require('../../libs/av-weapp.js');
var pictures = [];
Page({
  data:{
      pictures: [],
      QRCode: '',
      author: {},
      title: '',
      content: '',
      description: '',
      activityURL: '',
      discountId: '',
      array: ['食品', '洗护', '美妆', '服饰','书籍', '百货','凑单','其他'],
      objectArray: [
        {
          id: 0,
          name: '食品'
        },
        {
          id: 1,
          name: '洗护'
        },
        {
          id: 2,
          name: '美妆'
        },
        {
          id: 3,
          name: '服饰'
        },
        {
          id: 4,
          name: '书籍'
        },
        {
          id: 5,
          name: '百货'
        },
        {
          id: 6,
          name: '鞋靴'
        },
        {
          id: 7,
          name: '其他'
        }
      ],
      index: '0'
  },
  onLoad:function(options){
    new app.WeToast();
    

    // 页面初始化 options为页面跳转所带来的参数
    this.data.pictures = [];
    pictures = [];//防止缓存影响
    
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.data.author = userInfo;
      that.data.discountId = options.disId;
      
      if (options.disId){
        
        let detail = {};
        let discount = new AV.Query('discount');   
        discount.equalTo('objectId', that.data.discountId);
        discount.find().then(function (results) {
            
            detail.content = results[0].attributes.content;
            detail.disForm = results[0].attributes.disForm;
            // detail.img = results[0].attributes.background_url;
            pictures.push(results[0].get('background_url'));
            
            that.data.title = detail.content.summary;
            that.data.content = detail.content.detail.join('');
            that.data.description = detail.disForm;
            // that.data.contentpictures = [detail.img];
            that.setData({
                discount: detail,
                pictures: pictures
            });
            
        });
      }
    });
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
  titleEventFunc: function(e) {
      
      if(e.detail && e.detail.value) {
          this.data.title = e.detail.value;
      }
  },
  contentEventFunc: function(e) {
      if(e.detail && e.detail.value) {
          this.data.content = e.detail.value;
      }
  },
  descriptionEventFunc: function(e) {
      if(e.detail && e.detail.value) {
          this.data.description = e.detail.value;
      }
  },
  activityUrlEventFunc: function(e) {
      if(e.detail && e.detail.value) {
          this.data.activityURL = e.detail.value;
      }
  },
  formSubmit: function(e) {
      if(this.data.title === '') {
        
            wx.showToast({
              title: '标题不能为空',
              image: warnImg,
              titleClassName: 'my_wetoast_title'
            })
          return false;
      }else if(this.data.content === ''){
        wx.showToast({
            title: '内容不能为空',
            image: warnImg,
            
          })
          return false;
      }else if(this.data.QRCode === ''){
          wx.showToast({
            title: '请添加群二维码',
            image: warnImg,
            titleClassName: 'my_wetoast_title'
          })
          return false;
      }else {

          var orderObj = AV.Object.extend('orders'),
            order = new orderObj();
          const openid = wx.getStorageSync('openid')
          order.set('title', this.data.title);
          order.set('content', this.data.content);
          order.set('description', this.data.description);
          order.set('url', this.data.activityURL);
          order.set('author', this.data.author);
          order.set('pictures', this.data.pictures);
          order.set('discountId', this.data.discountId);
          order.set('QRCode', this.data.QRCode);
          order.set('mallKinds', this.data.index);
          order.set('openid', openid)

          order.save().then(function (order) {
            // 成功保存之后，执行其他逻辑.
            // wx.navigateTo({
            //     url: '../index/index'
            // })
            wx.navigateBack();
          }, function (error) {
            // 异常处理
            console.log(error);
          });
      }
  },  
  chooseQRCode: function() {
      //上传图片相关
      var that = this;
      wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              let tempFilePaths = res.tempFilePaths;
              tempFilePaths.forEach(function(url, index){
                //   pictures.push(url);
                //   that.setData({
                //       pictures: pictures
                //   });
                let strRegex = "(.jpg|.png|.gif|.jpeg)$"; //用于验证图片扩展名的正则表达式
                let re=new RegExp(strRegex);
                if (re.test(url.toLowerCase())){
                    let name = '' + index + '.' + url.split('.')[url.split('.').length - 1],
                        localFile = url,
                        image = new AV.File(name, {
                            blob: {  
                                uri: localFile,  
                            }
                        });
                        image.save().then(function(file) {
                            // 文件保存成功
                            
                            that.setData({
                                QRCode: file.url()
                            });
                            
                        }, function(error) {
                            // 异常处理
                            console.error(error);
                        }); 
                }else {
                    throw "选择的不是图片";
                }
               
              });
          }
      });
  },  
  chooseImage: function() {
      //上传图片相关
      var that = this;
      wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              let tempFilePaths = res.tempFilePaths;
              
              tempFilePaths.forEach(function(url, index){
                //   pictures.push(url);
                //   that.setData({
                //       pictures: pictures
                //   });
                let strRegex = "(.jpg|.png|.gif|.jpeg)$"; //用于验证图片扩展名的正则表达式
                let re=new RegExp(strRegex);
                if (re.test(url.toLowerCase())){
                    let name = '' + index + '.' + url.split('.')[url.split('.').length - 1],
                        localFile = url,
                        image = new AV.File(name, {
                            blob: {  
                                uri: localFile,  
                            }
                        });
                        image.save().then(function(file) {
                            // 文件保存成功
                            
                            pictures.push(file.url());
                            that.setData({
                                pictures: pictures
                            });
                        }, function(error) {
                            // 异常处理
                            console.error(error);
                        }); 
                }else {
                    throw "选择的不是图片";
                }
               
              });
          }
      });
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    
    this.setData({
      index: e.detail.value
    })
  }
})