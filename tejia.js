jQuery(document).ready(function($) {
    //女装 裙装 
    var root = "https://data.800-taobao.com/";
    async.waterfall([
        function(callback) {
            $.ajax({
                type: "GET",
                url: root + "api/v2/tejiacategories",
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

                        var xhr = new XMLHttpRequest();
                        var url = item.url.replace("callback=?","callback=callback");
                        xhr.open("GET", url, true);
                        xhr.onreadystatechange = function() {
                            if (xhr.readyState == 4) {
                                // JSON.parse does not evaluate the attacker's scripts.
                                var resp = xhr.responseText;
                                resp=resp.replace("callback(","").replace("})","}").replace("\\\&#39;s","");
                                cb(null, jQuery.parseJSON(resp));
                            }
                        }
                        xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
                        xhr.send();


                    },
                    function(json, cb) {
                        var data = {
                            category: item._id,
                            itemList: json.data,
                            picServer: json.picServer
                        };
                        $.ajax({
                            type: "POST",
                            url: root + "api/v3/tejia",
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
