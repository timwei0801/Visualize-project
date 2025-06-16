/**
 * 智能報告生成器 - 前端模組
 * 與 MCP 服務器配合，生成專業統計報告和簡報
 */

class ReportGenerator {
    constructor(vizApp) {
        this.vizApp = vizApp; // 視覺化應用程式實例
        this.mcpConnection = null;
        this.reportTemplates = this.initializeTemplates();
        this.initializeUI();
    }

    /**
     * 初始化報告模板
     */
    initializeTemplates() {
        return {
            executive: {
                name: '高管摘要報告',
                description: '簡潔的高層決策導向報告',
                sections: ['執行摘要', '關鍵指標', '主要發現', '建議行動'],
                maxPages: 3,
            },
            detailed: {
                name: '詳細分析報告',
                description: '完整的統計分析報告',
                sections: ['數據概覽', '統計分析', '圖表解讀', '深度洞察', '方法論', '附錄'],
                maxPages: 15,
            },
            technical: {
                name: '技術報告',
                description: '面向技術人員的深度分析',
                sections: ['技術規格', '算法說明', '統計驗證', '代碼實作', '效能評估'],
                maxPages: 20,
            },
            presentation: {
                name: '簡報版本',
                description: '適合演講的簡報格式',
                sections: ['封面', '議程', '關鍵發現', '詳細分析', '結論與建議'],
                maxSlides: 25,
            }
        };
    }

    /**
     * 初始化 UI 介面
     */
    initializeUI() {
        this.createReportGeneratorModal();
        this.setupEventListeners();
    }

    /**
     * 創建報告生成器模態框
     */
    createReportGeneratorModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'reportGeneratorModal';
        
        modal.innerHTML = `
            <div class="modal-content large">
                <div class="modal-header">
                    <h3 class="modal-title">🤖 AI 智能報告生成器</h3>
                    <button class="close-btn" onclick="reportGenerator.closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <!-- 報告類型選擇 -->
                    <div class="report-type-section">
                        <h4>📋 選擇報告類型</h4>
                        <div class="report-type-grid">
                            ${Object.entries(this.reportTemplates).map(([key, template]) => `
                                <div class="report-type-card ${key === 'detailed' ? 'selected' : ''}" 
                                     data-type="${key}">
                                    <h5>${template.name}</h5>
                                    <p>${template.description}</p>
                                    <div class="template-info">
                                        ${template.maxPages ? `最多 ${template.maxPages} 頁` : `最多 ${template.maxSlides} 張投影片`}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- 報告設定 -->
                    <div class="report-settings-section">
                        <h4>⚙️ 報告設定</h4>
                        <div class="settings-grid">
                            <div class="form-group">
                                <label>目標受眾</label>
                                <select id="targetAudience" class="form-select">
                                    <option value="business">商業決策者</option>
                                    <option value="technical">技術人員</option>
                                    <option value="academic">學術研究者</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>報告標題</label>
                                <input type="text" id="reportTitle" class="form-input" 
                                       value="數據分析報告" placeholder="輸入自定義標題">
                            </div>
                            <div class="form-group">
                                <label>包含內容</label>
                                <div class="checkbox-group">
                                    <label><input type="checkbox" id="includeCharts" checked> 圖表分析</label>
                                    <label><input type="checkbox" id="includeStats" checked> 統計洞察</label>
                                    <label><input type="checkbox" id="includeRecommendations" checked> 建議行動</label>
                                    <label><input type="checkbox" id="includeMethodology"> 方法論說明</label>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>語言風格</label>
                                <select id="languageStyle" class="form-select">
                                    <option value="professional">專業正式</option>
                                    <option value="casual">親和易懂</option>
                                    <option value="technical">技術導向</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- AI 提示詞設定 -->
                    <div class="ai-prompt-section">
                        <h4>🧠 AI 分析提示</h4>
                        <textarea id="aiPrompt" class="form-input" rows="3" 
                                  placeholder="請描述您希望 AI 重點關注的分析方向...">請根據數據特徵，從統計學角度深入分析，提供專業的洞察和建議。</textarea>
                    </div>

                    <!-- 預覽區域 -->
                    <div class="report-preview-section">
                        <h4>👁️ 報告預覽</h4>
                        <div id="reportPreview" class="report-preview">
                            <div class="preview-placeholder">
                                點擊「生成預覽」查看報告結構
                            </div>
                        </div>
                    </div>

