// pages/productDetail/productDetail.js
var req = require('../../../service/service');
var login = require('../../../utils/login');
const util = require('../../../utils/util.js');
Page({
  // 初始化数据
  data: {
    items: [{
      name: '0'
    },],

    dataloaded: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 4500,
    duration: 500,
    productInfo: {},
    images: [],
    productSku: [],
    currentIndex: 0,
    stock: 0,
    price: '',
    shop_id: '',
    orderInfo: {},
    shopImg: '',
    spu_id: '',
    name: '',
    data_id: '',
    share_image_url: '',
    sku_id: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var reg_shop_id = options.reg_shop_id;
    var spu_id = options.spu_id ? options.spu_id : '';
    var sku_id = options.sku_id ? options.sku_id : '';
    // data_id = 5694 & productId=5776
    var data_id = options.data_id ? options.data_id : '';
    var from_member_id = options.from_member_id ? options.from_member_id : '';
    var register_channel = options.register_channel;

    var from_user_id = options.from_user_id;

    var entity_type = 'product';
    var entity_id = spu_id;

    that.data.sku_id = sku_id;
    that.data.data_id = data_id;
    that.data.spu_id = spu_id;
    login.processRegShopId(reg_shop_id, from_member_id, register_channel, from_user_id, entity_type, entity_id, function () {
      var url = 'api/product/getProductDetail4Score';

      var param = {
        spu_id: spu_id,
        data_id: data_id,
        sku_id: sku_id,
      };
      req.reqData(url, param,
        function (res) {
          if (res.data.returnCode == 0) {
            var data = res.data.data;
            //console.log(res);
            wx.setNavigationBarTitle({
              title: data.name
            })
            that.setData({
              productInfo: data,
              coupon_count: data.coupon_count,
              images: data.main_images,
              shop_id: data.shop_id,
              shop_name: data.shop_name,
              share_image_url: data.qrcode,
              dataloaded: 1,
            });


          }
        },
        function (res) {

        });

    }, data_id);
    // console.log(productId);


  },









  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 积分兑换
  btnExchange: util.throttle(function (e) {
    var that = this;

    var url = 'api/product/submitExcahgeProduct';
    var param = {
      spu_id: that.data.spu_id,
      data_id: that.data.data_id,
      sku_id: that.data.sku_id,
    };
    req.reqData(url, param,
      function (res) {
        if (res.data.returnCode == 0) {
          var data = res.data.data;

          wx.navigateTo({
            url: "/pages/activity/activityPay/activityPay?order_id=" + data.act_order_id
          })
        }
      },
      function (res) {

      });


  },1000),

  // 立即购买弹窗
  btnBuy: util.throttle(function (e) {
    var that = this;
    var num = e.currentTarget.dataset.num;
    var sku_id = e.currentTarget.dataset.sku_id;
    var data_id = e.currentTarget.dataset.data_id;
    var url = 'api/product/checkSkuId';
    var reqData = {
      sku_id: sku_id,
      num: num,
      data_id: data_id,
    };
    req.reqData(url, reqData,
      function (res) {
        wx.navigateTo({
          url: '/pages/productDetail/payOrderDetail/payOrderDetail?sku_id=' + that.data.sku_id + '&num=' + 1 + '&data_id=' + that.data.data_id
        })

      });
   
  },1000),






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

    var url = 'api/product/getProductDetail4Score';

    var param = {
      spu_id: that.data.spu_id,
      data_id: that.data.data_id,
      sku_id: that.data.sku_id
    };
    req.reqData(url, param,
      function (res) {
        if (res.data.returnCode == 0) {
          var data = res.data.data;
          //console.log(res);
          wx.setNavigationBarTitle({
            title: data.name
          })
          that.setData({
            productInfo: data,
            coupon_count: data.coupon_count,
            images: data.main_images,
            shop_id: data.shop_id,
            shop_name: data.shop_name,
            share_image_url: data.qrcode,
            dataloaded: 1,
          });


        }
      },
      function (res) {

      });


  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


  btnShare: function (e) {
    var app = getApp();
    app.aldstat.sendEvent('商品详情-分享到朋友圈', {
      'shop_id': this.data.shop_id,
    });
    this.setData({
      shareMaskShow: 1,
      noscroll: 1,
      itemMask: 0,
      maskShow: 0,
    })
  },

  // 关闭二维码蒙层
  closeMask() {
    this.setData({
      shareMaskShow: 0,
      noscroll: 0,
      maskShow: false,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var member_id = wx.getStorageSync('member_id');
    if (!member_id) {
      member_id = '';
    }
    this.setData({
      noscroll: false,
      maskShow: false,
      itemMask: 0,
    })
    var app = getApp();
    app.aldstat.sendEvent('商品详情页-分享', {
      'shop_id': that.data.shop_id + '',
      'product_id': that.data.spu_id + '',
    });

    var my_home_flag = wx.getStorageSync('my_home_flag');
    var user_id = wx.getStorageSync('wx_id');
    var entity_type;
    var entity_id;
    if (my_home_flag == 1) {
      entity_type = 'e_home'
    }
    if (my_home_flag == 2) {
      entity_type = 's_home'
    }
    if (my_home_flag == 3) {
      entity_type = 'm_home'
    }
    entity_id = wx.getStorageSync('my_home_id');
    if (!entity_id) {
      entity_id = 0;
    }

    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    // }
    return {
      title: that.data.productInfo.name,
      path: 'pages/productDetail/productDetail?from_member_id=' + member_id + '&register_channel=wxapp_share' + '&from_user_id=' + user_id + '&spu_id=' + that.data.spu_id + '&data_id=' + that.data.data_id + '&entity_type=' + entity_type + '&entity_id=' + entity_id,
      success: function (res) {
        // 转发成功

      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})