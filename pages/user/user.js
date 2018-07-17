
var app = getApp();

Page({
  data: {
    user: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userUrl = app.globalData.doubanBase + "/v2/user/1000001";
    this.getUserData(userUrl);

  },
  getUserData: function (url) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        that.processDoubanData(res.data);
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  processDoubanData: function (user) {
    var user = {
      id:user.id,                                          
      name: user.name,
      avatar: user.avatar
    }
    this.setData({ user: user });
  }
})