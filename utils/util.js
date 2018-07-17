function convertToStarsArray(stars) {
  var num = stars.toString().substring(0, 1);
  var num_2 = stars.toString().substring(1, 2);
  var array = [];
  for (var i = 0; i < num; i++) {
    array.push(1);
  }
  if (num_2 > 0) {
    array.push(2);
  }
  while (array.length < 5) {
    array.push(0);
  }
  return array;
}

function http(url, callBack) {
  wx.request({
    url: url,
    method: 'GET',
    header: {
      "Content-Type": "json"
    },
    success: function (res) {
      callBack(res.data);
    },
    fail: function (error) {
      console.log(error)
    }
  })
}

module.exports = {
  convertToStarsArray: convertToStarsArray,
  http: http
}