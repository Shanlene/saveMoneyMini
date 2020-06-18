// pages/detail/detail.js
//获取应用实例
var app = getApp();

var warnImg = '/icons/warning.png';
//查询用户信息
const AV = require('../../libs/av-weapp.js');
var app = getApp();
var orderFormat = require('../../utils/orderFormat.js');
var util = require('../../utils/util.js');
var pic = [];



Page({
  data:{
      order:[],
      pictures: [],
      QRCode: '',
      author: {},
      title: '',
      content: '',
      description: '',
      activityURL: '',
      objId: '',
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
      index: '0',
      contentCheck: '',
      // ImageCheck:[]
  },
  onLoad:function(options){
    this.data.objId=options.objId
    new AV.Query('orders')
    .get(options.objId)
    .then(order=>{
      order = orderFormat.orderFormat(order);
      this.setData({
        order: order,
        QRCode:order.QRCode,
        title:order.title,
        content:order.content,
        pictures:order.pictures,
        author:order.author,
        description:order.description,
        activityURL:order.activityURL
     });
     pic = this.data.pictures ;
     console.log(pic)
   }, error => console.log(error));

   console.log(this.data.pictures)
 
 


    new app.WeToast();
    // 页面初始化 options为页面跳转所带来的参数
    this.data.pictures = [];
    pic = []
    
    console.log(pic)
    
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.data.author = userInfo;
      that.data.discountId = options.disId;
      
      if (options.id){
        
        let detail = {};
        let discount = new AV.Query('Discount');   
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
    // this.setData({
    //   pictures : [],
    //   QRCode : ''
    // })
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
  deleteQRCode: function (e) {
    var that = this;
    var images = that.data.QRCode;
    var index = e.currentTarget.dataset.index;//获取当前长按图片下标
    wx.showModal({
     title: '提示',
     content: '确定要删除此图片吗？',
     success: function (res) {
      if (res.confirm) {
       console.log('点击确定了');
 
       images='';
       that.setData({
        QRCode: images
    });
      } else if (res.cancel) {
        console.log('点击取消了');
        return false;    
       }
      that.setData({
       images
      });
     }
    })
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
                            console.log(image.attributes.url)

                            console.log("choseImge")
                            console.log(that.data.pictures)
                            console.log(pic)
                            pic.push(file.url());
                            that.setData({
                                pictures: pic
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
  deleteImage: function (e) {
    var that = this;
    var images = that.data.pictures;
    var index = e.currentTarget.dataset.index;//获取当前长按图片下标
    wx.showModal({
     title: '提示',
     content: '确定要删除此图片吗？',
     success: function (res) {
      if (res.confirm) {
       console.log('点击确定了');
 
       images.splice(index, 1);
       that.setData({
        pictures: images
    });
    pic = images;
    
    console.log(pic)
      } else if (res.cancel) {
        console.log('点击取消了');
        return false;    
       }
      that.setData({
       images
      });
     }
    })
   },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    
    this.setData({
      index: e.detail.value
    })
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
        wx.showLoading({
          title: '正在发布中...',
        })
        
        let contentCheck = this.data.title + this.data.content + this.data.description + this.data.activityURL ;
        var ImageCheck = [] ;
        // ImageCheck.push(this.data.pictures);
        for(let i in this.data.pictures){
          ImageCheck.push(this.data.pictures[i]) ;
        }
        ImageCheck.push(this.data.QRCode);
        console.log("检查内容")
        console.log(this.data.pictures)

        //  调用ContentCheck函数检查文字是否违规
        console.log(this.data.contentCheck)
        console.log("ImageCheck:" + ImageCheck)
        console.log(ImageCheck.length)
        console.log(typeof ImageCheck[0])

        
               //  调用ContentCheck函数检查文字是否违规
       wx.serviceMarket.invokeService({
          service: 'wxee446d7507c68b11',
          api: 'msgSecCheck',
          data: {
            "Action": "TextApproval",
            "Text": contentCheck
          },
        }).then(res => {
          // console.log(JSON.stringify(res.data.Response))
          if(JSON.stringify(res.data.Response.EvilTokens) != '[]') {
            var islegal = JSON.stringify(res.data.Response.EvilTokens[0].EvilFlag) ;
            if (islegal != 0){
              wx.hideLoading()
              wx.showModal({
                title: '待发布文字中包含违规内容，请确认后重试~'
              })
              
              return false ;
            }
          }else{
              
              
        // content = "特3456书yuuo莞6543李zxcz蒜7782法fgnv级";
            let isImageLegal = true
            let legalList = []
            for(let item in ImageCheck ){
              console.log(item)
              console.log(ImageCheck[item])
                // 调用图片检查图片是否合法
                let pro = new Promise((resolve) => {wx.serviceMarket.invokeService({
                  service: 'wxee446d7507c68b11',
                  api: 'imgSecCheck',
                  data: {
                    "Action": "ImageModeration",
                    "Scenes": ["PORN", "TERRORISM"],
                    "ImageUrl": ImageCheck[item],
                  },
                }).then(res => { 
                  console.log("检测图片")
                  // console.log(JSON.stringify(res))
                  var isPorn = res.data.Response.PornResult.Suggestion;
                  // var isText = res.data.Response.TextResult.Suggestion;
                  var isTerror = res.data.Response.TerrorismResult.Suggestion;
                  console.log(isPorn, isTerror);
                  if ( isPorn == "BLOCK" || isTerror == "BLOCK"  ){
                    isImageLegal = false;
                }
                resolve(isImageLegal)
              })
            })
              legalList.push(pro)
            }      
	    // 显示判断结果
            Promise.all(legalList).then((res)=>{
              console.log(res)
              for (let i in res){
                if(res[i] == false){
                  wx.hideLoading()
                  wx.showModal({
                  title: '待发布图片中包含违规内容，请确认后重试~',
                })
                // this.setData({
                //   pictures : [],
                //   QRCode : ''
                // })
                  return false
                }
                // 如果到了最后一次还没有返回
                console.log(i, res.length)
          if(i == res.length-1){
              // 检查通过 可以上传
            console.log("检查通过可以上传")
          var orderObj = AV.Object.extend('orders');
          var order = orderObj.createWithoutData('orders',this.data.objId)
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
            wx.hideLoading()
	          wx.navigateBack();
          }, function (error) {
            // 异常处理
            console.log(error);
          });
		      wx.hideLoading()
      }
      }


            })


          }

        })
        }
        
  
 
      }
  

})
 