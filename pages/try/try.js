Page({
  // mixins: [require('../../mixin/themeChanged')],
  data: {
      inputShowed: false,
      inputVal: "",

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
    }],
    },
    imgArr:[
        'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
        'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
        'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
        'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg'
    ]
    



  },

  onLoad: function(e){
        console.log(e)
  },
  tapnavigator: function(e){
    console.log(e)
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
  },
  clearInput: function () {
      this.setData({
          inputVal: ""
      });
  },
  inputTyping: function (e) {
    console.log(e.detail.value)
      this.setData({
          inputVal: e.detail.value
          

      });
  },
  previewImg:function(e){
    console.log(e)
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.imgArr;
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }

});