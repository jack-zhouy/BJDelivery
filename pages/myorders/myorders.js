Page({
  //数据源
  data: {
    //配送工已抢到的订单
    ordersList: [],
    // loading: false,
    loading: true,
    limit: 6,
    windowHeight: 0,
    scrollTop: 100,
  },
  onPullDownRefresh:function(){
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.requestData();
    //模拟加载
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },

  requestData: function (a) {
    var that = this;
    var app = getApp();
    console.log("后台查询已抢到的任务单");

    wx.request({
      url: getApp().GlobalConfig.baseUrl + "/api/TaskOrders" + "/" + app.globalData.userId + "?",
      data: {
        orderStatus: 1
      },
      method: 'GET',
      success: function (res) {
        // 数据从逻辑层发送到视图层，同时改变对应的 this.data 的值
        console.log(res.data);
        that.setData({
          ordersList: res.data.items,
          loading: true
        })
        console.log("ordersList:");
        console.log(that.data.ordersList);
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
  // 页面初始化
  onLoad: function () {
    
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
    this.requestData();
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
  // 订单处理
  // dealOrder: function (e) {
  //   var order = e.currentTarget.dataset.order;
  //    wx.navigateTo({
  //      url: '../deliver/deliver?order=' + JSON.stringify(order),
  //     success: function (res) { },
  //     fail: function (res) { },
  //     complete: function (res) { },
  //   })
  // },
  showDetail:function(e){
    
    var order = e.currentTarget.dataset.order;
    console.log(JSON.stringify(order));
    wx.navigateTo({
      url: '../detail/detail?order=' + JSON.stringify(order) + '&model=private',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })

  }
})