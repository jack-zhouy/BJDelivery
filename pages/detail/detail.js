Page({
  data: {
    order: {},
    carts: {},
    loading: false,
    showGrab: false
  },
  // 页面初始化
  onLoad: function (options) {
    // options为页面跳转所带来的参数
    var that = this;
    var order = JSON.parse(options.order);
    var carts = JSON.parse(order.type);
    var model = options.model;
    //还没有抢的订单，需要显示抢单按钮
    if (model=='public'){
      that.setData({
        showGrab:true,
      })
    }
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
  // 抢单
  getOrder: function () {
    var orderIndex = this.data.order.id;
    wx.showModal({
      title: '订单号：' + orderIndex,
      content: '确认抢单？',
      showCancel: true,
      confirmColor: '#ff4d64',

      success: (res) => {
        if (res.confirm) {
          console.log("抢单成功！");
          wx.switchTab({
            url: '../orders/orders',
          })
        }
      },
      fail: (res) => {
      }
    })
  },
  showMap: function (e) {
    var address = e.currentTarget.dataset.address;
    var that = this;
    that.getLocation(address);
  },
  //逆向地址解析
  getLocation: function (address) {
    var that = this;
    wx.request({
      url: 'https://restapi.amap.com/v3/geocode/geo?key=a44d27e0bf7b64770dad4664e3ba92b1&address=' + address,
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // success
        var strLocation = res.data.geocodes[0].location;
        var searchedAddress = res.data.geocodes[0].formatted_address;
        var location = {};
        location.lng = parseFloat(strLocation.split(',')[0]);
        location.lat = parseFloat(strLocation.split(',')[1]);

        wx.openLocation({
          address: searchedAddress,
          latitude: location.lat,
          longitude: location.lng,
          scale: 15
        })
      },
      fail: function () {
        console.log("逆向地址解析错误");
        // fail 
      },
      complete: function () {
        // complete 
      }
    })
  }
})