const req = require('../../../../service/service.js');
const login = require('../../../../utils/login');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: '',
    send_to: '',
    send_to_mobile: '',
    total_money: '',
    order_no: '',
    order_id: '',
    interval: '',
    isShowPage: '0',
    cont: 0,
    // isBindPhone:0,
    goback: 0,
    isExchange: '',
    act_order_id: '',
    pay_score: '',
    real_order_id:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.data.isExchange = options.isExchange;
    that.data.act_order_id = options.act_order_id;
    if (options.isExchange == 0) {
      login.processRegShopId(options.reg_shop_id);

      that.data.order_no = options.order_no;
      that.data.goback = options.goback ? options.goback : 0;
      console.log(that.data.goback);
      wx.showLoading({
        title: '支付中',
      })
    } else {

      var url = 'api/activityOrder/checkScoreStatus';
      var data = {
        act_order_id: that.data.act_order_id
      };
      req.reqData(url, data,
        function (res) {
          if (res.data.returnCode == 0) {
            that.setData({
              isShowPage: 1,
              bind_mobile_tip: res.data.data.bind_mobile_tip,
              address: res.data.data.address,
              send_to: res.data.data.send_to,
              total_money: res.data.data.total_money,
              order_id: res.data.data.order_id,
              pay_score: res.data.data.pay_score,
              real_order_id: res.data.data.real_order_id
            });
          }





        },
        function (res) {

        });


    }
  },

  // PerRefresh(url, data) {

  //   req.reqData(url, data,
  //     function (res) {
  //       that.setData({
  //         address: res.data.data.address,
  //         send_to: res.data.data.send_to,
  //         total_money: res.data.data.total_money,

  //       });

  //     },
  //     function (res) {

  //     });
  // },

  goOrder(e) {
    wx.redirectTo({
      url: '/pages/order/orderDetial/detial?id=' + this.data.real_order_id,
    })
  },
  goBack: function () {
    wx.navigateBack({
      delta: 2
    })
  },
  go_back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    if (that.data.isExchange == 0) {
      var url = 'api/activityOrder/checkPayStatus';
      var data = {
        order_no: that.data.order_no
      };
      clearInterval(that.data.interval);
      that.data.interval = setInterval(function () {
        req.reqData(url, data,
          function (res) {
            if (res.data.returnCode == 0) {
              clearInterval(that.data.interval);
              getApp().globalData.flag = true;
              wx.hideLoading();
              getApp().globalData.isH5Login = true;
              console.log(that.data.goback);
              if (that.data.goback == 1) {
                wx.navigateBack({
                  delta: 1
                })
              } else {
                wx.redirectTo({
                  url: res.data.data.success_url,
                })
              }

              console.log(res.data.data.success_url);

              return;
            } else {
              that.data.cont++;
              if (that.data.cont >= 3) {
                wx.showToast({
                  title: '支付失败'
                })
                clearInterval(that.data.interval);
                getApp().globalData.isH5Login = true;
                console.log(that.data.goback);
                if (that.data.goback == 1) {
                  wx.navigateBack({
                    delta: 1
                  })
                } else {
                  wx.redirectTo({
                    url: res.data.data.success_url,
                  })
                }
                return;
              }
            }


            var app = getApp();
            app.aldstat.sendEvent('支付成功', {
              'order_id': res.data.data.order_id,
              'spu_id': res.data.data.spu_id,
              'sku_id': res.data.data.sku_id,
              'live_id': res.data.data.live_id,
            });
            that.setData({
              // isShowPage: 1,
              bind_mobile_tip: res.data.data.bind_mobile_tip,
              address: res.data.data.address,
              send_to: res.data.data.send_to,
              total_money: res.data.data.total_money,
              order_id: res.data.data.order_id,
            });

          },
          function (res) {
            clearInterval(that.data.interval)
          });
      }, 3000);
    }
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
    clearInterval(this.interval)
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


  lookPay: function (e) {
    var order_id = e.currentTarget.dataset.id;
    console.log(order_id);
    wx.navigateTo({
      // url: '/pages/my/myOrder/order?order_status=' + order_status,
      url: '/pages/order/orderDetial/detial?id=' + order_id,
    })
  },

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
})