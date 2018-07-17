var util = require('../../utils/util.js')
var app = getApp();

Page({
  data: {
    movies: {},
    requestUrl: "",
    totalCount: 0,
    isEmpty: true
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '拼命加载中...',
    })
    var typeId = options.typeId;
    var dataUrl = "";
    this.data.navigateTitle = typeId;
    switch (typeId) {
      case "近期上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "热门电影":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "电视剧":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    dataUrl = dataUrl + "?count=18";
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.processDoubanData);

  },
  onReady: function () {

  },
  onReachBottom: function (event) {
    var nextUrl = this.data.requestUrl + "?star=" + this.data.totalCount + "&count=18";
    util.http(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  onPullDownRefresh: function (event) {
    console.log(refreshUrl);
    var refreshUrl = this.data.requestUrl + "?star=0&count=18";
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  processDoubanData: function (moviesDouban) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;

      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    var totalMovies = {};

    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }

    this.setData({ movies: totalMovies });

    this.data.totalCount += 18;
    wx.hideLoading();
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  onMovieTap: function (event) {
    var mid = event.currentTarget.dataset.mid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?mid=' + mid
    })
  }
});