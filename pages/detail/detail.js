Page({
  data: {
    order: {},
    carts:{},
    loading: false,
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
  onReady: function(){
    console.log(this.data.order.location);
    wx.setNavigationBarTitle({
      title: this.data.order.location
    })
  },

  // 抢单
  getOrders: function() {
    wx.navigateTo({
      url: '../deliver/deliver?order=' + JSON.stringify(this.data.order),
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
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