jQuery(document).ready(function($) {
    //女装 裙装 
    var root = "https://data.800-taobao.com/";
    // var root = "https://127.0.0.1:3001/";
    async.waterfall([
        function(callback) {
            $.ajax({
                type: "GET",
                url: root + "api/v2/qiangcategories",
                success: function(data) {
                    callback(null, data);
                },
                failure: function(errMsg) {
                    callback(errMsg, data);
                }
            });
        },
        function(data, callback) {

            async.eachSeries(data.results, function iterator(item, callback2) {
                async.waterfall([
                    function(cb) {
                        // console.log(item.url);
                        $.get(item.url, function(json, textStatus) {
                            cb(null, json);
                        });
                    },
                    function(result, cb) {
                        var json = {};
                        json.itemList = [];
                        $("<div></div>").html(result).find('.qg-category-list .qg-ing').each(function(index, el) {
                            var item = {};
                            item.href = $(el).attr("href");
                            if($(el).find("img").attr("data-ks-lazyload")){
                                item.img = $(el).find("img").attr("data-ks-lazyload").replace("_440x440q90.jpg_.webp", "");
                            }else{
                                item.img = $(el).find("img").attr("src").replace("_440x440q90.jpg_.webp", "");
                            }
                            item.itemId = item.href.split("id=")[1].split("&")[0];
                            item.name = $(el).find(".qg-detail .des").text();
                            item.price = {
                                original: $(el).find(".price .original-price i").text(),
                                promo: $(el).find(".price .promo-price em").text()
                            };
                            if($(el).find(".process .process-text").text().search("准时开抢")>0){
                                item.startDate = +new Date((new Date()).toDateString()+" "+$(el).find(".process .process-text span").text().split(" ")[1].replace("准时开抢",""));
                            }else{
                                item.startDate = +new Date();
                            }

                            json.itemList.push(item);
                        });

                        var data = {
                            category: item._id,
                            itemList: json.itemList
                        };
                        $.ajax({
                            type: "POST",
                            url: root + "api/v2/qiang",
                            data: JSON.stringify(data),
                            contentType: "application/json; charset=utf-8",
                            success: function() {
                                cb(null);
                            }
                        });
                    }
                ], function(err, data) {
                    callback2(null);
                });
            }, function done(err) {
                callback(err, "done");
            });


        }
    ], function(err, data) {
        alert("采集完成！");
    });

});
