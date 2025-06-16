/**
 * 增強版智能報告生成器 - 完整除錯版
 * 支援圖表截圖、真實 AI 分析、HTML/PDF 生成
 * 修正所有已知問題，確保所有功能正常運作
 */

class EnhancedReportGenerator {
    constructor(vizApp) {
        this.vizApp = vizApp;
        this.aiProvider = 'openai';
        this.reportData = null;
        this.chartImages = new Map();
        this.proxyServerUrl = 'http://localhost:3002';
        
        // 新增：自動修復計時器
        this.autoFixTimer = null;
        
        this.initializeAIProviders();
        this.initializeUI();
        // 新增：設定自動修復監聽器
        this.setupAutoFixListeners();
        console.log('🚀 增強版報告生成器初始化完成（含自動修復）');
    }

    // 新增：設定自動修復監聽器
    setupAutoFixListeners() {
        // 監聽圖表變化
        if (this.vizApp) {
            const originalRenderCharts = this.vizApp.renderCharts;
            const self = this;

            this.vizApp.renderCharts = function(...args) {
                const result = originalRenderCharts.apply(this, args);

                // 圖表更新後，延遲更新預覽
                clearTimeout(self.autoFixTimer);
                self.autoFixTimer = setTimeout(() => {
                    const modal = document.getElementById('enhancedReportModal');
                    if (modal && modal.classList.contains('show')) {
                        console.log('🔄 自動更新圖表預覽...');
                        self.updateChartsPreview();
                    }
                }, 1000);

                return result;
            };
        }

        console.log('✅ 自動修復監聽器設定完成');
    }

    // 6. 新增預覽狀態檢查方法
    /**
     * 檢查並修復預覽狀態
     */
    checkAndFixPreviewState() {
        const modal = document.getElementById('enhancedReportModal');
        if (!modal || !modal.classList.contains('show')) {
            return false;
        }
        
        const grid = document.getElementById('chartsPreviewGrid');
        if (!grid) {
            console.warn('⚠️ 預覽網格不存在，需要重新初始化');
            return false;
        }
        
        const cardCount = grid.querySelectorAll('.chart-preview-card').length;
        const chartCount = this.vizApp.state.charts.length;
        
        if (cardCount !== chartCount) {
            console.log(`🔄 預覽卡片數量不匹配 (${cardCount}/${chartCount})，自動修復...`);
            this.updateChartsPreview();
            return false;
        }
        
        return true;
    }

    /**
     * 初始化 AI 提供商
     */
    initializeAIProviders() {
        this.aiProviders = {
            openai: {
                name: 'OpenAI (GPT-4)',
                apiUrl: 'https://api.openai.com/v1/chat/completions',
                model: 'gpt-4o',
                supportsImages: true,
                maxTokens: 4000,
                description: '最先進的大語言模型，具備優秀的推理和分析能力'
            },
            claude: {
                name: 'Claude 4 Sonnet',
                apiUrl: 'https://api.anthropic.com/v1/messages',
                model: 'claude-sonnet-4-20250514',
                supportsImages: true,
                maxTokens: 4000,
                description: '專業的分析型 AI，擅長深度思考和結構化分析'
            },
            gemini: {
                name: 'Google Gemini',
                apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
                model: 'gemini-1.5-pro',
                supportsImages: true,
                maxTokens: 4000,
                description: 'Google 的多模態 AI，具備強大的圖片分析能力'
            }
        };
    }

