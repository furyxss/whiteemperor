const fs = require('fs');
const path = require('path');

// 分析中间件插件的脚本
class MiddlewareAnalyzer {
    constructor(filePath) {
        this.filePath = filePath;
        this.content = '';
        this.middlewares = [];
    }

    // 读取文件内容
    readFile() {
        try {
            this.content = fs.readFileSync(this.filePath, 'utf8');
            console.log(`📁 文件读取成功: ${this.filePath}`);
            console.log(`📊 文件大小: ${(this.content.length / 1024).toFixed(2)} KB`);
            return true;
        } catch (error) {
            console.error('❌ 文件读取失败:', error.message);
            return false;
        }
    }

    // 查找所有中间件插件
    findMiddlewares() {
        console.log('\n🔍 开始分析中间件插件...\n');

        // 1. 查找 DEBUG_NAME 模式
        this.findDebugNames();
        
        // 2. 查找 beforeSend 函数
        this.findBeforeSendFunctions();
        
        // 3. 查找 onResponse 函数
        this.findOnResponseFunctions();
        
        // 4. 查找 onError 函数
        this.findOnErrorFunctions();
        
        // 5. 查找特定的插件模式
        this.findSpecificPatterns();
    }

    // 查找 DEBUG_NAME
    findDebugNames() {
        const debugNameRegex = /DEBUG_NAME\s*:\s*["']([^"']+)["']/g;
        let match;
        const debugNames = [];

        while ((match = debugNameRegex.exec(this.content)) !== null) {
            debugNames.push({
                name: match[1],
                position: match.index,
                context: this.getContext(match.index, 100)
            });
        }

        console.log('🏷️  找到的 DEBUG_NAME:');
        debugNames.forEach((item, index) => {
            console.log(`  ${index + 1}. ${item.name}`);
        });
        console.log();

        return debugNames;
    }

