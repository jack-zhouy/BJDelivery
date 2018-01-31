Page({
  data: {
    order: {},
    carts: {},
    loading: false,
    showGrab: false,
    payMethod: "",
    payStatus:"",
    orderState: "",
    deliveryAddress: "",
    deliveryAddressDetail:"",
    //抢单或者完成配送text
    dealText:"",
    orderSn:"",
    recvNamePhone:"",
    createTime:"",
    goodsName:"",
    quantity:"",
    dealPrice:"",
    orderAmount:"",
    comment:"",
    //一开始隐藏true
    taskBoolean: true,
    orderBoolean:true,

  },
  // 页面初始化
  onLoad: function (options) {
    // options为页面跳转所带来的参数
    var that = this;
    var order = JSON.parse(options.order);
    var model = options.model;
    console.log(order);
    console.log(model);
    //还没有抢的订单，需要显示抢单按钮

    if (model=='public'){
      that.setData({
        showGrab:true,
        taskBoolean: false
      })

      if (order.object.payType.index == 0) {
        that.data.payMethod = "微信支付"
      }
      else {
        that.data.payMethod = "气到付款"
      }

      if (order.object.orderStatus == 0) {
        that.data.orderState = "待配送"
      }
      else if (order.object.orderStatus == 1){
        that.data.orderState = "派送中"
      }
      else if (order.object.orderStatus == 2) {
        that.data.orderState = "已签收"
      }
      else if (order.object.orderStatus == 3) {
        that.data.orderState = "订单结束"
      }
      else{
        that.data.orderState = "作废"
      }

      if (order.object.payStatus.index == 0)
      {
        that.data.payStatus = "待支付"
      }
      if (order.object.payStatus.index == 1) {
        that.data.payStatus = "已支付"
      }
      if (order.object.payStatus.index == 2) {
        that.data.payStatus = "退款中"
      }
      else if (order.object.payStatus.index == 3) {
      
        that.data.payStatus = "已退款"
      }

      that.data.deliveryAddress = order.object.recvAddr.province + order.object.recvAddr.city
        + order.object.recvAddr.county;
      that.data.deliveryAddressDetail = order.object.recvAddr.detail;
      that.data.dealText = "立即抢单";

    }

     else if (model == 'private') {
        that.setData({
          showGrab: true,
          taskBoolean: false
        })
        if (order.object.payType.index == 0) {
          that.data.payMethod = "微信支付"
        }
        else {
          that.data.payMethod = "气到付款"
        }

        if (order.object.orderStatus == 0) {
          that.data.orderState = "待配送"
        }
        else if (order.object.orderStatus == 1) {
          that.data.orderState = "派送中"
        }
        else if (order.object.orderStatus == 2) {
          that.data.orderState = "已签收"
        }
        else if (order.object.orderStatus == 3) {
          that.data.orderState = "订单结束"
        }
        else {
          that.data.orderState = "作废"
        }

        if (order.object.payStatus.index == 0) {
          that.data.payStatus = "待支付"
        }
        if (order.object.payStatus.index == 1) {
          that.data.payStatus = "已支付"
        }
        if (order.object.payStatus.index == 2) {
          that.data.payStatus = "退款中"
        }
        else if (order.object.payStatus.index == 3) 
        {
            that.data.payStatus = "已退款"
        }
        that.data.deliveryAddress = order.object.recvAddr.province + order.object.recvAddr.city
          + order.object.recvAddr.county;
        that.data.deliveryAddressDetail = order.object.recvAddr.detail;
        that.data.dealText = "下一步";
      }
      
    else if (model == 'history') {
      that.setData({
        showGrab: false,
        orderBoolean: false
      })
      if (order.payType.index == 0) {
        that.data.payMethod = "微信支付"
      }
      else {
        that.data.payMethod = "气到付款"
      }

      if (order.orderStatus == 0) {
        that.data.orderState = "待配送"
      }
      else if (order.orderStatus == 1) {
        that.data.orderState = "派送中"
      }
      else if (order.orderStatus == 2) {
        that.data.orderState = "已签收"
      }
      else if (order.orderStatus == 3) {
        that.data.orderState = "订单结束"
      }
      else {
        that.data.orderState = "作废"
      }

      if (order.payStatus.index == 0) {
        that.data.payStatus = "待支付"
      }
      if (order.payStatus.index == 1) {
        that.data.payStatus = "已支付"
      }
      if (order.payStatus.index == 2) {
        that.data.payStatus = "退款中"
      }
      else if (order.payStatus.index == 3) {
        that.data.payStatus = "已退款"
      }
      that.data.deliveryAddress = order.recvAddr.province + order.recvAddr.city
        + order.recvAddr.county;
      that.data.deliveryAddressDetail = order.recvAddr.detail;
      that.data.dealText = "下一步";
    }

    that.setData({
      order: order,
      loading: true,
      deliveryAddress: that.data.deliveryAddress,
      deliveryAddressDetail: that.data.deliveryAddressDetail,
      payMethod: that.data.payMethod,
      payStatus:that.data.payStatus,
      orderState: that.data.orderState,
      dealText: that.data.dealText,
      goodsName: that.data.goodsName,
      quantity:that.data.quantity,
      dealPrice:that.data.dealPrice,
    })
    console.log(that.data.payMethod);
    console.log(that.data.orderState);
  },
  // 页面初次渲染完成（每次打开页面都会调用一次）
  onReady: function () {
    console.log(this.data.order.location);
    wx.setNavigationBarTitle({
      title: this.data.order.location
    })
  },
  // 抢单/配送至客户,客户签收
  dealOrder: function () {
    var that = this;
    var order = that.data.order;
    console.log(order);

    if (that.data.dealText == "立即抢单")
    {
      var orderIndex = this.data.order.id;
      wx.showModal({
        title: '任务单号：' + orderIndex,
        content: '确认抢单？',
        showCancel: true,
        confirmColor: '#ff4d64',

        success: (res) => {
          if (res.confirm) {
            console.log("提交抢单的订单");
            that.dealTask_request();
            // wx.switchTab({
            //   url: '../orders/orders',
            // })
          }
        },
        fail: (res) => {
          console.error("提交抢单失败");
        }
      })
    }
    else if (that.data.dealText == "下一步"){
     wx.navigateTo({
       url: '../deliver/deliver?order=' + JSON.stringify(order),
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
      })
    }
  },
  //抢单处理请求
  dealTask_request: function () {
    var that = this;
    var app = getApp();
    console.log("后台处抢单请求");
    var task = {};
    task.businessKey = that.data.order.object.orderSn;
    task.candiUser = getApp().globalData.userId;
    task.orderStatus = 1;
    console.log(task);
    wx.request({
      url: getApp().GlobalConfig.baseUrl + "/api/TaskOrders/Process" + "/" + this.data.order.id,
      data: task,
      method: 'GET',
      success: function (res) {
        // 数据从逻辑层发送到视图层，同时改变对应的 this.data 的值
        if (res.statusCode != 200) {
          console.error("抢单失败");
          wx.showToast({
            title: '抢单失败',
            icon: 'fail',
            duration: 1500
          })

        } else {
          console.log("抢单成功");
          wx.showToast({
            title: '抢单成功',
            icon: 'success',
            duration: 2000,
            success: function (){
              setTimeout(function () {
                wx.switchTab({
                  url: '../myorders/myorders',
                })
              }, 1500);
            }
          });

        }
      },
      fail: function () {
        console.error("抢单失败");
        wx.showToast({
          title: '抢单失败',
          icon: 'fail',
          duration: 1500
        })
      }
    })
  },

  showMap: function (e) {
    var address = e.currentTarget.dataset.address;
    var that = this;
    that.getLocation(address.province + address.city + address.county + address.detail);
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
        console.log(res.data  );
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