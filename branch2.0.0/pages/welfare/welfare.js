// pages/welfare/welfare.js
const md5 = require('../../utils/md5.js');
const req = require('../../service/service.js');
const login = require('../../utils/login.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    welfareData: '',
    rechangeScore: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    var url = 'api/welfare/index';
    var data = {};
    req.reqData(url, data, function (res) {
      var data = res.data.data;


      var progress = (data.data.header.current_face_score - data.data.header.face_score_min) / (data.data.header.face_score_max - data.data.header.face_score_min) * 100;

      that.setData({
        welfareData: data.data,
        rechangeScore: data,
        progress: progress,
      })


    }, function () { })
  },

  btnPrize(e) {
    wx.navigateTo({
      url: '/pages/integralDraw/integralDraw',
    })
  },
  btnRechange(e) {
    var app_url = e.currentTarget.dataset.app_url;

    wx.navigateTo({
      url: '/' + app_url,
    })
    // var spu_id = e.currentTarget.dataset.spu_id;
    // var data_id = e.currentTarget.dataset.data_id;
    // var sku_id = e.currentTarget.dataset.sku_id;
    // var that = this;

    // var url = 'api/product/submitExcahgeProduct';
    // var param = {
    //   spu_id: spu_id,
    //   data_id: data_id,
    //   sku_id: sku_id,
    // };
    // req.reqData(url, param,
    //   function (res) {
    //     if (res.data.returnCode == 0) {
    //       var data = res.data.data;
    //       wx.navigateTo({
    //         url: '/' + app_url,
    //       })
    //     }
    //   },
    //   function (res) {

    //   });



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
    var that = this;
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 500);
    var that = this;

    var url = 'api/welfare/index';
    var data = {};
    req.reqData(url, data, function (res) {
      var data = res.data.data;


      var progress = (data.data.header.current_face_score - data.data.header.face_score_min) / (data.data.header.face_score_max - data.data.header.face_score_min) * 100;

      that.setData({
        welfareData: data.data,
        rechangeScore: data,
        progress: progress,
      })


    }, function () { })
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