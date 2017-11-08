Page({
  //数据源
  data: {
    orders: [],
    loading: false,
    limit: 6,
    windowHeight: 0,
    scrollTop: 100
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
    var that = this
    wx.request({
      url: getApp().GlobalConfig.baseUrl+"/api/orders/mytask", 
      data: {
        userId: getApp().globalData.userId
      },
      method:'GET',
      success: function(res) {
        // 数据从逻辑层发送到视图层，同时改变对应的 this.data 的值
        console.log(res.data);
        that.setData({
          orders: res.data.items,
          loading: true
        })
      },
      fail: function()
      {
         console.log("failed");
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
    if (!app.globalData.loginState) {
      wx.navigateTo({
        url: '../index/index',
      })
    } else{
      this.requestData();
    }
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
  // 购票
  buyTickets: function() {
    wx.showModal({
      title: '购票提示：',
      content: '目前不支持购买',
      showCancel: false,
      confirmColor: '#ff4d64'
    })
  },
  showDetail:function(e){
    
    var order = e.currentTarget.dataset.order;
    console.log(JSON.stringify(order));
    wx.navigateTo({
      url: '../detail/detail?order=' + JSON.stringify(order),
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })

  }
})