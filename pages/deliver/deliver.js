Page({

  data: {
    order: {},
    carts: {},
    oldBottle:{},
    newBottle: {},
    loading: false,
    getBottle: false,
    delivered:false
  },
  // 页面初始化
  onLoad: function (options) {
    // options为页面跳转所带来的参数
    var that = this;
    var order = JSON.parse(options.order);
    var carts = JSON.parse(order.type);
    console.log(carts);
    that.setData({
      order: order,
      carts: carts,
      loading: true,
    })
  },
  // 页面初次渲染完成（每次打开页面都会调用一次）
  onReady: function () {
    console.log(this.data.order.location);
    wx.setNavigationBarTitle({
      title: this.data.order.location
    })
  },
  // 展开介绍
  showDesc: function () {
    this.setData({
      desc: true
    })
  },
  // 关闭介绍
  hideDesc: function () {
    this.setData({
      desc: false
    })
  },
  // 打开相册
  showAlbum(e) {
    wx.navigateTo({
      url: '../album/album?title=navigate&id=' + this.data.orderDetail.id + '&pid=' + e.target.dataset.index + ''
    })
  },
  // 抢单
  getOrders: function () {
    wx.navigateTo({
      url: '../deliver/deliver?order=' + JSON.stringify(this.data.order),
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  scanOldId:function() {
    var that = this;
    wx.scanCode({
      success: (res) => {
        console.log(res);
        try {
        that.setData({
          oldBottle:JSON.parse(res.result),
        })
        }
        catch(e)
        {
          wx.showModal({
            title: '提示：',
            content: '错误钢瓶码',
            showCancel: false,
            confirmColor: '#ff4d64'
          })
        }
      }
    })
  },
  scanNewId: function () {
    var that = this;
    wx.scanCode({
      success: (res) => {
        console.log(res);
        try {
          that.setData({
            newBottle: JSON.parse(res.result),
          })
        }
        catch (e) {
          wx.showModal({
            title: '提示：',
            content: '错误钢瓶码',
            showCancel: false,
            confirmColor: '#ff4d64'
          })
        }
      }
    })
  },

  getBottleFunc:function(){
    //TODO 发送确认请求
    this.setData({
      getBottle: true,
    })
  },
  deliveredFunc: function () {
    //TODO 发送确认请求
    this.setData({
      delivered: true,
    })
  },
  

})