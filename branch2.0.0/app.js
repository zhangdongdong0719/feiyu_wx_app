//app.js
var uaChange = require('utils/head.js');
const login = require('utils/login.js');
var aldstat = require("utils/ald-stat.js");

App({
  // testcallback: function() {
  //     // console.log('test');
  // },
  // failcallback: function () {
  //   console.log('failcallback');
  // },
  onLaunch: function () { 
  
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // debugger
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              // console.log(res);

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    isH5Login:false,
    isLoginIndex:false,
    userInfo: null,
    title:'',
    back:false,
    takeGcoupon:0,
    flag:false,
    isRunningBack:false,
    isBindPhone:0,
    phoneToClub:0,

  //  {
  //   "pagePath": "pages/welfare/welfare",
  //   "text": "福利社",
  //   "iconPath": "images/tabbar/welfare.png",
  //   "selectedIconPath": "images/tabbar/welfare_red.png"
  // },
    // client:'139.224.119.2',
    // port:80,
    // is_test: 1,
    // baseurl: 'https://apitest.topshopstv.com/',
    // imBaseUrl: 'https://imtest.topshopstv.com/im',
    // useSSL:false,
    

    client: 'ws.topshopstv.com',
    is_test: 0,
    baseurl: 'https://api.topshopstv.com/',
    port: 443,
    useSSL:true,
    imBaseUrl: 'https://im.topshopstv.com',
  }
})