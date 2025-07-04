// 测试中间件系统
console.log('🚀 启动中间件系统测试...\n');

// 引入cookie.js中的函数
// 如果在浏览器中，直接运行cookie.js后使用全局变量
// 如果在Node.js中，使用require

async function runTests() {
    try {
        console.log('📋 === 测试配置 ===');
        console.log('URL:', n);
        console.log('请求配置:', JSON.stringify(o, null, 2));
        console.log('原始中间件数组:', e);
        console.log('增强中间件数组:', e_enhanced);
        
        console.log('\n🧪 === 开始测试 ===');
        
        // 测试1: 原始中间件数组
        console.log('\n--- 测试1: 原始中间件数组 ---');
        const middleware1 = m(originalFetch, e);
        const result1 = await middleware1(n, o);
        console.log('测试1结果:', result1);
        
        console.log('\n--- 测试2: 增强中间件数组 ---');
        const middleware2 = m(originalFetch, e_enhanced);
        const result2 = await middleware2(n, o);
        console.log('测试2结果:', result2);
        
        console.log('\n✅ === 所有测试完成 ===');
        
    } catch (error) {
        console.error('❌ 测试失败:', error);
    }
}

// 运行测试
runTests();

// 额外的调试函数
window.debugMiddleware = function() {
    console.log('\n🔍 === 调试信息 ===');
    console.log('当前环境变量:');
    console.log('- n (URL):', n);
    console.log('- o (配置):', o);
    console.log('- e (原始中间件):', e);
    console.log('- e_enhanced (增强中间件):', e_enhanced);
    console.log('- m (中间件函数):', typeof m);
    console.log('- v (URL处理器):', typeof v);
    console.log('- p (中间件提取器):', typeof p);
};

// 手动测试反爬虫签名生成
window.testAntiContent = function() {
    console.log('\n🛡️ === 测试反爬虫签名生成 ===');
    
    const testUrl = '/mangkhut/mms/recentOrderList';
    const testBody = '{"orderType":1,"pageNumber":1}';
    const testTimestamp = Date.now();
    
    const signature = generateAntiContent(testUrl, testBody, testTimestamp);
    
    console.log('测试参数:');
    console.log('  URL:', testUrl);
    console.log('  Body:', testBody);
    console.log('  时间戳:', testTimestamp);
    console.log('生成的签名:', signature);
    
    return signature;
};

// 比较不同中间件的效果
window.compareMiddlewares = async function() {
    console.log('\n⚖️ === 比较不同中间件效果 ===');
    
    console.log('1. 无中间件 (直接fetch):');
    const directResult = await originalFetch(n, o);
    console.log('  状态:', directResult.status);
    console.log('  头部:', Array.from(directResult.headers.entries()));
    
    console.log('\n2. 原始中间件数组:');
    const middleware1 = m(originalFetch, e);
    const result1 = await middleware1(n, o);
    console.log('  结果:', result1);
    
    console.log('\n3. 增强中间件数组:');
    const middleware2 = m(originalFetch, e_enhanced);
    const result2 = await middleware2(n, o);
    console.log('  结果:', result2);
    
    return {
        direct: directResult,
        original: result1,
        enhanced: result2
    };
};

console.log('\n💡 === 可用的调试函数 ===');
console.log('- debugMiddleware() // 查看环境变量');
console.log('- testAntiContent() // 测试签名生成');
console.log('- compareMiddlewares() // 比较中间件效果');
console.log('- testMiddlewareSystem() // 运行完整测试');
