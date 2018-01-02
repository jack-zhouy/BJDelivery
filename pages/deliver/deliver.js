Page({

  data: {
    order: {},
    carts: {},
    oldBottle: {},
    newBottle: {},
    securityCheckTypes: [
      "胶管不合格，请予更换",
      "调压阀不合格，请予更换",
      "灶具不合格，请予更换",
      "用气环境不合格，请予调整",
      "自换",
      "已对用户做用气安全培训"
    ],
    payTypes: [
      "扫码支付",
      "现金支付"
    ],
    securityCheckResult: [],
    payType: "",
    payState:"",
    addedPayFee: null,
    tempFilePaths: "",
    loading: false,
    getBottle: false,
    delivered: false,
    qrCode: false,
    uploadCertificateFlag:false,
    qrCodeUrl: "",

    deliveryAddress: "",
    deliveryAddressDetail: "",
    nextGroup:"",

  },
  // 页面初始化
  onLoad: function (options) {
    // options为页面跳转所带来的参数
    var that = this;
    var order = JSON.parse(options.order);
    console.log("options.order");
    console.log(options.order);

    if (order.object.payType == "PTOnLine") {
      that.data.payType = "微信支付"
    }
    else {
      that.data.payType = "气到付款"
    }

    if (order.object.payStatus == "PSUnpaid") {
      that.data.payState = "待支付"
    }
    else if (order.object.orderStatus == "PSPaied") {
      that.data.payState = "已支付"
    }
    else if (order.object.orderStatus == "PSRefounding") {
      that.data.payState = "退款中"
    }
    else if (order.object.orderStatus == "PSRefounded") {
      that.data.payState = "已退款"
    }

    that.data.deliveryAddress = order.object.recvAddr.province + order.object.recvAddr.city
      + order.object.recvAddr.county;
    that.data.deliveryAddressDetail = order.object.recvAddr.detail;

    that.data.addedPayFee = order.object.orderAmount;

    that.setData({
      order: order,
      loading: true,
      deliveryAddress: that.data.deliveryAddress,
      deliveryAddressDetail: that.data.deliveryAddressDetail,
      addedPayFee: that.data.addedPayFee,
      payType: that.data.payType,
      payState: that.data.payState
    })
  },
  // 页面初次渲染完成（每次打开页面都会调用一次）
  onReady: function () {
    // console.log(this.data.order.location);
    // wx.setNavigationBarTitle({
    //   title: this.data.order.location
    // })
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
  scanOldId: function () {
    var that = this;
    wx.scanCode({
      success: (res) => {
        console.log(res);
        try {
          that.setData({
            oldBottle: JSON.parse(res.result),
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

  getBottleFunc: function () {
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
  },
  bindSecurityCheckChange: function (e) {
    var index = e.detail.value;
    var securityType = this.data.securityCheckTypes[index];
    this.data.securityCheckResult.push(securityType);
    this.setData({
      securityCheckResult: this.data.securityCheckResult,
    })
    console.log(this.data.securityCheckResult);
  },

  deleteSecurityCheck: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log(index);
    this.data.securityCheckResult.splice(index, 1);
    this.setData({
      securityCheckResult: this.data.securityCheckResult,
    })

  },

  //上传用户单据
  uploadCertificate: function () {
    var that = this;


    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有

      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          // formData: {
          //   'user': 'test'
          // },
          success: function (res) {
            var data = res.data
            //do something
            console.log(data);
          }
        })

        that.setData({
          tempFilePaths: tempFilePaths,
          uploadCertificateFlag: true,
        })

      }
    })


    // wx.chooseImage({
    //   count: 1, // 默认9
    //   sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    //   sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    //   success: function (res) {
    //     // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    //     var tempFilePaths = res.tempFilePaths;
    //     that.setData({
    //       tempFilePaths: tempFilePaths,
    //       uploadCertificateFlag :true,
    //     })
        
    //   }
    // })
  },
  bindPayTypesChange: function (e) {
    var that = this;
    var index = e.detail.value;
    var payType = this.data.payTypes[index];
    if (index == 0) {
      this.setData({
        qrCode: true,
        payType: payType,
      })
      that.getQRCode();
    } else {
      this.setData({
        qrCode: false,
        payType: payType,
      })
    }

  },

  getQRCode: function () { 
    var that = this;
    console.log(that.data.addedPayFee);
    console.log(that.data.order);
    that.setData({
      qrCodeUrl: "http://118.31.77.228:8006/api/test/Pay/Scan?orderIndex=" +
      that.data.order.id + "&totalFree=" + that.data.addedPayFee*100,
    })
  },

  //加收的金额发生改变
  addedPayFeeChanged: function (e) {
    var that = this;
    var value = e.detail.value
    that.setData({
      addedPayFee: value,
    })
  },

  successDelivery:function(){
    var that = this;
    that.GetDepLeader_request();
  },

  GetDepLeader_request:function(){
    var that = this;
    var app = getApp();
    console.log("查询用户所属部门责任人");
    wx.request({
      url: getApp().GlobalConfig.baseUrl + "/api/sysusers/GetDepLeader",
      data:{
        groupCode:"00005",
        userId: app.globalData.userId
      },
      method: 'GET',
      success: function (res) {
        // 数据从逻辑层发送到视图层，同时改变对应的 this.data 的值
        if (res.statusCode != 200) {
          console.error("请求查询用户所属部门责任人失败");
        } else {
          console.log("请求查询用户所属部门责任人成功");
          console.log(res.data);
          that.setData({
            nextGroup: res.data.items[0].userId
          })

          that.success_deliver();
        }
      },
      fail: function () {
        console.error("请求查询用户所属部门责任人失败");
      }
    })
  },

  success_deliver:function(){
    var that = this;
    var app = getApp();
    var task = {};
    task.businessKey = that.data.order.object.orderSn;
    task.candiUser = that.data.nextGroup;
    task.orderStatus = 2;
    console.log(task);
    wx.request({
      url: getApp().GlobalConfig.baseUrl + "/api/TaskOrders/Process" + "/" + this.data.order.id,
      data: task,
      method: 'GET',
      success: function (res) {
        // 数据从逻辑层发送到视图层，同时改变对应的 this.data 的值
        if (res.statusCode != 200) {
          console.error("配送失败");
          wx.showToast({
            title: '配送失败',
            icon: 'fail',
            duration: 1500
          })
        } else {
          //console.log("配送成功");
          wx.showToast({
            title: '配送成功',
            icon: 'success',
            duration: 2000,
            success:function(){
              setTimeout(function () {
                wx.switchTab({
                  url: '../orders/orders',
                })
              }, 1500);

            }
          })

        }
      },
      fail: function () {
        console.error("配送失败");
      }
    })
  }
})