//index.js
const req = require('../../../service/service.js');
const login = require('../../../utils/login');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    returnData:'',
    hasData:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // var return_score = options.return_score;
    // this.setData({
    //   return_score: return_score,
    // })


  },
  btnUseScore(e) {
    wx.switchTab({
      url: '/pages/welfare/welfare',
    })
  },
  btn_getSure: function (e) {
    wx.navigateTo({
      url: '/pages/my/myOrder/order?order_status=' + 0,
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
    var that = this;
    var url = 'api/member/getSumReturnScore';
    var data = {};
    req.reqData(url, data, function (res) {

      that.setData({
        returnData: res.data.data,
        hasData: 1
      })
    }, function () {

    })
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

  // },

  // 积分按钮点击事件
  userPointBtnClick: function () {
    wx.navigateTo({
      url: '../../my/pointChange/pointChange',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  sureReceiveBtnClick: function () {
    wx.showToast({
      title: '确认收货',
    })
  }
})