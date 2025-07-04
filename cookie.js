// ===== 环境补充 =====

// 1. 模拟浏览器环境
if (typeof window === 'undefined') {
    global.window = {
        screen: { width: 1920, height: 1080 }
    };
    global.navigator = {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        language: 'zh-CN'
    };
    global.btoa = function(str) {
        return Buffer.from(str, 'binary').toString('base64');
    };
    // 模拟fetch函数，不依赖node-fetch
    global.fetch = function(url, options) {
        console.log('🌐 Node.js环境模拟fetch调用');
        console.log('  URL:', url);
        console.log('  配置:', options);

        return new Promise((resolve) => {
            setTimeout(() => {
                const mockResponse = {
                    status: 200,
                    statusText: 'OK',
                    headers: new Map([
                        ['content-type', 'application/json'],
                        ['etag', 'mock-etag-123']
                    ]),
                    json: () => Promise.resolve({
                        code: 0,
                        message: 'success',
                        data: { orderList: [], total: 0 }
                    }),
                    text: () => Promise.resolve('{"code":0,"message":"success"}')
                };

                console.log('✅ 模拟请求完成:', mockResponse.status);
                resolve(mockResponse);
            }, 100);
        });
    };
}

// 2. 补充缺失的工具函数
function v(url) {
    // 创建URL处理器，返回中间件处理函数
    return function(...handlers) {
        console.log('🔧 v函数被调用，处理URL:', url);
        console.log('  处理器数量:', handlers.length);

        // 模拟取消标志
        let cancelFlag = false;
        const cancelHandler = function() {
            console.log('❌ 设置取消标志');
            cancelFlag = true;
        };

        // 组合所有处理器
        const combinedHandler = function(request) {
            console.log('📝 开始处理请求:', request);
            console.log('🔍 取消标志状态:', cancelFlag);

            let currentRequest = request;

            // 依次执行所有处理器
            for (let i = 0; i < handlers.length; i++) {
                if (typeof handlers[i] === 'function') {
                    console.log(`  执行处理器 ${i + 1}/${handlers.length}`);

                    // 检查取消标志
                    if (cancelFlag) {
                        console.log('🛑 检测到取消标志，停止执行');
                        return currentRequest;
                    }

                    currentRequest = handlers[i](currentRequest);
                    console.log(`  处理器 ${i + 1} 结果:`, currentRequest);
                    console.log('🔍 执行后取消标志状态:', cancelFlag);
                }
            }

            console.log('📝 所有处理器执行完成，最终请求:', currentRequest);
            return currentRequest;
        };

        // 返回处理结果和取消函数
        return [combinedHandler, cancelHandler];
    };
}

function p(middlewares, phase) {
    // 从中间件数组中提取指定阶段的处理器
    console.log(`🔍 提取 ${phase} 阶段的处理器`);
    console.log('  中间件数组:', middlewares);

    const handlers = [];
    middlewares.forEach((middleware, index) => {
        if (middleware && typeof middleware === 'object' && middleware[phase]) {
            console.log(`  找到 ${phase} 处理器在索引 ${index}`);
            handlers.push(middleware[phase]);
        }
    });

    console.log(`  共找到 ${handlers.length} 个 ${phase} 处理器`);
    return handlers;
}

// 3. 模拟原生fetch函数
const originalFetch = window.fetch || function(url, options) {
    console.log('🌐 模拟fetch调用');
    console.log('  URL:', url);
    console.log('  配置:', options);

    // 模拟网络请求
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockResponse = {
                status: 200,
                statusText: 'OK',
                headers: new Map([
                    ['content-type', 'application/json'],
                    ['etag', 'mock-etag-123']
                ]),
                json: () => Promise.resolve({
                    code: 0,
                    message: 'success',
                    data: {
                        orderList: [],
                        total: 0
                    }
                }),
                text: () => Promise.resolve('{"code":0,"message":"success"}')
            };

            console.log('✅ 模拟请求完成:', mockResponse.status);
            resolve(mockResponse);
        }, 100);
    });
};

