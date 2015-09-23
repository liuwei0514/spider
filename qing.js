jQuery(document).ready(function($) {
    //女装 裙装	
    var root = "https://data.800-taobao.com/";
    async.waterfall([
        function(callback) {
            $.ajax({
                type: "GET",
                url: root + "api/v2/qingcategories",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
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
                        $.getJSON(item.url, function(json, textStatus) {
                            cb(null, json);
                        });
                    },
                    function(json, cb) {
                        var data = {
                            category: item._id,
                            itemList: json.itemList
                        };
                        $.ajax({
                            type: "POST",
                            url: root + "api/v3/qing",
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
