jQuery(document).ready(function($) {
    //女装 裙装	
    async.waterfall([
        function(callback) {
            $.ajax({
                type: "GET",
                url: "http://localhost:3000/api/v2/productcategories",
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
                            categoryName: item.name,
                            itemList: json.itemList
                        };
                        $.ajax({
                            type: "POST",
                            url: "http://localhost:3000/api/v2/products",
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
