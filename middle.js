(function (i) {
    if (e && u(0, r, o, a),
        n)
        return o;
    var c = 1
        , l = function (t, e, r) {
            for (var n; ;) {
                var o = t();
                if (d(o) && (o = o.v),
                    !o)
                    return i;
                if (o.then) {
                    n = 0;
                    break
                }
                var i = r();
                if (i && i.then) {
                    if (!d(i)) {
                        n = 1;
                        break
                    }
                    i = i.s
                }
                if (e) {
                    var a = e();
                    if (a && a.then && !d(a)) {
                        n = 2;
                        break
                    }
                }
            }
            var u = new s
                , c = f.bind(null, u, 2);
            return (0 === n ? o.then(h) : 1 === n ? i.then(l) : a.then(p)).then(void 0, c),
                u;
            function l(n) {
                i = n;
                do {
                    if (e && (a = e()) && a.then && !d(a))
                        return void a.then(p).then(void 0, c);
                    if (!(o = t()) || d(o) && !o.v)
                        return void f(u, 1, i);
                    if (o.then)
                        return void o.then(h).then(void 0, c);
                    d(i = r()) && (i = i.v)
                } while (!i || !i.then);
                i.then(l).then(void 0, c)
            }
            function h(t) {
                t ? (i = r()) && i.then ? i.then(l).then(void 0, c) : l(i) : f(u, 1, i)
            }
            function p() {
                (o = t()) ? o.then ? o.then(h).then(void 0, c) : h(o) : f(u, 1, i)
            }
        }((function () {
            return c < t.length
        }
        ), (function () {
            return c++
        }
        ), (function () {
            var n = t[c];
            return Promise.resolve(n(i)).then((function (t) {
                i = t,
                    e && u(c, r, i, a)
            }
            ))
        }
        ));
    return l && l.then ? l.then((function () {
        return i
    }
    )) : i
}
)


function d(t) {
    return t instanceof s && 1 & t.s
}