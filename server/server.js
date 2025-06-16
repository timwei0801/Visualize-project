/**
 * AI API 代理服務器 - 修正版
 * 解決 CORS 問題並提供更好的錯誤處理
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

// 詳細的 CORS 配置
const corsOptions = {
    origin: function (origin, callback) {
        console.log(`📡 CORS 請求來源: ${origin}`);
        
        // 允許的域名列表
        const allowedOrigins = [
            'http://localhost:8000',
            'http://127.0.0.1:8000',
            'http://localhost:5501',
            'http://127.0.0.1:5501',
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://localhost:5500',
            'http://127.0.0.1:5500',
            'http://localhost:8080',
            'http://127.0.0.1:8080'
        ];
        
        // 開發環境允許所有本地主機
        if (!origin || 
            allowedOrigins.includes(origin) ||
            /^http:\/\/localhost:\d+$/.test(origin) ||
            /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) {
            callback(null, true);
        } else {
            console.warn(`❌ CORS 拒絕來源: ${origin}`);
            callback(new Error('CORS 政策不允許此來源'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-Requested-With',
        'Accept',
        'Origin'
    ],
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
    maxAge: 86400 // 24小時
};

// 中間件配置
app.use(cors(corsOptions));

// 添加明確的 OPTIONS 處理
app.options('*', cors(corsOptions));

// 請求日誌中間件
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} from ${req.get('origin') || 'unknown'}`);
    next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 靜態文件服務（可選）
app.use('/static', express.static(path.join(__dirname, '../')));

/**
 * 健康檢查端點 - 修正版
 */
app.get('/health', (req, res) => {
    console.log('🏥 健康檢查請求');
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        services: ['openai', 'claude', 'gemini'],
        server: 'AI Proxy Server v1.1'
    });
});

/**
 * API 狀態檢查
 */
app.get('/api/status', (req, res) => {
    console.log('📊 API 狀態檢查');
    res.json({
        server: 'AI Proxy Server',
        version: '1.1.0',
        endpoints: {
            openai: '/api/openai/analyze',
            claude: '/api/claude/analyze',
            gemini: '/api/gemini/analyze',
            unified: '/api/ai/analyze'
        },
        features: [
            'CORS 支援',
            '圖片分析',
            '多 AI 提供商',
            '錯誤處理',
            '請求記錄'
        ]
    });
});

/**
 * OpenAI API 代理
 */
app.post('/api/openai/analyze', async (req, res) => {
    try {
        console.log('🤖 OpenAI 分析請求');
        const { apiKey, messages, model = 'gpt-4o', maxTokens = 4000 } = req.body;
        
        if (!apiKey) {
            return res.status(400).json({ error: 'API Key is required' });
        }

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model,
            messages,
            max_tokens: maxTokens,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            timeout: 60000 // 60秒超時
        });

        console.log('✅ OpenAI 分析完成');
        res.json({
            success: true,
            content: response.data.choices[0].message.content,
            usage: response.data.usage
        });

    } catch (error) {
        console.error('❌ OpenAI API Error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: error.response?.data?.error?.message || error.message
        });
    }
});

/**
 * Claude API 代理
 */
app.post('/api/claude/analyze', async (req, res) => {
    try {
        console.log('🧠 Claude 分析請求');
        const { apiKey, messages, model = 'claude-3-5-sonnet-20241022', maxTokens = 4000, systemPrompt } = req.body;
        
        if (!apiKey) {
            return res.status(400).json({ error: 'API Key is required' });
        }

        const response = await axios.post('https://api.anthropic.com/v1/messages', {
            model,
            max_tokens: maxTokens,
            system: systemPrompt,
            messages
        }, {
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01'
            },
            timeout: 60000
        });

        console.log('✅ Claude 分析完成');
        res.json({
            success: true,
            content: response.data.content[0].text,
            usage: response.data.usage
        });

    } catch (error) {
        console.error('❌ Claude API Error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: error.response?.data?.error?.message || error.message
        });
    }
});

