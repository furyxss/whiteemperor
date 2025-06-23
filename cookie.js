var r = { "cityTransportOption": "", "sameCityDistributionOption": 0, "promiseDeliveryTime": 0, "promiseDeliveryOption": "", "expressGotStatusDelayGray": true, "orderSn": "", "trackingNumber": "", "goodsId": "", "goodsName": "", "receiveName": "", "orderType": 1, "afterSaleType": 1, "remarkStatus": -1, "urgeShippingStatus": -1, "groupStartTime": 1742873111, "groupEndTime": 1750649111, "pageNumber": 1, "pageSize": 20, "source": "MMS", "remarkType": 0, "urgeExpressType": 0, "noticeBarStatus": 99, "mobile": "", "quickGroupTime": 90, "groupTime": ["2025-03-25T03:25:10.785Z", "2025-06-23T03:25:10.786Z"], "lastTime": 0, "lastStartTime": null, "lastEndTime": null, "quickSearchType": 0, "sortType": 10, "sortTypeSelectValues": 4, "typeSortOptions": [{ "label": "最先超时订单在上", "value": 4, "trackingSn": 52175 }, { "label": "最先超时订单在下", "value": 3, "trackingSn": 52164 }, { "label": "最新成交订单在上", "value": 1, "trackingSn": 64955 }, { "label": "最新成交订单在下", "value": 2, "trackingSn": 64954 }], "promiseDeliveryStartTime": null, "promiseDeliveryEndTime": null, "delayShippingStatus": 0, "showCheckegionBlackDelayShipping": true, "hideRegionBlackDelayShipping": null }

Ma = function (e, t, r, n) {
    return new (r || (r = Promise))((function (o, a) {
        function i(e) {
            try {
                c(n.next(e))
            } catch (t) {
                a(t)
            }
        }
        function l(e) {
            try {
                c(n.throw(e))
            } catch (t) {
                a(t)
            }
        }
        function c(e) {
            var t;
            e.done ? o(e.value) : (t = e.value,
                t instanceof r ? t : new r((function (e) {
                    e(t)
                }
                ))).then(i, l)
        }
        c((n = n.apply(e, t || [])).next())
    }
    ))
}

Na = function (e, t) {
    var r, n, o, a, i = {
        label: 0,
        sent: function () {
            if (1 & o[0])
                throw o[1];
            return o[1]
        },
        trys: [],
        ops: []
    };
    return a = {
        next: l(0),
        throw: l(1),
        return: l(2)
    },
        "function" === typeof Symbol && (a[Symbol.iterator] = function () {
            return this
        }
        ),
        a;
    function l(a) {
        return function (l) {
            return function (a) {
                if (r)
                    throw new TypeError("Generator is already executing.");
                for (; i;)
                    try {
                        if (r = 1,
                            n && (o = 2 & a[0] ? n.return : a[0] ? n.throw || ((o = n.return) && o.call(n),
                                0) : n.next) && !(o = o.call(n, a[1])).done)
                            return o;
                        switch (n = 0,
                        o && (a = [2 & a[0], o.value]),
                        a[0]) {
                            case 0:
                            case 1:
                                o = a;
                                break;
                            case 4:
                                return i.label++,
                                {
                                    value: a[1],
                                    done: !1
                                };
                            case 5:
                                i.label++,
                                    n = a[1],
                                    a = [0];
                                continue;
                            case 7:
                                a = i.ops.pop(),
                                    i.trys.pop();
                                continue;
                            default:
                                if (!(o = (o = i.trys).length > 0 && o[o.length - 1]) && (6 === a[0] || 2 === a[0])) {
                                    i = 0;
                                    continue
                                }
                                if (3 === a[0] && (!o || a[1] > o[0] && a[1] < o[3])) {
                                    i.label = a[1];
                                    break
                                }
                                if (6 === a[0] && i.label < o[1]) {
                                    i.label = o[1],
                                        o = a;
                                    break
                                }
                                if (o && i.label < o[2]) {
                                    i.label = o[2],
                                        i.ops.push(a);
                                    break
                                }
                                o[2] && i.ops.pop(),
                                    i.trys.pop();
                                continue
                        }
                        a = t.call(e, i)
                    } catch (l) {
                        a = [6, l],
                            n = 0
                    } finally {
                        r = o = 0
                    }
                if (5 & a[0])
                    throw a[1];
                return {
                    value: a[0] ? a[1] : void 0,
                    done: !0
                }
            }([a, l])
        }
    }
};

