var timer;
var that;
Page({
  //数据源
  data: {
    //全部订单
    ordersList: [],
    location : {},
    latitude:"",
    longitude:"",
    loading: false,
    //loading: true,
    limit: 6,
    windowHeight: 0,
    scrollTop: 100,
    //navigationBarTitle:"待抢订单",
    model:"neededToBeDealed",
    // deliveryAddress:"",
    // deliveryAddressDetail:"",


  },
  onPullDownRefresh:function(){
    wx.showNavigationBarLoading() //在标题栏中显示加载

    this.upload_requestOrder();
    //模拟加载
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  // 页面初始化
  onLoad: function (options) {
    var that = this;
    //this.upload_requestOrder();
  },  


  // 页面显示（一个页面只会调用一次）
  onShow:function(){
    var app = getApp();
    //如果没有登录就跳转到登录页面
    // if (!app.globalData.loginState) {
    //   wx.navigateTo({
    //     url: '../index/index',
    //   })
    // } else{
    //   this.requestData();
    // }
    // if ((!app.globalData.loginState) && (app.globalData.userId == null)) {
    //   wx.navigateTo({
    //     url: '../login/login',
    //   })
    // } else {
    //   wx.navigateTo({
    //     url: '../index/index',
    //   })
    // }
    var that = this;
    this.upload_requestOrder();
  },
  // 页面初次渲染完成（每次打开页面都会调用一次）
  onReady:function(){ 
  },
  // 页面隐藏（当navigateTo或底部tab切换时调用）
  onHide:function(){   
  },
  // 页面关闭（当redirectTo或navigateBack的时候调用）
  onUnload:function(){   
  },
  
  //上传配送工位置信息，成功后请求可抢订单
  upload_requestOrder:function(){
    var that = this;

    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          longitude: longitude,
          latitude: latitude
        });
      }
    })
    //that.data.navigationBarTitle = "待抢订单";
    this.uploadLocation();
    setInterval(that.uploadLocation, 5000);

    // wx.setNavigationBarTitle({
    //   title: that.data.navigationBarTitle
    // })
  },


  //获取配送员位置信息
  uploadLocation: function () {
    var that=this;
    var app = getApp();
    var location = {};
    location.longitude = that.data.longitude;
    location.latitude = that.data.latitude;
    location = JSON.stringify(location);
    //console.log(location);
    wx.request({
      url: getApp().GlobalConfig.baseUrl + "/api/sysusers/position" + "?userId=" + app.globalData.userId,
      data: location,
      method: 'POST',
      success: function (res) {
        that.requestData();
        // 数据从逻辑层发送到视图层，同时改变对应的 this.data 的值
        if (res.statusCode != 200) {
          //存储用户信息 
          console.error("位置信息上传错误");
        }
      }
    })
  },

  //获取所有可以抢的订单
  requestData: function () {
    var that = this;
    var app = getApp();
    //console.log("后台查询可抢的任务单");
    wx.request({
      url: getApp().GlobalConfig.baseUrl + "/api/TaskOrders" + "/" + app.globalData.userId + "?",
      data: {
        orderStatus: 0
      },
      method: 'GET',
      success: function (res) {
        // 数据从逻辑层发送到视图层，同时改变对应的 this.data 的值
        //console.log(res.data);
        that.setData({
          ordersList: res.data.items,
          loading: true
        })
        //console.log("ordersList:");
       // console.log(that.data.ordersList);
      },
      fail: function () {
        console.error("failed");
      }
    })

    // 获取系统信息
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    })
  },

  showDetail:function(e){ 
    var order = e.currentTarget.dataset.order;
    console.log(JSON.stringify(order));
    wx.navigateTo({
      url: '../detail/detail?order=' + JSON.stringify(order) + '&model=public',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })

  }
})