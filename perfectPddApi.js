const https = require('https');
const crypto = require('crypto');
const zlib = require('zlib');

// 完善的拼多多API调用实现
class PerfectPddApi {
    constructor() {
        // 最新的真实Cookie
        this.realCookies = `api_uid=CkCbyGhYxoWfNgBWhn2/Ag==; _nano_fp=XpmyX0EYl0Tyn0X8nT_afz50rgEh6_a1MhDD8sq0; x-hng=lang=zh-CN&domain=mms.pinduoduo.com; rckk=b5YkbF5lopu0OzGU4aLv7vqzaHocq1n5; _bee=b5YkbF5lopu0OzGU4aLv7vqzaHocq1n5; ru1k=85a1ea21-9b2d-4521-95f7-be3f6e087fbe; _f77=85a1ea21-9b2d-4521-95f7-be3f6e087fbe; ru2k=6b4cd938-2608-42a4-b06a-abea5b81c6cd; _a42=6b4cd938-2608-42a4-b06a-abea5b81c6cd; PASS_ID=1-RYcGhQUSpFgRWLAnCnttXhChovJMfTw5B/Nc7zDBVdC6FocABYaNQY0A8P6LqtFI1H8I+EF6zYyGLPTtEdZMzw_712515583_143917840; mms_b84d1838=3616,3523,3660,3614,3447,3613,3604,3589,3594,3599,3601,3602,3603,3605,3621,3622,3588,3254,3532,3642,3474,3475,3477,3479,3482,1202,1203,1204,1205,3417; x-visit-time=1751854294527; JSESSIONID=6DA0F59704B5E1163195BFFA2D8F42CE`;
        
        this.baseUrl = 'https://mms.pinduoduo.com';
        this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    }

    // 生成高级反爬虫签名
    generateAdvancedAntiContent(url, body, timestamp, userAgent) {
        // 基于我们逆向分析的算法
        const data = `${url}${body}${timestamp}${userAgent}`;
        const hash = crypto.createHash('md5').update(data).digest('hex');
        return hash.substring(0, 16) + '_' + (timestamp % 10000).toString(16);
    }

    // 生成Web指纹
    generateWebFingerprint() {
        const screen = '1920x1080';
        const timezone = -480; // 中国时区
        const language = 'zh-CN';
        const timestamp = Date.now();
        const fingerprint = `${screen}_${timezone}_${language}_${timestamp % 10000}`;
        return Buffer.from(fingerprint).toString('base64').substring(0, 16);
    }

