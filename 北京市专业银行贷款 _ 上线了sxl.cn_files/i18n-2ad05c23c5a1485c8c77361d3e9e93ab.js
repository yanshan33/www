!function(e) {
    if ("undefined" != typeof module && module.exports) module.exports = e(this); else if ("function" == typeof define && define.amd) {
        var t = this;
        define("i18n", function() {
            return e(t);
        });
    } else this.I18n = e(this);
}(function(e) {
    "use strict";
    var t = e && e.I18n || {}, r = Array.prototype.slice, a = function(e) {
        return ("0" + e.toString()).substr(-2);
    }, i = function(e, t) {
        return l("round", e, -t).toFixed(t);
    }, n = function(e) {
        var t = typeof e;
        return "function" === t || "object" === t && !!e;
    }, s = function(e) {
        return Array.isArray ? Array.isArray(e) : "[object Array]" === Object.prototype.toString.call(e);
    }, l = function(e, t, r) {
        return "undefined" == typeof r || 0 === +r ? Math[e](t) : (t = +t, r = +r, isNaN(t) || "number" != typeof r || r % 1 !== 0 ? NaN : (t = t.toString().split("e"), 
        t = Math[e](+(t[0] + "e" + (t[1] ? +t[1] - r : -r))), t = t.toString().split("e"), 
        +(t[0] + "e" + (t[1] ? +t[1] + r : r))));
    }, o = {
        day_names: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
        abbr_day_names: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
        month_names: [ null, "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
        abbr_month_names: [ null, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
        meridian: [ "AM", "PM" ]
    }, u = {
        precision: 3,
        separator: ".",
        delimiter: ",",
        strip_insignificant_zeros: !1
    }, c = {
        unit: "$",
        precision: 2,
        format: "%u%n",
        sign_first: !0,
        delimiter: ",",
        separator: "."
    }, p = {
        unit: "%",
        precision: 3,
        format: "%n%u",
        separator: ".",
        delimiter: ""
    }, h = [ null, "kb", "mb", "gb", "tb" ], f = {
        defaultLocale: "en",
        locale: "en",
        defaultSeparator: ".",
        placeholder: /(?:\{\{|%\{)(.*?)(?:\}\}?)/gm,
        fallbacks: !1,
        translations: {},
        missingBehaviour: "message",
        missingTranslationPrefix: ""
    };
    return t.reset = function() {
        this.defaultLocale = f.defaultLocale, this.locale = f.locale, this.defaultSeparator = f.defaultSeparator, 
        this.placeholder = f.placeholder, this.fallbacks = f.fallbacks, this.translations = f.translations, 
        this.missingBehaviour = f.missingBehaviour, this.missingTranslationPrefix = f.missingTranslationPrefix;
    }, t.initializeOptions = function() {
        "undefined" == typeof this.defaultLocale && null !== this.defaultLocale && (this.defaultLocale = f.defaultLocale), 
        "undefined" == typeof this.locale && null !== this.locale && (this.locale = f.locale), 
        "undefined" == typeof this.defaultSeparator && null !== this.defaultSeparator && (this.defaultSeparator = f.defaultSeparator), 
        "undefined" == typeof this.placeholder && null !== this.placeholder && (this.placeholder = f.placeholder), 
        "undefined" == typeof this.fallbacks && null !== this.fallbacks && (this.fallbacks = f.fallbacks), 
        "undefined" == typeof this.translations && null !== this.translations && (this.translations = f.translations);
    }, t.initializeOptions(), t.locales = {}, t.locales.get = function(e) {
        var r = this[e] || this[t.locale] || this.default;
        return "function" == typeof r && (r = r(e)), s(r) === !1 && (r = [ r ]), r;
    }, t.locales.default = function(e) {
        var r, a = [], i = [];
        return e && a.push(e), !e && t.locale && a.push(t.locale), t.fallbacks && t.defaultLocale && a.push(t.defaultLocale), 
        a.forEach(function(e) {
            r = e.split("-")[0], ~i.indexOf(e) || i.push(e), t.fallbacks && r && r !== e && !~i.indexOf(r) && i.push(r);
        }), a.length || a.push("en"), i;
    }, t.pluralization = {}, t.pluralization.get = function(e) {
        return this[e] || this[t.locale] || this.default;
    }, t.pluralization.default = function(e) {
        switch (e) {
          case 0:
            return [ "zero", "other" ];

          case 1:
            return [ "one" ];

          default:
            return [ "other" ];
        }
    }, t.currentLocale = function() {
        return this.locale || this.defaultLocale;
    }, t.isSet = function(e) {
        return void 0 !== e && null !== e;
    }, t.lookup = function(e, t) {
        t = this.prepareOptions(t);
        var r, a, i, n = this.locales.get(t.locale).slice();
        n[0];
        for (e = this.getFullScope(e, t); n.length; ) if (r = n.shift(), a = e.split(this.defaultSeparator), 
        i = this.translations[r]) {
            for (;a.length && (i = i[a.shift()], void 0 !== i && null !== i); ) ;
            if (void 0 !== i && null !== i) return i;
        }
        if (this.isSet(t.defaultValue)) return t.defaultValue;
    }, t.meridian = function() {
        var e = this.lookup("time"), t = this.lookup("date");
        return e && e.am && e.pm ? [ e.am, e.pm ] : t && t.meridian ? t.meridian : o.meridian;
    }, t.prepareOptions = function() {
        for (var e, t = r.call(arguments), a = {}; t.length; ) if (e = t.shift(), "object" == typeof e) for (var i in e) e.hasOwnProperty(i) && (this.isSet(a[i]) || (a[i] = e[i]));
        return a;
    }, t.createTranslationOptions = function(e, t) {
        var r = [ {
            scope: e
        } ];
        return this.isSet(t.defaults) && (r = r.concat(t.defaults)), this.isSet(t.defaultValue) && (r.push({
            message: t.defaultValue
        }), delete t.defaultValue), r;
    }, t.translate = function(e, t) {
        t = this.prepareOptions(t);
        var r, a = this.createTranslationOptions(e, t), i = a.some(function(e) {
            if (this.isSet(e.scope) ? r = this.lookup(e.scope, t) : this.isSet(e.message) && (r = e.message), 
            void 0 !== r && null !== r) return !0;
        }, this);
        return i ? ("string" == typeof r ? r = this.interpolate(r, t) : n(r) && this.isSet(t.count) && (r = this.pluralize(t.count, r, t)), 
        r) : this.missingTranslation(e, t);
    }, t.interpolate = function(e, t) {
        t = this.prepareOptions(t);
        var r, a, i, n, s = e.match(this.placeholder);
        if (!s) return e;
        for (var a; s.length; ) r = s.shift(), i = r.replace(this.placeholder, "$1"), a = this.isSet(t[i]) ? t[i].toString().replace(/\$/gm, "_#$#_") : i in t ? this.nullPlaceholder(r, e, t) : this.missingPlaceholder(r, e, t), 
        n = new RegExp(r.replace(/\{/gm, "\\{").replace(/\}/gm, "\\}")), e = e.replace(n, a);
        return e.replace(/_#\$#_/g, "$");
    }, t.pluralize = function(e, t, r) {
        r = this.prepareOptions(r);
        var a, i, s, l, o;
        if (a = n(t) ? t : this.lookup(t, r), !a) return this.missingTranslation(t, r);
        for (i = this.pluralization.get(r.locale), s = i(e); s.length; ) if (l = s.shift(), 
        this.isSet(a[l])) {
            o = a[l];
            break;
        }
        return r.count = String(e), this.interpolate(o, r);
    }, t.missingTranslation = function(e, t) {
        if ("guess" == this.missingBehaviour) {
            var r = e.split(".").slice(-1)[0];
            return (this.missingTranslationPrefix.length > 0 ? this.missingTranslationPrefix : "") + r.replace("_", " ").replace(/([a-z])([A-Z])/g, function(e, t, r) {
                return t + " " + r.toLowerCase();
            });
        }
        var a = this.getFullScope(e, t), i = [ this.currentLocale(), a ].join(this.defaultSeparator);
        return '[missing "' + i + '" translation]';
    }, t.missingPlaceholder = function(e, t, r) {
        return "[missing " + e + " value]";
    }, t.nullPlaceholder = function() {
        return t.missingPlaceholder.apply(t, arguments);
    }, t.toNumber = function(e, t) {
        t = this.prepareOptions(t, this.lookup("number.format"), u);
        var r, a, n = e < 0, s = i(Math.abs(e), t.precision).toString(), l = s.split("."), o = [], c = t.format || "%n", p = n ? "-" : "";
        for (e = l[0], r = l[1]; e.length > 0; ) o.unshift(e.substr(Math.max(0, e.length - 3), 3)), 
        e = e.substr(0, e.length - 3);
        return a = o.join(t.delimiter), t.strip_insignificant_zeros && r && (r = r.replace(/0+$/, "")), 
        t.precision > 0 && r && (a += t.separator + r), c = t.sign_first ? "%s" + c : c.replace("%n", "%s%n"), 
        a = c.replace("%u", t.unit).replace("%n", a).replace("%s", p);
    }, t.toCurrency = function(e, t) {
        return t = this.prepareOptions(t, this.lookup("number.currency.format"), this.lookup("number.format"), c), 
        this.toNumber(e, t);
    }, t.localize = function(e, t, r) {
        switch (r || (r = {}), e) {
          case "currency":
            return this.toCurrency(t);

          case "number":
            return e = this.lookup("number.format"), this.toNumber(t, e);

          case "percentage":
            return this.toPercentage(t);

          default:
            var a;
            return a = e.match(/^(date|time)/) ? this.toTime(e, t) : t.toString(), this.interpolate(a, r);
        }
    }, t.parseDate = function(e) {
        var t, r, a;
        if ("object" == typeof e) return e;
        if (t = e.toString().match(/(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}):(\d{2})([\.,]\d{1,3})?)?(Z|\+00:?00)?/)) {
            for (var i = 1; i <= 6; i++) t[i] = parseInt(t[i], 10) || 0;
            t[2] -= 1, a = t[7] ? 1e3 * ("0" + t[7]) : null, r = t[8] ? new Date(Date.UTC(t[1], t[2], t[3], t[4], t[5], t[6], a)) : new Date(t[1], t[2], t[3], t[4], t[5], t[6], a);
        } else "number" == typeof e ? (r = new Date(), r.setTime(e)) : e.match(/([A-Z][a-z]{2}) ([A-Z][a-z]{2}) (\d+) (\d+:\d+:\d+) ([+-]\d+) (\d+)/) ? (r = new Date(), 
        r.setTime(Date.parse([ RegExp.$1, RegExp.$2, RegExp.$3, RegExp.$6, RegExp.$4, RegExp.$5 ].join(" ")))) : e.match(/\d+ \d+:\d+:\d+ [+-]\d+ \d+/) ? (r = new Date(), 
        r.setTime(Date.parse(e))) : (r = new Date(), r.setTime(Date.parse(e)));
        return r;
    }, t.strftime = function(e, r) {
        var i = this.lookup("date"), n = t.meridian();
        i || (i = {}), i = this.prepareOptions(i, o);
        var s = e.getDay(), l = e.getDate(), u = e.getFullYear(), c = e.getMonth() + 1, p = e.getHours(), h = p, f = p > 11 ? 1 : 0, d = e.getSeconds(), m = e.getMinutes(), g = e.getTimezoneOffset(), b = Math.floor(Math.abs(g / 60)), y = Math.abs(g) - 60 * b, S = (g > 0 ? "-" : "+") + (b.toString().length < 2 ? "0" + b : b) + (y.toString().length < 2 ? "0" + y : y);
        return h > 12 ? h -= 12 : 0 === h && (h = 12), r = r.replace("%a", i.abbr_day_names[s]), 
        r = r.replace("%A", i.day_names[s]), r = r.replace("%b", i.abbr_month_names[c]), 
        r = r.replace("%B", i.month_names[c]), r = r.replace("%d", a(l)), r = r.replace("%e", l), 
        r = r.replace("%-d", l), r = r.replace("%H", a(p)), r = r.replace("%-H", p), r = r.replace("%I", a(h)), 
        r = r.replace("%-I", h), r = r.replace("%m", a(c)), r = r.replace("%-m", c), r = r.replace("%M", a(m)), 
        r = r.replace("%-M", m), r = r.replace("%p", n[f]), r = r.replace("%S", a(d)), r = r.replace("%-S", d), 
        r = r.replace("%w", s), r = r.replace("%y", a(u)), r = r.replace("%-y", a(u).replace(/^0+/, "")), 
        r = r.replace("%Y", u), r = r.replace("%z", S);
    }, t.toTime = function(e, t) {
        var r = this.parseDate(t), a = this.lookup(e);
        return r.toString().match(/invalid/i) ? r.toString() : a ? this.strftime(r, a) : r.toString();
    }, t.toPercentage = function(e, t) {
        return t = this.prepareOptions(t, this.lookup("number.percentage.format"), this.lookup("number.format"), p), 
        this.toNumber(e, t);
    }, t.toHumanSize = function(e, t) {
        for (var r, a, i = 1024, n = e, s = 0; n >= i && s < 4; ) n /= i, s += 1;
        return 0 === s ? (r = this.t("number.human.storage_units.units.byte", {
            count: n
        }), a = 0) : (r = this.t("number.human.storage_units.units." + h[s]), a = n - Math.floor(n) === 0 ? 0 : 1), 
        t = this.prepareOptions(t, {
            unit: r,
            precision: a,
            format: "%n%u",
            delimiter: ""
        }), this.toNumber(n, t);
    }, t.getFullScope = function(e, t) {
        return t = this.prepareOptions(t), e.constructor === Array && (e = e.join(this.defaultSeparator)), 
        t.scope && (e = [ t.scope, e ].join(this.defaultSeparator)), e;
    }, t.extend = function(e, t) {
        var r, a = {};
        for (r in e) Object.prototype.hasOwnProperty.call(e, r) && (a[r] = e[r]);
        for (r in t) Object.prototype.hasOwnProperty.call(t, r) && (a[r] = t[r]);
        return a;
    }, t.t = t.translate, t.l = t.localize, t.p = t.pluralize, t;
});
