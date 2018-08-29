var express = require('express');
var router = express();
var request = require('request');


router.io=function (io) {
    io.on("connection",function(socket){
        var obj = {
            data:"连接成功..."
        }
        socket.emit("frist",escape(JSON.stringify(obj)));
        setInterval(function () {
            getDatas(function (data) {
                socket.emit("receive",escape(JSON.stringify(data)))
            });
        },10000);
    })
};

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});

router.get('/getDatas', function (req, res) {

    var {page} = req.query;
    var url = 'https://m.weibo.cn/api/container/getIndex?containerid=100103type%3D61%26q%3D亚运会%26t%3D0&page_type=searchall&page='+page;
    getDatas(url,function (data) {
        res.end(JSON.stringify(data));
    })
})

function getDatas(url,callback){
    if(typeof url == 'function'){
        var callback = url;
        var url = 'https://m.weibo.cn/api/container/getIndex?containerid=100103type%3D61%26q%3D亚运会%26t%3D0&page_type=searchall';
    }
    var url = encodeURI(url);
    console.log(url);
    request({
        url: url,
        method: "get"
    },function (err,response,body) {
        if(err){
            callback({mes:'err'});
        }else {
            if(!JSON.parse(response.body).data){
                callback({mes:'err'});
            }else {
                var data = JSON.parse(response.body).data.cards[0].card_group;
                callback(data);
            }

        }

    });
}
module.exports = router;

// var reqData = {
//     code:'831869bfc35575bf2f0d02202e2e6912',
//     client_id:'1841855414',
//     client_secret:'dd94e4553443396abb931dce5ea4b5c8',
//     grant_type:'authorization_code',
//     redirect_uri:'https://api.weibo.com/oauth2/default.html'
// };