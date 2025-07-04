
return {
    beforeSend: function (r) {
        try {
            var n = r.init
                , o = void 0 === n ? {} : n
                , i = o.spiderFont;
            return i ? (Lt || (Lt = function (t, e) {
                var r = {};
                return e !== !!e && (r = {
                    font_types: e
                }),
                    new Promise((function (e) {
                        t("https://api.yangkeduo.com/api/phantom/web/en/ft", {
                            body: JSON.stringify(gt({
                                scene: "cp_b_data_center"
                            }, r)),
                            method: "POST",
                            headers: {
                                "Content-type": "application/json; charset=utf-8"
                            }
                        }).then((function (t) {
                            200 === t.status ? t.json().then((function (t) {
                                e(t)
                            }
                            )) : e(null)
                        }
                        )).catch((function () {
                            e(null)
                        }
                        ))
                    }
                    ))
            }(t.rawFetch, i)),
                Promise.resolve(Lt).then((function (t) {
                    if (t) {
                        var n, i, a = "@font-face\n        {\n        font-family: 'spider-font';\n        src: url('" + t.ttf_url + "') format('truetype');\n        } .__spider_font {\n          font-family: 'spider-font' !important;\n        } ", u = t.font_type_vos, c = void 0 === u ? [] : u;
                        c.forEach((function (t) {
                            a += "@font-face\n          {\n          font-family: '_" + t.font_type + "';\n          src: url('" + t.ttf_url + "') format('truetype');\n          } .__" + t.font_type + " {\n            font-family: '_" + t.font_type + "', '" + t.font_type + "' !important;\n          } "
                        }
                        ));
                        var s = "spider-" + (null === (n = t.ttf_url) || void 0 === n ? void 0 : n.split("/")[(null === (i = t.ttf_url) || void 0 === i ? void 0 : i.split("/").length) - 1]) + "," + c.map((function (t) {
                            var e, r;
                            return t.font_type + "-" + (null === (e = t.ttf_url) || void 0 === e ? void 0 : e.split("/")[(null === (r = t.ttf_url) || void 0 === r ? void 0 : r.split("/").length) - 1])
                        }
                        )).join(",");
                        return document.querySelector('style[data-id="' + s + '"]') || function (t, e) {
                            var r = document
                                , n = r.createElement("style");
                            if (n.setAttribute("data-id", e),
                                n.setAttribute("type", "text/css"),
                                n.styleSheet)
                                n.styleSheet.cssText = t;
                            else {
                                var o = r.createTextNode(t);
                                n.appendChild(o)
                            }
                            var i = r.getElementsByTagName("head");
                            i.length ? i[0].appendChild(n) : r.documentElement.appendChild(n)
                        }(a, s),
                            gt({}, r, {
                                init: gt({}, o, {
                                    headers: gt({
                                        webSpiderRule: t.web_spider_rule
                                    }, null === o || void 0 === o ? void 0 : o.headers)
                                })
                            })
                    }
                    e({
                        url: "/api/phantom/web/en/ft",
                        name: "ApiSpiderError",
                        message: "\u98ce\u63a7\u8bf7\u6c42\u5931\u8d25\uff0c\u8d70\u5230\u4e86\u964d\u7ea7\u8bf7\u6c42"
                    });
                    var f = o.body;
                    if ("string" === typeof o.body) {
                        var d = o.body ? JSON.parse(o.body) : {};
                        f = JSON.stringify(gt({}, d, {
                            sign: "drZtFdOb"
                        }))
                    }
                    return gt({}, r, {
                        init: gt({}, o, {
                            body: f,
                            headers: gt({}, null === o || void 0 === o ? void 0 : o.headers)
                        })
                    })
                }
                ))) : Promise.resolve(r)
        } catch (a) {
            return Promise.reject(a)
        }
    },
    DEBUG_NAME: "fetch-plugin-spider"
}