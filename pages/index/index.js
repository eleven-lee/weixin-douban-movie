var util = require('../../utils/util.js')
var app = getApp();

Page({
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult:{},
    containerShow:true,
    searchPanelShow:false
  },
  onLoad: function (event) {
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters?start=0&count=8";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250?start=0&count=8";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon?start=0&count=8";

    this.getMovieListData(inTheatersUrl, "inTheaters", "近期上映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "热门电影");
    this.getMovieListData(top250Url, "top250", "电视剧");
  },
  getMovieListData: function (url, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        that.processDoubanData(res.data, settedKey, categoryTitle)
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
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

    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    }

    this.setData(readyData);
  },
  onbindFocus:function(){
    this.setData({
      containerShow: false,
      searchPanelShow: true
    });
  },
  onBindConfirm:function(event){
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase +"/v2/movie/search?q="+text;
    this.getMovieListData(searchUrl,"searchResult","");
  },
  onCloseSearchTap:function(event){
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult:{},
      text:""
    });
  },
  onMoreTap: function (event) {
    var typeId = event.currentTarget.dataset.typeId;
    wx.navigateTo({
      url: '../list/list?typeId=' + typeId
    })
  },
  onMovieTap: function (event) {
    var mid = event.currentTarget.dataset.mid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?mid=' + mid
    })
  },
  searchTap: function (event) {
    wx.redirectTo({
      url: '../search/search'
    })
  }

});