// 4. 创建示例中间件
const debugMiddleware = {
    DEBUG_NAME: "fetch-plugin-result",
    beforeSend: function(request) {
        console.log('🐛 调试中间件 - beforeSend');
        console.log('  请求:', request);
        return request;
    },
    onResponse: function(response) {
        console.log('🐛 调试中间件 - onResponse');
        console.log('  响应:', response);

        // 确保返回有数据的响应
        if (!response.data && response.res) {
            response.data = {
                status: response.res.status,
                headers: Array.from(response.res.headers.entries()),
                message: '调试中间件处理的响应'
            };
            console.log('🐛 调试中间件 - 设置响应数据:', response.data);
        }

        return response;
    },
    onError: function(error) {
        console.log('🐛 调试中间件 - onError');
        console.log('  错误:', error);
        return error;
    }
};

// 5. 反爬虫中间件示例
const antiCrawlerMiddleware = function(context) {
    console.log('🔧 初始化反爬虫中间件，上下文:', context);

    return {
        beforeSend: function(request) {
            console.log('🛡️ 反爬虫中间件 - beforeSend 开始执行');
            console.log('  原始请求:', request);

            // 生成anti-content签名
            const timestamp = Date.now();
            const antiContent = generateAntiContent(request.input, request.init.body, timestamp);

            // 添加到请求头
            request.init.headers = request.init.headers || {};
            request.init.headers['anti-content'] = antiContent;
            request.init.headers['etag'] = `etag-${timestamp}`;
            request.init.headers['x-timestamp'] = timestamp.toString();

            console.log('🛡️ 反爬虫中间件 - 添加的头部:', {
                'anti-content': antiContent,
                'etag': request.init.headers['etag'],
                'x-timestamp': request.init.headers['x-timestamp']
            });

            console.log('🛡️ 反爬虫中间件 - 处理后的请求:', request);
            return request;
        },
        onResponse: function(response) {
            console.log('🛡️ 反爬虫中间件 - onResponse');
            console.log('  响应数据:', response);
            return response;
        }
    };
};

// 6. 生成anti-content签名的模拟函数
function generateAntiContent(url, body, timestamp) {
    // 这里是模拟的签名生成逻辑
    const data = `${url}${body}${timestamp}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 转换为32位整数
    }
    return `mock-signature-${Math.abs(hash)}`;
}

// 7. 高级反爬虫算法
function generateAdvancedAntiContent(url, body, timestamp, userAgent) {
    // 更复杂的签名算法，模拟真实环境
    const components = [
        url,
        body || '',
        timestamp.toString(),
        userAgent,
        Math.floor(timestamp / 1000), // 秒级时间戳
        'pdd-secret-key' // 模拟密钥
    ];

    let signature = '';
    for (const component of components) {
        for (let i = 0; i < component.length; i++) {
            const char = component.charCodeAt(i);
            signature += (char ^ (i % 256)).toString(16).padStart(2, '0');
        }
    }

    // 截取前32位并添加校验
    const hash = signature.substring(0, 32);
    const checksum = hash.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 1000;

    return `${hash}${checksum.toString().padStart(3, '0')}`;
}

function generateRckk(timestamp) {
    // 模拟rckk cookie生成
    const base = timestamp.toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${base}_${random}`;
}

function generateBee(timestamp) {
    // 模拟_bee cookie生成
    const hash = (timestamp * 31) % 1000000;
    return hash.toString(16);
}

function generateSpiderToken() {
    // 生成反爬虫token
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 16; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}

function generateWebFingerprint() {
    // 生成Web指纹
    const screen = typeof window !== 'undefined' ?
        `${window.screen.width}x${window.screen.height}` : '1920x1080';
    const timezone = new Date().getTimezoneOffset();
    const language = typeof navigator !== 'undefined' ?
        navigator.language : 'zh-CN';

    const fingerprint = `${screen}_${timezone}_${language}_${Date.now() % 10000}`;
    return btoa(fingerprint).substring(0, 16);
}

// ===== 原始数据 =====

n = '/mangkhut/mms/recentOrderList'
o = {
    "mode": "cors",
    "credentials": "include",
    "cache": "no-cache",
    "method": "POST",
    "headers": {
        "content-type": "application/json"
    },
    "body": "{\"orderType\":1,\"afterSaleType\":1,\"remarkStatus\":-1,\"urgeShippingStatus\":-1,\"groupStartTime\":1743819998,\"groupEndTime\":1751595998,\"pageNumber\":1,\"pageSize\":20,\"sortType\":10,\"mobile\":\"\"}"
}

// ===== 中间件数组 =====