                    <!-- 生成進度 -->
                    <div id="generationProgress" class="generation-progress" style="display: none;">
                        <div class="progress-header">
                            <h4>🚀 AI 正在生成報告...</h4>
                            <div class="progress-bar">
                                <div class="progress-fill" id="progressFill"></div>
                            </div>
                        </div>
                        <div class="progress-steps">
                            <div class="progress-step active" data-step="1">分析數據</div>
                            <div class="progress-step" data-step="2">解讀圖表</div>
                            <div class="progress-step" data-step="3">生成洞察</div>
                            <div class="progress-step" data-step="4">撰寫報告</div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="reportGenerator.generatePreview()">
                        👁️ 生成預覽
                    </button>
                    <button class="btn btn-primary" onclick="reportGenerator.generateReport()">
                        🤖 AI 生成報告
                    </button>
                    <button class="btn btn-success" onclick="reportGenerator.exportReport()" disabled id="exportBtn">
                        💾 下載報告
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    /**
     * 設定事件監聽器
     */
    setupEventListeners() {
        // 報告類型選擇
        document.addEventListener('click', (e) => {
            if (e.target.closest('.report-type-card')) {
                this.selectReportType(e.target.closest('.report-type-card'));
            }
        });

        // 設定變更時自動更新預覽
        ['targetAudience', 'languageStyle'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.updatePreview());
            }
        });
    }

    /**
     * 選擇報告類型
     */
    selectReportType(card) {
        // 移除其他選中狀態
        document.querySelectorAll('.report-type-card').forEach(c => c.classList.remove('selected'));
        
        // 選中當前卡片
        card.classList.add('selected');
        
        // 更新預覽
        this.updatePreview();
    }

    /**
     * 生成報告預覽
     */
    async generatePreview() {
        const selectedType = document.querySelector('.report-type-card.selected')?.dataset.type || 'detailed';
        const template = this.reportTemplates[selectedType];
        
        const previewContent = `
            <div class="preview-content">
                <h3>📄 ${template.name}</h3>
                <div class="preview-sections">
                    ${template.sections.map((section, index) => `
                        <div class="preview-section">
                            <div class="section-number">${index + 1}</div>
                            <div class="section-content">
                                <h4>${section}</h4>
                                <p class="section-description">${this.getSectionDescription(section, selectedType)}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="preview-stats">
                    <span>📊 ${this.vizApp.state.charts.length} 個圖表</span>
                    <span>📈 ${this.vizApp.getCurrentData()?.length || 0} 筆數據</span>
                    <span>⏱️ 預計 ${this.estimateGenerationTime(selectedType)} 分鐘</span>
                </div>
            </div>
        `;
        
        document.getElementById('reportPreview').innerHTML = previewContent;
    }

    /**
     * 獲取章節描述
     */
    getSectionDescription(section, reportType) {
        const descriptions = {
            '執行摘要': '數據概覽、關鍵發現、主要建議的簡潔總結',
            '關鍵指標': '最重要的統計指標和績效數據',
            '主要發現': '從數據分析中獲得的重要洞察',
            '建議行動': '基於分析結果的具體行動建議',
            '數據概覽': '數據結構、品質、基本統計描述',
            '統計分析': '深度統計分析，包含相關性、分布等',
            '圖表解讀': '每個圖表的詳細統計意義解釋',
            '深度洞察': 'AI 驅動的深層數據洞察分析',
            '方法論': '分析方法、統計技術、假設說明',
            '附錄': '詳細數據表格、技術規格、參考資料',
        };
        
        return descriptions[section] || '詳細分析內容';
    }

    /**
     * 估算生成時間
     */
    estimateGenerationTime(reportType) {
        const baseTime = {
            executive: 2,
            detailed: 5,
            technical: 7,
            presentation: 3,
        };
        
        const chartCount = this.vizApp.state.charts.length;
        const dataSize = this.vizApp.getCurrentData()?.length || 0;
        
        // 根據圖表數量和數據量調整時間
        const adjustedTime = baseTime[reportType] + 
                           Math.ceil(chartCount / 3) + 
                           Math.ceil(dataSize / 10000);
        
        return Math.min(adjustedTime, 15); // 最多15分鐘
    }

    /**
     * 生成完整報告
     */
    async generateReport() {
        if (!this.vizApp.getCurrentData()) {
            this.vizApp.showError('請先上傳數據並生成圖表');
            return;
        }

        const selectedType = document.querySelector('.report-type-card.selected')?.dataset.type || 'detailed';
        const settings = this.collectSettings();
        
        try {
            this.showGenerationProgress();
            
            // 準備儀表板數據
            const dashboardData = this.prepareDashboardData();
            
            // 調用 MCP 工具生成報告
            const report = await this.callMCPService('generate_statistical_report', {
                dashboardData,
                reportType: selectedType,
                targetAudience: settings.targetAudience,
                ...settings
            });

            // 如果是簡報類型，額外生成簡報大綱
            if (selectedType === 'presentation') {
                const presentation = await this.callMCPService('create_presentation_outline', {
                    dashboardData,
                    presentationStyle: settings.targetAudience,
                    timeLimit: 15
                });
                
                this.displayPresentationResult(presentation, settings);
            } else {
                this.displayReportResult(report, settings);
            }
            
            // 啟用下載按鈕
            document.getElementById('exportBtn').disabled = false;
            
        } catch (error) {
            console.error('報告生成失敗:', error);
            this.vizApp.showError('報告生成失敗: ' + error.message);
        } finally {
            this.hideGenerationProgress();
        }
    }

    /**
     * 收集設定
     */
    collectSettings() {
        return {
            targetAudience: document.getElementById('targetAudience')?.value || 'business',
            reportTitle: document.getElementById('reportTitle')?.value || '數據分析報告',
            includeCharts: document.getElementById('includeCharts')?.checked || true,
            includeStats: document.getElementById('includeStats')?.checked || true,
            includeRecommendations: document.getElementById('includeRecommendations')?.checked || true,
            includeMethodology: document.getElementById('includeMethodology')?.checked || false,
            languageStyle: document.getElementById('languageStyle')?.value || 'professional',
            aiPrompt: document.getElementById('aiPrompt')?.value || '',
        };
    }

    /**
     * 準備儀表板數據
     */
    prepareDashboardData() {
        return {
            data: this.vizApp.getCurrentData(),
            charts: this.vizApp.state.charts.map(chart => ({
                id: chart.id,
                type: chart.type,
                title: chart.title,
                config: chart.config,
                customOptions: chart.customOptions
            })),
            analysisResult: this.vizApp.getCurrentAnalysis(),
            metadata: {
                timestamp: new Date().toISOString(),
                dataSource: this.vizApp.state.file?.name || 'Unknown',
                chartCount: this.vizApp.state.charts.length,
                dataSize: this.vizApp.getCurrentData()?.length || 0
            }
        };
    }

    /**
     * 模擬 MCP 服務調用
     * 實際實作中需要建立與 MCP 服務器的連接
     */
    async callMCPService(toolName, args) {
        // 模擬 API 調用延遲
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 這裡應該是真正的 MCP 調用
        // 現在返回模擬數據
        switch (toolName) {
            case 'generate_statistical_report':
                return this.generateMockReport(args);
            case 'create_presentation_outline':
                return this.generateMockPresentation(args);
            default:
                throw new Error(`Unknown MCP tool: ${toolName}`);
        }
    }

    /**
     * 生成模擬報告（實際中由 MCP 服務器生成）
     */
    generateMockReport(args) {
        const { dashboardData, reportType, targetAudience } = args;
        
        return {
            metadata: {
                title: '智能視覺化數據分析報告',
                reportType,
                targetAudience,
                generateTime: new Date().toISOString()
            },
            content: `# ${args.reportTitle || '數據分析報告'}

## 📊 執行摘要

基於 ${dashboardData.data.length.toLocaleString()} 筆數據記錄的分析，透過 ${dashboardData.charts.length} 個視覺化圖表，我們發現了以下關鍵洞察：

### 🎯 主要發現
${dashboardData.analysisResult.數據洞察.map((insight, i) => `${i + 1}. ${insight}`).join('\n')}

### 📈 數據品質評估
- **完整性**：${dashboardData.analysisResult.數據質量.完整性}% - ${this.getQualityInterpretation(dashboardData.analysisResult.數據質量.完整性)}
- **質量評分**：${dashboardData.analysisResult.數據質量.質量評分}/100 - ${this.getScoreInterpretation(dashboardData.analysisResult.數據質量.質量評分)}

## 🔍 詳細分析

### 圖表洞察分析
${dashboardData.charts.map(chart => this.generateChartAnalysis(chart, dashboardData)).join('\n\n')}

### 統計發現
${this.generateStatisticalFindings(dashboardData.analysisResult)}

## 💡 建議行動

基於上述分析，我們建議：

${dashboardData.analysisResult.數據質量.建議.map(rec => `- ${rec}`).join('\n')}

---
*本報告由 AI 智能視覺化系統自動生成 | 生成時間：${new Date().toLocaleString()}*`
        };
    }

    /**
     * 生成圖表分析
     */
    generateChartAnalysis(chart, dashboardData) {
        const purposes = {
            bar: '比較不同類別的數值差異，識別最高/最低值',
            line: '追蹤趨勢變化，識別模式和週期性',
            pie: '顯示組成比例，識別主要構成要素',
            scatter: '探索變數關係，識別相關性和異常值',
            heatmap: '顯示多維關係，識別熱點區域',
        };

        return `#### ${chart.title} (${chart.type})
**圖表目的**：${purposes[chart.type] || '呈現數據特徵'}

**關鍵洞察**：
- 此圖表顯示了 ${this.generateChartInsight(chart, dashboardData)}
- 建議重點關注 ${this.generateChartRecommendation(chart)}`;
    }

    /**
     * 顯示生成進度
     */
    showGenerationProgress() {
        document.getElementById('generationProgress').style.display = 'block';
        
        // 模擬進度更新
        let step = 1;
        const progressInterval = setInterval(() => {
            if (step <= 4) {
                // 更新進度條
                const progress = (step / 4) * 100;
                document.getElementById('progressFill').style.width = `${progress}%`;
                
                // 更新步驟狀態
                document.querySelectorAll('.progress-step').forEach((el, index) => {
                    if (index < step) {
                        el.classList.add('completed');
                        el.classList.remove('active');
                    } else if (index === step) {
                        el.classList.add('active');
                    }
                });
                
                step++;
            } else {
                clearInterval(progressInterval);
            }
        }, 1500);
        
        this.progressInterval = progressInterval;
    }

    /**
     * 隱藏生成進度
     */
    hideGenerationProgress() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
        document.getElementById('generationProgress').style.display = 'none';
    }

    /**
     * 顯示報告結果
     */
    displayReportResult(report, settings) {
        const resultHTML = `
            <div class="report-result">
                <div class="result-header">
                    <h3>✅ 報告生成完成</h3>
                    <p>AI 已成功分析您的數據並生成專業報告</p>
                </div>
                <div class="result-content">
                    <div class="result-preview">
                        <pre>${report.content}</pre>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="btn btn-secondary" onclick="reportGenerator.editReport()">✏️ 編輯報告</button>
                    <button class="btn btn-primary" onclick="reportGenerator.shareReport()">🔗 分享報告</button>
                </div>
            </div>
        `;
        
        document.getElementById('reportPreview').innerHTML = resultHTML;
        this.currentReport = report;
    }

    /**
     * 匯出報告
     */
    async exportReport() {
        if (!this.currentReport) {
            this.vizApp.showError('沒有可匯出的報告');
            return;
        }

        const selectedType = document.querySelector('.report-type-card.selected')?.dataset.type || 'detailed';
        
        try {
            // 根據報告類型選擇匯出格式
            switch (selectedType) {
                case 'presentation':
                    await this.exportAsPresentation();
                    break;
                default:
                    await this.exportAsDocument();
            }
            
            this.vizApp.showSuccess('報告已成功匯出');
        } catch (error) {
            this.vizApp.showError('匯出失敗: ' + error.message);
        }
    }

    /**
     * 匯出為文檔
     */
    async exportAsDocument() {
        const content = this.currentReport.content;
        
        // 創建 Markdown 檔案
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `智能分析報告_${new Date().toISOString().split('T')[0]}.md`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    /**
     * 關閉模態框
     */
    closeModal() {
        document.getElementById('reportGeneratorModal').classList.remove('show');
    }

    /**
     * 顯示報告生成器
     */
    showReportGenerator() {
        if (!this.vizApp.getCurrentData()) {
            this.vizApp.showError('請先上傳數據檔案');
            return;
        }

        if (this.vizApp.state.charts.length === 0) {
            this.vizApp.showError('請先生成一些圖表');
            return;
        }

        document.getElementById('reportGeneratorModal').classList.add('show');
        this.generatePreview(); // 自動生成預覽
    }

    // === 輔助方法 ===

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

    generateChartInsight(chart, dashboardData) {
        // 根據圖表類型生成洞察
        const insights = {
            bar: '各類別間存在顯著差異，可進一步分析成因',
            line: '時間序列呈現明顯趨勢，值得持續監控',
            pie: '分布相對集中，主要組成要素清晰可見',
            scatter: '變數間呈現一定程度的關聯性',
        };
        
        return insights[chart.type] || '重要的數據模式';
    }

    generateChartRecommendation(chart) {
        const recommendations = {
            bar: '排名前三的類別及其影響因素',
            line: '趨勢轉折點和未來預測方向',
            pie: '主要構成要素的變化趨勢',
            scatter: '極值點和異常模式的原因',
        };
        
        return recommendations[chart.type] || '關鍵數據點的背景原因';
    }

    generateStatisticalFindings(analysisResult) {
        const findings = [];
        
        if (analysisResult.統計摘要.相關性分析) {
            findings.push('**變數關係分析**：');
            Object.entries(analysisResult.統計摘要.相關性分析).forEach(([pair, correlation]) => {
                const strength = this.interpretCorrelation(correlation);
                findings.push(`- ${pair}: 相關係數 ${correlation.toFixed(3)} (${strength})`);
            });
        }

        return findings.join('\n');
    }

    interpretCorrelation(correlation) {
        const abs = Math.abs(correlation);
        if (abs >= 0.8) return '非常強相關';
        if (abs >= 0.6) return '強相關';
        if (abs >= 0.4) return '中度相關';
        if (abs >= 0.2) return '弱相關';
        return '幾乎無相關';
    }
}

// 全域實例和設定
window.ReportGenerator = ReportGenerator;

// 在主應用程式載入後初始化報告生成器
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.app) {
            window.reportGenerator = new ReportGenerator(window.app);
            
            // 在快速操作區添加報告生成按鈕
            const reportBtn = document.createElement('button');
            reportBtn.className = 'btn btn-success';
            reportBtn.innerHTML = '🤖 AI 生成報告';
            reportBtn.onclick = () => window.reportGenerator.showReportGenerator();
            
            // 找到合適的位置插入按鈕
            const rightPanel = document.querySelector('.right-panel .section-title:last-of-type');
            if (rightPanel) {
                rightPanel.parentNode.insertBefore(reportBtn, rightPanel.nextSibling);
            }
            
            console.log('📄 AI 報告生成器已初始化');
        }
    }, 1000);
});

// 樣式
const style = document.createElement('style');
style.textContent = `
/* 報告生成器樣式 */
.report-type-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin-bottom: 20px;
}