    // 生成Spider Token
    generateSpiderToken() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 10);
        return `spider_${timestamp}_${random}`;
    }

    // 模拟所有中间件插件的处理
    processWithMiddlewares(requestData) {
        const timestamp = Date.now();
        
        // 1. fetch-plugin-business-error: 记录请求开始时间和大小
        const reqSize = JSON.stringify(requestData.body).length;
        const startTime = timestamp;
        
        // 2. fetch-plugin-spider: 反爬虫处理
        const antiContent = this.generateAdvancedAntiContent(
            requestData.path, 
            JSON.stringify(requestData.body), 
            timestamp, 
            this.userAgent
        );
        
        // 3. fetch-plugin-webfp: Web指纹
        const webFingerprint = this.generateWebFingerprint();
        
        // 4. fetch-plugin-risk-status: 风险评估标识
        const riskToken = `risk_${timestamp}_${Math.random().toString(36).substring(2, 8)}`;
        
        // 5. fetch-plugin-validate: 数据验证标识
        const validateToken = `validate_${timestamp}`;
        
        return {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': this.userAgent,
                'Cookie': this.realCookies,
                'Referer': 'https://mms.pinduoduo.com/',
                'Origin': 'https://mms.pinduoduo.com',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                
                // 反爬虫相关头部
                'anti-content': antiContent,
                'etag': `W/"${timestamp}"`,
                'x-web-fp': webFingerprint,
                'x-spider-token': this.generateSpiderToken(),
                'x-risk-token': riskToken,
                'x-validate-token': validateToken,
                'webSpiderRule': `rule_${timestamp}`,
                
                // 性能监控头部
                'x-req-size': reqSize.toString(),
                'x-req-time': startTime.toString(),
            },
            metadata: {
                reqSize,
                startTime,
                timestamp
            }
        };
    }

    // 查询订单列表
    async queryOrderList(params = {}) {
        console.log('🚀 开始查询订单列表...');
        
        const defaultParams = {
            "orderType": 1,
            "afterSaleType": 1,
            "remarkStatus": -1,
            "urgeShippingStatus": -1,
            "groupStartTime": 1743819998,
            "groupEndTime": 1751595998,
            "pageNumber": 1,
            "pageSize": 20,
            "sortType": 10,
            "mobile": ""
        };
        
        const requestBody = { ...defaultParams, ...params };
        
        const requestData = {
            path: '/mangkhut/mms/recentOrderList',
            body: requestBody
        };
        
        // 通过中间件处理
        const processed = this.processWithMiddlewares(requestData);
        
        console.log('🛡️ 反爬虫参数:');
        console.log('  anti-content:', processed.headers['anti-content']);
        console.log('  x-web-fp:', processed.headers['x-web-fp']);
        console.log('  x-spider-token:', processed.headers['x-spider-token']);
        console.log('  etag:', processed.headers['etag']);
        
        return this.makeRequest('/mangkhut/mms/recentOrderList', requestBody, processed.headers);
    }

    // 测试字体反爬虫API
    async testFontApi() {
        console.log('🎨 测试字体反爬虫API...');
        
        const requestBody = {
            scene: "cp_b_data_center"
        };
        
        const options = {
            hostname: 'api.yangkeduo.com',
            port: 443,
            path: '/api/phantom/web/en/ft',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'User-Agent': this.userAgent,
                'Accept': 'application/json',
                'Origin': 'https://mms.pinduoduo.com',
                'Referer': 'https://mms.pinduoduo.com/',
            }
        };
        
        return this.makeHttpsRequest(options, JSON.stringify(requestBody));
    }

    // 发送HTTPS请求
    makeRequest(path, data, headers) {
        const requestBody = JSON.stringify(data);
        
        const options = {
            hostname: 'mms.pinduoduo.com',
            port: 443,
            path: path,
            method: 'POST',
            headers: {
                ...headers,
                'Content-Length': Buffer.byteLength(requestBody)
            }
        };
        
        return this.makeHttpsRequest(options, requestBody);
    }

    // 通用HTTPS请求方法
    makeHttpsRequest(options, data) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const req = https.request(options, (res) => {
                let responseData = Buffer.alloc(0);

                res.on('data', (chunk) => {
                    responseData = Buffer.concat([responseData, chunk]);
                });

                res.on('end', () => {
                    const endTime = Date.now();
                    const responseTime = endTime - startTime;

                    console.log(`📊 响应统计:`);
                    console.log(`  状态码: ${res.statusCode}`);
                    console.log(`  响应时间: ${responseTime}ms`);
                    console.log(`  原始响应大小: ${responseData.length} bytes`);
                    console.log(`  Content-Encoding: ${res.headers['content-encoding'] || '无压缩'}`);

                    // 处理gzip压缩
                    this.processResponse(responseData, res, responseTime)
                        .then(resolve)
                        .catch(reject);
                });
            });

            req.on('error', (error) => {
                console.error('❌ 请求错误:', error.message);
                reject(error);
            });

            req.write(data);
            req.end();
        });
    }

    // 处理响应数据（包括解压缩）
    async processResponse(responseData, res, responseTime) {
        let decompressedData = responseData;

        // 检查是否需要解压缩
        const contentEncoding = res.headers['content-encoding'];
        if (contentEncoding === 'gzip') {
            console.log('🗜️  检测到gzip压缩，正在解压缩...');
            try {
                decompressedData = await new Promise((resolve, reject) => {
                    zlib.gunzip(responseData, (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    });
                });
                console.log(`✅ 解压缩成功，解压后大小: ${decompressedData.length} bytes`);
            } catch (error) {
                console.error('❌ 解压缩失败:', error.message);
                throw error;
            }
        } else if (contentEncoding === 'deflate') {
            console.log('🗜️  检测到deflate压缩，正在解压缩...');
            try {
                decompressedData = await new Promise((resolve, reject) => {
                    zlib.inflate(responseData, (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    });
                });
                console.log(`✅ 解压缩成功，解压后大小: ${decompressedData.length} bytes`);
            } catch (error) {
                console.error('❌ 解压缩失败:', error.message);
                throw error;
            }
        }

        const responseText = decompressedData.toString('utf8');
        console.log(`📄 解压后内容预览: ${responseText.substring(0, 200)}...`);

        try {
            const jsonData = JSON.parse(responseText);

            const result = {
                success: res.statusCode === 200,
                statusCode: res.statusCode,
                headers: res.headers,
                data: jsonData,
                responseTime,
                responseSize: responseText.length,
                originalSize: responseData.length,
                compressed: !!contentEncoding
            };

            if (jsonData.errorCode || jsonData.error_code) {
                console.log(`⚠️  业务错误: ${jsonData.errorCode || jsonData.error_code}`);
                console.log(`   错误信息: ${jsonData.errorMsg || jsonData.error_msg || '无错误信息'}`);
            } else if (jsonData.success === false) {
                console.log(`❌ 请求失败: ${jsonData.errorMsg || '未知错误'}`);
            } else {
                console.log(`✅ 请求成功！`);
                if (jsonData.result && jsonData.result.pageItems) {
                    console.log(`📦 获取到 ${jsonData.result.pageItems.length} 条订单数据`);
                    // 显示第一条订单的部分信息
                    if (jsonData.result.pageItems.length > 0) {
                        const firstOrder = jsonData.result.pageItems[0];
                        console.log(`   第一条订单预览:`);
                        console.log(`     订单号: ${firstOrder.order_sn || '未知'}`);
                        console.log(`     商品名: ${firstOrder.goods_name || '未知'}`);
                        console.log(`     状态: ${firstOrder.order_status || '未知'}`);
                    }
                } else if (jsonData.result) {
                    console.log(`📋 获取到结果数据，类型: ${typeof jsonData.result}`);
                }
            }

            return result;
        } catch (e) {
            console.log(`⚠️  响应不是有效的JSON格式`);
            console.log(`   解析错误: ${e.message}`);
            console.log(`   响应内容: ${responseText.substring(0, 500)}...`);

            return {
                success: res.statusCode === 200,
                statusCode: res.statusCode,
                headers: res.headers,
                rawData: responseText,
                responseTime,
                responseSize: responseText.length,
                originalSize: responseData.length,
                compressed: !!contentEncoding,
                parseError: e.message
            };
        }
    }

    // 运行完整测试
    async runCompleteTest() {
        console.log('🚀 === 完善的拼多多API测试开始 ===\n');
        
        try {
            // 测试1: 查询订单列表
            console.log('📋 测试1: 查询订单列表');
            const orderResult = await this.queryOrderList();
            
            console.log('\n⏱️  等待3秒后进行下一个测试...');
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // 测试2: 字体反爬虫API
            console.log('\n🎨 测试2: 字体反爬虫API');
            const fontResult = await this.testFontApi();
            
            // 生成测试报告
            this.generateTestReport([
                { name: '订单列表查询', result: orderResult },
                { name: '字体反爬虫API', result: fontResult }
            ]);
            
        } catch (error) {
            console.error('❌ 测试过程中出现错误:', error);
        }
        
        console.log('\n✅ 完整测试完成！');
    }

    // 生成测试报告
    generateTestReport(tests) {
        console.log('\n📋 === 测试报告 ===');
        
        tests.forEach((test, index) => {
            console.log(`\n${index + 1}. ${test.name}:`);
            if (test.result.success) {
                console.log(`   ✅ 成功 (${test.result.statusCode})`);
                console.log(`   ⏱️  响应时间: ${test.result.responseTime}ms`);
                console.log(`   📦 响应大小: ${test.result.responseSize} bytes`);
            } else {
                console.log(`   ❌ 失败 (${test.result.statusCode || 'ERROR'})`);
            }
        });
        
        // 保存详细报告
        const fs = require('fs');
        fs.writeFileSync('perfect-pdd-api-report.json', JSON.stringify({
            timestamp: new Date().toISOString(),
            tests: tests,
            cookies: this.realCookies,
            userAgent: this.userAgent
        }, null, 2));
        
        console.log('\n💾 详细报告已保存到: perfect-pdd-api-report.json');
    }
}

// 运行测试
if (require.main === module) {
    const api = new PerfectPddApi();
    api.runCompleteTest();
}

module.exports = PerfectPddApi;