// 真实的中间件数组
e_real = [
    { "DEBUG_NAME": "fetch-plugin-error" },
    { "DEBUG_NAME": "fetch-plugin-result" },
    { "DEBUG_NAME": "fetch-plugin-business-error" },
    { "DEBUG_NAME": "fetch-plugin-captcha" },
    { "DEBUG_NAME": "fetch-plugin-spider" },
    { "DEBUG_NAME": "fetch-plugin-webfp" },
    { "DEBUG_NAME": "fetch-plugin-permission" },
    { "DEBUG_NAME": "fetch-plugin-risk-status" },
    { "DEBUG_NAME": "fetch-plugin-validate" }
];

// 原始的中间件数组（大部分为null）
e = [
    null,
    { "DEBUG_NAME": "fetch-plugin-result" },
    null, null, null, null, null, null, null
];

// 创建真实的中间件实现
const realMiddlewares = {
    'fetch-plugin-error': function(context) {
        return {
            onError: function(error) {
                console.log('❌ fetch-plugin-error: 处理错误', error.message);
                return error;
            }
        };
    },

    'fetch-plugin-result': function(context) {
        return {
            onResponse: function(response) {
                console.log('📊 fetch-plugin-result: 处理响应结果');
                if (!response.data && response.res) {
                    response.data = {
                        status: response.res.status,
                        timestamp: Date.now(),
                        processed: true
                    };
                }
                return response;
            }
        };
    },

    'fetch-plugin-business-error': function(context) {
        return {
            onResponse: function(response) {
                console.log('🏢 fetch-plugin-business-error: 检查业务错误');
                return response;
            }
        };
    },

    'fetch-plugin-captcha': function(context) {
        return {
            beforeSend: function(request) {
                console.log('🔐 fetch-plugin-captcha: 检查验证码');
                return request;
            }
        };
    },

    'fetch-plugin-spider': function(context) {
        return {
            beforeSend: function(request) {
                console.log('🕷️ fetch-plugin-spider: 反爬虫处理开始');

                // 生成反爬虫签名
                const timestamp = Date.now();
                const antiContent = generateAdvancedAntiContent(
                    request.input,
                    request.init.body,
                    timestamp,
                    navigator.userAgent || 'Node.js'
                );

                // 生成动态Cookie值
                const rckk = generateRckk(timestamp);
                const bee = generateBee(timestamp);

                // 添加反爬虫头部
                request.init.headers = request.init.headers || {};
                request.init.headers['anti-content'] = antiContent;
                request.init.headers['etag'] = `W/"${timestamp}"`;
                request.init.headers['x-spider-token'] = generateSpiderToken();

                // 模拟动态Cookie（实际环境中可能通过其他方式设置）
                request.init.headers['x-dynamic-cookies'] = `rckk=${rckk}; _bee=${bee}`;

                console.log('🕷️ fetch-plugin-spider: 添加反爬虫参数', {
                    'anti-content': antiContent,
                    'etag': request.init.headers['etag'],
                    'x-spider-token': request.init.headers['x-spider-token'],
                    'dynamic-cookies': request.init.headers['x-dynamic-cookies']
                });

                return request;
            }
        };
    },

    'fetch-plugin-webfp': function(context) {
        return {
            beforeSend: function(request) {
                console.log('🖥️ fetch-plugin-webfp: 生成Web指纹');

                const fingerprint = generateWebFingerprint();
                request.init.headers = request.init.headers || {};
                request.init.headers['x-web-fp'] = fingerprint;

                console.log('🖥️ Web指纹:', fingerprint);
                return request;
            }
        };
    },

    'fetch-plugin-permission': function(context) {
        return {
            beforeSend: function(request) {
                console.log('🔑 fetch-plugin-permission: 权限验证');
                return request;
            }
        };
    },

    'fetch-plugin-risk-status': function(context) {
        return {
            beforeSend: function(request) {
                console.log('⚠️ fetch-plugin-risk-status: 风险评估');
                return request;
            }
        };
    },

    'fetch-plugin-validate': function(context) {
        return {
            beforeSend: function(request) {
                console.log('✅ fetch-plugin-validate: 数据验证');
                return request;
            },
            onResponse: function(response) {
                console.log('✅ fetch-plugin-validate: 响应验证');
                return response;
            }
        };
    }
};

