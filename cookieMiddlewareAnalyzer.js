const fs = require('fs');

// Cookie中间件分析器
class CookieMiddlewareAnalyzer {
    constructor() {
        this.jsContent = '';
        this.cookiePatterns = [];
    }

    // 读取JS文件
    readJsFile(filePath) {
        try {
            this.jsContent = fs.readFileSync(filePath, 'utf8');
            console.log(`📁 文件读取成功: ${filePath}`);
            console.log(`📊 文件大小: ${(this.jsContent.length / 1024).toFixed(2)} KB`);
            return true;
        } catch (error) {
            console.error('❌ 文件读取失败:', error.message);
            return false;
        }
    }

    // 查找Cookie相关的代码
    findCookiePatterns() {
        console.log('\n🍪 开始分析Cookie处理机制...\n');

        const patterns = [
            // 1. 查找document.cookie相关代码
            {
                name: 'document.cookie操作',
                regex: /document\.cookie[^;]{0,200}/g,
                description: '直接操作document.cookie的代码'
            },
            // 2. 查找Cookie设置函数
            {
                name: 'Cookie设置函数',
                regex: /[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*[^;]{0,100}cookie[^;]{0,100}/gi,
                description: '设置Cookie的函数'
            },
            // 3. 查找Cookie读取函数
            {
                name: 'Cookie读取函数',
                regex: /[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*[^;]{0,100}getCookie|readCookie|parseCookie[^;]{0,100}/gi,
                description: '读取Cookie的函数'
            },
            // 4. 查找特定Cookie名称
            {
                name: '特定Cookie名称',
                regex: /(msfe-pc-cookie-captcha-token|api_uid|_nano_fp|x-hng|rckk|_bee|PASS_ID|JSESSIONID|mms_b84d1838)/g,
                description: '特定的Cookie名称'
            },
            // 5. 查找Cookie验证相关
            {
                name: 'Cookie验证',
                regex: /VerifyAuthToken|captcha.*token|auth.*cookie/gi,
                description: 'Cookie验证相关代码'
            },
            // 6. 查找Cookie过期设置
            {
                name: 'Cookie过期设置',
                regex: /expires\s*=|max-age\s*=|setTime.*getTime/gi,
                description: 'Cookie过期时间设置'
            },
            // 7. 查找Cookie域名和路径设置
            {
                name: 'Cookie域名路径',
                regex: /domain\s*=|path\s*=|secure|httponly/gi,
                description: 'Cookie域名和路径设置'
            }
        ];

        patterns.forEach(pattern => {
            console.log(`🔍 查找: ${pattern.name}`);
            const matches = [];
            let match;

            while ((match = pattern.regex.exec(this.jsContent)) !== null) {
                matches.push({
                    content: match[0],
                    position: match.index,
                    context: this.getContext(match.index, 150)
                });
            }

            console.log(`   找到 ${matches.length} 个匹配项`);
            matches.forEach((item, index) => {
                console.log(`   ${index + 1}. 位置: ${item.position}`);
                console.log(`      内容: ${item.content}`);
                console.log(`      上下文: ${item.context.substring(0, 100)}...`);
                console.log();
            });

            this.cookiePatterns.push({
                ...pattern,
                matches
            });
        });
    }

    // 分析Cookie中间件函数
    analyzeCookieMiddleware() {
        console.log('\n🔧 分析Cookie中间件函数...\n');

        // 查找可能的Cookie处理中间件
        const middlewarePatterns = [
            // 查找包含Cookie处理的beforeSend函数
            /beforeSend\s*:\s*function[^}]{0,500}cookie[^}]{0,500}\}/gi,
            // 查找包含Cookie处理的onResponse函数
            /onResponse\s*:\s*function[^}]{0,500}cookie[^}]{0,500}\}/gi,
            // 查找Cookie相关的工具函数
            /function\s+[a-zA-Z_$][a-zA-Z0-9_$]*[^}]{0,200}cookie[^}]{0,200}\}/gi
        ];

        middlewarePatterns.forEach((pattern, index) => {
            console.log(`🔍 查找Cookie中间件模式 ${index + 1}:`);
            let match;
            let count = 0;

            while ((match = pattern.exec(this.jsContent)) !== null && count < 5) {
                count++;
                console.log(`   匹配 ${count}:`);
                console.log(`     位置: ${match.index}`);
                console.log(`     内容: ${match[0].substring(0, 200)}...`);
                console.log(`     上下文: ${this.getContext(match.index, 200)}`);
                console.log();
            }
        });
    }

    // 提取Cookie处理函数
    extractCookieFunctions() {
        console.log('\n🍪 提取Cookie处理函数...\n');

        // 查找T()函数 - 可能是Cookie读取函数
        const tFunctionPattern = /var\s+T\s*=\s*function[^}]+\}/g;
        let match;

        while ((match = tFunctionPattern.exec(this.jsContent)) !== null) {
            console.log('🔍 找到T()函数（可能的Cookie读取函数）:');
            console.log('   位置:', match.index);
            console.log('   内容:', match[0]);
            console.log('   上下文:', this.getContext(match.index, 300));
            console.log();
        }

        // 查找E()函数 - 可能是Cookie设置函数
        const eFunctionPattern = /var\s+E\s*=\s*function[^}]+\}/g;
        while ((match = eFunctionPattern.exec(this.jsContent)) !== null) {
            console.log('🔍 找到E()函数（可能的Cookie设置函数）:');
            console.log('   位置:', match.index);
            console.log('   内容:', match[0]);
            console.log('   上下文:', this.getContext(match.index, 300));
            console.log();
        }

        // 查找M()函数 - 可能是Cookie删除函数
        const mFunctionPattern = /var\s+M\s*=\s*function[^}]+\}/g;
        while ((match = mFunctionPattern.exec(this.jsContent)) !== null) {
            console.log('🔍 找到M()函数（可能的Cookie删除函数）:');
            console.log('   位置:', match.index);
            console.log('   内容:', match[0]);
            console.log('   上下文:', this.getContext(match.index, 300));
            console.log();
        }
    }

    // 分析验证码Cookie机制
    analyzeCaptchaCookie() {
        console.log('\n🔐 分析验证码Cookie机制...\n');

        // 查找验证码Cookie相关的代码
        const captchaPattern = /msfe-pc-cookie-captcha-token[^;]{0,300}/g;
        let match;

        while ((match = captchaPattern.exec(this.jsContent)) !== null) {
            console.log('🔍 找到验证码Cookie处理:');
            console.log('   位置:', match.index);
            console.log('   内容:', match[0]);
            console.log('   上下文:', this.getContext(match.index, 400));
            console.log();
        }

        // 查找VerifyAuthToken相关处理
        const verifyTokenPattern = /VerifyAuthToken[^;]{0,200}/g;
        while ((match = verifyTokenPattern.exec(this.jsContent)) !== null) {
            console.log('🔍 找到VerifyAuthToken处理:');
            console.log('   位置:', match.index);
            console.log('   内容:', match[0]);
            console.log('   上下文:', this.getContext(match.index, 300));
            console.log();
        }
    }

    // 获取上下文
    getContext(position, length = 100) {
        const start = Math.max(0, position - length);
        const end = Math.min(this.jsContent.length, position + length);
        return this.jsContent.substring(start, end).replace(/\s+/g, ' ').trim();
    }

    // 生成Cookie分析报告
    generateCookieReport() {
        console.log('\n📋 === Cookie处理机制分析报告 ===\n');

        const report = {
            timestamp: new Date().toISOString(),
            fileSize: this.jsContent.length,
            cookiePatterns: this.cookiePatterns,
            summary: {
                totalPatterns: this.cookiePatterns.length,
                totalMatches: this.cookiePatterns.reduce((sum, pattern) => sum + pattern.matches.length, 0),
                hasDocumentCookie: this.cookiePatterns.some(p => p.name === 'document.cookie操作' && p.matches.length > 0),
                hasCaptchaCookie: this.cookiePatterns.some(p => p.matches.some(m => m.content.includes('captcha-token'))),
                hasVerifyAuthToken: this.cookiePatterns.some(p => p.matches.some(m => m.content.includes('VerifyAuthToken')))
            }
        };

        // 统计信息
        console.log('📊 统计信息:');
        console.log(`  分析的模式数量: ${report.summary.totalPatterns}`);
        console.log(`  总匹配项数量: ${report.summary.totalMatches}`);
        console.log(`  包含document.cookie操作: ${report.summary.hasDocumentCookie ? '✅' : '❌'}`);
        console.log(`  包含验证码Cookie: ${report.summary.hasCaptchaCookie ? '✅' : '❌'}`);
        console.log(`  包含VerifyAuthToken: ${report.summary.hasVerifyAuthToken ? '✅' : '❌'}`);

        // 保存详细报告
        fs.writeFileSync('cookie-middleware-analysis.json', JSON.stringify(report, null, 2));
        console.log('\n💾 详细报告已保存到: cookie-middleware-analysis.json');

        return report;
    }

    // 运行完整分析
    run(filePath) {
        console.log('🚀 === Cookie中间件分析器启动 ===\n');

        if (!this.readJsFile(filePath)) {
            return;
        }

        this.findCookiePatterns();
        this.analyzeCookieMiddleware();
        this.extractCookieFunctions();
        this.analyzeCaptchaCookie();
        this.generateCookieReport();

        console.log('\n✅ Cookie分析完成！');
    }
}

// 运行分析
if (require.main === module) {
    const filePath = process.argv[2] || './commons.297c3580201ce29dbb61.js';
    
    if (!fs.existsSync(filePath)) {
        console.error('❌ 文件不存在:', filePath);
        process.exit(1);
    }
    
    const analyzer = new CookieMiddlewareAnalyzer();
    analyzer.run(filePath);
}

module.exports = CookieMiddlewareAnalyzer;