/**
 * Google Gemini API 代理
 */
app.post('/api/gemini/analyze', async (req, res) => {
    try {
        console.log('🌟 Gemini 分析請求');
        const { apiKey, prompt, model = 'gemini-1.5-pro' } = req.body;
        
        if (!apiKey) {
            return res.status(400).json({ error: 'API Key is required' });
        }

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
                contents: [
                    {
                        parts: [
                            { text: prompt }
                        ]
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 60000
            }
        );

        console.log('✅ Gemini 分析完成');
        res.json({
            success: true,
            content: response.data.candidates[0].content.parts[0].text,
            usage: response.data.usageMetadata
        });

    } catch (error) {
        console.error('❌ Gemini API Error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: error.response?.data?.error?.message || error.message
        });
    }
});

/**
 * 通用 AI 分析端點
 */
app.post('/api/ai/analyze', async (req, res) => {
    try {
        const { provider, apiKey, analysisData, customPrompt, chartImages } = req.body;
        
        console.log(`📊 收到 ${provider} 分析請求`);
        console.log(`📈 數據大小: ${analysisData.dataSize}`);
        console.log(`📊 圖表數量: ${analysisData.chartCount}`);
        
        let result;
        
        switch (provider) {
            case 'openai':
                result = await analyzeWithOpenAI(apiKey, analysisData, customPrompt, chartImages);
                break;
            case 'claude':
                result = await analyzeWithClaude(apiKey, analysisData, customPrompt, chartImages);
                break;
            case 'gemini':
                result = await analyzeWithGemini(apiKey, analysisData, customPrompt, chartImages);
                break;
            default:
                throw new Error(`不支援的 AI 提供商: ${provider}`);
        }
        
        console.log('✅ AI 分析完成');
        res.json({
            success: true,
            analysis: result,
            metadata: {
                provider,
                timestamp: new Date().toISOString(),
                dataSize: analysisData.dataSize,
                chartCount: analysisData.chartCount
            }
        });

    } catch (error) {
        console.error('❌ AI Analysis Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * OpenAI 分析函數
 */
async function analyzeWithOpenAI(apiKey, analysisData, customPrompt, chartImages) {
    const systemPrompt = `你是一個專業的數據分析師和統計學家，擅長從商業和統計角度分析數據視覺化。

你的任務是：
1. 分析提供的儀表板數據和圖表
2. 提供專業的統計洞察和商業建議
3. 解釋每個圖表的統計意義
4. 識別數據中的模式、趨勢和異常
5. 提供可行的商業建議

請用繁體中文回應，並確保分析具有統計學嚴謹性。`;

    const userPrompt = buildAnalysisPrompt(analysisData, customPrompt);
    
    const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
    ];

    // 如果有圖片，添加圖片分析
    if (chartImages && chartImages.length > 0) {
        chartImages.forEach(chart => {
            messages.push({
                role: 'user',
                content: [
                    { type: 'text', text: `請分析這個${chart.title}圖表：` },
                    { type: 'image_url', image_url: { url: chart.image } }
                ]
            });
        });
    }

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4o',
        messages,
        max_tokens: 4000,
        temperature: 0.7
    }, {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    });

    return response.data.choices[0].message.content;
}

/**
 * Claude 分析函數
 */
async function analyzeWithClaude(apiKey, analysisData, customPrompt, chartImages) {
    const systemPrompt = `你是一個專業的數據分析師和統計學家，擅長從商業和統計角度分析數據視覺化。請用繁體中文提供專業的統計洞察和商業建議。`;

    const userPrompt = buildAnalysisPrompt(analysisData, customPrompt);
    
    const messages = [{ role: 'user', content: userPrompt }];

    // Claude 的圖片處理
    if (chartImages && chartImages.length > 0) {
        const imageContent = chartImages.map(chart => ({
            type: 'image',
            source: {
                type: 'base64',
                media_type: 'image/png',
                data: chart.image.split(',')[1]
            }
        }));
        
        messages[0].content = [
            { type: 'text', text: userPrompt },
            ...imageContent
        ];
    }

    const response = await axios.post('https://api.anthropic.com/v1/messages', {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        system: systemPrompt,
        messages
    }, {
        headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
        }
    });

    return response.data.content[0].text;
}