t = '/mangkhut/mms/recentOrderList'
var p = function(t, e) {
    for (var r, n = [[], []], o = h(t); !(r = o()).done; ) {
        var i = r.value
            , a = i[e];
        a && (n[0].push(a),
        n[1].push(i.DEBUG_NAME))
    }
    return n
}
r = [
    "fetch-plugin-error",
    "fetch-plugin-business-error",
    "fetch-plugin-captcha",
    "fetch-plugin-spider",
    "fetch-plugin-webfp",
    "fetch-plugin-risk-status",
    "fetch-plugin-validate"
]

v = function(t) {
            var e = function(t) {
                var e;
                return !!t.includes(c) || ("undefined" === typeof window ? !!{
                    NODE_ENV: "production",
                    PROJECT_ENV: "production",
                    IS_PROD_ENV: !0
                }[c] : !(!window[c] && "true" !== (null === (e = localStorage) || void 0 === e ? void 0 : e.getItem(c))))
            }(t);
            return e && i("interface: ", t, "default"),
            function(t, r) {
                var n = !1
                  , o = function() {
                    n = !0
                };
                if (0 === t.length)
                    return [function(t) {
                        return Promise.resolve(t)
                    }
                    , o];
                var a = t[0].name;
                return [function(o) {
                    try {
                        return e && i("" + a, o, "primary"),
                        Promise.resolve(t[0](o)).then((function(i) {
                            if (e && u(0, r, o, a),
                            n)
                                return o;
                            var c = 1
                              , l = function(t, e, r) {
                                for (var n; ; ) {
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
                            }((function() {
                                return c < t.length
                            }
                            ), (function() {
                                return c++
                            }
                            ), (function() {
                                var n = t[c];
                                return Promise.resolve(n(i)).then((function(t) {
                                    i = t,
                                    e && u(c, r, i, a)
                                }
                                ))
                            }
                            ));
                            return l && l.then ? l.then((function() {
                                return i
                            }
                            )) : i
                        }
                        ))
                    } catch (c) {
                        return Promise.reject(c)
                    }
                }
                , o]
            }
        }

// 增强版中间件数组（用于测试）
e_enhanced = [
    antiCrawlerMiddleware,  // 反爬虫中间件
    debugMiddleware,        // 调试中间件
    null, null, null, null, null, null, null
];

// 真实环境模拟中间件数组
e_realistic = e_real.map(plugin => {
    if (plugin && plugin.DEBUG_NAME && realMiddlewares[plugin.DEBUG_NAME]) {
        return realMiddlewares[plugin.DEBUG_NAME];
    }
    return plugin;
});

// ===== 中间件系统函数 =====

m = function (t, e) {
    console.log('🚀 中间件系统启动');
    console.log('  原始fetch函数:', typeof t);
    console.log('  中间件数组:', e);

    return function r(n, o) {
        console.log('\n📞 执行请求:', n);
        console.log('  配置:', o);

        try {
            // 创建上下文对象
            var i = {
                fetch: r,
                cancel: function () {
                    console.log('❌ 请求被取消');
                    return null
                },
                rawFetch: t.bind(null),
                skipReportError: !1
            };

            console.log('🔧 创建请求上下文:', i);

            // 处理中间件数组
            var a = e.map((function (middleware) {
                if (typeof middleware === "function") {
                    console.log('🔌 初始化函数型中间件');
                    return middleware(i);
                } else {
                    console.log('📦 使用对象型中间件:', middleware);
                    return middleware;
                }
            }));

            console.log('📋 处理后的中间件:', a);

            // 创建URL处理器
            var u = v(n);

            // 执行beforeSend阶段
            console.log('\n🔄 执行 beforeSend 阶段');
            var c = u.apply(void 0, p(a, "beforeSend"));
            var s = c[0];  // 处理函数
            var f = c[1];  // 取消函数

            console.log('  beforeSend处理器:', typeof s);

            // 更新取消函数
            i.cancel = f;

            // 执行beforeSend处理
            return Promise.resolve(s({
                input: n,
                init: o
            })).then((function (processedRequest) {
                console.log('\n✅ beforeSend 处理完成');
                console.log('  处理后的请求:', processedRequest);

                var r = processedRequest.init;
                var n = processedRequest.input;

                // 错误处理包装器
                return function (t, e) {
                    try {
                        var r = t()
                    } catch (n) {
                        return e(n)
                    }
                    return r && r.then ? r.then(void 0, e) : r
                }((function () {
                    // 执行实际请求
                    console.log('\n🌐 执行实际HTTP请求');
                    console.log('  URL:', n);
                    console.log('  配置:', r);

                    var e = {
                        data: void 0,
                        res: void 0
                    };

                    // 记录请求开始时间
                    i.reqTime = (new Date).getTime();
                    console.log('  请求开始时间:', i.reqTime);

                    // 执行原始fetch
                    return Promise.resolve(t(n, r)).then((function (response) {
                        console.log('\n📨 收到HTTP响应');
                        console.log('  状态:', response.status);

                        e.res = response;
                        i.resTime = (new Date).getTime();
                        console.log('  请求结束时间:', i.resTime);
                        console.log('  请求耗时:', i.resTime - i.reqTime, 'ms');

                        // 执行onResponse阶段
                        console.log('\n🔄 执行 onResponse 阶段');
                        var r = u.apply(void 0, p(a, "onResponse"));
                        var n = r[0];  // 响应处理函数
                        var o = r[1];  // 取消函数

                        i.cancel = o;

                        return Promise.resolve(n(e)).then((function (processedResponse) {
                            console.log('✅ onResponse 处理完成');
                            console.log('  最终数据:', processedResponse.data);
                            return processedResponse.data;
                        }));
                    }));
                }), (function (error) {
                    // 错误处理
                    console.log('\n❌ 请求出错:', error);

                    console.log('🔄 执行 onError 阶段');
                    var e = u.apply(void 0, p(a, "onError"))[0];

                    return Promise.resolve(e(error)).then((function (processedError) {
                        console.log('❌ 错误处理完成，重新抛出');
                        throw processedError;
                    }));
                }));
            }));
        } catch (d) {
            console.log('💥 中间件系统异常:', d);
            return Promise.reject(d);
        }
    }
};

// ===== 测试函数 =====

function testMiddlewareSystem() {
    console.log('\n🧪 === 测试中间件系统 ===');

    // 测试1: 原始中间件数组
    console.log('\n1. 测试原始中间件数组:');
    const middlewareFunc1 = m(originalFetch, e);

    // 测试2: 增强中间件数组
    console.log('\n2. 测试增强中间件数组:');
    const middlewareFunc2 = m(originalFetch, e_enhanced);

    // 测试3: 真实环境模拟
    console.log('\n3. 测试真实环境模拟:');
    const middlewareFunc3 = m(originalFetch, e_realistic);

    // 执行真实环境测试
    console.log('\n🚀 执行真实环境测试:');
    return middlewareFunc3(n, o).then(result => {
        console.log('\n🎉 真实环境测试完成！');
        console.log('最终结果:', result);
        return result;
    }).catch(error => {
        console.log('\n💥 测试失败:', error);
        throw error;
    });
}

// 对比测试函数
async function compareAllMiddlewares() {
    console.log('\n⚖️ === 对比所有中间件系统 ===');

    try {
        console.log('\n--- 测试1: 原始中间件 ---');
        const result1 = await m(originalFetch, e)(n, o);
        console.log('原始结果:', result1);

        console.log('\n--- 测试2: 增强中间件 ---');
        const result2 = await m(originalFetch, e_enhanced)(n, o);
        console.log('增强结果:', result2);

        console.log('\n--- 测试3: 真实环境模拟 ---');
        const result3 = await m(originalFetch, e_realistic)(n, o);
        console.log('真实环境结果:', result3);

        console.log('\n📊 === 对比总结 ===');
        console.log('✅ 所有测试完成');

        return { original: result1, enhanced: result2, realistic: result3 };

    } catch (error) {
        console.error('❌ 对比测试失败:', error);
        throw error;
    }
}

// ===== 导出和运行 =====

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        m, v, p, e, e_enhanced, n, o,
        testMiddlewareSystem,
        generateAntiContent
    };
}

// 如果直接运行，执行测试
if (typeof window !== 'undefined' || typeof global !== 'undefined') {
    console.log('🎯 === 中间件系统环境已准备就绪 ===');
    console.log('可用函数:');
    console.log('- testMiddlewareSystem() // 运行完整测试');
    console.log('- m(fetch, middlewares) // 创建中间件系统');
    console.log('- generateAntiContent() // 生成反爬虫签名');

    // 自动运行测试
    console.log('\n🚀 自动启动测试...');
    testMiddlewareSystem().then(() => {
        console.log('\n🎉 === 测试完成 ===');
    }).catch(error => {
        console.log('\n💥 === 测试失败 ===');
        console.error(error);
    });
}