Aa.b = ["orderSn", "trackingNumber", "goodsId", "mobile", "receiveName", "orderType", "remarkStatus", "remarkTag", "orderStartTime", "orderEndTime", "lastStartTime", "lastEndTime", "hideRegionBlackDelayShipping", "pageNumber", "pageSize", "source", "crawlerInfo", "sortType", "consolidateTypeList", "virtualMobile", "extNumber", "extraPackageStatus", "extraPackageTypeList"];
Aa.c = ['orderSn', 'trackingNumber', 'goodsId', 'goodsName', 'receiveName', 'orderType', 'afterSaleType', 'remarkStatus', 'urgeShippingStatus', 'remarkTag', 'groupStartTime', 'groupEndTime', 'lastStartTime', 'mobile', 'virtualMobile', 'extNumber', 'lastEndTime', 'pageNumber', 'pageSize', 'sortType', 'promiseDeliveryOption', 'hideRegionBlackDelayShipping', 'sameCityDistributionOption', 'promiseDeliveryStartTime', 'promiseDeliveryEndTime', 'cityTransportOption', 'startShippingTime', 'endShippingTime', 'consolidateTypeList', 'forceDeliveryTypeList', 'forceExpressType', 'extraPackageTypeList', 'delayShippingStatus'];

ye.f = function s(e, t) {
            var r = e || {}
              , n = r.combinateMobile
              , s = r.mobile
              , u = n && Array.isArray(n)
              , d = {};
            u && (d = n[0] || n[1] ? {
                virtualMobile: n[0] || "",
                extNumber: n[1] || ""
            } : {});
            var p = c(e, t) || {}
              , f = p.sameCityDistributionOption
              , m = p.extraPackageTypeList
              , h = p.delayShippingStatus
              , v = l(p, ["sameCityDistributionOption", "extraPackageTypeList", "delayShippingStatus"]);
            return i(i(i(i(i({}, v), (null === m || void 0 === m ? void 0 : m.length) ? (null === m || void 0 === m ? void 0 : m.indexOf(a.a.NONE)) > -1 ? {
                extraPackageStatus: 1
            } : {
                extraPackageTypeList: m
            } : {}), 0 === f ? {} : {
                sameCityDistributionOption: f
            }), u ? d : {
                mobile: n || s
            }), h === o.a.UNLIMITED ? {} : {
                delayShippingStatus: h
            })
        };

Ze.e =  c = function(e) {
            return a(void 0, void 0, void 0, (function() {
                return i(this, (function(t) {
                    return [2, Object(n.post)("/mangkhut/mms/recentOrderList", e)]
                }
                ))
            }
            ))
        };
var t = false;
queryOrderList = function (r) {
    return Ma(e, void 0, void 0, (function () {
        return Na(this, (function (e) {
            return t ? [2, (n = Object(ye.f)(r, Aa.b),
                Object(j.post)("/mangkhut/mms/deliveryScheduleOrderList", n).then((function (e) {
                    return Ra(Ra({}, e), {
                        pageItems: e.pageItems.map((function (e) {
                            return Ra(Ra({}, e), {
                                __isPartialShipApi: !0
                            })
                        }
                        ))
                    })
                }
                )))] : [2, Object(Ze.e)(Object(ye.f)(r, Aa.c))];
            var n
        }
        ))
    }
    ))
}

