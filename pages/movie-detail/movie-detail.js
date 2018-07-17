var util = require('../../utils/util.js')
var app = getApp();

Page({
  data: {
    movie: []
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '拼命加载中...'
    })
    var mid = options.mid;
    var dataUrl = "";
    dataUrl = app.globalData.doubanBase + "/v2/movie/subject/" + mid;
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.processDoubanData);
  },
  processDoubanData: function (movieData) {
    var movie = [];
    var genres = [];
    var actors = [];
    var comments = [];
    for (var i in movieData.genres) {
      genres.push(movieData.genres[i]);
    }
    for (var j in movieData.casts) {
      actors.push(movieData.casts[j].name);
    }
    for(var c in movieData.popular_comments){
      var temp = {
        author: movieData.popular_comments[c].author.name,
        avatar: movieData.popular_comments[c].author.avatar,
        date: movieData.popular_comments[c].created_at,
        aid: movieData.popular_comments[c].id,
        stars: util.convertToStarsArray(movieData.popular_comments[c].rating.value),
        content: movieData.popular_comments[c].content
      };
      comments.push(temp);
    }
    
    var movie = {
      id: movieData.id,
      title: movieData.title,
      simage: movieData.images.small,
      bimage: movieData.images.large,
      average: movieData.rating.average,
      stars: util.convertToStarsArray(movieData.rating.stars),
      genres: movieData.durations[0] + genres.join(' / '),
      pubdate: movieData.pubdates[0] + "  上映",
      casts: actors.join(' / '),
      collect_count:movieData.collect_count,
      comments_count: movieData.comments_count,
      comments: comments,
      summary: movieData.summary
    };
    
    wx.setNavigationBarTitle({
      title: movieData.title
    })
    this.setData({ movie: movie });
    wx.hideLoading();
  },
  moreCommentTap: function(event){
    var mid = event.currentTarget.dataset.mid;
    wx.navigateTo({
      url: '../comment/comment?mid='+mid
    })
  }
});