/**
 * Gemini 分析函數
 */
async function analyzeWithGemini(apiKey, analysisData, customPrompt, chartImages) {
    const prompt = buildAnalysisPrompt(analysisData, customPrompt);
    
    const contents = [
        {
            parts: [{ text: prompt }]
        }
    ];

    // Gemini 的圖片處理
    if (chartImages && chartImages.length > 0) {
        chartImages.forEach(chart => {
            contents[0].parts.push({
                inline_data: {
                    mime_type: 'image/png',
                    data: chart.image.split(',')[1]
                }
            });
        });
    }

    const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
        { contents },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    return response.data.candidates[0].content.parts[0].text;
}

/**
 * 構建分析提示
 */
function buildAnalysisPrompt(analysisData, customPrompt) {
    return `請分析以下儀表板數據：

## 數據概覽
- 總記錄數：${analysisData.dataSize.toLocaleString()}
- 圖表數量：${analysisData.chartCount}
- 資料欄位：${analysisData.columns.join(', ')}
- 數據完整性：${analysisData.dataQuality.完整性}%
- 質量評分：${analysisData.dataQuality.質量評分}/100

## 圖表資訊
${analysisData.charts ? analysisData.charts.map(chart => `- ${chart.title} (${chart.type}): ${chart.description || '數據視覺化圖表'}`).join('\n') : ''}

## 現有洞察
${analysisData.insights ? analysisData.insights.join('\n') : '尚無現有洞察'}

## 自定義分析要求
${customPrompt}

請提供以下格式的分析報告：

# 執行摘要
[簡潔的關鍵發現總結]

# 數據品質評估
[數據完整性、可靠性分析]

# 圖表深度分析
[針對每個圖表的統計解讀]

# 關鍵洞察
[重要的商業和統計發現]

# 建議行動
[基於分析的具體建議]

# 技術附註
[統計方法和限制說明]`;
}

/**
 * 錯誤處理中間件
 */
app.use((error, req, res, next) => {
    console.error('💥 伺服器錯誤:', error);
    res.status(500).json({
        success: false,
        error: '伺服器內部錯誤',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
});

/**
 * 404 處理
 */
app.use((req, res) => {
    console.log(`❓ 404 - 路徑不存在: ${req.path}`);
    res.status(404).json({
        success: false,
        error: '端點不存在',
        path: req.path
    });
});

/**
 * 啟動伺服器
 */
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 AI 代理伺服器已啟動`);
    console.log(`📡 服務地址: http://localhost:${PORT}`);
    console.log(`🔗 健康檢查: http://localhost:${PORT}/health`);
    console.log(`📊 API 狀態: http://localhost:${PORT}/api/status`);
    console.log(`\n🤖 支援的 AI 提供商:`);
    console.log(`   - OpenAI GPT-4: /api/openai/analyze`);
    console.log(`   - Anthropic Claude: /api/claude/analyze`);
    console.log(`   - Google Gemini: /api/gemini/analyze`);
    console.log(`   - 統一端點: /api/ai/analyze`);
    console.log(`\n🔧 CORS 配置:`);
    console.log(`   - 允許所有本地主機域名`);
    console.log(`   - 支援預檢請求 (OPTIONS)`);
    console.log(`   - 詳細請求日誌`);
});

// 優雅關閉
process.on('SIGTERM', () => {
    console.log('🛑 收到 SIGTERM，正在關閉服務器...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 收到 SIGINT，正在關閉服務器...');
    process.exit(0);
});

module.exports = app;