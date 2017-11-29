Page({
  //数据源
  data: {
    orders: [
      { "id": 1, "userId": "kehu-1", "userName": "王然", "location": "南京栖霞区丁香花园8栋909", "phone": "18722334456", "number": "1", "psText": "下午送", "createTime": "2017-10-19 13:33:52", "updateTime": "2017-10-20 09:50:10", "taskId": "74", "type": "{\"carts\":[{\"goodName\":\"桶装水\",\"quantity\":\"5\",\"price\":\"100\"},{\"goodName\":\"煤气灶\",\"quantity\":\"3\",\"price\":\"300\"},{\"goodName\":\"角阀\",\"quantity\":\"1\",\"price\":\"20\"}]}" }, 
      { "id": 2, "userId": "kehu-2", "userName": "周远", "location": "南京雨花台区善水湾花园4栋308", "phone": "13722334456", "number": "1", "psText": "白天送", "createTime": "2017-10-19 13:33:52", "updateTime": "2017-11-01 18:23:24", "taskId": "77", "type": "{\"carts\":[{\"goodName\":\"桶装水\",\"quantity\":\"5\",\"price\":\"100\"},{\"goodName\":\"煤气灶\",\"quantity\":\"3\",\"price\":\"300\"},{\"goodName\":\"角阀\",\"quantity\":\"1\",\"price\":\"20\"}]}" }, 
      { "id": 3, "userId": "kehu-2", "userName": "里子群", "location": "南京中电28所东区", "phone": "13700000456", "number": "1", "psText": "白天送", "createTime": "2017-10-19 13:33:52", "updateTime": "2017-11-01 18:23:47", "taskId": "80", "type": "{\"carts\":[{\"goodName\":\"桶装水\",\"quantity\":\"5\",\"price\":\"100\"},{\"goodName\":\"煤气灶\",\"quantity\":\"3\",\"price\":\"300\"},{\"goodName\":\"角阀\",\"quantity\":\"1\",\"price\":\"20\"}]}" },
      { "id": 4, "userId": "kehu-2", "userName": "里子群", "location": "南京中电28所东区", "phone": "13700000456", "number": "1", "psText": "白天送", "createTime": "2017-10-19 13:33:52", "updateTime": "2017-11-01 18:23:47", "taskId": "80", "type": "{\"carts\":[{\"goodName\":\"桶装水\",\"quantity\":\"5\",\"price\":\"100\"},{\"goodName\":\"煤气灶\",\"quantity\":\"3\",\"price\":\"300\"},{\"goodName\":\"角阀\",\"quantity\":\"1\",\"price\":\"20\"}]}" },
      { "id": 5, "userId": "kehu-2", "userName": "里子群", "location": "南京中电28所东区", "phone": "13700000456", "number": "1", "psText": "白天送", "createTime": "2017-10-19 13:33:52", "updateTime": "2017-11-01 18:23:47", "taskId": "80", "type": "{\"carts\":[{\"goodName\":\"桶装水\",\"quantity\":\"5\",\"price\":\"100\"},{\"goodName\":\"煤气灶\",\"quantity\":\"3\",\"price\":\"300\"},{\"goodName\":\"角阀\",\"quantity\":\"1\",\"price\":\"20\"}]}" },
      { "id": 6, "userId": "kehu-2", "userName": "里子群", "location": "南京中电28所东区", "phone": "13700000456", "number": "1", "psText": "白天送", "createTime": "2017-10-19 13:33:52", "updateTime": "2017-11-01 18:23:47", "taskId": "80", "type": "{\"carts\":[{\"goodName\":\"桶装水\",\"quantity\":\"5\",\"price\":\"100\"},{\"goodName\":\"煤气灶\",\"quantity\":\"3\",\"price\":\"300\"},{\"goodName\":\"角阀\",\"quantity\":\"1\",\"price\":\"20\"}]}" },
      { "id": 7, "userId": "kehu-2", "userName": "里子群", "location": "南京中电28所东区", "phone": "13700000456", "number": "1", "psText": "白天送", "createTime": "2017-10-19 13:33:52", "updateTime": "2017-11-01 18:23:47", "taskId": "80", "type": "{\"carts\":[{\"goodName\":\"桶装水\",\"quantity\":\"5\",\"price\":\"100\"},{\"goodName\":\"煤气灶\",\"quantity\":\"3\",\"price\":\"300\"},{\"goodName\":\"角阀\",\"quantity\":\"1\",\"price\":\"20\"}]}" },
      { "id": 8, "userId": "kehu-2", "userName": "里子群", "location": "南京中电28所东区", "phone": "13700000456", "number": "1", "psText": "白天送", "createTime": "2017-10-19 13:33:52", "updateTime": "2017-11-01 18:23:47", "taskId": "80", "type": "{\"carts\":[{\"goodName\":\"桶装水\",\"quantity\":\"5\",\"price\":\"100\"},{\"goodName\":\"煤气灶\",\"quantity\":\"3\",\"price\":\"300\"},{\"goodName\":\"角阀\",\"quantity\":\"1\",\"price\":\"20\"}]}" }],
    // loading: false,
    loading: true,
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
    //查询我可以抢的订单
    // wx.request({
    //   url: getApp().GlobalConfig.baseUrl+"/api/orders/mytask", 
    //   data: {
    //     userId: getApp().globalData.userId
    //   },
    //   method:'GET',
    //   success: function(res) {
    //     // 数据从逻辑层发送到视图层，同时改变对应的 this.data 的值
    //     console.log(res.data);
    //     that.setData({
    //       orders: res.data.items,
    //       loading: true
    //     })
    //   },
    //   fail: function()
    //   {
    //      console.log("failed");
    //   }
    // })
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
    var app = getApp();1
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
  // 抢单
  getOrder: function (e) {
    var orderIndex = e.currentTarget.dataset.orderindex;
    wx.showModal({
      title: '订单号：'+orderIndex,
      content: '确认抢单？',
      showCancel: true,   
      confirmColor: '#ff4d64',

      success: (res) => {
        if (res.confirm){
          console.log("抢单成功！");
          }
      },
      fail: (res) => {
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