Page({

  data: {
    order: {},
    carts: {},
    oldBottle: {},
    newBottle: {},
    securityCheckTypes: [
      '胶管不合格，请予更换',
      '调压阀不合格，请予更换',
      '灶具不合格，请予更换',
      '用气环境不合格，请予调整',
      '已对用户做用气安全培训',
      '安全检查合格', 
      '用户自行跟换相关配件',
    ],
    index: 0,
    payTypes: [
      "微信支付",
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
    emptyBottleNumber:"",
    fullBottleNumber:"",
    customerUserId:"",

    orderNum:"",
    checkpayState:""

  },
  //下拉刷新
  onPullDownRefresh: function () {
    console.log("下拉刷新");
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.checkOrderPayStatus_request();
    //模拟加载
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },

  //验证是否选择支付方式
  checkChoosePayMethod: function () {
    var that = this;
    if (that.data.payType.length > 0) {
      return true;
    }
    else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请选择支付方式'
      });
      return false;
    }
  },

//check订单支付状态
  checkOrderPayStatus_request: function(){
    var that = this; 
    //查询所有订单
    wx.request({
      url: getApp().GlobalConfig.baseUrl + "/api/Orders",
      data: {
        orderSn: that.data.orderNum
      },
      method: 'GET',
      success: function (res) {
        // 数据从逻辑层发送到视图层，同时改变对应的 this.data 的值
        //console.log(res.data);
        var payState=res.data.items[0].payStatus.index;
        if (payState == 0)
        {
          that.data.checkpayState ="待支付"
        }
        else if (payState == 1) {
          that.data.checkpayState = "已支付"
        }
        else if (payState == 2) {
          that.data.checkpayState = "退款中"
        }
        else if (payState == 3) {
          that.data.checkpayState = "已退款"
        }
        that.setData({
          checkpayState: that.data.checkpayState
        })
        wx.showModal({
          title: '提示：',
          content: '订单支付状态是' + that.data.checkpayState,
          showCancel: false,
          confirmColor: '#ff4d64'
        })

      },
      fail: function () {
        console.log("failed");
      }
    })
  },
  // 页面初始化
  onLoad: function (options) {
    // options为页面跳转所带来的参数
    var that = this;
    var order = JSON.parse(options.order);
    console.log("options.order");
    console.log(options.order);

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

    that.data.customerUserId = order.object.customer.userId;
    that.data.orderNum = order.object.orderSn;
    that.setData({
      order: order,
      loading: true,
      deliveryAddress: that.data.deliveryAddress,
      deliveryAddressDetail: that.data.deliveryAddressDetail,
      addedPayFee: that.data.addedPayFee,
      payType: that.data.payType,
      payState: that.data.payState,
      customerUserId: that.data.customerUserId,
      orderNum: that.data.orderNum
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
    // that.getLocation(address);
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
    // var index = e.detail.value;
    // var securityType = this.data.securityCheckTypes[index];
    // this.data.securityCheckResult.push(securityType);
    // this.setData({
    //   securityCheckResult: this.data.securityCheckResult,
    // })
    // //console.log(this.data.securityCheckResult);

    this.setData({
      index: e.detail.value
    })
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
      console.log(that.data.payType);
      console.log(that.data.payType.length);
    }
  },

//调微信二维码
  getQRCode: function () { 
    var that = this;
    console.log(that.data.addedPayFee);
    console.log(that.data.order.object.orderSn);
    that.setData({
      qrCodeUrl: "https://www.yunnanbaijiang.com:8009/api/pay/scan?orderIndex=" +
      that.data.order.object.orderSn + "&totalFee=" + that.data.addedPayFee*100,
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
    var flag = this.checkChoosePayMethod();
    console.log(flag);
    if (flag)
    {
      that.upload_BottleNumber();
    }
   
    // that.upload_fullBottleNumber();
    // that.GetDepLeader_request();

  },

//查询配送工下一个负责人
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

//调用接口是配送成功
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
          //调接口修改订单支付方式为微信支付
          if (that.data.qrCode == true) {
            that.changeOrderPayStatus_request();
          }
        }
      },
      fail: function () {
        console.error("配送失败");
      }
    })
  },

  //空钢瓶号输入
  emptyBottleNumInput: function (e) {
    var that = this;
    // if (e.detail.value.length > 0) {
    //   this.setData({
    //     emptyBottleNumber: e.detail.value
    //   })
    // }
    // else {
    //   wx.showModal({
    //     title: '提示',
    //     showCancel: false,
    //     content: '请输入正确的空瓶号'
    //   });
    // }
    this.setData({
        emptyBottleNumber: e.detail.value
    })
    console.log(that.data.emptyBottleNumber);
    console.log(that.data.emptyBottleNumber.length);
  },

  //重钢瓶号输入
  fullBottleNumInput: function (e) {
    var that = this;
    // if (e.detail.value.length > 0) {
    //   this.setData({
    //     fullBottleNumber: e.detail.value
    //   })
    // }
    // else{
    //   wx.showToast({
    //     title: '请输入正确的重瓶号',
    //     icon: 'fail',
    //     duration: 2000,
    //   });
    // }
    this.setData({
        fullBottleNumber: e.detail.value
    })
   console.log(that.data.fullBottleNumber);
   console.log(that.data.fullBottleNumber.length);
  },

  //如果有输入空瓶号则上传空瓶号，成功后上传重瓶号，再次成功后走到配送成功
  //如果没有输入空瓶号则上传重瓶号，成功之后走到配送成功
  upload_BottleNumber: function () {
    var that = this;
    var app = getApp();
    
    //console.log(that.data.emptyBottleNumber.length);
    // var flag = this.checkEmptyBottleNum();
    //有空瓶号输入则上传空瓶号，成功后上传重瓶号，再次成功后走到配送成功
    if (that.data.emptyBottleNumber.length>0){
      console.log("上传空钢瓶号码");
      wx.request({
        url: getApp().GlobalConfig.baseUrl + "/api/GasCylinder/TakeOver" + '/' + this.data.emptyBottleNumber + '?srcUserId=' + that.data.customerUserId + '&targetUserId=' + app.globalData.userId + '&serviceStatus=6',
        method: 'PUT',
        success: function (res) {
          if (res.statusCode == 200) {
            console.log("空瓶号上传成功");
            // wx.showToast({
            //   title: '空瓶号上传成功',
            //   icon: 'fail',
            //   duration: 2000,
            // });
            // 空瓶号上传成功后上传重钢瓶号
            that.upload_fullBottleNumber();
          } 
          else if (res.statusCode == 404){
            console.error("空瓶或用户不存在");      
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '空瓶不存在'
            });
          }
          else if (res.statusCode == 406){
            console.error("空瓶责任人校验错误");         
          }
          else if (res.statusCode == 400) {
            console.error("空瓶参数错误");
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '空瓶不存在'
            });
          }
        },
        fail: function () {
          console.error("上传空瓶号失败");

          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '上传空瓶号失败'
          });
        }
      })
    }
  //没有空瓶号输入则上传重瓶号，成功之后走到配送成功
    else{
      that.upload_fullBottleNumber();
    }
  },

  //上传重钢瓶号
  upload_fullBottleNumber: function () {
    var that = this;
    var app = getApp();
    console.log("上传重瓶号");
    // var flag = this.checkFullBottleNum(param);
    if (that.data.fullBottleNumber.length > 0) {
      wx.request({
        url: getApp().GlobalConfig.baseUrl + "/api/GasCylinder/TakeOver" + '/' + this.data.fullBottleNumber + '?srcUserId=' + app.globalData.userId + '&targetUserId=' + that.data.customerUserId + '&serviceStatus=5',
        method: 'PUT',
        success: function (res) {
          if (res.statusCode == 200) {
            console.log("重瓶号上传成功");
            //如成功调接口查询配送工的下一个责任人
            that.GetDepLeader_request();
          }
          else if (res.statusCode == 404) {
            console.error("重瓶或用户不存在");
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '重瓶不存在'
            });
          }
          else if (res.statusCode == 406) {
            console.error("重瓶参数错误/责任人校验错误");
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '重瓶不存在'
            });
          }
        },
        fail: function () {
          console.error("上传重瓶号失败");
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '上传重瓶号失败'
          });
        }
      })
    }
    else
    {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入正确的重瓶号'
      });
    }
  },

  //选择扫码支付并修改订单支付方式
  changeOrderPayStatus_request: function () {
    var that = this;
    console.log("修改订单微信支付");
    wx.request({
      url: getApp().GlobalConfig.baseUrl + "/api/Orders" + '/' + that.data.orderNum + '?payType=PTOnLine',
      method: 'PUT',
      success: function (res) {
        console.log("修改订单微信支付成功");
      },
      fail: function () {
        console.error("修改订单微信支付失败");
      }
    })
  },

})