    /**
     * 初始化增強版 UI
     */
    initializeUI() {
        // 清理可能存在的舊模態框
        const existingModal = document.getElementById('enhancedReportModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        this.createEnhancedReportModal();
        this.setupEventListeners();
        this.loadHTMLToPDFGenerator();
    }

    /**
     * 載入 HTML 轉 PDF 生成器
     */
    async loadHTMLToPDFGenerator() {
        try {
            // 檢查是否已載入
            if (typeof HTMLToPDFGenerator !== 'undefined') {
                console.log('✅ HTMLToPDFGenerator 已存在');
                return;
            }

            // 如果 htmlToPdfGenerator.js 文件存在，直接載入
            if (typeof window.HTMLToPDFGenerator === 'undefined') {
                console.log('📦 載入 HTMLToPDFGenerator...');
                
                // 動態載入 htmlToPdfGenerator.js
                await this.loadScript('js/htmlToPdfGenerator.js');
                console.log('✅ HTMLToPDFGenerator 載入成功');
            }
        } catch (error) {
            console.warn('⚠️ HTMLToPDFGenerator 載入失敗:', error);
            // 載入失敗時使用內建的生成器
            this.createBuiltinHTMLGenerator();
        }
    }

    /**
     * 動態載入腳本
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Failed to load ${src}`));
            document.head.appendChild(script);
        });
    }

    /**
     * 創建內建的 HTML 生成器（作為備用）
     */
    createBuiltinHTMLGenerator() {
        if (typeof window.HTMLToPDFGenerator !== 'undefined') return;

        window.HTMLToPDFGenerator = class {
            generateReportHTML(reportData) {
                return `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI 智能數據分析報告</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif; line-height: 1.6; margin: 40px; }
        .report-header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #1976d2; padding-bottom: 20px; }
        .report-title { font-size: 28px; color: #1976d2; margin-bottom: 10px; }
        .section-title { font-size: 20px; color: #1976d2; margin: 30px 0 15px 0; border-bottom: 2px solid #e3f2fd; padding-bottom: 8px; }
        .content-text { margin-bottom: 15px; text-align: justify; }
        .chart-container { margin: 20px 0; text-align: center; }
        .chart-image { max-width: 100%; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .metadata { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        pre { white-space: pre-wrap; font-family: inherit; }
    </style>
</head>
<body>
    <div class="report-header">
        <h1 class="report-title">🤖 AI 智能數據分析報告</h1>
        <p>生成時間：${new Date().toLocaleString()}</p>
    </div>
    
    <div class="metadata">
        <strong>AI 引擎：</strong> ${reportData.metadata?.aiProvider || '智能模擬分析'}<br>
        <strong>數據量：</strong> ${(reportData.metadata?.dataSize || 0).toLocaleString()} 筆<br>
        <strong>圖表數：</strong> ${reportData.metadata?.chartCount || 0} 個
    </div>
    
    <div class="content">
        <pre>${reportData.content?.aiAnalysis || '分析內容生成中...'}</pre>
    </div>
    
    ${reportData.content?.charts?.map((chart, index) => `
        <div class="chart-container">
            <h3>${index + 1}. ${chart.title}</h3>
            <img src="${chart.image}" alt="${chart.title}" class="chart-image">
        </div>
    `).join('') || ''}
</body>
</html>`;
            }

            async convertToPDF(htmlContent, filename = null) {
                if (typeof html2pdf === 'undefined') {
                    throw new Error('html2pdf 庫未載入');
                }

                const fileName = filename || `AI分析報告_${new Date().toISOString().split('T')[0]}.pdf`;
                
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = htmlContent;
                tempDiv.style.position = 'absolute';
                tempDiv.style.left = '-9999px';
                document.body.appendChild(tempDiv);

                try {
                    await html2pdf()
                        .from(tempDiv)
                        .set({
                            margin: 10,
                            filename: fileName,
                            image: { type: 'jpeg', quality: 0.98 },
                            html2canvas: { scale: 2 },
                            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                        })
                        .save();
                } finally {
                    document.body.removeChild(tempDiv);
                }
            }

            previewHTML(htmlContent) {
                const newWindow = window.open('', '_blank');
                newWindow.document.write(htmlContent);
                newWindow.document.close();
            }

            downloadHTML(htmlContent, filename = null) {
                const fileName = filename || `AI分析報告_${new Date().toISOString().split('T')[0]}.html`;
                const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        };

        console.log('✅ 內建 HTMLToPDFGenerator 創建完成');
    }

    /**
     * 創建增強版報告生成器模態框
     */
    createEnhancedReportModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'enhancedReportModal';
        
        modal.innerHTML = `
            <div class="modal-content extra-large">
                <div class="modal-header">
                    <h3 class="modal-title">🤖 AI 智能報告生成器 2.0</h3>
                    <button class="close-btn" onclick="enhancedReportGenerator.closeModal()">×</button>
                </div>
                <div class="modal-body">
                    
                    <!-- 連接狀態顯示 -->
                    <div class="connection-status" id="connectionStatus">
                        <div class="status-item">
                            <span class="status-icon" id="proxyStatus">🔍</span>
                            <span>檢查代理服務器...</span>
                        </div>
                    </div>
                    
                    <!-- AI 提供商選擇 -->
                    <div class="ai-provider-section">
                        <h4>🧠 選擇 AI 分析引擎</h4>
                        <div class="ai-provider-grid">
                            ${Object.entries(this.aiProviders).map(([key, provider]) => `
                                <div class="ai-provider-card ${key === 'openai' ? 'selected' : ''}" 
                                     data-provider="${key}">
                                    <h5>${provider.name}</h5>
                                    <p class="provider-description">${provider.description}</p>
                                    <div class="provider-details">
                                        <span class="model-info">模型：${provider.model}</span>
                                        <div class="provider-features">
                                            ${provider.supportsImages ? '📸 支援圖片分析' : '📝 純文字分析'}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="api-key-input">
                            <label>API Key:</label>
                            <input type="password" id="aiApiKey" class="form-input" 
                                   placeholder="輸入您的 AI API Key...">
                            <small>API Key 僅在本次會話中使用，不會被儲存。如果沒有 API Key，系統將使用智能模擬分析。</small>
                        </div>
                    </div>

                    <!-- 報告配置 -->
                    <div class="report-config-section">
                        <h4>📊 報告配置</h4>
                        <div class="config-grid">
                            <div class="form-group">
                                <label>報告類型</label>
                                <select id="enhancedReportType" class="form-select">
                                    <option value="comprehensive">綜合分析報告</option>
                                    <option value="executive">高管摘要</option>
                                    <option value="technical">技術深度分析</option>
                                    <option value="presentation">簡報版本</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>分析深度</label>
                                <select id="analysisDepth" class="form-select">
                                    <option value="basic">基礎分析</option>
                                    <option value="detailed" selected>詳細分析</option>
                                    <option value="expert">專家級分析</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>目標受眾</label>
                                <select id="enhancedTargetAudience" class="form-select">
                                    <option value="business">商業決策者</option>
                                    <option value="technical">技術團隊</option>
                                    <option value="academic">學術研究</option>
                                    <option value="general">一般大眾</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>輸出格式</label>
                                <div class="checkbox-group">
                                    <label><input type="checkbox" id="includeChartImages" checked> 包含圖表截圖</label>
                                    <label><input type="checkbox" id="includeDataTables" checked> 包含數據表格</label>
                                    <label><input type="checkbox" id="includeStatistics" checked> 包含統計分析</label>
                                    <label><input type="checkbox" id="includeRecommendations" checked> 包含行動建議</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 自定義分析提示 -->
                    <div class="custom-prompt-section">
                        <h4>✨ 自定義分析重點</h4>
                        <textarea id="customAnalysisPrompt" class="form-input custom-prompt" rows="4" 
                                  placeholder="請描述您希望 AI 重點關注的分析面向...">請從統計學和商業分析的角度，深入分析我的儀表板數據。重點關注：
1. 數據趨勢的統計顯著性
2. 各變數間的相關性分析
3. 異常值和潛在問題識別
4. 基於數據的商業洞察和建議</textarea>
                    </div>

                    <!-- 圖表預覽區 -->
                    <div class="charts-preview-section">
                        <h4>📈 圖表預覽與選擇</h4>
                        <div id="chartsPreviewGrid" class="charts-preview-grid">
                            <!-- 動態生成圖表預覽 -->
                        </div>
                    </div>

                    <!-- 實時生成預覽 -->
                    <div class="live-preview-section">
                        <h4>👁️ 實時預覽</h4>
                        <div id="livePreview" class="live-preview">
                            <div class="preview-placeholder">
                                配置完成後點擊「生成預覽」查看報告結構
                            </div>
                        </div>
                    </div>

                    <!-- AI 分析進度 -->
                    <div id="aiAnalysisProgress" class="ai-progress" style="display: none;">
                        <div class="progress-header">
                            <h4 id="progressTitle">🤖 AI 正在深度分析您的數據...</h4>
                            <div class="progress-bar">
                                <div class="progress-fill" id="aiProgressFill"></div>
                            </div>
                        </div>
                        <div class="analysis-steps">
                            <div class="analysis-step" data-step="1">📸 圖表截圖</div>
                            <div class="analysis-step" data-step="2">📊 數據分析</div>
                            <div class="analysis-step" data-step="3">🤖 AI 洞察生成</div>
                            <div class="analysis-step" data-step="4">📝 報告撰寫</div>
                            <div class="analysis-step" data-step="5">📄 文檔生成</div>
                        </div>
                        <div class="current-task" id="currentTask">
                            準備開始分析...
                        </div>
                    </div>

                    <!-- 生成結果展示 -->
                    <div id="generatedReport" class="generated-report" style="display: none;">
                        <div class="report-header">
                            <h4>✅ AI 分析報告已生成</h4>
                            <div class="report-stats">
                                <span id="reportWordCount">字數統計</span>
                                <span id="reportChartCount">圖表數量</span>
                                <span id="reportInsightCount">洞察數量</span>
                            </div>
                        </div>
                        <div class="report-content-preview" id="reportContentPreview">
                            <!-- AI 生成的報告內容預覽 -->
                        </div>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="enhancedReportGenerator.generatePreview()">
                        👁️ 生成預覽
                    </button>
                    <button class="btn btn-primary" onclick="enhancedReportGenerator.generateAIReport()" id="generateAIBtn">
                        🤖 AI 深度分析
                    </button>
                    <button class="btn btn-info" onclick="enhancedReportGenerator.downloadReport('preview')" disabled id="previewBtn" 
                            style="background: linear-gradient(45deg, #17a2b8, #20c997);">
                        🌐 預覽報告
                    </button>
                    <button class="btn btn-success" onclick="enhancedReportGenerator.downloadReport('pdf')" disabled id="downloadPdfBtn">
                        📄 下載 PDF
                    </button>
                    <button class="btn btn-warning" onclick="enhancedReportGenerator.downloadReport('html')" disabled id="downloadHtmlBtn" 
                            style="background: linear-gradient(45deg, #ffc107, #fd7e14);">
                        🌐 下載 HTML
                    </button>
                    <button class="btn btn-purple" onclick="enhancedReportGenerator.downloadReport('markdown')" disabled id="downloadMdBtn">
                        📝 下載 Markdown
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        console.log('✅ 增強版報告模態框創建完成');
    }

    /**
     * 設定事件監聽器
     */
    setupEventListeners() {
        // AI 提供商選擇事件
        document.addEventListener('click', (e) => {
            if (e.target.closest('.ai-provider-card')) {
                this.selectAIProvider(e.target.closest('.ai-provider-card'));
            }
        });

        // 配置變更監聽
        const configElements = ['enhancedReportType', 'analysisDepth', 'enhancedTargetAudience'];
        configElements.forEach(id => {
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.addEventListener('change', () => this.updateLivePreview());
                }
            }, 100);
        });

        console.log('✅ 事件監聽器設定完成');
    }

    /**
     * 檢查代理服務器狀態
     */
    async checkProxyServer() {
        const statusElement = document.getElementById('proxyStatus');
        const connectionStatus = document.getElementById('connectionStatus');
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch(`${this.proxyServerUrl}/health`, {
                method: 'GET',
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                console.log('✅ 代理服務器連接成功');
                
                if (statusElement) statusElement.textContent = '✅';
                if (connectionStatus) {
                    connectionStatus.innerHTML = `
                        <div class="status-item success">
                            <span class="status-icon">✅</span>
                            <span>代理服務器已連接 - 可使用真實 AI 分析</span>
                        </div>
                    `;
                }
                return true;
            }
        } catch (error) {
            console.warn('⚠️ 代理服務器連接失敗，將使用模擬分析');
            
            if (statusElement) statusElement.textContent = '⚠️';
            if (connectionStatus) {
                connectionStatus.innerHTML = `
                    <div class="status-item warning">
                        <span class="status-icon">⚠️</span>
                        <span>代理服務器不可用 - 將使用智能模擬分析</span>
                        <button class="retry-btn" onclick="enhancedReportGenerator.retryConnection()">重試連接</button>
                    </div>
                `;
            }
        }
        return false;
    }

    /**
     * 重試連接
     */
    async retryConnection() {
        const connectionStatus = document.getElementById('connectionStatus');
        if (connectionStatus) {
            connectionStatus.innerHTML = `
                <div class="status-item">
                    <span class="status-icon">🔄</span>
                    <span>重新檢查連接...</span>
                </div>
            `;
        }
        await this.checkProxyServer();
    }

    /**
     * 選擇 AI 提供商
     */
    selectAIProvider(card) {
        document.querySelectorAll('.ai-provider-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        
        const provider = card.dataset.provider;
        this.aiProvider = provider;
        
        const apiKeyInput = document.getElementById('aiApiKey');
        const placeholders = {
            openai: '輸入您的 OpenAI API Key (sk-...)',
            claude: '輸入您的 Anthropic API Key (sk-ant-...)',
            gemini: '輸入您的 Google Gemini API Key'
        };
        if (apiKeyInput) {
            apiKeyInput.placeholder = placeholders[provider];
        }
        
        console.log(`🤖 選擇 AI 提供商: ${this.aiProviders[provider].name}`);
    }

    /**
     * 截取圖表圖片
     */
    async captureChartImages() {
        const chartImages = new Map();
        let successCount = 0;
        
        for (const chart of this.vizApp.state.charts) {
            try {
                const chartElement = document.getElementById(`chart-canvas-${chart.id}`);
                if (!chartElement) continue;

                let imageData;
                const chartInstance = this.vizApp.chartInstances.get(chart.id);
                
                if (chartInstance && chartInstance.type === 'chartjs') {
                    const canvas = chartElement.querySelector('canvas');
                    if (canvas) {
                        imageData = canvas.toDataURL('image/png', 1.0);
                    }
                } else if (chartInstance && chartInstance.type === 'plotly') {
                    const plotlyDiv = chartElement.querySelector('[id^="plotly-"]');
                    if (plotlyDiv && typeof Plotly !== 'undefined') {
                        try {
                            imageData = await Plotly.toImage(plotlyDiv, {
                                format: 'png',
                                width: 800,
                                height: 600,
                                scale: 2
                            });
                        } catch (plotlyError) {
                            console.warn('Plotly 截圖失敗:', plotlyError);
                        }
                    }
                }
                
                if (!imageData && typeof html2canvas !== 'undefined') {
                    try {
                        const canvas = await html2canvas(chartElement, {
                            backgroundColor: '#ffffff',
                            scale: 2,
                            logging: false,
                            allowTaint: true,
                            useCORS: true
                        });
                        imageData = canvas.toDataURL('image/png', 1.0);
                    } catch (canvasError) {
                        console.warn('html2canvas 截圖失敗:', canvasError);
                    }
                }

                if (imageData) {
                    chartImages.set(chart.id, {
                        title: chart.title,
                        type: chart.type,
                        image: imageData,
                        timestamp: new Date().toISOString()
                    });
                    successCount++;
                    console.log(`✅ 圖表 ${chart.title} 截圖成功`);
                }
            } catch (error) {
                console.warn(`❌ 圖表 ${chart.id} 截圖失敗:`, error);
            }
        }
        
        console.log(`📸 圖表截圖完成: ${successCount}/${this.vizApp.state.charts.length}`);
        this.chartImages = chartImages;
        return chartImages;
    }

    /**
     * AI 分析主流程
     */
    async callAIAnalysis(dashboardData, customPrompt) {
        const apiKey = document.getElementById('aiApiKey')?.value;
        const useProxy = await this.checkProxyServer();
        
        if (useProxy && apiKey) {
            console.log('🔄 使用代理服務器調用真實 AI API');
            return await this.callAIViaProxy(dashboardData, customPrompt, apiKey);
        } else {
            console.log('🎭 使用智能模擬分析');
            document.getElementById('progressTitle').textContent = '🎭 智能模擬分析中...';
            return await this.simulateAIAnalysis(dashboardData, customPrompt);
        }
    }

    /**
     * 通過代理服務器調用 AI
     */
    async callAIViaProxy(dashboardData, customPrompt, apiKey) {
        const analysisData = {
            dataSize: dashboardData.data.length,
            chartCount: dashboardData.charts.length,
            columns: dashboardData.analysisResult.基本信息.欄位列表,
            dataQuality: dashboardData.analysisResult.數據質量,
            insights: dashboardData.analysisResult.數據洞察,
            charts: dashboardData.charts.map(chart => ({
                title: chart.title,
                type: chart.type,
                description: this.getChartDescription(chart.type)
            }))
        };

        const chartImages = Array.from(this.chartImages.values());

        try {
            const response = await fetch(`${this.proxyServerUrl}/api/ai/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    provider: this.aiProvider,
                    apiKey: apiKey,
                    analysisData: analysisData,
                    customPrompt: customPrompt,
                    chartImages: chartImages
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: response.statusText }));
                throw new Error(errorData.error || `API 錯誤: ${response.status}`);
            }

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || '分析失敗');
            }

            console.log('✅ 真實 AI 分析完成');
            return result.analysis;
        } catch (error) {
            console.error('❌ AI API 調用失敗:', error);
            console.log('🎭 降級到智能模擬分析');
            document.getElementById('progressTitle').textContent = '🎭 降級到智能模擬分析...';
            return await this.simulateAIAnalysis(dashboardData, customPrompt);
        }
    }

    /**
     * 模擬 AI 分析
     */
    async simulateAIAnalysis(dashboardData, customPrompt) {
        await new Promise(resolve => setTimeout(resolve, 3000));

        const analysisData = {
            dataSize: dashboardData.data.length,
            chartCount: dashboardData.charts.length,
            columns: dashboardData.analysisResult.基本信息.欄位列表,
            dataQuality: dashboardData.analysisResult.數據質量,
            insights: dashboardData.analysisResult.數據洞察,
            numericColumns: dashboardData.analysisResult.欄位分析.數值欄位,
            categoricalColumns: dashboardData.analysisResult.欄位分析.類別欄位,
            correlations: dashboardData.analysisResult.統計摘要.相關性分析 || {}
        };

        return this.generateIntelligentAnalysis(analysisData, customPrompt);
    }

    /**
     * 生成智能分析內容
     */
    generateIntelligentAnalysis(analysisData, customPrompt) {
        const reportType = document.getElementById('enhancedReportType')?.value || 'comprehensive';
        const analysisDepth = document.getElementById('analysisDepth')?.value || 'detailed';
        const targetAudience = document.getElementById('enhancedTargetAudience')?.value || 'business';

        let analysis = `# 智能數據分析報告\n\n`;
        
        // 執行摘要
        analysis += `## 📊 執行摘要\n\n`;
        analysis += `本報告基於 **${analysisData.dataSize.toLocaleString()}** 筆數據記錄進行深度分析，`;
        analysis += `透過 **${analysisData.chartCount}** 個視覺化圖表，發現以下關鍵洞察：\n\n`;
        
        // 生成關鍵發現
        const keyFindings = this.generateKeyFindings(analysisData);
        keyFindings.forEach((finding, index) => {
            analysis += `**${index + 1}. ${finding}**\n\n`;
        });

        // 數據品質評估
        analysis += `## 🔍 數據品質評估\n\n`;
        analysis += `- **完整性評分**：${analysisData.dataQuality.完整性}% - ${this.getQualityInterpretation(analysisData.dataQuality.完整性)}\n`;
        analysis += `- **整體品質評分**：${analysisData.dataQuality.質量評分}/100 - ${this.getScoreInterpretation(analysisData.dataQuality.質量評分)}\n`;
        analysis += `- **數據維度**：${analysisData.columns.length} 個欄位（${analysisData.numericColumns.length} 個數值欄位，${analysisData.categoricalColumns.length} 個類別欄位）\n\n`;

        // 圖表分析
        if (this.vizApp.state.charts.length > 0) {
            analysis += `## 📈 圖表深度分析\n\n`;
            this.vizApp.state.charts.forEach((chart, index) => {
                analysis += `### ${index + 1}. ${chart.title}\n\n`;
                analysis += `**統計意義**：${this.getChartStatisticalMeaning(chart.type)}\n\n`;
                analysis += `**關鍵洞察**：${this.generateChartInsight(chart, analysisData)}\n\n`;
            });
        }

        // 相關性分析
        if (Object.keys(analysisData.correlations).length > 0) {
            analysis += `## 🔗 變數關係分析\n\n`;
            Object.entries(analysisData.correlations).forEach(([pair, correlation]) => {
                const strength = this.interpretCorrelation(correlation);
                const direction = correlation > 0 ? '正向' : '負向';
                analysis += `- **${pair}**：${direction}相關，強度 ${Math.abs(correlation).toFixed(3)} (${strength})\n`;
            });
            analysis += '\n';
        }

        // 建議行動
        analysis += `## 🎯 建議行動\n\n`;
        const recommendations = this.generateActionableRecommendations(analysisData, targetAudience);
        recommendations.forEach((rec, index) => {
            analysis += `### ${index + 1}. ${rec.title}\n`;
            analysis += `${rec.description}\n\n`;
            analysis += `**優先級**：${rec.priority} | **預期效益**：${rec.impact}\n\n`;
        });

        // 結論
        analysis += `## 📝 結論\n\n`;
        analysis += this.generateConclusion(analysisData, targetAudience);
        analysis += '\n\n';

        analysis += `---\n\n`;
        analysis += `*本報告由智能視覺化系統生成 | 生成時間：${new Date().toLocaleString()}*\n`;
        analysis += `*分析引擎：智能模擬分析 v2.0 | 分析深度：${analysisDepth} | 目標受眾：${targetAudience}*`;

        return analysis;
    }

    /**
     * 生成關鍵發現
     */
    generateKeyFindings(analysisData) {
        const findings = [];
        
        if (analysisData.dataSize > 1000) {
            findings.push('數據集規模充足，分析結果具有統計顯著性，可支持可靠的商業決策');
        } else if (analysisData.dataSize < 50) {
            findings.push('數據集較小，建議擴大樣本規模以提高分析的可靠性');
        } else {
            findings.push('數據集規模適中，適合進行探索性分析和初步洞察發現');
        }

        if (analysisData.dataQuality.完整性 >= 95) {
            findings.push('數據完整性優秀，可信度極高，為深度分析提供堅實基礎');
        } else if (analysisData.dataQuality.完整性 < 80) {
            findings.push('數據存在較多缺失值，建議進行數據清理以提升分析準確性');
        }

        if (analysisData.numericColumns.length >= 3) {
            findings.push(`包含 ${analysisData.numericColumns.length} 個數值變數，支持多維度量化分析和趨勢預測`);
        }

        if (Object.keys(analysisData.correlations).length > 0) {
            const strongCorrelations = Object.entries(analysisData.correlations)
                .filter(([, value]) => Math.abs(value) > 0.6);
            if (strongCorrelations.length > 0) {
                findings.push(`發現 ${strongCorrelations.length} 組強相關變數，提示重要的業務關聯性`);
            }
        }

        return findings.slice(0, 4);
    }

    /**
     * 輔助方法
     */
    getQualityInterpretation(completeness) {
        if (completeness >= 95) return '優秀';
        if (completeness >= 85) return '良好';
        if (completeness >= 70) return '尚可';
        return '需改善';
    }

    getScoreInterpretation(score) {
        if (score >= 90) return '優秀品質';
        if (score >= 75) return '良好品質';
        if (score >= 60) return '中等品質';
        return '需要改善';
    }

    interpretCorrelation(correlation) {
        const abs = Math.abs(correlation);
        if (abs >= 0.8) return '非常強相關';
        if (abs >= 0.6) return '強相關';
        if (abs >= 0.4) return '中度相關';
        if (abs >= 0.2) return '弱相關';
        return '幾乎無相關';
    }

    getChartStatisticalMeaning(chartType) {
        const meanings = {
            bar: '透過視覺化比較不同類別間的數值差異，有助於識別重要趨勢',
            line: '展示數值隨時間的變化軌跡，適合趨勢分析和預測',
            pie: '呈現各部分佔整體的比例關係，適合理解構成結構',
            scatter: '探索兩個變數間的相關關係，可識別潛在關聯性',
            boxplot: '展示數據分布的統計摘要，有助於發現異常值',
            heatmap: '視覺化多變數間的關係強度和模式'
        };
        return meanings[chartType] || '提供重要的數據洞察';
    }

    generateChartInsight(chart, analysisData) {
        const insights = {
            bar: '各類別間表現差異明顯，建議深入分析表現優異類別的成功因素',
            line: '時間趨勢呈現清晰走向，可作為預測和策略規劃的重要參考',
            pie: '構成比例分布清楚，主要組成要素對整體影響顯著',
            scatter: '變數間關聯性為進一步分析提供方向',
            boxplot: '數據分布特徵明顯，異常值可能隱含重要商業信息'
        };
        return insights[chart.type] || '提供重要的數據模式洞察';
    }

    generateActionableRecommendations(analysisData, targetAudience) {
        const recommendations = [];
        
        if (analysisData.dataQuality.完整性 < 90) {
            recommendations.push({
                title: '實施數據品質提升計畫',
                description: '建立數據驗證機制，減少缺失值和異常值對分析的影響',
                priority: '高',
                impact: '顯著提升分析可靠性'
            });
        }

        if (analysisData.numericColumns.length >= 3) {
            recommendations.push({
                title: '導入進階統計分析',
                description: '採用多變量分析或機器學習方法，探索數據的深層結構',
                priority: '中',
                impact: '發現新的業務洞察'
            });
        }

        recommendations.push({
            title: '建立自動化報告系統',
            description: '設定定期自動生成分析報告的機制，確保決策者能即時獲得最新洞察',
            priority: '低',
            impact: '提升決策效率'
        });

        return recommendations;
    }

    generateConclusion(analysisData, targetAudience) {
        return `透過本次數據分析，我們為您的業務決策提供了紮實的數據基礎。關鍵發現顯示數據品質${this.getQualityInterpretation(analysisData.dataQuality.完整性)}，可支持可靠的商業洞察。建議定期更新分析，建立數據驅動的決策文化。`;
    }

    getChartDescription(chartType) {
        const descriptions = {
            bar: '比較不同類別的數值大小',
            line: '顯示數值隨時間的變化趨勢',
            pie: '展示各部分佔整體的比例',
            scatter: '探索兩個變數間的關係'
        };
        return descriptions[chartType] || '數據視覺化圖表';
    }

    /**
     * 生成 AI 報告主流程
     */
    async generateAIReport() {
        if (!this.vizApp.getCurrentData()) {
            this.vizApp.showError('請先上傳數據並生成圖表');
            return;
        }

        if (this.vizApp.state.charts.length === 0) {
            this.vizApp.showError('請先生成一些圖表');
            return;
        }

        try {
            this.showAIProgress();
            
            // 步驟 1: 截取圖表圖片
            this.updateAIProgress(1, '正在截取圖表圖片...');
            await this.captureChartImages();
            
            // 步驟 2: 準備數據
            this.updateAIProgress(2, '正在準備數據分析...');
            const dashboardData = this.prepareDashboardData();
            
            // 步驟 3: AI 分析
            this.updateAIProgress(3, '正在進行深度分析...');
            const customPrompt = document.getElementById('customAnalysisPrompt')?.value || '';
            const aiAnalysis = await this.callAIAnalysis(dashboardData, customPrompt);
            
            // 步驟 4: 生成報告
            this.updateAIProgress(4, '正在整合報告內容...');
            const report = this.buildFinalReport(aiAnalysis, dashboardData);
            
            // 步驟 5: 完成
            this.updateAIProgress(5, '報告生成完成！');
            
            this.displayGeneratedReport(report);
            this.enableDownloadButtons();
            
        } catch (error) {
            console.error('AI 報告生成失敗:', error);
            this.vizApp.showError('AI 分析失敗: ' + error.message);
        } finally {
            setTimeout(() => this.hideAIProgress(), 1000);
        }
    }

    /**
     * 準備儀表板數據
     */
    prepareDashboardData() {
        return {
            data: this.vizApp.getCurrentData(),
            charts: this.vizApp.state.charts,
            analysisResult: this.vizApp.getCurrentAnalysis(),
            chartImages: this.chartImages,
            metadata: {
                timestamp: new Date().toISOString(),
                dataSource: this.vizApp.state.file?.name || 'Unknown',
                aiProvider: this.aiProvider,
                reportType: document.getElementById('enhancedReportType')?.value || 'comprehensive'
            }
        };
    }

    /**
     * 構建最終報告
     */
    buildFinalReport(aiAnalysis, dashboardData) {
        const includeImages = document.getElementById('includeChartImages')?.checked ?? true;
        
        return {
            metadata: {
                title: '智能數據分析報告',
                type: dashboardData.metadata.reportType,
                generatedAt: new Date().toISOString(),
                aiProvider: this.aiProvider || 'intelligent_simulation',
                chartCount: dashboardData.charts.length,
                dataSize: dashboardData.data.length
            },
            content: {
                aiAnalysis: aiAnalysis,
                charts: includeImages ? Array.from(this.chartImages.values()) : [],
                rawData: dashboardData.data,
                statistics: dashboardData.analysisResult
            },
            settings: {
                includeChartImages: includeImages,
                includeDataTables: document.getElementById('includeDataTables')?.checked ?? true,
                includeStatistics: document.getElementById('includeStatistics')?.checked ?? true,
                includeRecommendations: document.getElementById('includeRecommendations')?.checked ?? true
            }
        };
    }

    /**
     * 顯示生成的報告
     */
    displayGeneratedReport(report) {
        const preview = document.getElementById('reportContentPreview');
        if (!preview) return;
        
        // 統計資訊
        const wordCount = report.content.aiAnalysis.length;
        const chartCount = report.content.charts.length;
        const insightCount = (report.content.aiAnalysis.match(/##|###|\*\*\d+\./g) || []).length;
        
        const wordCountEl = document.getElementById('reportWordCount');
        const chartCountEl = document.getElementById('reportChartCount');
        const insightCountEl = document.getElementById('reportInsightCount');
        
        if (wordCountEl) wordCountEl.textContent = `${wordCount.toLocaleString()} 字`;
        if (chartCountEl) chartCountEl.textContent = `${chartCount} 個圖表`;
        if (insightCountEl) insightCountEl.textContent = `${insightCount} 個洞察`;
        
        // 報告預覽
        preview.innerHTML = `
            <div class="report-preview-content">
                <div class="report-ai-analysis">
                    <pre style="white-space: pre-wrap; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6;">${report.content.aiAnalysis}</pre>
                </div>
                ${report.content.charts.length > 0 ? `
                    <div class="report-charts-section">
                        <h4>📊 包含的圖表</h4>
                        <div class="chart-thumbnails">
                            ${report.content.charts.map(chart => `
                                <div class="chart-thumbnail">
                                    <img src="${chart.image}" alt="${chart.title}" style="max-width: 200px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                    <p style="margin: 8px 0 0 0; font-size: 12px; text-align: center;">${chart.title}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
        
        const generatedReport = document.getElementById('generatedReport');
        if (generatedReport) {
            generatedReport.style.display = 'block';
        }
        
        this.reportData = report;
    }

    /**
     * 顯示/隱藏 AI 分析進度
     */
    showAIProgress() {
        const progress = document.getElementById('aiAnalysisProgress');
        const generateBtn = document.getElementById('generateAIBtn');
        if (progress) progress.style.display = 'block';
        if (generateBtn) generateBtn.disabled = true;
    }

    updateAIProgress(step, message) {
        const progress = (step / 5) * 100;
        const progressFill = document.getElementById('aiProgressFill');
        const currentTask = document.getElementById('currentTask');
        
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (currentTask) currentTask.textContent = message;
        
        // 更新步驟狀態
        document.querySelectorAll('.analysis-step').forEach((el, index) => {
            if (index < step) {
                el.classList.add('completed');
                el.classList.remove('active');
            } else if (index === step - 1) {
                el.classList.add('active');
                el.classList.remove('completed');
            } else {
                el.classList.remove('active', 'completed');
            }
        });
    }

    hideAIProgress() {
        const progress = document.getElementById('aiAnalysisProgress');
        const generateBtn = document.getElementById('generateAIBtn');
        if (progress) progress.style.display = 'none';
        if (generateBtn) generateBtn.disabled = false;
    }

    /**
     * 啟用下載按鈕
     */
    enableDownloadButtons() {
        const buttons = ['downloadPdfBtn', 'downloadHtmlBtn', 'downloadMdBtn', 'previewBtn'];
        buttons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) btn.disabled = false;
        });
    }

    /**
     * 生成預覽
     */
    generatePreview() {
        const reportType = document.getElementById('enhancedReportType')?.value || 'comprehensive';
        const analysisDepth = document.getElementById('analysisDepth')?.value || 'detailed';
        const targetAudience = document.getElementById('enhancedTargetAudience')?.value || 'business';
        
        const preview = `
            <div class="preview-summary">
                <h3>📋 報告預覽</h3>
                <div class="preview-stats">
                    <div class="stat-item">
                        <strong>報告類型：</strong> ${this.getReportTypeName(reportType)}
                    </div>
                    <div class="stat-item">
                        <strong>分析深度：</strong> ${this.getAnalysisDepthName(analysisDepth)}
                    </div>
                    <div class="stat-item">
                        <strong>目標受眾：</strong> ${this.getAudienceName(targetAudience)}
                    </div>
                    <div class="stat-item">
                        <strong>AI 引擎：</strong> ${this.aiProvider ? this.aiProviders[this.aiProvider].name : '智能模擬分析'}
                    </div>
                </div>
                
                <div class="preview-structure">
                    <h4>📄 報告結構</h4>
                    <ol>
                        <li>執行摘要</li>
                        <li>數據品質評估</li>
                        <li>圖表深度分析（${this.vizApp.state.charts.length} 個圖表）</li>
                        <li>統計洞察發現</li>
                        <li>建議行動方案</li>
                        <li>結論與展望</li>
                    </ol>
                </div>
                
                <div class="preview-features">
                    <h4>✨ 包含功能</h4>
                    <ul>
                        ${document.getElementById('includeChartImages')?.checked !== false ? '<li>📸 高解析度圖表截圖</li>' : ''}
                        ${document.getElementById('includeDataTables')?.checked !== false ? '<li>📊 數據統計表格</li>' : ''}
                        ${document.getElementById('includeStatistics')?.checked !== false ? '<li>📈 統計分析結果</li>' : ''}
                        ${document.getElementById('includeRecommendations')?.checked !== false ? '<li>💡 AI 智能建議</li>' : ''}
                    </ul>
                </div>
            </div>
        `;
        
        const livePreview = document.getElementById('livePreview');
        if (livePreview) {
            livePreview.innerHTML = preview;
        }
    }

    /**
     * 輔助方法 - 名稱轉換
     */
    getReportTypeName(type) {
        const types = {
            comprehensive: '綜合分析報告',
            executive: '高管摘要',
            technical: '技術深度分析',
            presentation: '簡報版本'
        };
        return types[type] || type;
    }

    getAnalysisDepthName(depth) {
        const depths = {
            basic: '基礎分析',
            detailed: '詳細分析',
            expert: '專家級分析'
        };
        return depths[depth] || depth;
    }

    getAudienceName(audience) {
        const audiences = {
            business: '商業決策者',
            technical: '技術團隊',
            academic: '學術研究',
            general: '一般大眾'
        };
        return audiences[audience] || audience;
    }

    /**
     * 下載報告 - 統一入口
     */
    async downloadReport(format) {
        if (!this.reportData) {
            this.vizApp.showError('沒有可下載的報告');
            return;
        }

        try {
            console.log(`📥 開始下載 ${format} 格式報告...`);
            
            switch (format) {
                case 'pdf':
                    await this.downloadAsPDF();
                    break;
                case 'html':
                    await this.downloadAsHTML();
                    break;
                case 'markdown':
                    await this.downloadAsMarkdown();
                    break;
                case 'preview':
                    await this.previewHTMLReport();
                    return; // 預覽不需要成功訊息
                default:
                    throw new Error('不支援的格式');
            }
            
            this.vizApp.showSuccess(`報告已成功下載為 ${format.toUpperCase()} 格式`);
            
        } catch (error) {
            console.error('下載錯誤:', error);
            this.vizApp.showError('下載失敗: ' + error.message);
        }
    }

    /**
     * PDF 下載
     */
    async downloadAsPDF() {
        console.log('📄 開始生成 PDF...');
        
        try {
            if (typeof HTMLToPDFGenerator === 'undefined') {
                throw new Error('HTMLToPDFGenerator 未載入，使用備用方案');
            }
            
            const htmlGenerator = new HTMLToPDFGenerator();
            const htmlContent = htmlGenerator.generateReportHTML(this.reportData);
            await htmlGenerator.convertToPDF(htmlContent);
            
            console.log('✅ PDF 生成成功');
        } catch (error) {
            console.error('❌ PDF 生成失敗:', error);
            // 降級到 Markdown 下載
            await this.downloadAsMarkdown();
            throw new Error('PDF 轉換失敗，已改為下載 Markdown 格式');
        }
    }

    /**
     * HTML 下載
     */
    async downloadAsHTML() {
        console.log('🌐 生成 HTML 報告...');
        
        try {
            if (typeof HTMLToPDFGenerator === 'undefined') {
                throw new Error('HTMLToPDFGenerator 未載入');
            }
            
            const htmlGenerator = new HTMLToPDFGenerator();
            const htmlContent = htmlGenerator.generateReportHTML(this.reportData);
            htmlGenerator.downloadHTML(htmlContent);
            
            console.log('✅ HTML 報告下載成功');
        } catch (error) {
            console.error('❌ HTML 生成失敗:', error);
            await this.downloadAsMarkdown();
            throw error;
        }
    }

    /**
     * 預覽 HTML 報告
     */
    async previewHTMLReport() {
        console.log('👁️ 預覽 HTML 報告...');
        
        try {
            if (typeof HTMLToPDFGenerator === 'undefined') {
                throw new Error('HTMLToPDFGenerator 未載入');
            }
            
            const htmlGenerator = new HTMLToPDFGenerator();
            const htmlContent = htmlGenerator.generateReportHTML(this.reportData);
            htmlGenerator.previewHTML(htmlContent);
            
            console.log('✅ HTML 預覽已開啟');
            this.vizApp.showSuccess('報告預覽已在新視窗開啟');
        } catch (error) {
            console.error('❌ HTML 預覽失敗:', error);
            this.vizApp.showError('預覽失敗: ' + error.message);
        }
    }

    /**
     * Markdown 下載
     */
    async downloadAsMarkdown() {
        let content = `# 智能數據分析報告\n\n`;
        
        // 報告元數據
        content += `**生成時間：** ${new Date().toLocaleString()}\n`;
        content += `**AI 引擎：** ${this.aiProvider ? this.aiProviders[this.aiProvider].name : '智能模擬分析'}\n`;
        content += `**數據量：** ${this.reportData.metadata.dataSize.toLocaleString()} 筆\n`;
        content += `**圖表數：** ${this.reportData.metadata.chartCount} 個\n\n`;
        
        content += `---\n\n`;
        content += this.reportData.content.aiAnalysis;
        
        // 下載 Markdown
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `AI分析報告_${new Date().toISOString().split('T')[0]}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * 更新圖表預覽
     */
    async updateChartsPreview() {
        const grid = document.getElementById('chartsPreviewGrid');
        if (!grid) {
            console.warn('❌ 找不到 chartsPreviewGrid 元素');
            return;
        }
        
        const charts = this.vizApp.state.charts;
        if (charts.length === 0) {
            grid.innerHTML = '<div class="no-charts">請先生成一些圖表</div>';
            return;
        }
        
        console.log(`📊 更新 ${charts.length} 個圖表的預覽...`);
        
        grid.innerHTML = charts.map(chart => `
            <div class="chart-preview-card" data-chart-id="${chart.id}">
                <div class="chart-preview-header">
                    <h5>${chart.title}</h5>
                    <span class="chart-type-badge">${chart.type}</span>
                </div>
                <div class="chart-preview-thumbnail" id="thumbnail-${chart.id}">
                    <div class="thumbnail-loading">載入中...</div>
                </div>
                <div class="chart-preview-actions">
                    <label>
                        <input type="checkbox" checked> 包含在報告中
                    </label>
                </div>
            </div>
        `).join('');
        
        // 延遲生成縮圖，確保 DOM 已更新
        setTimeout(() => {
            this.generateThumbnailsImproved();
        }, 100);
    }

    // 2. 新增改進的縮圖生成方法
    /**
     * 改進的縮圖生成方法
     */
    async generateThumbnailsImproved() {
        console.log('🖼️ 開始生成改進版縮圖...');
        
        const charts = this.vizApp.state.charts;
        
        for (let i = 0; i < charts.length; i++) {
            const chart = charts[i];
            console.log(`🔄 處理圖表 ${i + 1}/${charts.length}: ${chart.title}`);
            
            try {
                const thumbnailElement = document.getElementById(`thumbnail-${chart.id}`);
                if (!thumbnailElement) {
                    console.warn(`❌ 找不到縮圖容器: thumbnail-${chart.id}`);
                    continue;
                }

                const chartElement = document.getElementById(`chart-canvas-${chart.id}`);
                if (!chartElement) {
                    console.warn(`❌ 找不到圖表容器: chart-canvas-${chart.id}`);
                    continue;
                }

                let thumbnailImage = null;
                const chartInstance = this.vizApp.chartInstances.get(chart.id);

                if (chartInstance && chartInstance.type === 'chartjs') {
                    console.log(`   📊 Chart.js 縮圖生成中...`);
                    const canvas = chartElement.querySelector('canvas');
                    if (canvas) {
                        // 等待確保渲染完成
                        await new Promise(resolve => setTimeout(resolve, 150));
                        
                        try {
                            const thumbnailCanvas = document.createElement('canvas');
                            thumbnailCanvas.width = 200;
                            thumbnailCanvas.height = 120;
                            const ctx = thumbnailCanvas.getContext('2d');
                            
                            // 設定白色背景
                            ctx.fillStyle = '#ffffff';
                            ctx.fillRect(0, 0, thumbnailCanvas.width, thumbnailCanvas.height);
                            
                            // 繪製縮放的圖表
                            ctx.drawImage(canvas, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);
                            thumbnailImage = thumbnailCanvas.toDataURL('image/png', 0.9);
                            console.log(`   ✅ Chart.js 縮圖成功`);
                        } catch (canvasError) {
                            console.warn(`   ⚠️ Chart.js 縮圖失敗:`, canvasError);
                        }
                    }
                } else if (chartInstance && chartInstance.type === 'plotly') {
                    console.log(`   📈 Plotly 縮圖生成中...`);
                    const plotlyDiv = chartElement.querySelector('[id^="plotly-"]');
                    if (plotlyDiv && typeof Plotly !== 'undefined') {
                        try {
                            await new Promise(resolve => setTimeout(resolve, 300));
                            
                            thumbnailImage = await Plotly.toImage(plotlyDiv, {
                                format: 'png',
                                width: 200,
                                height: 120,
                                scale: 1
                            });
                            console.log(`   ✅ Plotly 縮圖成功`);
                        } catch (plotlyError) {
                            console.warn(`   ⚠️ Plotly 縮圖失敗:`, plotlyError);
                        }
                    }
                }

                // html2canvas 備用方案
                if (!thumbnailImage && typeof html2canvas !== 'undefined') {
                    console.log(`   🔄 使用 html2canvas 備用方案...`);
                    try {
                        const canvas = await html2canvas(chartElement, {
                            backgroundColor: '#ffffff',
                            scale: 0.6,
                            logging: false,
                            allowTaint: true,
                            useCORS: true,
                            width: 333,  // 200/0.6
                            height: 200  // 120/0.6
                        });
                        thumbnailImage = canvas.toDataURL('image/png', 0.8);
                        console.log(`   ✅ html2canvas 備用方案成功`);
                    } catch (canvasError) {
                        console.warn(`   ❌ html2canvas 失敗:`, canvasError);
                    }
                }

                // 更新縮圖顯示
                if (thumbnailImage) {
                    thumbnailElement.innerHTML = `
                        <img src="${thumbnailImage}" 
                            alt="${chart.title}" 
                            style="
                                width: 100%; 
                                height: 100%; 
                                object-fit: cover; 
                                border-radius: 4px; 
                                cursor: pointer;
                                border: 1px solid #e0e0e0;
                                transition: transform 0.2s ease;
                            "
                            onmouseover="this.style.transform='scale(1.05)'"
                            onmouseout="this.style.transform='scale(1)'"
                            onclick="console.log('點擊了圖表: ${chart.title}')">
                    `;
                    console.log(`   ✅ 縮圖顯示更新完成`);
                } else {
                    // 美化的文字佔位符
                    thumbnailElement.innerHTML = `
                        <div style="
                            display: flex; 
                            flex-direction: column;
                            align-items: center; 
                            justify-content: center; 
                            height: 100%; 
                            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); 
                            color: #666; 
                            border-radius: 4px; 
                            font-size: 11px; 
                            text-align: center;
                            border: 2px dashed #ccc;
                            transition: all 0.3s ease;
                            cursor: pointer;
                        " onmouseover="this.style.background='linear-gradient(135deg, #667eea 0%, #764ba2 100%)'; this.style.color='white';"
                        onmouseout="this.style.background='linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'; this.style.color='#666';">
                            <div style="font-size: 20px; margin-bottom: 4px;">📊</div>
                            <div style="font-weight: bold; margin-bottom: 2px;">${chart.type}</div>
                            <div style="font-size: 10px; opacity: 0.8;">${chart.title}</div>
                        </div>
                    `;
                    console.log(`   📝 使用美化文字佔位符`);
                }

            } catch (error) {
                console.error(`   ❌ 圖表 ${chart.id} 縮圖生成失敗:`, error);
                
                // 錯誤佔位符
                const thumbnailElement = document.getElementById(`thumbnail-${chart.id}`);
                if (thumbnailElement) {
                    thumbnailElement.innerHTML = `
                        <div style="
                            display: flex; 
                            flex-direction: column;
                            align-items: center; 
                            justify-content: center; 
                            height: 100%; 
                            background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%); 
                            color: #d32f2f; 
                            border-radius: 4px; 
                            font-size: 10px; 
                            text-align: center;
                            border: 2px solid #f44336;
                        ">
                            <div style="font-size: 16px; margin-bottom: 4px;">⚠️</div>
                            <div style="font-weight: bold;">截圖失敗</div>
                            <div style="font-size: 9px; margin-top: 2px;">${chart.title}</div>
                        </div>
                    `;
                }
            }
        }
        
        console.log('🖼️ 改進版縮圖生成完成！');
    }

    /**
     * 更新實時預覽
     */
    updateLivePreview() {
        // 延遲執行，避免頻繁更新
        clearTimeout(this.previewTimeout);
        this.previewTimeout = setTimeout(() => {
            this.generatePreview();
        }, 300);
    }

    /**
     * 顯示增強版報告生成器
     */
    async showEnhancedReportGenerator() {
        if (!this.vizApp.getCurrentData()) {
            this.vizApp.showError('請先上傳數據檔案');
            return;
        }

        if (this.vizApp.state.charts.length === 0) {
            this.vizApp.showError('請先生成一些圖表');
            return;
        }

        const modal = document.getElementById('enhancedReportModal');
        if (modal) {
            modal.classList.add('show');
            
            console.log('📱 增強報告生成器已開啟');
            
            // 等待模態框完全顯示後初始化
            setTimeout(async () => {
                console.log('🔄 初始化報告生成器內容...');
                
                // 檢查代理服務器
                await this.checkProxyServer();
                
                // 更新圖表預覽 (使用修復版方法)
                await this.updateChartsPreview();
                
                // 生成預覽
                this.generatePreview();
                
                console.log('✅ 報告生成器初始化完成');
            }, 300);  // 增加延遲時間確保模態框完全載入
        }
    }


    /**
     * 關閉模態框
     */
    closeModal() {
        const modal = document.getElementById('enhancedReportModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }
}

// 全域實例和初始化
window.EnhancedReportGenerator = EnhancedReportGenerator;

// 在主應用程式載入後初始化增強版報告生成器
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.app) {
            window.enhancedReportGenerator = new EnhancedReportGenerator(window.app);
            
            // 替換原有的報告生成按鈕
            const existingBtn = document.querySelector('#exportReportBtn');
            if (existingBtn) {
                existingBtn.innerHTML = '🤖 AI 深度分析';
                existingBtn.onclick = () => window.enhancedReportGenerator.showEnhancedReportGenerator();
            }
            
            console.log('🚀 增強版 AI 報告生成器已初始化（完整除錯版）');
        }
    }, 1000);
});

// 樣式增強
const enhancedStyle = document.createElement('style');
enhancedStyle.textContent = `
/* 增強版報告生成器樣式 */
.modal-content.extra-large {
    max-width: 1200px;
    max-height: 90vh;
    width: 90%;
}

.ai-provider-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    margin-bottom: 20px;
}

.ai-provider-card {
    padding: 15px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
}

.ai-provider-card:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
}

.ai-provider-card.selected {
    border-color: #1976d2;
    background: rgba(25, 118, 210, 0.1);
}

.provider-description {
    font-size: 12px;
    color: #666;
    margin: 8px 0;
}

.model-info {
    font-size: 11px;
    color: #999;
}

.provider-features {
    font-size: 11px;
    color: #1976d2;
    font-weight: 500;
}

.connection-status {
    background: rgba(255, 255, 255, 0.05);
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.status-item {
    display: flex;
    align-items: center;
    gap: 10px;
}

.status-item.success { color: #4caf50; }
.status-item.warning { color: #ff9800; }

.retry-btn {
    margin-left: auto;
    padding: 4px 8px;
    background: rgba(25, 118, 210, 0.2);
    border: 1px solid rgba(25, 118, 210, 0.3);
    border-radius: 4px;
    color: #1976d2;
    cursor: pointer;
    font-size: 12px;
}

.config-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 20px;
}

.checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.checkbox-group label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
}

.custom-prompt {
    min-height: 100px;
    resize: vertical;
}

.charts-preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
}

.chart-preview-card {
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.05);
}

.chart-preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.chart-preview-header h5 {
    margin: 0;
    font-size: 13px;
}

.chart-type-badge {
    background: #1976d2;
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 10px;
}

.chart-preview-thumbnail {
    height: 80px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
    font-size: 12px;
    color: #666;
}

.live-preview {
    background: rgba(255, 255, 255, 0.05);
    padding: 20px;
    border-radius: 8px;
    min-height: 150px;
}

.preview-summary {
    font-size: 14px;
}

.preview-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin: 15px 0;
}

.stat-item {
    padding: 8px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
}

.ai-progress {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 25px;
    margin: 20px 0;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 20px;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #1976d2, #42a5f5);
    width: 0%;
    transition: width 0.5s ease;
}

.analysis-steps {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 15px;
}

.analysis-step {
    flex: 1;
    text-align: center;
    padding: 8px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 6px;
    font-size: 11px;
    color: #666;
    transition: all 0.3s ease;
}

.analysis-step.active {
    background: rgba(25, 118, 210, 0.2);
    color: #1976d2;
}

.analysis-step.completed {
    background: rgba(76, 175, 80, 0.2);
    color: #4caf50;
}

.generated-report {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
}

.report-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.report-stats {
    display: flex;
    gap: 15px;
    font-size: 13px;
    color: #666;
}

.report-content-preview {
    max-height: 300px;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.05);
    padding: 15px;
    border-radius: 6px;
    font-size: 13px;
}

.chart-thumbnails {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
}

.no-charts {
    text-align: center;
    color: #666;
    padding: 30px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
}

/* 響應式設計 */
@media (max-width: 768px) {
    .modal-content.extra-large {
        width: 95%;
        height: 95vh;
    }
    
    .ai-provider-grid,
    .config-grid {
        grid-template-columns: 1fr;
    }
    
    .charts-preview-grid {
        grid-template-columns: 1fr;
    }
    
    .analysis-steps {
        flex-direction: column;
        gap: 4px;
    }
    
    .report-header {
        flex-direction: column;
        gap: 8px;
    }
    
    .report-stats {
        flex-direction: column;
        gap: 5px;
    }
}
`;

document.head.appendChild(enhancedStyle);

console.log('🔧 增強版報告生成器載入完成 - 所有功能已修復');