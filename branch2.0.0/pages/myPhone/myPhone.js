// pages/myPhone/myPhone.js
var req = require('../../service/service');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber: '',
    time: 59,
    sendding: 0,
    timer: '',
    verificationCode: '',
    mobile: '',
    hasData: 0,
    isClub: 0,
    club:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.data.isClub = options.club;
    that.data.club = options.club;
    // console.log(club);
    var url = '/api/member/getMemberStatInfo';
    var data = {};
    req.reqData(url, data, function (res) {
      // console.log(res);
      that.setData({
        mobile: res.data.data.mobile,
        hasData: 1
      })
    }, function () { })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 监听手机号码输入框
  getPhoneNum(e) {
    var num = e.detail.value;
    this.setData({
      phoneNumber: num,
    })
  },
  // 获取验证码
  getCode() {
    var that = this;
    var url = 'api/smsCode/bindMobileToMember';
    var data = {
      mobileNumber: that.data.phoneNumber
    }
    if (!that.data.phoneNumber) {
      return;
    } else if (that.data.phoneNumber.length < 11) {
      wx.showToast({
        title: '请输入正确手机号'
      })
      return;
    } else {
      this.setData({
        sendding: 1,
      })
      // 获取验证码请求
      req.reqData(url, data, function (res) {
        wx.showToast({
          title: "验证码已发送"
        });
      }, function () {
        console.log('获取验证码失败');
      });

      // 开启定时器
      that.data.timer = setInterval(function () {
        that.data.time -= 1;
        if (that.data.time <= 0) {
          clearInterval(that.data.timer);
          that.setData({
            sendding: 0,
            time: 59,
          })
        } else {
          that.setData({
            time: that.data.time
          })
        }
      }, 1000)
    }

  },

  // 监听验证码输入框变化
  verCode(e) {
    var inputValue = e.detail.value;
    this.setData({
      verificationCode: inputValue
    })
  },

  // 绑定手机号
  bindPhone() {
    var that = this;
    var url = 'api/member/bindMobile';
    var data = {
      mobileNumber: that.data.phoneNumber,
      smsCode: that.data.verificationCode,
    }
    req.reqData(url, data, function (res) {
      wx.showToast({
        title: "绑定成功"
      })
    if(getApp().takeGcoupon == 1){
      // 首页领红包
      var url = 'api/coupon/takeGcoupon';
      var data = {};
      req.reqData(url, data, function (res) {
        wx.showToast({
          title: '领取成功'
        })
        getApp().globalData.takeGcoupon = 0;
        getApp().globalData.isLoginIndex = 1;
        setTimeout(function(){
          wx.navigateTo({
            url: '/pages/my/myCoupon/myCoupon',
          })
        },800)
      })
    }
    if(that.data.club == 1){
      getApp().globalData.phoneToClub = 1;
      wx.redirectTo({
          url: '/pages/activity/vipClub/vipClub',
        })
      }else if (that.data.isClub == 0) {
        setTimeout(function () {
          wx.switchTab({
            url: "../../pages/my/my"
          })
        }, 500)
      } else {
        getApp().globalData.isBindPhone = 1;
        wx.navigateBack({
          delta: 1,
        })
      }


    }, function () {

    })
  },

  // 变更手机号
  chagePhone() {
    this.setData({
      mobile: '',
    })
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