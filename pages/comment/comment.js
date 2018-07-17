var util = require('../../utils/util.js')
var app = getApp();

Page({
  data: {
    winHeight: 0,
    currentTab: 0,
    comments: [],
    reviews: []
  },
  onLoad: function (options) {
    var that = this;
    var mid = options.mid;
    var dataUrl = "";
    dataUrl = app.globalData.doubanBase + "/v2/movie/subject/" + mid;
    this.data.requestUrl = dataUrl;
   
    util.http(dataUrl, this.processDoubanData);

    wx.setNavigationBarTitle({
      title: "全部短评"
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winHeight: res.windowHeight
        });
      },
    })
  },
  processDoubanData: function (commentData) {
    var comments = [];
    var reviews = [];
    for (var c in commentData.popular_comments) {
      var comment = commentData.popular_comments[c];
      //console.log(commentData.popular_comments[c].author.name);
      var temp = {
        author: comment.author.name,
        avatar: comment.author.avatar,
        date: comment.created_at,
        aid: comment.id,
        stars: util.convertToStarsArray(comment.rating.value),
        content: comment.content
      };
      comments.push(temp);
    }
    //console.log(commentData.popular_reviews);
    for (var r in commentData.popular_reviews) {
      var review = commentData.popular_reviews[r];
      var temp2 = {
        id: review.id,
        author: review.author.name,
        avatar: review.author.avatar,
        date: review.created_at,
        aid: review.id,
        stars: util.convertToStarsArray(review.rating.value),
        content: review.summary
      };
      reviews.push(temp2);
    }

    //console.log(comments);
    console.log(reviews);

    this.setData({
      comments: comments,
      reviews: reviews
    });
  },
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  switchNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current
      });
    }
  }
})