.report-type-card {
    padding: 20px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
}

.report-type-card:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
}

.report-type-card.selected {
    border-color: #1976d2;
    background: rgba(25, 118, 210, 0.1);
}

.report-type-card h5 {
    margin: 0 0 8px 0;
    color: #1976d2;
    font-weight: 600;
}

.report-type-card p {
    margin: 0 0 10px 0;
    color: #666;
    font-size: 14px;
}

.template-info {
    font-size: 12px;
    color: #999;
}

.settings-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
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

.report-preview {
    min-height: 200px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.preview-content h3 {
    color: #1976d2;
    margin-bottom: 20px;
}

.preview-sections {
    margin-bottom: 20px;
}

.preview-section {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    margin-bottom: 15px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
}

.section-number {
    background: #1976d2;
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
}

.section-content h4 {
    margin: 0 0 4px 0;
    color: #333;
    font-size: 14px;
}

.section-description {
    margin: 0;
    color: #666;
    font-size: 12px;
}

.preview-stats {
    display: flex;
    gap: 20px;
    font-size: 14px;
    color: #1976d2;
}

.generation-progress {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 20px;
    margin: 20px 0;
}

.progress-header h4 {
    margin: 0 0 15px 0;
    color: #1976d2;
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

.progress-steps {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.progress-step {
    flex: 1;
    text-align: center;
    padding: 10px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 6px;
    font-size: 12px;
    color: #666;
    transition: all 0.3s ease;
}

.progress-step.active {
    background: rgba(25, 118, 210, 0.2);
    color: #1976d2;
}

.progress-step.completed {
    background: rgba(76, 175, 80, 0.2);
    color: #4caf50;
}

.result-preview {
    max-height: 400px;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.05);
    padding: 15px;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    line-height: 1.4;
}

.result-actions {
    display: flex;
    gap: 10px;
    margin-top: 15px;
}

@media (max-width: 768px) {
    .report-type-grid,
    .settings-grid {
        grid-template-columns: 1fr;
    }
    
    .progress-steps {
        flex-direction: column;
    }
    
    .preview-stats {
        flex-direction: column;
        gap: 8px;
    }
}
`;

document.head.appendChild(style);