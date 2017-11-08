//app.js

App({
  GlobalConfig : {
    baseUrl: 'http://118.31.77.228:8006',
    appid:  'wxb137ebfa3dc90901',
    secret: 'ec3bbfe9300efa39b561ebac0aac5f2d',
    openid: null,
    cst_number: null
  },
 

  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          //发起网络请求
         
        } else 
        {
            console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId         
              this.globalData.userInfo = res.userInfo;
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
    })
  },
  globalData: {
    userInfo: null,
    userId:null,
    loginState:false
  }
})