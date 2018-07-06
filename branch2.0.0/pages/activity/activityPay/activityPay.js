// pages/settlement/settlement.js
var req = require('../../../service/service');
var login = require('../../../utils/login');
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_setAddress: 0,
    customer_remark: '',
    address_id: '',
    buy_user_address: '',
    buy_user_name: '',
    buy_user_mobile: '',
    orderInfo: {},
    payData: {},
    payAddressUrl: {},
    order_id: '',
    top_order_no: '',
    showPage: 0,
    goback: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order_id: options.order_id
    });
    var that = this;
    that.data.goback = options.goback ? options.goback : 0;
    console.log(that.data.goback);
    var url = 'api/activityOrder/getWaitPayOrder'
    var data = {
      order_id: that.data.order_id
    }
    req.reqData(url, data, function (res) {
      var data = res.data.data;
      var address = data.default_address.city_name + data.default_address.province_name + data.default_address.district_name + data.default_address.address;
      if (data.address_id == 0) {
        that.setData({
          is_setAddress: 0
        })
      } else {
        that.setData({
          is_setAddress: 1
        })
      }
      that.setData({
        orderInfo: data,
        address_id: data.address_id,
        buy_user_address: address,
        buy_user_name: data.default_address.send_to,
        buy_user_mobile: data.default_address.send_to_mobile,
        order_no: data.order_no,
        showPage: 1
      });

      console.log(that.data.is_setAddress);
      // wx.setNavigationBarTitle({
      //   title: data.act_name
      // })
    }, function () { });

  },

  // 买家留言
  getInput: function (e) {
    var value = e.detail.value;
    this.setData({
      customer_remark: value
    })
  },
  // 添加地址
  addAdress: function () {
    var that = this;
    var url = "api/address/addAddress";
    var app = getApp();
    app.aldstat.sendEvent('购物车结算-地址', {});
    wx.chooseAddress({
      success: function (res) {
        that.data.payAddressUrl.userName = res.userName;
        that.data.payAddressUrl.postalCode = res.postalCode;
        that.data.payAddressUrl.provinceName = res.provinceName;
        that.data.payAddressUrl.cityName = res.cityName;
        that.data.payAddressUrl.countyName = res.countyName;
        that.data.payAddressUrl.detailInfo = res.detailInfo;
        that.data.payAddressUrl.nationalCode = res.nationalCode;
        that.data.payAddressUrl.telNumber = res.telNumber;
        that.setData({
          buy_user_address: res.provinceName + res.cityName + res.countyName + res.detailInfo,
          buy_user_name: res.userName,
          buy_user_mobile: res.telNumber
        })
        login.login(true, function () {
          req.reqData(url, that.data.payAddressUrl,
            function (res) {
              if (res.data.returnCode == 0) {
                that.setData({
                  address_id: res.data.data,
                  is_setAddress: 1
                })
              } else if (res.data.returnCode == '-1') {
                login.login();
              } else {
                wx.showToast({
                  title: res.data.message
                })
              }
            },
            function (res) {

            });
        }, function () {
          //  没有登录
          // console.log('未登录');
        })
      },
      fail: function (err) {
        // console.log("用户不允许");
        var message_error = err.errMsg;
        if (message_error.indexOf('cancel') < 0) {
          wx.openSetting({
            success: (res) => {
              //console.log(res);
              that.setData({
                is_setAddress: 1
              })

            }
          })
        }
      }
    })
  },

  commit_btnExchange: util.throttle(function (e) {
    var that = this;
    console.log(that.data.goback);
    var url = "api/activityOrder/scorepay";
    var data = {
      order_id: that.data.order_id,
      customer_remark: that.data.customer_remark,
      address_id: that.data.address_id
    }
    if (this.data.address_id == 0) {
      wx.showToast({
        title: '请选择地址'
      })
      return;
    }
    login.login(true, function () {
      // 用户授权
      req.reqData(url, data,
        function (res) {
          if (res.data.returnCode == 0) {
            var app = getApp();
            app.aldstat.sendEvent('积分支付-支付成功', {});
        
            wx.redirectTo({
              url: '/pages/activity/activityPay/payFinished/payFinished?isExchange=' + 1 + '&act_order_id=' + res.data.data.act_order_id,
            })

          } else {
            wx.showToast({
              title: res.data.message
            })
          }
        },
        function (res) {

        });
    }, function () {
      // 用户不授权
    })
  },1000),
  commit_order: function () {
    var that = this;
    console.log(that.data.goback);
    var url = "api/activityOrder/wxpay";
    var data = {
      order_id: that.data.order_id,
      customer_remark: that.data.customer_remark,
      address_id: that.data.address_id
    }
    if (this.data.address_id == 0) {
      wx.showToast({
        title: '请选择地址'
      })
      return;
    }
    login.login(true, function () {
      // 用户授权
      req.reqData(url, data,
        function (res) {
          if (res.data.returnCode == 0) {
            wx.requestPayment({ //调起微信支付
              'timeStamp': res.data.data.timeStamp,
              'nonceStr': res.data.data.nonceStr,
              'package': res.data.data.package,
              'signType': 'MD5',
              'paySign': res.data.data.paySign,
              'success': function () {
                var app = getApp();
                app.aldstat.sendEvent('活动支付-支付成功', {});

                wx.redirectTo({
                  url: '../../../pages/activity/activityPay/payFinished/payFinished?order_no=' + res.data.data.order_no + '&goback=' + that.data.goback,
                })
              },
              'fail': function (res) {
                wx.showToast({
                  title: '支付取消',
                })
              }
            })
          } else if (res.data.returnCode == '-1') {
            login.login();
          } else {
            wx.showToast({
              title: res.data.message
            })
          }
        },
        function (res) {

        });
    }, function () {
      // 用户不授权
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})