    // 查找 beforeSend 函数
    findBeforeSendFunctions() {
        // 匹配 beforeSend: function(t) { ... }
        const beforeSendRegex = /beforeSend\s*:\s*function\s*\([^)]*\)\s*\{[^}]*\}/g;
        let match;
        const beforeSends = [];

        while ((match = beforeSendRegex.exec(this.content)) !== null) {
            const fullFunction = this.extractFullFunction(match.index, 'beforeSend');
            beforeSends.push({
                position: match.index,
                preview: match[0].substring(0, 200) + '...',
                fullFunction: fullFunction,
                context: this.getContext(match.index, 200)
            });
        }

        console.log('🚀 找到的 beforeSend 函数:');
        beforeSends.forEach((item, index) => {
            console.log(`  ${index + 1}. 位置: ${item.position}`);
            console.log(`     预览: ${item.preview}`);
            console.log();
        });

        return beforeSends;
    }

    // 查找 onResponse 函数
    findOnResponseFunctions() {
        const onResponseRegex = /onResponse\s*:\s*function\s*\([^)]*\)\s*\{/g;
        let match;
        const onResponses = [];

        while ((match = onResponseRegex.exec(this.content)) !== null) {
            onResponses.push({
                position: match.index,
                preview: this.getContext(match.index, 150),
            });
        }

        console.log('📥 找到的 onResponse 函数:');
        onResponses.forEach((item, index) => {
            console.log(`  ${index + 1}. 位置: ${item.position}`);
            console.log(`     预览: ${item.preview}`);
            console.log();
        });

        return onResponses;
    }

    // 查找 onError 函数
    findOnErrorFunctions() {
        const onErrorRegex = /onError\s*:\s*function\s*\([^)]*\)\s*\{/g;
        let match;
        const onErrors = [];

        while ((match = onErrorRegex.exec(this.content)) !== null) {
            onErrors.push({
                position: match.index,
                preview: this.getContext(match.index, 150),
            });
        }

        console.log('❌ 找到的 onError 函数:');
        onErrors.forEach((item, index) => {
            console.log(`  ${index + 1}. 位置: ${item.position}`);
            console.log(`     预览: ${item.preview}`);
            console.log();
        });

        return onErrors;
    }

    // 查找特定模式
    findSpecificPatterns() {
        console.log('🎯 查找特定模式...\n');

        // 查找您提到的特定 beforeSend 模式
        const specificPattern = /beforeSend\s*:\s*function\s*\([^)]*\)\s*\{[^}]*Date\.now\(\)[^}]*\}/g;
        let match;

        while ((match = specificPattern.exec(this.content)) !== null) {
            console.log('🎯 找到匹配的特定模式:');
            console.log('位置:', match.index);
            console.log('内容:', match[0]);
            console.log('上下文:', this.getContext(match.index, 300));
            console.log('---\n');
        }

        // 查找包含 body.length 的模式
        const bodyLengthPattern = /body\.length/g;
        const bodyLengthMatches = [];
        while ((match = bodyLengthPattern.exec(this.content)) !== null) {
            bodyLengthMatches.push({
                position: match.index,
                context: this.getContext(match.index, 200)
            });
        }

        console.log('📏 找到 body.length 引用:');
        bodyLengthMatches.forEach((item, index) => {
            console.log(`  ${index + 1}. 位置: ${item.position}`);
            console.log(`     上下文: ${item.context}`);
            console.log();
        });
    }

    // 获取上下文
    getContext(position, length = 100) {
        const start = Math.max(0, position - length);
        const end = Math.min(this.content.length, position + length);
        return this.content.substring(start, end).replace(/\s+/g, ' ').trim();
    }

    // 提取完整函数
    extractFullFunction(startPos, functionName) {
        let braceCount = 0;
        let inFunction = false;
        let functionStart = startPos;
        
        // 找到函数开始的 {
        for (let i = startPos; i < this.content.length; i++) {
            if (this.content[i] === '{') {
                if (!inFunction) {
                    inFunction = true;
                    functionStart = i;
                }
                braceCount++;
            } else if (this.content[i] === '}') {
                braceCount--;
                if (braceCount === 0 && inFunction) {
                    return this.content.substring(startPos, i + 1);
                }
            }
        }
        
        return this.content.substring(startPos, Math.min(startPos + 1000, this.content.length));
    }

    // 生成报告
    generateReport() {
        console.log('\n📋 === 分析报告 ===\n');
        
        const debugNames = this.findDebugNames();
        const beforeSends = this.findBeforeSendFunctions();
        const onResponses = this.findOnResponseFunctions();
        const onErrors = this.findOnErrorFunctions();

        console.log('📊 统计信息:');
        console.log(`  - DEBUG_NAME 数量: ${debugNames.length}`);
        console.log(`  - beforeSend 函数数量: ${beforeSends.length}`);
        console.log(`  - onResponse 函数数量: ${onResponses.length}`);
        console.log(`  - onError 函数数量: ${onErrors.length}`);
        console.log();

        // 保存详细报告到文件
        this.saveDetailedReport(debugNames, beforeSends, onResponses, onErrors);
    }

    // 保存详细报告
    saveDetailedReport(debugNames, beforeSends, onResponses, onErrors) {
        const report = {
            timestamp: new Date().toISOString(),
            file: this.filePath,
            fileSize: this.content.length,
            summary: {
                debugNames: debugNames.length,
                beforeSends: beforeSends.length,
                onResponses: onResponses.length,
                onErrors: onErrors.length
            },
            details: {
                debugNames,
                beforeSends,
                onResponses,
                onErrors
            }
        };

        const reportPath = 'middleware-analysis-report.json';
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`💾 详细报告已保存到: ${reportPath}`);
    }

    // 运行分析
    run() {
        console.log('🚀 === 中间件分析器启动 ===\n');
        
        if (!this.readFile()) {
            return;
        }

        this.findMiddlewares();
        this.generateReport();
        
        console.log('\n✅ 分析完成！');
    }
}

// 使用示例
if (require.main === module) {
    const filePath = process.argv[2] || './commons.297c3580201ce29dbb61.js';
    
    console.log('📁 目标文件:', filePath);
    
    if (!fs.existsSync(filePath)) {
        console.error('❌ 文件不存在:', filePath);
        process.exit(1);
    }
    
    const analyzer = new MiddlewareAnalyzer(filePath);
    analyzer.run();
}

module.exports = MiddlewareAnalyzer;
