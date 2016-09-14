!function(e) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = e(); else if ("function" == typeof define && define.amd) define([], e); else {
        var n;
        n = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, 
        n.pingpp = e();
    }
}(function() {
    return function e(n, t, r) {
        function i(o, l) {
            if (!t[o]) {
                if (!n[o]) {
                    var c = "function" == typeof require && require;
                    if (!l && c) return c(o, !0);
                    if (a) return a(o, !0);
                    var d = new Error("Cannot find module '" + o + "'");
                    throw d.code = "MODULE_NOT_FOUND", d;
                }
                var u = t[o] = {
                    exports: {}
                };
                n[o][0].call(u.exports, function(e) {
                    var t = n[o][1][e];
                    return i(t ? t : e);
                }, u, u.exports, e, n, t, r);
            }
            return t[o].exports;
        }
        for (var a = "function" == typeof require && require, o = 0; o < r.length; o++) i(r[o]);
        return i;
    }({
        1: [ function(e, n, t) {
            n.exports = {
                userCallback: void 0,
                innerCallback: function(e, n) {
                    "function" == typeof this.userCallback && ("undefined" == typeof n && (n = this.error()), 
                    this.userCallback(e, n), this.userCallback = void 0);
                },
                error: function(e, n) {
                    return e = "undefined" == typeof e ? "" : e, n = "undefined" == typeof n ? "" : n, 
                    {
                        msg: e,
                        extra: n
                    };
                }
            };
        }, {} ],
        2: [ function(e, n, t) {
            var r = e("../utils"), i = e("../mods"), a = {}.hasOwnProperty;
            n.exports = {
                ALIPAY_WAP_URL_OLD: "https://wappaygw.alipay.com/service/rest.htm",
                ALIPAY_WAP_URL: "https://mapi.alipay.com/gateway.do",
                handleCharge: function(e) {
                    var n = e.channel, t = e.credential[n], o = this.ALIPAY_WAP_URL;
                    a.call(t, "req_data") ? o = this.ALIPAY_WAP_URL_OLD : a.call(t, "channel_url") && (o = t.channel_url), 
                    a.call(t, "_input_charset") || (t._input_charset = "utf-8");
                    var l = r.stringifyData(t, n, !0), c = o + "?" + l, d = i.getExtraModule("ap");
                    r.inWeixin() && "undefined" != typeof d ? d.pay(c) : r.redirectTo(c);
                }
            };
        }, {
            "../mods": 9,
            "../utils": 12
        } ],
        3: [ function(e, n, t) {
            var r = e("../callbacks"), i = e("../utils"), a = e("../stash"), o = e("../mods"), l = {}.hasOwnProperty;
            n.exports = {
                PINGPP_NOTIFY_URL_BASE: "https://api.pingxx.com/notify/charges/",
                handleCharge: function(e) {
                    for (var n = e.credential[e.channel], t = [ "appId", "timeStamp", "nonceStr", "package", "signType", "paySign" ], i = 0; i < t.length; i++) if (!l.call(n, t[i])) return void r.innerCallback("fail", r.error("invalid_credential", "missing_field_" + t[i]));
                    a.jsApiParameters = n, this.callpay();
                },
                callpay: function() {
                    var e = this, n = o.getExtraModule("wx_jssdk");
                    if ("undefined" != typeof n && n.jssdkEnabled()) n.callpay(); else if ("undefined" == typeof WeixinJSBridge) {
                        var t = function() {
                            e.jsApiCall();
                        };
                        document.addEventListener ? document.addEventListener("WeixinJSBridgeReady", t, !1) : document.attachEvent && (document.attachEvent("WeixinJSBridgeReady", t), 
                        document.attachEvent("onWeixinJSBridgeReady", t));
                    } else this.jsApiCall();
                },
                jsApiCall: function() {
                    l.call(a, "jsApiParameters") && WeixinJSBridge.invoke("getBrandWCPayRequest", a.jsApiParameters, function(e) {
                        delete a.jsApiParameters, "get_brand_wcpay_request:ok" == e.err_msg ? r.innerCallback("success") : "get_brand_wcpay_request:cancel" == e.err_msg ? r.innerCallback("cancel") : r.innerCallback("fail", r.error("wx_result_fail", e.err_msg));
                    });
                },
                runTestMode: function(e) {
                    var n = confirm("模拟付款？");
                    n && i.request(this.PINGPP_NOTIFY_URL_BASE + e.id + "?livemode=false", "GET", null, function(e, n) {
                        if (n >= 200 && n < 400 && "success" == e) r.innerCallback("success"); else {
                            var t = "http_code:" + n + ";response:" + e;
                            r.innerCallback("fail", r.error("testmode_notify_fail", t));
                        }
                    }, function() {
                        r.innerCallback("fail", r.error("network_err"));
                    });
                }
            };
        }, {
            "../callbacks": 1,
            "../mods": 9,
            "../stash": 10,
            "../utils": 12
        } ],
        4: [ function(e, n, t) {
            var r = e("../utils"), i = e("../callbacks"), a = {}.hasOwnProperty;
            n.exports = {
                handleCharge: function(e) {
                    var n = e.credential[e.channel];
                    "string" == typeof n ? r.redirectTo(n) : "object" == typeof n && a.call(n, "url") ? r.redirectTo(n.url) : i.innerCallback("fail", i.error("invalid_credential", "credential 格式不正确"));
                }
            };
        }, {
            "../callbacks": 1,
            "../utils": 12
        } ],
        5: [ function(e, n, t) {
            var r = e("./utils"), i = e("./stash"), a = e("./libs/md5"), o = {
                seperator: "###",
                limit: 1,
                report_url: "https://statistics.pingxx.com/one_stats",
                timeout: 100
            }, l = function(e, n) {
                var t = new RegExp("(^|&)" + n + "=([^&]*)(&|$)", "i"), r = e.substr(0).match(t);
                return null !== r ? unescape(r[2]) : null;
            }, c = function() {
                return navigator.userAgent;
            }, d = function() {
                return window.location.host;
            };
            o.store = function(e) {
                if ("undefined" != typeof localStorage && null !== localStorage) {
                    var n = this, t = {};
                    t.app_id = e.app_id || i.app_id || "app_not_defined", t.ch_id = e.ch_id || "", t.channel = e.channel || "", 
                    t.type = e.type || "", t.user_agent = c(), t.host = d(), t.time = new Date().getTime(), 
                    t.puid = i.puid;
                    var r = "app_id=" + t.app_id + "&channel=" + t.channel + "&ch_id=" + t.ch_id + "&host=" + t.host + "&time=" + t.time + "&type=" + t.type + "&user_agent=" + t.user_agent + "&puid=" + t.puid;
                    "undefined" == typeof localStorage.PPP_ONE_STATS || 0 === localStorage.PPP_ONE_STATS.length ? localStorage.PPP_ONE_STATS = r : localStorage.PPP_ONE_STATS = localStorage.PPP_ONE_STATS + n.seperator + r;
                }
            }, o.send = function() {
                if ("undefined" != typeof localStorage && null !== localStorage) {
                    var e = this;
                    if (!("undefined" == typeof localStorage.PPP_ONE_STATS || localStorage.PPP_ONE_STATS.split(e.seperator).length < e.limit)) try {
                        for (var n = [], t = localStorage.PPP_ONE_STATS.split(e.seperator), i = a(t.join("&")), o = 0; o < t.length; o++) n.push({
                            app_id: l(t[o], "app_id"),
                            channel: l(t[o], "channel"),
                            ch_id: l(t[o], "ch_id"),
                            host: l(t[o], "host"),
                            time: l(t[o], "time"),
                            type: l(t[o], "type"),
                            user_agent: l(t[o], "user_agent"),
                            puid: l(t[o], "puid")
                        });
                        r.request(e.report_url, "POST", n, function(e, n) {
                            200 == n && localStorage.removeItem("PPP_ONE_STATS");
                        }, void 0, {
                            "X-Pingpp-Report-Token": i
                        });
                    } catch (e) {}
                }
            }, o.report = function(e) {
                var n = this;
                n.store(e), setTimeout(function() {
                    n.send();
                }, n.timeout);
            }, n.exports = o;
        }, {
            "./libs/md5": 7,
            "./stash": 10,
            "./utils": 12
        } ],
        6: [ function(e, n, t) {
            var r = e("./stash"), i = e("./utils"), a = e("./collection");
            n.exports = {
                SRC_URL: "https://cookie.pingxx.com",
                init: function() {
                    var e = this;
                    i.documentReady(function() {
                        e.initPuid();
                    });
                },
                initPuid: function() {
                    if ("undefined" != typeof window && "undefined" != typeof localStorage) {
                        var e;
                        if ("undefined" == typeof localStorage.pingpp_uid ? (e = i.randomString(), localStorage.pingpp_uid = e) : e = localStorage.pingpp_uid, 
                        r.puid = e, !document.getElementById("p_analyse_iframe")) {
                            var n = document.createElement("iframe");
                            n.id = "p_analyse_iframe", n.src = this.SRC_URL + "/?puid=" + e, n.style.display = "none", 
                            document.body.appendChild(n);
                        }
                        setTimeout(function() {
                            a.send();
                        }, 0);
                    }
                }
            };
        }, {
            "./collection": 5,
            "./stash": 10,
            "./utils": 12
        } ],
        7: [ function(e, n, t) {
            !function() {
                function e(e, n) {
                    var t = (65535 & e) + (65535 & n), r = (e >> 16) + (n >> 16) + (t >> 16);
                    return r << 16 | 65535 & t;
                }
                function t(e, n) {
                    return e << n | e >>> 32 - n;
                }
                function r(n, r, i, a, o, l) {
                    return e(t(e(e(r, n), e(a, l)), o), i);
                }
                function i(e, n, t, i, a, o, l) {
                    return r(n & t | ~n & i, e, n, a, o, l);
                }
                function a(e, n, t, i, a, o, l) {
                    return r(n & i | t & ~i, e, n, a, o, l);
                }
                function o(e, n, t, i, a, o, l) {
                    return r(n ^ t ^ i, e, n, a, o, l);
                }
                function l(e, n, t, i, a, o, l) {
                    return r(t ^ (n | ~i), e, n, a, o, l);
                }
                function c(n, t) {
                    n[t >> 5] |= 128 << t % 32, n[(t + 64 >>> 9 << 4) + 14] = t;
                    var r, c, d, u, s, f = 1732584193, p = -271733879, h = -1732584194, _ = 271733878;
                    for (r = 0; r < n.length; r += 16) c = f, d = p, u = h, s = _, f = i(f, p, h, _, n[r], 7, -680876936), 
                    _ = i(_, f, p, h, n[r + 1], 12, -389564586), h = i(h, _, f, p, n[r + 2], 17, 606105819), 
                    p = i(p, h, _, f, n[r + 3], 22, -1044525330), f = i(f, p, h, _, n[r + 4], 7, -176418897), 
                    _ = i(_, f, p, h, n[r + 5], 12, 1200080426), h = i(h, _, f, p, n[r + 6], 17, -1473231341), 
                    p = i(p, h, _, f, n[r + 7], 22, -45705983), f = i(f, p, h, _, n[r + 8], 7, 1770035416), 
                    _ = i(_, f, p, h, n[r + 9], 12, -1958414417), h = i(h, _, f, p, n[r + 10], 17, -42063), 
                    p = i(p, h, _, f, n[r + 11], 22, -1990404162), f = i(f, p, h, _, n[r + 12], 7, 1804603682), 
                    _ = i(_, f, p, h, n[r + 13], 12, -40341101), h = i(h, _, f, p, n[r + 14], 17, -1502002290), 
                    p = i(p, h, _, f, n[r + 15], 22, 1236535329), f = a(f, p, h, _, n[r + 1], 5, -165796510), 
                    _ = a(_, f, p, h, n[r + 6], 9, -1069501632), h = a(h, _, f, p, n[r + 11], 14, 643717713), 
                    p = a(p, h, _, f, n[r], 20, -373897302), f = a(f, p, h, _, n[r + 5], 5, -701558691), 
                    _ = a(_, f, p, h, n[r + 10], 9, 38016083), h = a(h, _, f, p, n[r + 15], 14, -660478335), 
                    p = a(p, h, _, f, n[r + 4], 20, -405537848), f = a(f, p, h, _, n[r + 9], 5, 568446438), 
                    _ = a(_, f, p, h, n[r + 14], 9, -1019803690), h = a(h, _, f, p, n[r + 3], 14, -187363961), 
                    p = a(p, h, _, f, n[r + 8], 20, 1163531501), f = a(f, p, h, _, n[r + 13], 5, -1444681467), 
                    _ = a(_, f, p, h, n[r + 2], 9, -51403784), h = a(h, _, f, p, n[r + 7], 14, 1735328473), 
                    p = a(p, h, _, f, n[r + 12], 20, -1926607734), f = o(f, p, h, _, n[r + 5], 4, -378558), 
                    _ = o(_, f, p, h, n[r + 8], 11, -2022574463), h = o(h, _, f, p, n[r + 11], 16, 1839030562), 
                    p = o(p, h, _, f, n[r + 14], 23, -35309556), f = o(f, p, h, _, n[r + 1], 4, -1530992060), 
                    _ = o(_, f, p, h, n[r + 4], 11, 1272893353), h = o(h, _, f, p, n[r + 7], 16, -155497632), 
                    p = o(p, h, _, f, n[r + 10], 23, -1094730640), f = o(f, p, h, _, n[r + 13], 4, 681279174), 
                    _ = o(_, f, p, h, n[r], 11, -358537222), h = o(h, _, f, p, n[r + 3], 16, -722521979), 
                    p = o(p, h, _, f, n[r + 6], 23, 76029189), f = o(f, p, h, _, n[r + 9], 4, -640364487), 
                    _ = o(_, f, p, h, n[r + 12], 11, -421815835), h = o(h, _, f, p, n[r + 15], 16, 530742520), 
                    p = o(p, h, _, f, n[r + 2], 23, -995338651), f = l(f, p, h, _, n[r], 6, -198630844), 
                    _ = l(_, f, p, h, n[r + 7], 10, 1126891415), h = l(h, _, f, p, n[r + 14], 15, -1416354905), 
                    p = l(p, h, _, f, n[r + 5], 21, -57434055), f = l(f, p, h, _, n[r + 12], 6, 1700485571), 
                    _ = l(_, f, p, h, n[r + 3], 10, -1894986606), h = l(h, _, f, p, n[r + 10], 15, -1051523), 
                    p = l(p, h, _, f, n[r + 1], 21, -2054922799), f = l(f, p, h, _, n[r + 8], 6, 1873313359), 
                    _ = l(_, f, p, h, n[r + 15], 10, -30611744), h = l(h, _, f, p, n[r + 6], 15, -1560198380), 
                    p = l(p, h, _, f, n[r + 13], 21, 1309151649), f = l(f, p, h, _, n[r + 4], 6, -145523070), 
                    _ = l(_, f, p, h, n[r + 11], 10, -1120210379), h = l(h, _, f, p, n[r + 2], 15, 718787259), 
                    p = l(p, h, _, f, n[r + 9], 21, -343485551), f = e(f, c), p = e(p, d), h = e(h, u), 
                    _ = e(_, s);
                    return [ f, p, h, _ ];
                }
                function d(e) {
                    var n, t = "";
                    for (n = 0; n < 32 * e.length; n += 8) t += String.fromCharCode(e[n >> 5] >>> n % 32 & 255);
                    return t;
                }
                function u(e) {
                    var n, t = [];
                    for (t[(e.length >> 2) - 1] = void 0, n = 0; n < t.length; n += 1) t[n] = 0;
                    for (n = 0; n < 8 * e.length; n += 8) t[n >> 5] |= (255 & e.charCodeAt(n / 8)) << n % 32;
                    return t;
                }
                function s(e) {
                    return d(c(u(e), 8 * e.length));
                }
                function f(e, n) {
                    var t, r, i = u(e), a = [], o = [];
                    for (a[15] = o[15] = void 0, i.length > 16 && (i = c(i, 8 * e.length)), t = 0; t < 16; t += 1) a[t] = 909522486 ^ i[t], 
                    o[t] = 1549556828 ^ i[t];
                    return r = c(a.concat(u(n)), 512 + 8 * n.length), d(c(o.concat(r), 640));
                }
                function p(e) {
                    var n, t, r = "0123456789abcdef", i = "";
                    for (t = 0; t < e.length; t += 1) n = e.charCodeAt(t), i += r.charAt(n >>> 4 & 15) + r.charAt(15 & n);
                    return i;
                }
                function h(e) {
                    return unescape(encodeURIComponent(e));
                }
                function _(e) {
                    return s(h(e));
                }
                function g(e) {
                    return p(_(e));
                }
                function m(e, n) {
                    return f(h(e), h(n));
                }
                function y(e, n) {
                    return p(m(e, n));
                }
                function v(e, n, t) {
                    return n ? t ? m(n, e) : y(n, e) : t ? _(e) : g(e);
                }
                n.exports = v;
            }();
        }, {} ],
        8: [ function(e, n, t) {
            var r = e("./version").v, i = e("./testmode"), a = e("./callbacks"), o = e("./mods"), l = e("./stash"), c = e("./collection"), d = {}.hasOwnProperty, u = function() {
                e("./init").init();
            };
            u.prototype = {
                version: r,
                createPayment: function(e, n, t, r) {
                    "function" == typeof n && (a.userCallback = n);
                    var u;
                    if ("string" == typeof e) try {
                        u = JSON.parse(e);
                    } catch (e) {
                        return void a.innerCallback("fail", a.error("json_decode_fail", e));
                    } else u = e;
                    if ("undefined" == typeof u) return void a.innerCallback("fail", a.error("json_decode_fail"));
                    if (!d.call(u, "id")) return void a.innerCallback("fail", a.error("invalid_charge", "no_charge_id"));
                    if (!d.call(u, "channel")) return void a.innerCallback("fail", a.error("invalid_charge", "no_channel"));
                    d.call(u, "app") && ("string" == typeof u.app ? l.app_id = u.app : "object" == typeof u.app && "string" == typeof u.app.id && (l.app_id = u.app.id)), 
                    c.report({
                        type: "pure_sdk_click",
                        channel: u.channel,
                        ch_id: u.id
                    });
                    var s = u.channel;
                    if (!d.call(u, "credential")) return void a.innerCallback("fail", a.error("invalid_charge", "no_credential"));
                    if (!u.credential) return void a.innerCallback("fail", a.error("invalid_credential", "credential_is_undefined"));
                    if (!d.call(u.credential, s)) return void a.innerCallback("fail", a.error("invalid_credential", "credential_is_incorrect"));
                    if (!d.call(u, "livemode")) return void a.innerCallback("fail", a.error("invalid_charge", "no_livemode_field"));
                    var f = o.getChannelModule(s);
                    return "undefined" == typeof f ? (console.error('channel module "' + s + '" is undefined'), 
                    void a.innerCallback("fail", a.error("invalid_channel", 'channel module "' + s + '" is undefined'))) : u.livemode === !1 ? void (d.call(f, "runTestMode") ? f.runTestMode(u) : i.runTestMode(u)) : ("undefined" != typeof t && (l.signature = t), 
                    "boolean" == typeof r && (l.debug = r), void f.handleCharge(u));
                },
                setAPURL: function(e) {
                    l.APURL = e;
                }
            }, n.exports = new u();
        }, {
            "./callbacks": 1,
            "./collection": 5,
            "./init": 6,
            "./mods": 9,
            "./stash": 10,
            "./testmode": 11,
            "./version": 13
        } ],
        9: [ function(e, n, t) {
            var r = {}.hasOwnProperty, i = {};
            n.exports = i, i.channels = {
                alipay_wap: e("./channels/alipay_wap"),
                wx_pub: e("./channels/wx_pub"),
                wx_wap: e("./channels/wx_wap")
            }, i.extras = {}, i.getChannelModule = function(e) {
                if (r.call(i.channels, e)) return i.channels[e];
            }, i.getExtraModule = function(e) {
                if (r.call(i.extras, e)) return i.extras[e];
            };
        }, {
            "./channels/alipay_wap": 2,
            "./channels/wx_pub": 3,
            "./channels/wx_wap": 4
        } ],
        10: [ function(e, n, t) {
            n.exports = {};
        }, {} ],
        11: [ function(e, n, t) {
            var r = e("./utils"), i = {}.hasOwnProperty;
            n.exports = {
                PINGPP_MOCK_URL: "http://sissi.pingxx.com/mock.php",
                runTestMode: function(e) {
                    var n = {
                        ch_id: e.id,
                        scheme: "http",
                        channel: e.channel
                    };
                    i.call(e, "order_no") ? n.order_no = e.order_no : i.call(e, "orderNo") && (n.order_no = e.orderNo), 
                    i.call(e, "time_expire") ? n.time_expire = e.time_expire : i.call(e, "timeExpire") && (n.time_expire = e.timeExpire), 
                    i.call(e, "extra") && (n.extra = encodeURIComponent(JSON.stringify(e.extra))), r.redirectTo(this.PINGPP_MOCK_URL + "?" + r.stringifyData(n));
                }
            };
        }, {
            "./utils": 12
        } ],
        12: [ function(e, n, t) {
            var r = {}.hasOwnProperty, i = n.exports = {
                stringifyData: function(e, n, t) {
                    "undefined" == typeof t && (t = !1);
                    var i = [];
                    for (var a in e) r.call(e, a) && "function" != typeof e[a] && ("bfb_wap" == n && "url" == a || "yeepay_wap" == n && "mode" == a || "channel_url" != a && i.push(a + "=" + (t ? encodeURIComponent(e[a]) : e[a])));
                    return i.join("&");
                },
                request: function(e, n, t, a, o, l) {
                    if ("undefined" == typeof XMLHttpRequest) return void console.log("Function XMLHttpRequest is undefined.");
                    var c = new XMLHttpRequest();
                    if ("undefined" != typeof c.timeout && (c.timeout = 6e3), n = n.toUpperCase(), "GET" === n && "object" == typeof t && t && (e += "?" + i.stringifyData(t, "", !0)), 
                    c.open(n, e, !0), "undefined" != typeof l) for (var d in l) r.call(l, d) && c.setRequestHeader(d, l[d]);
                    "POST" === n ? (c.setRequestHeader("Content-type", "application/json; charset=utf-8"), 
                    c.send(JSON.stringify(t))) : c.send(), "undefined" == typeof a && (a = function() {}), 
                    "undefined" == typeof o && (o = function() {}), c.onreadystatechange = function() {
                        4 == c.readyState && a(c.responseText, c.status, c);
                    }, c.onerror = function(e) {
                        o(c, 0, e);
                    };
                },
                formSubmit: function(e, n, t) {
                    if ("undefined" == typeof window) return void console.log("Not a browser, form submit url: " + e);
                    var i = document.createElement("form");
                    i.setAttribute("method", n), i.setAttribute("action", e);
                    for (var a in t) if (r.call(t, a)) {
                        var o = document.createElement("input");
                        o.setAttribute("type", "hidden"), o.setAttribute("name", a), o.setAttribute("value", t[a]), 
                        i.appendChild(o);
                    }
                    document.body.appendChild(i), i.submit();
                },
                randomString: function(e) {
                    "undefined" == typeof e && (e = 32);
                    for (var n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", t = n.length, r = "", i = 0; i < e; i++) r += n.charAt(Math.floor(Math.random() * t));
                    return r;
                },
                redirectTo: function(e) {
                    return "undefined" == typeof window ? void console.log("Not a browser, redirect url: " + e) : void (window.location.href = e);
                },
                inWeixin: function() {
                    if ("undefined" == typeof navigator) return !1;
                    var e = navigator.userAgent.toLowerCase();
                    return e.indexOf("micromessenger") !== -1;
                },
                documentReady: function(e) {
                    return "undefined" == typeof document ? void e() : void ("loading" != document.readyState ? e() : document.addEventListener("DOMContentLoaded", e));
                }
            };
        }, {} ],
        13: [ function(e, n, t) {
            n.exports = {
                v: "2.1.4"
            };
        }, {} ]
    }, {}, [ 8 ])(8);
});
