/* ==========================================
   智能視覺化推薦系統 v2.0 - 主要邏輯
   支援各種數據格式的通用視覺化系統
   ========================================== */

class VizApp {
    constructor() {
        this.state = {
            file: null,
            rawData: null,
            analysisResult: null,
            charts: [],
            selectedChart: null,
            recommendation: null,
            loading: false,
            currentTab: 'basic',
            currentPage: 1,
            itemsPerPage: 100,
            // 新增：全局篩選狀態
            globalFilters: new Map(), // key: 欄位名稱, value: 篩選值陣列
            crossFilterEnabled: true  // 是否啟用圖表間聯動
        };

        this.chartInstances = new Map();
        this.resizeObservers = new Map();
        
        this.init();

        this.grid = GridStack.init({
            column: 12,
            cellHeight: 80,
            margin: 5,
            animate: true,
            float: false,
            resizable: {
                handles: 'all',
                autoHide: false
            }
        }, '#chartsGrid');

        this.grid.on('change', (event, items) => {
            items.forEach(item => {
                const id = item.el.querySelector('.chart-card').getAttribute('data-chart-id');
                const ch = this.state.charts.find(c => c.id.toString() === id);
                if (ch) {
                    ch.x = item.x;
                    ch.y = item.y;
                    ch.w = item.w;
                    ch.h = item.h;
                }
            });
        });
    }

    /**
     * 初始化應用程式
     */
    init() {
        this.setupEventListeners();
        this.renderChartSelector();
        this.updateChartCount();
        this.showWelcomeMessage();
    }

    /**
     * 設定所有事件監聽器
     */
    setupEventListeners() {
        // 檔案上傳相關
        this.setupFileUploadEvents();
        
        // AI推薦相關
        this.setupAIRecommendationEvents();
        
        // 圖表操作相關
        this.setupChartEvents();
        
        // UI控制相關
        this.setupUIControlEvents();
        
        // 模態框相關
        this.setupModalEvents();
        
        // 鍵盤快捷鍵
        this.setupKeyboardShortcuts();
    }

    /**
     * 檔案上傳事件設定
     */
    setupFileUploadEvents() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');

        if (!uploadArea || !fileInput) {
            console.error('❌ 找不到上傳元素');
            return;
        }

        console.log('📁 設定檔案上傳事件');

        // 點擊上傳
        uploadArea.addEventListener('click', () => {
            console.log('🖱️ 點擊上傳區域');
            fileInput.click();
        });
        
        // 拖放事件
        uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        
        // 檔案選擇事件
        fileInput.addEventListener('change', (e) => {
            console.log('📂 檔案選擇事件觸發:', e.target.files);
            this.handleFileSelect(e);
        });
        
        console.log('✅ 檔案上傳事件設定完成');
    }

    /**
     * AI推薦事件設定
     */
    setupAIRecommendationEvents() {
        document.getElementById('claudeBtn').addEventListener('click', 
            () => this.handleAIRecommendation('claude'));
        document.getElementById('vizmlBtn').addEventListener('click', 
            () => this.handleAIRecommendation('vizml'));
        document.getElementById('hybridBtn').addEventListener('click', 
            () => this.handleAIRecommendation('hybrid'));
    }

    /**
     * 圖表事件設定
     */
    setupChartEvents() {
        // 圖表標籤頁
        document.querySelectorAll('.chart-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // 控制按鈕
        document.getElementById('layoutBtn').addEventListener('click', this.autoLayout.bind(this));
        document.getElementById('clearAllBtn').addEventListener('click', this.clearAllCharts.bind(this));
        document.getElementById('exportBtn').addEventListener('click', this.exportDashboard.bind(this));
        document.getElementById('floatingAddBtn').addEventListener('click', () => this.switchTab('basic'));
    }

    /**
     * UI控制事件設定
     */
    setupUIControlEvents() {
        // 快速操作按鈕
        document.getElementById('exportReportBtn').addEventListener('click', this.exportReport.bind(this));
        document.getElementById('filterDataBtn').addEventListener('click', this.showDataFilter.bind(this));
        document.getElementById('viewDataBtn').addEventListener('click', this.showFullDataView.bind(this));
    }

    /**
     * 模態框事件設定
     */
    setupModalEvents() {
        // 自定義標籤頁切換
        document.querySelectorAll('.custom-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchCustomTab(e.target.dataset.tab));
        });

        // 透明度滑桿
        const opacitySlider = document.getElementById('opacitySlider');
        if (opacitySlider) {
            opacitySlider.addEventListener('input', (e) => {
                document.getElementById('opacityValue').textContent = Math.round(e.target.value * 100) + '%';
            });
        }
    }

    /**
     * 鍵盤快捷鍵設定
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + 快捷鍵
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        this.exportDashboard();
                        break;
                    case 'n':
                        e.preventDefault();
                        this.clearAllCharts();
                        break;
                    case 'o':
                        e.preventDefault();
                        document.getElementById('fileInput').click();
                        break;
                }
            }

            // ESC 鍵關閉模態框
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    /**
     * 拖放事件處理
     */
    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            this.handleFileUpload(files[0]);
        }
    }

    handleFileSelect(e) {
        console.log('📂 handleFileSelect 被調用');
        console.log('檔案數量:', e.target.files.length);
        
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            console.log('選擇的檔案:', file.name, file.size, file.type);
            this.handleFileUpload(file);
        } else {
            console.log('❌ 沒有選擇檔案');
        }
    }

    /**
     * 檔案上傳處理 - 支援多種格式
     */
    async handleFileUpload(file) {
        console.log('📁 開始處理檔案:', file.name);
        
        this.state.file = file;
        this.setLoading(true);
        
        try {
            // 更新上傳UI
            this.updateUploadUI('uploading');
            
            // 顯示檔案信息
            this.showFileInfo(file);
            
            // 根據檔案類型處理
            const fileExtension = file.name.split('.').pop().toLowerCase();
            console.log('📄 檔案格式:', fileExtension);
            
            let data;

            switch (fileExtension) {
                case 'csv':
                    console.log('🔄 解析 CSV...');
                    data = await this.parseCSV(file);
                    break;
                case 'json':
                    console.log('🔄 解析 JSON...');
                    data = await this.parseJSON(file);
                    break;
                case 'xlsx':
                case 'xls':
                    throw new Error('Excel 檔案支援開發中，請使用 CSV 格式');
                default:
                    throw new Error(`不支援的檔案格式: ${fileExtension}。支援格式：CSV, JSON`);
            }

            if (!data || data.length === 0) {
                throw new Error('檔案中沒有有效數據');
            }

            console.log('✅ 數據解析成功，行數:', data.length);

            // 數據清理和標準化
            const cleanedData = this.cleanData(data);
            this.state.rawData = cleanedData;
            
            console.log('🧹 數據清理完成，有效行數:', cleanedData.length);
            
            // 使用 DataAnalyzer 分析數據
            const analysisResult = window.dataAnalyzer.analyzeData(cleanedData);
            this.state.analysisResult = analysisResult;
            
            console.log('📊 數據分析完成:', analysisResult);
            
            // 更新UI
            this.updateUploadUI('success');
            this.updateDataOverview();
            this.updateInsights();
            this.showFloatingButton();
            
            this.showSuccess(`成功載入 ${cleanedData.length} 行數據`);
            
        } catch (error) {
            console.error('❌ 檔案處理錯誤:', error);
            this.showError(error.message);
            this.updateUploadUI('error');
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * CSV解析
     */
    parseCSV(file) {
        return new Promise((resolve, reject) => {
            console.log('📄 開始解析 CSV 檔案...');
            
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                dynamicTyping: false, // 先不自動轉換類型，讓我們手動處理
                encoding: 'UTF-8',
                complete: (results) => {
                    console.log('📊 CSV 解析完成:', results);
                    
                    if (results.errors && results.errors.length > 0) {
                        console.warn('⚠️ CSV 解析警告:', results.errors);
                        // 只有嚴重錯誤才拒絕
                        const criticalErrors = results.errors.filter(error => error.type === 'Quotes');
                        if (criticalErrors.length > 0) {
                            reject(new Error('CSV解析錯誤: ' + criticalErrors[0].message));
                            return;
                        }
                    }
                    
                    if (!results.data || results.data.length === 0) {
                        reject(new Error('CSV 檔案中沒有數據'));
                        return;
                    }
                    
                    console.log('✅ CSV 解析成功，原始行數:', results.data.length);
                    resolve(results.data);
                },
                error: (error) => {
                    console.error('❌ CSV 解析失敗:', error);
                    reject(new Error('CSV 檔案解析失敗: ' + error.message));
                }
            });
        });
    }

    /**
     * JSON解析
     */
    async parseJSON(file) {
        const text = await file.text();
        const data = JSON.parse(text);
        
        // 確保數據是陣列格式
        if (Array.isArray(data)) {
            return data;
        } else if (typeof data === 'object' && data !== null) {
            // 如果是物件，嘗試找到陣列屬性
            const arrayValues = Object.values(data).filter(value => Array.isArray(value));
            if (arrayValues.length > 0) {
                return arrayValues[0];
            } else {
                // 將物件轉換為單行陣列
                return [data];
            }
        } else {
            throw new Error('JSON格式不正確');
        }
    }

    /**
     * Excel解析 (需要額外的庫支援)
     */
    async parseExcel(file) {
        // 這裡需要整合 SheetJS 或類似的庫
        // 目前返回錯誤提示
        throw new Error('Excel檔案解析功能開發中，請使用CSV格式');
    }

    /**
     * 數據清理
     */
    cleanData(data) {
        return data.filter(row => {
            // 過濾完全空的行
            return Object.values(row).some(value => 
                value !== null && value !== undefined && value !== ''
            );
        }).map(row => {
            // 清理欄位名稱
            const cleanedRow = {};
            Object.entries(row).forEach(([key, value]) => {
                const cleanedKey = key.trim().replace(/\s+/g, ' ');
                cleanedRow[cleanedKey] = value;
            });
            return cleanedRow;
        });
    }

    /**
     * AI推薦處理
     */
    async handleAIRecommendation(method) {
        const userInput = document.getElementById('userInput').value;
        
        if (!this.state.analysisResult) {
            this.showError('請先上傳數據檔案');
            return;
        }
        
        if (!userInput && (method === 'claude' || method === 'hybrid')) {
            this.showError('請先描述您的視覺化需求');
            return;
        }
        
        this.setLoading(true);
        this.showLoadingRecommendation();
        
        try {
            const recommendation = await this.generateRecommendation(method, userInput);
            this.state.recommendation = recommendation;
            this.displayRecommendation(recommendation);
        } catch (error) {
            this.showError('推薦生成失敗: ' + error.message);
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * 生成推薦 (模擬AI推薦邏輯)
     */
    async generateRecommendation(method, userInput) {
        // 模擬API延遲
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const analysis = this.state.analysisResult;
        const recommendations = analysis.推薦圖表;
        
        let chartTypes = [];
        let reasoning = '';
        let confidence = 0.85;

        switch (method) {
            case 'claude':
                chartTypes = this.getClaudeRecommendations(userInput, analysis);
                reasoning = `Claude 基於您的需求"${userInput}"，推薦以下圖表類型來最佳展示您的數據洞察。`;
                break;
            
            case 'vizml':
                chartTypes = recommendations.map(r => r.類型);
                reasoning = 'VizML 統計分析基於數據的統計特性，推薦最適合的視覺化方式。';
                break;
            
            case 'hybrid':
                const claudeTypes = this.getClaudeRecommendations(userInput, analysis);
                const vizmlTypes = recommendations.map(r => r.類型);
                chartTypes = [...new Set([...claudeTypes, ...vizmlTypes])];
                reasoning = '結合語義分析和統計分析，提供全面的視覺化建議。';
                confidence = 0.92;
                break;
        }

        return {
            method,
            chartTypes,
            reasoning,
            confidence,
            metadata: {
                dataSize: analysis.基本信息.總行數,
                columnCount: analysis.基本信息.欄位數,
                hasTimeData: analysis.欄位分析.時間欄位.length > 0,
                hasNumericData: analysis.欄位分析.數值欄位.length > 0
            }
        };
    }

    /**
     * Claude推薦邏輯 (基於關鍵詞分析)
     */
    getClaudeRecommendations(userInput, analysis) {
        const input = userInput.toLowerCase();
        const recommendations = [];
        
        // 關鍵詞映射
        const keywords = {
            '趨勢': ['line', 'area'],
            '時間': ['line', 'area'],
            '變化': ['line', 'area'],
            '比較': ['bar', 'radar'],
            '分布': ['pie', 'doughnut', 'histogram'],
            '比例': ['pie', 'doughnut'],
            '相關': ['scatter', 'bubble'],
            '關係': ['scatter', 'bubble'],
            '多維': ['radar', 'bubble']
        };

        // 根據關鍵詞推薦
        Object.entries(keywords).forEach(([keyword, charts]) => {
            if (input.includes(keyword)) {
                recommendations.push(...charts);
            }
        });

        // 如果沒有關鍵詞匹配，使用預設推薦
        if (recommendations.length === 0) {
            const { 數值欄位, 類別欄位, 時間欄位 } = analysis.欄位分析;
            
            if (時間欄位.length > 0) recommendations.push('line');
            if (類別欄位.length > 0) recommendations.push('bar');
            if (數值欄位.length >= 2) recommendations.push('scatter');
        }

        return [...new Set(recommendations)];
    }

    /**
     * 生成圖表
     */
    async generateChart(chartType, customOptions = {}) {
        if (!this.state.analysisResult) {
            this.showError('請先上傳數據檔案');
            return;
        }

        try {
            // 驗證圖表可行性
            const validation = window.chartGenerator.validateChartViability(
                this.getCurrentData(),
                chartType,
                this.getCurrentAnalysis()
            );

            if (!validation.valid) {
                this.showError(validation.reason);
                return;
            }

            // 生成圖表配置
            const chartConfig = window.chartGenerator.generateChart({
                data: this.getCurrentData(),
                chartType: chartType,
                analysis: this.getCurrentAnalysis(),
                customOptions: customOptions
            });

            // 創建圖表物件
            const chart = {
                id: Date.now() + Math.random(),
                type: chartType,
                config: chartConfig,
                title: customOptions.title || `${this.getChartName(chartType)} - ${new Date().toLocaleTimeString()}`,
                createdAt: new Date(),
                customOptions: customOptions
            };

            this.state.charts.push(chart);
            this.renderCharts();
            this.updateChartCount();
            
            // 延遲渲染真實圖表
            setTimeout(() => this.renderRealChart(chart), 100);
            
            this.showSuccess(`已生成 ${this.getChartName(chartType)}`);
            
        } catch (error) {
            console.error('圖表生成錯誤:', error);
            this.showError('圖表生成失敗: ' + error.message);
        }
    }

    /**
     * 渲染真實圖表
     */

    renderRealChart(chart) {
        const canvasContainer = document.getElementById(`chart-canvas-${chart.id}`);
        if (!canvasContainer) {
            console.error('找不到圖表容器:', chart.id);
            return;
        }
        
        canvasContainer.innerHTML = '';
        
        try {
            if (chart.config.engine === 'plotly') {
                this.renderPlotlyChart(chart, canvasContainer);
            } else {
                this.renderChartjsChart(chart, canvasContainer);
            }
            
            this.setupChartResizing(chart);
            
            // 新增：如果有全局篩選，立即應用
            if (this.state.globalFilters.size > 0) {
                setTimeout(() => {
                    this.applyFiltersToChart(chart);
                }, 100);
            }
            
        } catch (error) {
            console.error('圖表渲染錯誤:', error);
            this.renderErrorState(canvasContainer, error.message);
        }
    }

    /**
     * 渲染 Chart.js 圖表
     */
    renderChartjsChart(chart, container) {
        const canvas = document.createElement('canvas');
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const chartInstance = new Chart(ctx, chart.config.config);
        
        // 存儲實例
        this.chartInstances.set(chart.id, {
            type: 'chartjs',
            instance: chartInstance,
            element: canvas
        });
        
        this.addChartInteractivity(chart, chartInstance);
        console.log(`✅ Chart.js 圖表渲染成功: ${chart.type}`);
    }

    /**
     * 渲染 Plotly.js 圖表 - 修復版
     */
    renderPlotlyChart(chart, container) {
        const plotlyDiv = document.createElement('div');
        plotlyDiv.style.width = '100%';
        plotlyDiv.style.height = '100%';
        plotlyDiv.style.minHeight = '300px'; // 確保最小高度
        plotlyDiv.id = `plotly-${chart.id}`;
        container.appendChild(plotlyDiv);
        
        // 確保 layout 有正確的尺寸設定
        const layout = {
            ...chart.config.layout,
            autosize: true,
            margin: { l: 50, r: 50, t: 60, b: 50 }
        };
        
        // 渲染 Plotly 圖表
        Plotly.newPlot(
            plotlyDiv,
            chart.config.data,
            layout,
            {
                ...chart.config.config,
                responsive: true
            }
        ).then(() => {
            console.log(`✅ Plotly.js 圖表渲染成功: ${chart.type}`);
            
            // 存儲 Plotly 實例信息
            this.chartInstances.set(chart.id, {
                type: 'plotly',
                element: plotlyDiv,
                data: chart.config.data,
                layout: layout
            });
            
            // 添加 Plotly 互動事件
            this.addPlotlyInteractivity(chart, plotlyDiv);
            
        }).catch(error => {
            console.error('Plotly 渲染失敗:', error);
            this.renderErrorState(container, error.message);
        });
    }

    /**
     * 添加 Plotly 圖表互動性 - 修復版
     */
    addPlotlyInteractivity(chart, plotlyDiv) {
        // Plotly 點擊事件
        plotlyDiv.on('plotly_click', (data) => {
            if (data.points && data.points.length > 0) {
                const point = data.points[0];
                this.handleChartClick(chart, {
                    label: point.label || point.x,
                    value: point.value || point.y,
                    index: point.pointIndex,
                    trace: point.curveNumber,
                    categoryField: this.detectPlotlyFilterField(chart, point)
                });
            }
        });
        
        // Plotly 懸停事件
        plotlyDiv.on('plotly_hover', (data) => {
            plotlyDiv.style.cursor = 'pointer';
            if (this.state.crossFilterEnabled && data.points && data.points.length > 0) {
                this.showPlotlyHint(chart, data.points[0]);
            }
        });
        
        plotlyDiv.on('plotly_unhover', (data) => {
            plotlyDiv.style.cursor = 'default';
            this.hidePlotlyHint(chart);
        });
    }

    /**
     * 檢測 Plotly 圖表的篩選欄位
     */
    detectPlotlyFilterField(chart, point) {
        const analysis = this.getCurrentAnalysis();
        if (!analysis) return null;

        switch (chart.type) {
            case 'sankey':
                // 桑基圖可以根據節點名稱篩選
                return 'node';
            case 'treemap':
                // 樹狀圖根據標籤篩選
                return analysis.欄位分析.類別欄位[0];
            case 'heatmap':
                // 熱力圖可能需要特殊處理
                return null;
            default:
                return analysis.欄位分析.類別欄位[0];
        }
    }

    /**
     * 顯示 Plotly 互動提示
     */
    showPlotlyHint(chart, point) {
        const chartCard = document.getElementById(`chart-${chart.id}`);
        if (!chartCard) return;

        let hint = chartCard.querySelector('.chart-interactive-hint');
        if (!hint) {
            hint = document.createElement('div');
            hint.className = 'chart-interactive-hint';
            chartCard.appendChild(hint);
        }

        const filterField = this.detectPlotlyFilterField(chart, point);
        if (filterField) {
            hint.innerHTML = `
                <div>🚀 Plotly 聯動</div>
                <div style="font-size: 10px; margin-top: 2px;">
                    點擊進行交叉篩選
                </div>
            `;
            hint.style.opacity = '1';
        }
    }

    /**
     * 隱藏 Plotly 互動提示
     */
    hidePlotlyHint(chart) {
        this.hideInteractionHint(chart); // 重用現有方法
    }

    /**
     * 智能欄位匹配 - 改進的篩選欄位檢測
     */
    detectFilterField(chart, clickData) {
        const analysis = this.getCurrentAnalysis();
        if (!analysis) return null;

        // 如果 clickData 包含明確的篩選欄位，直接使用
        if (clickData.categoryField) {
            return clickData.categoryField;
        }

        // 根據圖表的 customOptions 確定使用的欄位
        if (chart.customOptions && chart.customOptions.xColumn) {
            const xColumn = chart.customOptions.xColumn;
            // 檢查 X 軸欄位是否為類別欄位
            if (analysis.欄位分析.類別欄位.includes(xColumn)) {
                return xColumn;
            }
        }

        // 預設邏輯
        switch (chart.type) {
            case 'bar':
            case 'pie':
            case 'doughnut':
                // 優先使用第一個類別欄位
                return analysis.欄位分析.類別欄位[0] || null;
            
            case 'line':
            case 'area':
                // 線圖可能使用時間欄位或類別欄位
                return analysis.欄位分析.時間欄位[0] || analysis.欄位分析.類別欄位[0] || null;
            
            default:
                return analysis.欄位分析.類別欄位[0] || null;
        }
    }


    /**
     * 添加 Plotly 自定義工具提示 - 簡化版
     */
    addPlotlyTooltip(chart, plotlyDiv) {
        // 簡化的工具提示，只針對特定圖表類型
        if (chart.type === 'sankey') {
            const tooltip = document.createElement('div');
            tooltip.className = 'plotly-custom-tooltip';
            tooltip.innerHTML = `
                <div style="position: absolute; top: 10px; right: 10px; 
                            background: rgba(0,0,0,0.8); color: white; 
                            padding: 8px 12px; border-radius: 6px; font-size: 12px;">
                    💡 拖拽節點重新排列<br>
                    📊 點擊查看流向詳情
                </div>
            `;
            plotlyDiv.appendChild(tooltip);
            
            // 3秒後自動隱藏
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.remove();
                }
            }, 3000);
        }
    }

    /**
     * 設定圖表大小調整 - 修復版
     */
    setupChartResizing(chart) {
        const chartCard = document.getElementById(`chart-${chart.id}`);
        if (!chartCard) return;
        
        // 創建 ResizeObserver
        const resizeObserver = new ResizeObserver(entries => {
            clearTimeout(chart.resizeTimeout);
            chart.resizeTimeout = setTimeout(() => {
                this.resizeChart(chart);
            }, 100);
        });
        
        resizeObserver.observe(chartCard);
        this.resizeObservers.set(chart.id, resizeObserver);
        
        // 添加互動提示
        const hint = document.createElement('div');
        hint.className = 'interaction-hint';
        hint.textContent = chart.config.engine === 'plotly' ? 
            '可調整大小 & 豐富互動' : '可調整大小和互動';
        chartCard.appendChild(hint);
    }

    /**
     * 調整圖表大小 - 修復版
     */
    resizeChart(chart) {
        const chartInstance = this.chartInstances.get(chart.id);
        
        if (!chartInstance) return;
        
        try {
            if (chartInstance.type === 'plotly') {
                // Plotly 圖表調整
                if (chartInstance.element && typeof Plotly !== 'undefined') {
                    Plotly.Plots.resize(chartInstance.element);
                }
            } else if (chartInstance.type === 'chartjs' && chartInstance.instance) {
                // Chart.js 圖表調整
                if (typeof chartInstance.instance.resize === 'function') {
                    chartInstance.instance.resize();
                }
            }
        } catch (error) {
            console.warn('圖表調整大小失敗:', error);
        }
    }

    /**
     * 刪除圖表 - 修復版
     */
    deleteChart(chartId) {
        // 銷毀圖表實例
        const chartInstance = this.chartInstances.get(chartId);
        if (chartInstance) {
            try {
                if (chartInstance.type === 'plotly') {
                    // 清理 Plotly 圖表
                    if (chartInstance.element && typeof Plotly !== 'undefined') {
                        Plotly.purge(chartInstance.element);
                    }
                } else if (chartInstance.type === 'chartjs' && chartInstance.instance) {
                    // 清理 Chart.js 圖表
                    if (typeof chartInstance.instance.destroy === 'function') {
                        chartInstance.instance.destroy();
                    }
                }
            } catch (error) {
                console.warn('圖表銷毀失敗:', error);
            }
            this.chartInstances.delete(chartId);
        }
        
        // 移除ResizeObserver
        const resizeObserver = this.resizeObservers.get(chartId);
        if (resizeObserver) {
            resizeObserver.disconnect();
            this.resizeObservers.delete(chartId);
        }
        
        // 從狀態中移除
        this.state.charts = this.state.charts.filter(chart => chart.id !== chartId);
        
        this.renderCharts();
        this.updateChartCount();
        this.showSuccess('圖表已刪除');
    }

    /**
     * 創建圖表卡片 - 改善尺寸版
     */
    createChartCard(chart) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('grid-stack-item');
        wrapper.setAttribute('gs-x', chart.x || 0);
        wrapper.setAttribute('gs-y', chart.y || 0);
        wrapper.setAttribute('gs-w', chart.w || 4);   // 預設寬度
        wrapper.setAttribute('gs-h', chart.h || 4);   // 預設高度（增加）

        const content = document.createElement('div');
        content.classList.add('grid-stack-item-content');
        const card = document.createElement('div');
        card.className = 'chart-card';
        card.setAttribute('data-chart-id', chart.id.toString());
        card.id = `chart-${chart.id}`;

        const chartInfo = this.getChartInfo(chart.type);

        // 根據圖表引擎添加不同的標識
        const engineBadge = chart.config.engine === 'plotly' ? ' 🚀' : '';

        card.innerHTML = `
            <div class="chart-header">
                <div class="chart-title">${chartInfo.icon} ${chart.title}${engineBadge}</div>
                <div class="chart-actions">
                    <button class="icon-btn" onclick="app.customizeChart('${chart.id}')" title="自定義">⚙️</button>
                    <button class="icon-btn" onclick="app.duplicateChart('${chart.id}')" title="複製">📋</button>
                    <button class="icon-btn" onclick="app.deleteChart('${chart.id}')" title="刪除">🗑️</button>
                </div>
            </div>
            <div class="chart-content">
                <div class="chart-canvas-container" id="chart-canvas-${chart.id}">
                    <div class="loading-placeholder">
                        <div class="loading-spinner"></div>
                        <div>渲染中...</div>
                    </div>
                </div>
            </div>
        `;

        wrapper.appendChild(content);
        content.appendChild(card);
        return wrapper;
    }

    /**
     * 渲染錯誤狀態
     */
    renderErrorState(container, errorMessage) {
        container.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; 
                        height: 100%; color: #666; flex-direction: column; text-align: center;
                        min-height: 200px; padding: 20px;">
                <div style="font-size: 3rem; margin-bottom: 10px;">⚠️</div>
                <div style="font-weight: 600; margin-bottom: 8px;">圖表渲染失敗</div>
                <div style="font-size: 0.9rem; color: #999; max-width: 300px; line-height: 1.4;">
                    ${errorMessage}
                </div>
                <button onclick="app.retryChart ? app.retryChart('${chart.id}') : location.reload()" 
                        style="margin-top: 15px; padding: 8px 16px; 
                            background: #1976d2; color: white; border: none; 
                            border-radius: 6px; cursor: pointer;">
                    重新嘗試
                </button>
            </div>
        `;
    }

    /**
     * 渲染圖表選擇器 - 改善版
     */
    renderChartSelector() {
        const chartGrid = document.getElementById('chartGrid');
        chartGrid.innerHTML = '';
        
        // 獲取可用圖表
        const availableCharts = window.chartGenerator.getAvailableChartsByCategory();
        const currentCharts = availableCharts[this.state.currentTab] || {};
        
        // 檢查引擎可用性
        const engineAvailability = window.chartGenerator.checkEngineAvailability();
        
        Object.entries(currentCharts).forEach(([key, chart]) => {
            const button = document.createElement('button');
            button.className = 'chart-btn';
            
            // 檢查是否可用
            let isEnabled = this.state.analysisResult;
            let disabledReason = '';
            
            if (chart.engine === 'plotly' && !engineAvailability.plotly) {
                isEnabled = false;
                disabledReason = 'Plotly.js 未載入';
            } else if (chart.engine === 'plotly' && !engineAvailability.plotlyGenerator) {
                isEnabled = false;
                disabledReason = 'PlotlyChartGenerator 未載入';
            } else if (chart.engine === 'chartjs' && !engineAvailability.chartjs) {
                isEnabled = false;
                disabledReason = 'Chart.js 未載入';
            }
            
            button.disabled = !isEnabled;
            if (disabledReason) {
                button.title = disabledReason;
            }
            
            // 根據圖表類型設定圖標
            const icons = {
                // Chart.js 圖表
                bar: '📊', line: '📈', pie: '🥧', scatter: '⚫', doughnut: '🍩',
                area: '🏔️', radar: '🕸️', polar: '🎯', bubble: '🫧', histogram: '📊',
                
                // Plotly.js 圖表
                sankey: '🌊', waterfall: '💧', funnel: '🏺', treemap: '🌳',
                boxplot: '📦', violin: '🎻', heatmap: '🔥', parallel: '🔗',
                scatter3d: '🎲', gauge: '⏲️', kpi: '📋'
            };
            
            // 添加引擎標識
            const engineBadge = chart.engine === 'plotly' ? ' 🚀' : '';
            
            button.innerHTML = `
                <span class="chart-icon">${icons[key] || '📊'}</span>
                ${chart.name}${engineBadge}
            `;
            
            button.onclick = () => this.generateChart(key);
            chartGrid.appendChild(button);
        });
        
        // 在控制台顯示引擎狀態
        console.log('📈 Chart.js:', engineAvailability.chartjs ? '✅' : '❌');
        console.log('🚀 Plotly.js:', engineAvailability.plotly ? '✅' : '❌');
        console.log('🔧 PlotlyGenerator:', engineAvailability.plotlyGenerator ? '✅' : '❌');
    }

    /**
     * 顯示載入狀態
     */
    showLoading(message = '載入中...') {
        console.log('🔄', message);
        // 你可以在這裡添加 UI 載入指示器
    }

    /**
     * 隱藏載入狀態
     */
    hideLoading() {
        console.log('✅ 載入完成');
    }

    /**
     * 生成圖表 - 修復版
     */
    async generateChart(chartType, customOptions = {}) {
        if (!this.state.analysisResult) {
            this.showError('請先上傳數據檔案');
            return;
        }

        try {
            // 驗證圖表可行性
            const validation = window.chartGenerator.validateChartViability(
                this.getCurrentData(),
                chartType,
                this.getCurrentAnalysis()
            );

            if (!validation.valid) {
                this.showError(validation.reason);
                return;
            }

            // 檢查引擎可用性
            const engineCheck = window.chartGenerator.checkEngineAvailability();
            const chartInfo = window.chartGenerator.chartTypes[chartType];
            
            if (chartInfo.engine === 'plotly' && !engineCheck.plotly) {
                this.showError('Plotly.js 未載入，無法生成此圖表');
                return;
            }

            // 顯示載入狀態
            this.showLoading(`正在生成 ${chartInfo.name}...`);

            // 生成圖表配置
            const chartConfig = await window.chartGenerator.generateChart({
                data: this.getCurrentData(),
                chartType: chartType,
                analysis: this.getCurrentAnalysis(),
                customOptions: customOptions
            });

            // 創建圖表物件，預設較大的尺寸
            const chart = {
                id: Date.now() + Math.random(),
                type: chartType,
                config: chartConfig,
                title: customOptions.title || chartInfo.name,
                createdAt: new Date(),
                customOptions: customOptions,
                // 設定預設較大的尺寸
                w: chartInfo.engine === 'plotly' ? 6 : 4,  // Plotly 圖表預設更寬
                h: chartInfo.engine === 'plotly' ? 5 : 4   // Plotly 圖表預設更高
            };

            this.state.charts.push(chart);
            this.renderCharts();
            this.updateChartCount();
            
            // 延遲渲染真實圖表
            setTimeout(() => this.renderRealChart(chart), 100);
            
            this.hideLoading();
            this.showSuccess(`已生成 ${chartInfo.name}`);
            
        } catch (error) {
            console.error('圖表生成錯誤:', error);
            this.hideLoading();
            this.showError('圖表生成失敗: ' + error.message);
        }
    }

    /**
     * 刪除圖表 - 更新版本
     */
    deleteChart(chartId) {
        // 銷毀圖表實例
        const chartInstance = this.chartInstances.get(chartId);
        if (chartInstance) {
            if (chartInstance.type === 'plotly') {
                // 清理 Plotly 圖表
                Plotly.purge(chartInstance.element);
            } else {
                // 清理 Chart.js 圖表
                chartInstance.destroy();
            }
            this.chartInstances.delete(chartId);
        }
        
        // 移除ResizeObserver
        const resizeObserver = this.resizeObservers.get(chartId);
        if (resizeObserver) {
            resizeObserver.disconnect();
            this.resizeObservers.delete(chartId);
        }
        
        // 從狀態中移除
        this.state.charts = this.state.charts.filter(chart => chart.id !== chartId);
        
        this.renderCharts();
        this.updateChartCount();
        this.showSuccess('圖表已刪除');
    }

    /**
     * 顯示載入狀態
     */
    showLoading(message = '載入中...') {
        // 你可以添加一個全域載入指示器
        console.log('🔄', message);
    }

    /**
     * 隱藏載入狀態
     */
    hideLoading() {
        console.log('✅ 載入完成');
    }

    /**
     * 渲染圖表選擇器 - 更新版本
     * 替換你現有的 renderChartSelector 方法
     */
    renderChartSelector() {
        const chartGrid = document.getElementById('chartGrid');
        chartGrid.innerHTML = '';
        
        // 獲取可用圖表（根據引擎可用性過濾）
        const availableCharts = window.chartGenerator.getAvailableChartsByCategory();
        const currentCharts = availableCharts[this.state.currentTab] || {};
        
        // 檢查引擎可用性
        const engineAvailability = window.chartGenerator.checkEngineAvailability();
        
        Object.entries(currentCharts).forEach(([key, chart]) => {
            const button = document.createElement('button');
            button.className = 'chart-btn';
            
            // 檢查是否可用
            let isEnabled = this.state.analysisResult;
            let disabledReason = '';
            
            if (chart.engine === 'plotly' && !engineAvailability.plotly) {
                isEnabled = false;
                disabledReason = 'Plotly.js 未載入';
            } else if (chart.engine === 'plotly' && !engineAvailability.plotlyGenerator) {
                isEnabled = false;
                disabledReason = 'PlotlyChartGenerator 未載入';
            } else if (chart.engine === 'chartjs' && !engineAvailability.chartjs) {
                isEnabled = false;
                disabledReason = 'Chart.js 未載入';
            }
            
            button.disabled = !isEnabled;
            if (disabledReason) {
                button.title = disabledReason;
            }
            
            // 根據圖表類型設定圖標
            const icons = {
                // Chart.js 圖表
                bar: '📊', line: '📈', pie: '🥧', scatter: '⚫', doughnut: '🍩',
                area: '🏔️', radar: '🕸️', polar: '🎯', bubble: '🫧', histogram: '📊',
                
                // Plotly.js 圖表
                sankey: '🌊', waterfall: '💧', funnel: '🏺', treemap: '🌳',
                boxplot: '📦', violin: '🎻', heatmap: '🔥', parallel: '🔗',
                scatter3d: '🎲', gauge: '⏲️', kpi: '📋'
            };
            
            // 添加引擎標識
            const engineBadge = chart.engine === 'plotly' ? ' 🚀' : '';
            
            button.innerHTML = `
                <span class="chart-icon">${icons[key] || '📊'}</span>
                ${chart.name}${engineBadge}
            `;
            
            button.onclick = () => this.generateChart(key);
            chartGrid.appendChild(button);
        });
        
        // 添加引擎狀態顯示
        this.displayEngineStatus(engineAvailability);
    }

    /**
     * 顯示引擎狀態
     */
    displayEngineStatus(availability) {
        // 你可以在 UI 中添加引擎狀態顯示
        console.log('📈 Chart.js:', availability.chartjs ? '✅' : '❌');
        console.log('🚀 Plotly.js:', availability.plotly ? '✅' : '❌');
        console.log('🔧 PlotlyGenerator:', availability.plotlyGenerator ? '✅' : '❌');
    }

    /**
     * 設定圖表大小調整
     */
    setupChartResizing(chart) {
        const chartCard = document.getElementById(`chart-${chart.id}`);
        if (!chartCard) return;
        
        // 創建 ResizeObserver
        const resizeObserver = new ResizeObserver(entries => {
            const chartInstance = this.chartInstances.get(chart.id);
            if (chartInstance) {
                // 延遲調整以避免頻繁重繪
                clearTimeout(chart.resizeTimeout);
                chart.resizeTimeout = setTimeout(() => {
                    this.resizeChart(chart);
                }, 100);
            }
        });
        
        resizeObserver.observe(chartCard);
        this.resizeObservers.set(chart.id, resizeObserver);
        
        // 添加互動提示
        const hint = document.createElement('div');
        hint.className = 'interaction-hint';
        hint.textContent = '可調整大小和互動';
        chartCard.appendChild(hint);
    }

    /**
     * 添加圖表互動性
     */
    addChartInteractivity(chart, chartInstance) {
        // 原有的基本互動設定
        chartInstance.options.onClick = (event, elements) => {
            if (elements.length > 0) {
                const element = elements[0];
                const dataIndex = element.index;
                const datasetIndex = element.datasetIndex;
                
                const data = chartInstance.data;
                const label = data.labels[dataIndex];
                const value = data.datasets[datasetIndex].data[dataIndex];
                const datasetLabel = data.datasets[datasetIndex].label;
                
                // 使用增強版的點擊處理方法
                this.handleChartClick(chart, {
                    label,
                    value,
                    datasetLabel,
                    dataIndex,
                    datasetIndex
                });
            }
        };

        chartInstance.options.onHover = (event, elements) => {
            event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
            
            // 添加懸停時的視覺反饋
            if (this.state.crossFilterEnabled && elements.length > 0) {
                this.showInteractionHint(chart, elements[0]);
            }
        };

        // 當滑鼠離開時清除提示
        chartInstance.options.onLeave = () => {
            this.hideInteractionHint(chart);
        };
    }

    /**
     * 顯示互動提示
     */
    showInteractionHint(chart, element) {
        const chartCard = document.getElementById(`chart-${chart.id}`);
        if (!chartCard) return;

        let hint = chartCard.querySelector('.chart-interactive-hint');
        if (!hint) {
            hint = document.createElement('div');
            hint.className = 'chart-interactive-hint';
            chartCard.appendChild(hint);
        }

        const analysis = this.getCurrentAnalysis();
        const filterField = this.detectFilterField(chart, { label: element.label });
        
        if (filterField) {
            hint.innerHTML = `
                <div>🔗 點擊篩選</div>
                <div style="font-size: 10px; margin-top: 2px;">
                    將以 ${filterField} 為條件<br>
                    篩選其他圖表
                </div>
            `;
            hint.style.opacity = '1';
        }
    }

    /**
     * 隱藏互動提示
     */
    hideInteractionHint(chart) {
        const chartCard = document.getElementById(`chart-${chart.id}`);
        if (!chartCard) return;

        const hint = chartCard.querySelector('.chart-interactive-hint');
        if (hint) {
            hint.style.opacity = '0';
        }
    }


    /**
     * 處理圖表點擊事件
     */
    handleChartClick(sourceChart, clickData) {
        console.log('🎯 圖表聯動點擊:', sourceChart.type, clickData);

        if (!this.state.crossFilterEnabled) {
            this.showSuccess(`點擊了 ${clickData.label}: ${clickData.value}`);
            return;
        }

        // 檢測點擊的數據是什麼類型的欄位
        const filterField = this.detectFilterField(sourceChart, clickData);
        if (!filterField) {
            this.showSuccess('此數據點無法用於篩選');
            return;
        }

        const filterValue = clickData.label || clickData.value;
        
        // 切換篩選狀態
        this.toggleGlobalFilter(filterField, filterValue);
        
        // 應用篩選到所有圖表
        this.applyGlobalFiltersToAllCharts();
        
        // 更新篩選UI顯示
        this.updateFilterDisplay();
        
        this.showSuccess(`${this.state.globalFilters.has(filterField) ? '已篩選' : '已取消篩選'}: ${filterField} = ${filterValue}`);
    }

    /**
     * 檢測點擊的數據對應的篩選欄位
     */
    detectFilterField(chart, clickData) {
        const analysis = this.getCurrentAnalysis();
        if (!analysis) return null;

        // 根據圖表類型推斷篩選欄位
        switch (chart.type) {
            case 'bar':
            case 'pie':
            case 'doughnut':
                // 長條圖、圓餅圖通常是類別欄位
                return analysis.欄位分析.類別欄位[0] || null;
            
            case 'line':
            case 'area':
                // 線圖通常是時間欄位
                return analysis.欄位分析.時間欄位[0] || analysis.欄位分析.類別欄位[0] || null;
            
            case 'scatter':
            case 'bubble':
                // 散佈圖可能需要更複雜的邏輯
                if (clickData.categoryField) {
                    return clickData.categoryField;
                }
                return analysis.欄位分析.類別欄位[0] || null;
            
            default:
                return analysis.欄位分析.類別欄位[0] || null;
        }
    }

    /**
     * 切換全局篩選條件
     */
    toggleGlobalFilter(field, value) {
        if (!field || value === undefined || value === null) return;

        const stringValue = String(value);
        
        if (this.state.globalFilters.has(field)) {
            const currentValues = this.state.globalFilters.get(field);
            const index = currentValues.indexOf(stringValue);
            
            if (index > -1) {
                // 移除篩選值
                currentValues.splice(index, 1);
                if (currentValues.length === 0) {
                    this.state.globalFilters.delete(field);
                }
            } else {
                // 添加篩選值
                currentValues.push(stringValue);
            }
        } else {
            // 創建新的篩選條件
            this.state.globalFilters.set(field, [stringValue]);
        }
    }

    /**
     * 應用全局篩選到所有圖表
     */
    applyGlobalFiltersToAllCharts() {
        this.state.charts.forEach(chart => {
            this.applyFiltersToChart(chart);
        });
    }

    /**
     * 對單個圖表應用篩選效果
     */
    applyFiltersToChart(chart) {
        const chartInstance = this.chartInstances.get(chart.id);
        if (!chartInstance) return;

        try {
            if (chartInstance.type === 'chartjs') {
                this.applyFiltersToChartJS(chart, chartInstance);
            } else if (chartInstance.type === 'plotly') {
                this.applyFiltersToPlotly(chart, chartInstance);
            }
        } catch (error) {
            console.warn('應用篩選失敗:', error);
        }
    }

    /**
     * 對 Chart.js 圖表應用篩選效果
     */
    applyFiltersToChartJS(chart, chartInstance) {
        const config = chartInstance.instance.config;
        const originalData = chart.config.config.data;
        
        if (!originalData) return;

        // 複製原始數據
        const filteredData = JSON.parse(JSON.stringify(originalData));
        
        // 應用篩選效果
        if (this.state.globalFilters.size > 0) {
            this.applyChartJSFilterEffects(filteredData, chart);
        }
        
        // 更新圖表數據
        chartInstance.instance.data = filteredData;
        chartInstance.instance.update('none'); // 不使用動畫以提高性能
    }

    /**
     * 應用 Chart.js 篩選視覺效果
     */
    applyChartJSFilterEffects(data, chart) {
        const currentData = this.getCurrentData();
        const analysis = this.getCurrentAnalysis();
        
        if (!currentData || !analysis) return;

        // 根據圖表類型應用不同的篩選邏輯
        switch (chart.type) {
            case 'bar':
            case 'pie':
            case 'doughnut':
                this.applyFiltersToCategoricalChart(data, chart);
                break;
            case 'line':
            case 'area':
                this.applyFiltersToTimeSeriesChart(data, chart);
                break;
            case 'scatter':
            case 'bubble':
                this.applyFiltersToScatterChart(data, chart);
                break;
        }
    }

    /**
     * 對類別圖表應用篩選
     */
    applyFiltersToCategoricalChart(data, chart) {
        const analysis = this.getCurrentAnalysis();
        
        // 檢查多個可能的篩選欄位
        const possibleFields = [
            ...analysis.欄位分析.類別欄位,
            ...analysis.欄位分析.時間欄位
        ];

        let applied = false;
        
        for (const field of possibleFields) {
            if (this.state.globalFilters.has(field)) {
                const activeFilters = this.state.globalFilters.get(field);
                
                // 修改背景色透明度來突出顯示篩選的數據
                if (data.datasets && data.datasets[0] && data.datasets[0].backgroundColor) {
                    const colors = data.datasets[0].backgroundColor;
                    const highlightedColors = [];

                    data.labels.forEach((label, index) => {
                        const isHighlighted = activeFilters.includes(String(label));
                        if (Array.isArray(colors)) {
                            const originalColor = colors[index] || '#3498db';
                            highlightedColors.push(
                                isHighlighted ? originalColor : this.adjustOpacity(originalColor, 0.2)
                            );
                        } else {
                            highlightedColors.push(
                                isHighlighted ? colors : this.adjustOpacity(colors, 0.2)
                            );
                        }
                    });

                    data.datasets[0].backgroundColor = highlightedColors;
                    
                    // 調整邊框以提供更好的視覺反饋
                    if (data.datasets[0].borderColor) {
                        data.datasets[0].borderColor = highlightedColors.map((color, index) => {
                            const isHighlighted = activeFilters.includes(String(data.labels[index]));
                            return isHighlighted ? '#1976d2' : this.adjustOpacity(color, 0.5);
                        });
                        data.datasets[0].borderWidth = highlightedColors.map((color, index) => {
                            const isHighlighted = activeFilters.includes(String(data.labels[index]));
                            return isHighlighted ? 3 : 1;
                        });
                    }
                    
                    applied = true;
                    break;
                }
            }
        }

        // 如果沒有應用任何篩選，恢復原始樣式
        if (!applied && this.state.globalFilters.size > 0) {
            this.restoreOriginalChartStyle(data, chart);
        }
    }

    /**
     * 恢復圖表原始樣式
     */
    restoreOriginalChartStyle(data, chart) {
        if (chart.config && chart.config.config && chart.config.config.data) {
            const originalData = chart.config.config.data;
            if (originalData.datasets && originalData.datasets[0]) {
                if (data.datasets && data.datasets[0]) {
                    data.datasets[0].backgroundColor = originalData.datasets[0].backgroundColor;
                    data.datasets[0].borderColor = originalData.datasets[0].borderColor;
                    data.datasets[0].borderWidth = originalData.datasets[0].borderWidth || 1;
                }
            }
        }
    }

    /**
     * 篩選狀態持久化
     */
    saveFilterState() {
        const filterState = {};
        this.state.globalFilters.forEach((values, key) => {
            filterState[key] = values;
        });
        
        try {
            sessionStorage.setItem('chartFilters', JSON.stringify(filterState));
        } catch (error) {
            console.warn('無法保存篩選狀態:', error);
        }
    }

    /**
     * 恢復篩選狀態
     */
    restoreFilterState() {
        try {
            const saved = sessionStorage.getItem('chartFilters');
            if (saved) {
                const filterState = JSON.parse(saved);
                Object.entries(filterState).forEach(([key, values]) => {
                    this.state.globalFilters.set(key, values);
                });
                
                if (this.state.globalFilters.size > 0) {
                    this.applyGlobalFiltersToAllCharts();
                    this.updateFilterDisplay();
                }
            }
        } catch (error) {
            console.warn('無法恢復篩選狀態:', error);
        }
    }

    /**
     * 篩選效能優化 - 批量更新
     */
    batchUpdateCharts() {
        // 暫停所有圖表的動畫
        this.chartInstances.forEach((chartInstance, chartId) => {
            if (chartInstance.type === 'chartjs' && chartInstance.instance) {
                chartInstance.instance.options.animation = false;
            }
        });

        // 應用篩選
        this.applyGlobalFiltersToAllCharts();

        // 恢復動畫（延遲執行）
        setTimeout(() => {
            this.chartInstances.forEach((chartInstance, chartId) => {
                if (chartInstance.type === 'chartjs' && chartInstance.instance) {
                    chartInstance.instance.options.animation = {
                        duration: 300,
                        easing: 'easeInOutQuart'
                    };
                }
            });
        }, 100);
    }

    /**
     * 導出篩選報告
     */
    exportFilterReport() {
        if (this.state.globalFilters.size === 0) {
            this.showError('沒有篩選條件可以導出');
            return;
        }

        const report = {
            timestamp: new Date().toISOString(),
            filters: {},
            affectedCharts: this.state.charts.length,
            dataSize: this.getCurrentData().length
        };

        this.state.globalFilters.forEach((values, key) => {
            report.filters[key] = values;
        });

        // 簡單的文字報告
        let reportText = `圖表篩選報告\n`;
        reportText += `時間: ${new Date().toLocaleString()}\n`;
        reportText += `篩選條件:\n`;
        
        Object.entries(report.filters).forEach(([field, values]) => {
            reportText += `  ${field}: ${values.join(', ')}\n`;
        });
        
        reportText += `\n影響圖表數量: ${report.affectedCharts}\n`;
        reportText += `篩選後數據量: ${report.dataSize} 筆\n`;

        // 下載報告
        const blob = new Blob([reportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chart_filter_report_${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);

        this.showSuccess('篩選報告已下載');
    }

    /**
     * 對時間序列圖表應用篩選
     */
    applyFiltersToTimeSeriesChart(data, chart) {
        // 時間序列圖表的篩選邏輯 - 可以根據需要實現
        // 例如：根據時間範圍篩選，或根據類別高亮某些時間段
        console.log('時間序列圖表篩選暫未實現');
    }

    /**
     * 對散佈圖應用篩選
     */
    applyFiltersToScatterChart(data, chart) {
        // 散佈圖的篩選邏輯 - 可以根據顏色分組等實現
        console.log('散佈圖篩選暫未實現');
    }

    /**
     * 對 Plotly.js 圖表應用篩選效果
     */
    applyFiltersToPlotly(chart, chartInstance) {
        if (!chartInstance.element || typeof Plotly === 'undefined') return;

        try {
            // 獲取原始數據
            const plotlyDiv = chartInstance.element;
            const originalData = chart.config.data;
            
            if (!originalData || !Array.isArray(originalData)) return;

            // 創建篩選後的數據
            const filteredData = this.createFilteredPlotlyData(originalData, chart);
            
            // 更新 Plotly 圖表
            Plotly.restyle(plotlyDiv, filteredData);
        } catch (error) {
            console.warn('Plotly 篩選更新失敗:', error);
        }
    }

    /**
     * 創建篩選後的 Plotly 數據
     */
    createFilteredPlotlyData(originalData, chart) {
        const updates = {};
        
        // 根據圖表類型處理不同的篩選邏輯
        switch (chart.type) {
            case 'sankey':
                // 桑基圖篩選邏輯
                break;
            case 'treemap':
                // 樹狀圖篩選邏輯
                break;
            case 'heatmap':
                // 熱力圖篩選邏輯
                break;
            default:
                // 通用篩選邏輯
                if (this.state.globalFilters.size > 0) {
                    updates.opacity = this.calculatePlotlyOpacity(originalData, chart);
                }
        }
        
        return updates;
    }

    /**
     * 計算 Plotly 圖表的透明度陣列
     */
    calculatePlotlyOpacity(data, chart) {
        // 根據篩選條件返回透明度陣列
        // 被篩選的數據透明度為 1.0，未被篩選的為 0.3
        if (!data[0] || !data[0].x) return 1.0;
        
        const analysis = this.getCurrentAnalysis();
        const categoryField = analysis.欄位分析.類別欄位[0];
        
        if (!categoryField || !this.state.globalFilters.has(categoryField)) {
            return 1.0; // 無篩選時全部正常顯示
        }

        const activeFilters = this.state.globalFilters.get(categoryField);
        const opacityArray = [];

        // 根據數據點是否在篩選範圍內設定透明度
        if (data[0].x && Array.isArray(data[0].x)) {
            data[0].x.forEach((value, index) => {
                const isHighlighted = activeFilters.includes(String(value));
                opacityArray.push(isHighlighted ? 1.0 : 0.3);
            });
        }

        return opacityArray.length > 0 ? opacityArray : 1.0;
    }

    /**
     * 更新篩選條件顯示UI
     */
    updateFilterDisplay() {
        // 檢查是否存在篩選顯示區域，如果不存在則創建
        let filterDisplay = document.getElementById('activeFiltersDisplay');
        if (!filterDisplay) {
            filterDisplay = this.createFilterDisplayElement();
        }

        if (this.state.globalFilters.size === 0) {
            filterDisplay.style.display = 'none';
            return;
        }

        filterDisplay.style.display = 'block';
        
        let filtersHTML = '<h4>🔍 作用中的篩選條件</h4>';
        filtersHTML += '<div class="filter-chips">';
        
        this.state.globalFilters.forEach((values, field) => {
            values.forEach(value => {
                filtersHTML += `
                    <div class="filter-chip" data-field="${field}" data-value="${value}">
                        <span>${field}: ${value}</span>
                        <button class="filter-chip-remove" onclick="app.removeGlobalFilter('${field}', '${value}')">×</button>
                    </div>
                `;
            });
        });
        
        filtersHTML += `
            <button class="clear-all-filters-btn" onclick="app.clearAllGlobalFilters()">
                清除所有篩選
            </button>
        `;
        filtersHTML += '</div>';
        
        filterDisplay.innerHTML = filtersHTML;
    }

    /**
     * 創建篩選顯示元素
     */
    createFilterDisplayElement() {
        const filterDisplay = document.createElement('div');
        filterDisplay.id = 'activeFiltersDisplay';
        filterDisplay.className = 'glass-card filter-display';
        filterDisplay.style.display = 'none';
        
        // 插入到儀表板區域前面
        const dashboardArea = document.querySelector('.dashboard-area');
        dashboardArea.parentNode.insertBefore(filterDisplay, dashboardArea);
        
        return filterDisplay;
    }

    /**
     * 移除單個全局篩選條件
     */
    removeGlobalFilter(field, value) {
        if (!this.state.globalFilters.has(field)) return;
        
        const values = this.state.globalFilters.get(field);
        const index = values.indexOf(value);
        
        if (index > -1) {
            values.splice(index, 1);
            if (values.length === 0) {
                this.state.globalFilters.delete(field);
            }
        }
        
        this.applyGlobalFiltersToAllCharts();
        this.updateFilterDisplay();
        this.showSuccess(`已移除篩選: ${field} = ${value}`);
    }

    /**
     * 清除所有全局篩選條件
     */
    clearAllGlobalFilters() {
        this.state.globalFilters.clear();
        this.applyGlobalFiltersToAllCharts();
        this.updateFilterDisplay();
        this.showSuccess('已清除所有篩選條件');
    }

    /**
     * 切換圖表聯動功能
     */
    toggleCrossFilter() {
        this.state.crossFilterEnabled = !this.state.crossFilterEnabled;
        
        const toggleBtn = document.getElementById('crossFilterToggle');
        if (toggleBtn) {
            toggleBtn.textContent = this.state.crossFilterEnabled ? '🔗' : '🔗❌';
            toggleBtn.title = this.state.crossFilterEnabled ? '關閉圖表聯動' : '開啟圖表聯動';
        }
        
        if (!this.state.crossFilterEnabled) {
            this.clearAllGlobalFilters();
        }
        
        this.showSuccess(`圖表聯動已${this.state.crossFilterEnabled ? '開啟' : '關閉'}`);
    }

    // ==========================================
    // 輔助方法
    // ==========================================

    /**
     * 調整顏色透明度
     */
    adjustOpacity(color, opacity) {
        if (color.startsWith('rgba')) {
            return color.replace(/[\d.]+\)$/g, `${opacity})`);
        } else if (color.startsWith('rgb')) {
            return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
        } else if (color.startsWith('#')) {
            const hex = color.slice(1);
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        return color;
    }

    /**
     * 渲染圖表選擇器
     */
    renderChartSelector() {
        const chartGrid = document.getElementById('chartGrid');
        chartGrid.innerHTML = '';
        
        const currentCharts = window.chartGenerator.chartTypes;
        const categoryCharts = Object.entries(currentCharts)
            .filter(([key, chart]) => chart.category === this.state.currentTab);
        
        categoryCharts.forEach(([key, chart]) => {
            const button = document.createElement('button');
            button.className = 'chart-btn';
            button.disabled = !this.state.analysisResult;
            
            // 根據圖表類型設定圖標
            const icons = {
                bar: '📊', line: '📈', pie: '🥧', scatter: '⚫', doughnut: '🍩',
                area: '🏔️', radar: '🕸️', polar: '🎯', bubble: '🫧', heatmap: '🔥',
                histogram: '📊', boxplot: '📦', gauge: '⏲️', funnel: '🏺',
                sankey: '🌊', treemap: '🌳', bullet: '🎯', kpi: '📋'
            };
            
            button.innerHTML = `
                <span class="chart-icon">${icons[key] || '📊'}</span>
                ${chart.name}
            `;
            
            button.onclick = () => this.generateChart(key);
            chartGrid.appendChild(button);
        });
    }

    /**
     * 渲染圖表
     */
    renderCharts() {
        const gridEl = document.getElementById('chartsGrid');
        const emptyState = document.getElementById('emptyState');
        if (this.state.charts.length === 0) {
            gridEl.style.display = 'none';
            emptyState.style.display = 'flex';
            return;
        }
        emptyState.style.display = 'none';
        gridEl.style.display = 'grid';

        // 清除所有舊 widget
        this.grid.removeAll();
        // 重新加入所有卡片並渲染
        this.state.charts.forEach(chart => {
            const cardEl = this.createChartCard(chart);
            this.grid.addWidget(cardEl);
            this.renderRealChart(chart);
        });
    }

    /**
     * 創建圖表卡片
     */
    createChartCard(chart) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('grid-stack-item');
        wrapper.setAttribute('gs-x', chart.x || 0);
        wrapper.setAttribute('gs-y', chart.y || 0);
        wrapper.setAttribute('gs-w', chart.w || 4);
        wrapper.setAttribute('gs-h', chart.h || 3);

        const content = document.createElement('div');
        content.classList.add('grid-stack-item-content');
        const card = document.createElement('div');
        card.className = 'chart-card';
        card.setAttribute('data-chart-id', chart.id.toString());
        card.id = `chart-${chart.id}`;

        const chartInfo = this.getChartInfo(chart.type);

        card.innerHTML = `
            <div class="chart-header">
                <div class="chart-title">${chartInfo.icon} ${chart.title}</div>
                <div class="chart-actions">
                    <button class="icon-btn" onclick="app.customizeChart('${chart.id}')" title="自定義">⚙️</button>
                    <button class="icon-btn" onclick="app.duplicateChart('${chart.id}')" title="複製">📋</button>
                    <button class="icon-btn" onclick="app.deleteChart('${chart.id}')" title="刪除">🗑️</button>
                </div>
            </div>
            <div class="chart-content">
                <div class="chart-canvas-container" id="chart-canvas-${chart.id}">
                    <div class="loading-placeholder">
                        <div class="loading-spinner"></div>
                        <div>渲染中...</div>
                    </div>
                </div>
            </div>
        `;

        wrapper.appendChild(content);
        content.appendChild(card);
        return wrapper;
    }

    /**
     * 獲取圖表信息
     */
    getChartInfo(chartType) {
        const icons = {
            bar: '📊', line: '📈', pie: '🥧', scatter: '⚫', doughnut: '🍩',
            area: '🏔️', radar: '🕸️', polar: '🎯', bubble: '🫧', heatmap: '🔥',
            histogram: '📊', boxplot: '📦', gauge: '⏲️', funnel: '🏺',
            sankey: '🌊', treemap: '🌳', bullet: '🎯', kpi: '📋'
        };
        
        const chartInfo = window.chartGenerator.chartTypes[chartType];
        return {
            name: chartInfo?.name || chartType,
            icon: icons[chartType] || '📊',
            category: chartInfo?.category || 'basic'
        };
    }

    /**
     * 獲取圖表名稱
     */
    getChartName(chartType) {
        return this.getChartInfo(chartType).name;
    }

    // ==========================================
    // UI 操作方法
    // ==========================================

    /**
     * 切換圖表標籤頁
     */
    switchTab(tab) {
        this.state.currentTab = tab;
        
        document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        
        this.renderChartSelector();
    }

    /**
     * 切換自定義標籤頁
     */
    switchCustomTab(tab) {
        document.querySelectorAll('.custom-tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('custom-tab');
        
        document.querySelectorAll('.custom-content').forEach(content => {
            content.style.display = 'none';
        });
        
        if (tab === 'visual') {
            document.getElementById('visualSettings').style.display = 'block';
        } else if (tab === 'data') {
            document.getElementById('dataSettings').style.display = 'block';
        }
    }

    /**
     * 刪除圖表
     */
    deleteChart(chartId) {
        // 銷毀Chart.js實例
        const chartInstance = this.chartInstances.get(chartId);
        if (chartInstance) {
            chartInstance.destroy();
            this.chartInstances.delete(chartId);
        }
        
        // 移除ResizeObserver
        const resizeObserver = this.resizeObservers.get(chartId);
        if (resizeObserver) {
            resizeObserver.disconnect();
            this.resizeObservers.delete(chartId);
        }
        
        // 從狀態中移除
        this.state.charts = this.state.charts.filter(chart => chart.id !== chartId);
        
        this.renderCharts();
        this.updateChartCount();
        this.showSuccess('圖表已刪除');
    }

    /**
     * 複製圖表
     */
    duplicateChart(chartId) {
        const originalChart = this.state.charts.find(chart => chart.id === chartId);
        if (!originalChart) return;
        
        const newChart = {
            ...originalChart,
            id: Date.now() + Math.random(),
            title: originalChart.title + ' (副本)',
            createdAt: new Date()
        };
        
        this.state.charts.push(newChart);
        this.renderCharts();
        this.updateChartCount();
        
        setTimeout(() => this.renderRealChart(newChart), 100);
        
        this.showSuccess('圖表已複製');
    }

    /**
     * 自定義圖表
     */
    customizeChart(chartId) {
        const chart = this.state.charts.find(c => c.id === chartId);
        if (!chart) return;
        
        this.state.selectedChart = chart;
        
        // 填充現有設定
        document.getElementById('chartTitleInput').value = chart.title;
        document.getElementById('colorThemeSelect').value = chart.customOptions?.colorScheme || 'default';
        document.getElementById('opacitySlider').value = chart.customOptions?.opacity || 0.8;
        document.getElementById('opacityValue').textContent = Math.round((chart.customOptions?.opacity || 0.8) * 100) + '%';
        
        // 填充欄位選項
        this.populateColumnSelects();
        
        // 顯示模態框
        document.getElementById('customizationModal').classList.add('show');
    }

    /**
     * 填充欄位選擇器
     */
    populateColumnSelects() {
        if (!this.state.analysisResult) return;
        
        const columns = this.state.analysisResult.基本信息.欄位列表;
        const xAxisSelect = document.getElementById('xAxisSelect');
        const yAxisSelect = document.getElementById('yAxisSelect');
        
        [xAxisSelect, yAxisSelect].forEach(select => {
            select.innerHTML = '';
            columns.forEach(column => {
                const option = document.createElement('option');
                option.value = column;
                option.textContent = column;
                select.appendChild(option);
            });
        });
    }

    /**
     * 套用自定義設定
     */
    applyCustomization() {
        if (!this.state.selectedChart) return;
        
        const newTitle = document.getElementById('chartTitleInput').value;
        const colorScheme = document.getElementById('colorThemeSelect').value;
        const opacity = parseFloat(document.getElementById('opacitySlider').value);
        const xColumn = document.getElementById('xAxisSelect').value;
        const yColumn = document.getElementById('yAxisSelect').value;
        const showLabels = document.getElementById('showLabels').checked;
        const showLegend = document.getElementById('showLegend').checked;
        const enableAnimation = document.getElementById('enableAnimation').checked;
        
        // 更新圖表設定
        this.state.selectedChart.title = newTitle;
        this.state.selectedChart.customOptions = {
            ...this.state.selectedChart.customOptions,
            title: newTitle,
            colorScheme,
            opacity,
            xColumn,
            yColumn,
            showLabels,
            showLegend,
            enableAnimation
        };
        
        // 重新生成圖表
        try {
            const newConfig = window.chartGenerator.generateChart({
                data: this.state.rawData,
                chartType: this.state.selectedChart.type,
                analysis: this.state.analysisResult,
                customOptions: this.state.selectedChart.customOptions
            });
            
            this.state.selectedChart.config = newConfig;
            
            // 更新圖表標題
            const titleElement = document.querySelector(`#chart-${this.state.selectedChart.id} .chart-title`);
            if (titleElement) {
                titleElement.textContent = `${this.getChartInfo(this.state.selectedChart.type).icon} ${newTitle}`;
            }
            
            // 重新渲染圖表
            this.renderRealChart(this.state.selectedChart);
            
            this.showSuccess('圖表設定已套用');
        } catch (error) {
            this.showError('設定套用失敗: ' + error.message);
        }
        
        this.closeCustomizationModal();
    }

    // ==========================================
    // 模態框控制
    // ==========================================

    closeCustomizationModal() {
        document.getElementById('customizationModal').classList.remove('show');
        this.state.selectedChart = null;
    }

    closeDataViewModal() {
        document.getElementById('dataViewModal').classList.remove('show');
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
    }

    // ==========================================
    // 數據顯示相關
    // ==========================================

    /**
     * 顯示完整數據查看
     */
    showFullDataView() {
        if (!this.state.rawData) {
            this.showError('沒有數據可以查看');
            return;
        }
        
        this.populateFullDataTable();
        document.getElementById('dataViewModal').classList.add('show');
    }

    /**
     * 填充完整數據表格
     */
    populateFullDataTable() {
        const table = document.getElementById('fullDataTable');
        const data = this.state.rawData;
        
        if (!data || data.length === 0) return;
        
        const columns = Object.keys(data[0]);
        
        // 生成表頭
        let html = '<thead><tr>';
        columns.forEach(col => {
            html += `<th>${col}</th>`;
        });
        html += '</tr></thead><tbody>';
        
        // 分頁顯示數據
        const startIndex = (this.state.currentPage - 1) * this.state.itemsPerPage;
        const endIndex = Math.min(startIndex + this.state.itemsPerPage, data.length);
        
        for (let i = startIndex; i < endIndex; i++) {
            const row = data[i];
            html += '<tr>';
            columns.forEach(col => {
                const value = row[col];
                html += `<td>${value !== null && value !== undefined ? value : ''}</td>`;
            });
            html += '</tr>';
        }
        
        html += '</tbody>';
        table.innerHTML = html;
        
        // 更新欄位篩選器
        this.updateColumnFilter(columns);
    }

    /**
     * 更新欄位篩選器
     */
    updateColumnFilter(columns) {
        const select = document.getElementById('columnFilter');
        select.innerHTML = '<option value="">所有欄位</option>';
        
        columns.forEach(col => {
            const option = document.createElement('option');
            option.value = col;
            option.textContent = col;
            select.appendChild(option);
        });
    }

    /**
     * 顯示數據篩選功能
     */
    showDataFilter() {
        if (!this.state.rawData) {
            this.showError('沒有數據可以篩選');
            return;
        }
        
        this.createFilterModal();
        document.getElementById('filterModal').classList.add('show');
    }

    /**
     * 創建篩選模態框
     */
    createFilterModal() {
        // 檢查是否已存在
        let filterModal = document.getElementById('filterModal');
        if (filterModal) {
            this.setupFilterListeners();
            this.updateFilterPreview();
            return;
        }
        
        // 創建模態框
        filterModal = document.createElement('div');
        filterModal.className = 'modal';
        filterModal.id = 'filterModal';
        
        const analysis = this.state.analysisResult;
        const columns = analysis.基本信息.欄位列表;
        
        filterModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">🔍 數據篩選器</h3>
                    <button class="close-btn" onclick="app.closeFilterModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="filter-section">
                        <h4>欄位篩選</h4>
                        <div class="filter-columns">
                            ${columns.map(col => `
                                <label class="filter-column-item">
                                    <input type="checkbox" value="${col}" checked> ${col}
                                </label>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="filter-section">
                        <h4>數值範圍篩選</h4>
                        <div id="numericFilters">
                            ${analysis.欄位分析.數值欄位.map(col => {
                                const stats = analysis.欄位分析.詳細分析[col].統計;
                                return `
                                    <div class="numeric-filter">
                                        <label>${col}:</label>
                                        <div class="range-inputs">
                                            <input type="number" 
                                                id="min_${col}" 
                                                placeholder="最小值" 
                                                value="${stats ? stats.最小值 : ''}"
                                                step="any">
                                            <span>到</span>
                                            <input type="number" 
                                                id="max_${col}" 
                                                placeholder="最大值" 
                                                value="${stats ? stats.最大值 : ''}"
                                                step="any">
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    
                    <div class="filter-section">
                        <h4>類別篩選</h4>
                        <div id="categoryFilters">
                            ${analysis.欄位分析.類別欄位.map(col => {
                                const distribution = analysis.欄位分析.詳細分析[col].分布;
                                const categories = distribution ? Object.keys(distribution.分布統計) : [];
                                return `
                                    <div class="category-filter">
                                        <label>${col}:</label>
                                        <div class="category-options">
                                            ${categories.map(cat => `
                                                <label class="category-option">
                                                    <input type="checkbox" value="${cat}" checked> ${cat}
                                                </label>
                                            `).join('')}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    
                    <div class="filter-actions">
                        <button class="btn btn-secondary" onclick="app.resetFilters()">重置篩選</button>
                        <button class="btn btn-primary" onclick="app.applyFilters()">套用篩選</button>
                    </div>
                    
                    <div class="filter-preview">
                        <h4>篩選預覽</h4>
                        <div id="filterPreview">
                            <span id="filteredCount">${this.state.rawData.length}</span> / ${this.state.rawData.length} 筆資料
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(filterModal);
        
        // 添加篩選預覽監聽器
        this.setupFilterListeners();
    }

    /**
     * 設定篩選監聽器
     */
    setupFilterListeners() {
        const modal = document.getElementById('filterModal');
        
        // 監聽所有篩選條件變化
        modal.addEventListener('change', () => {
            this.updateFilterPreview();
        });
        
        modal.addEventListener('input', () => {
            this.updateFilterPreview();
        });
    }

    /**
     * 更新篩選預覽
     */
    updateFilterPreview() {
        const filteredData = this.getFilteredData();
        document.getElementById('filteredCount').textContent = filteredData.length;
    }

    /**
     * 獲取篩選後的數據
     */
    getFilteredData() {
        let filteredData = [...this.state.rawData];
        
        // 欄位篩選
        const selectedColumns = Array.from(document.querySelectorAll('.filter-column-item input:checked'))
            .map(input => input.value);
        
        // 數值範圍篩選
        const analysis = this.state.analysisResult;
        analysis.欄位分析.數值欄位.forEach(col => {
            const minInput = document.getElementById(`min_${col}`);
            const maxInput = document.getElementById(`max_${col}`);
            
            if (minInput && maxInput) {
                const minVal = parseFloat(minInput.value);
                const maxVal = parseFloat(maxInput.value);
                
                if (!isNaN(minVal) || !isNaN(maxVal)) {
                    filteredData = filteredData.filter(row => {
                        const value = parseFloat(row[col]);
                        if (isNaN(value)) return false;
                        
                        if (!isNaN(minVal) && value < minVal) return false;
                        if (!isNaN(maxVal) && value > maxVal) return false;
                        
                        return true;
                    });
                }
            }
        });
        
        // 類別篩選
        analysis.欄位分析.類別欄位.forEach(col => {
            const categoryOptions = document.querySelectorAll(`[value="${col}"] ~ .category-options input:checked`);
            const selectedCategories = Array.from(categoryOptions).map(input => input.value);
            
            if (selectedCategories.length > 0) {
                filteredData = filteredData.filter(row => 
                    selectedCategories.includes(String(row[col]))
                );
            }
        });
        
        return filteredData;
    }

    /**
     * 套用篩選
     */
    applyFilters() {
        const filteredData = this.getFilteredData();
        
        if (filteredData.length === 0) {
            this.showError('篩選條件過於嚴格，沒有符合的數據');
            return;
        }
        
        // 更新狀態
        this.state.filteredData = filteredData;
        
        // 重新分析篩選後的數據
        const newAnalysis = window.dataAnalyzer.analyzeData(filteredData);
        this.state.filteredAnalysis = newAnalysis;
        
        // 更新UI顯示
        this.updateDataOverviewForFiltered(filteredData, newAnalysis);
        
        // 關閉模態框
        this.closeFilterModal();
        
        this.showSuccess(`篩選完成，顯示 ${filteredData.length} 筆數據`);

        // 更新現有圖表以反映篩選結果
        this.state.charts.forEach(chart => {
            try {
                const newConfig = window.chartGenerator.generateChart({
                    data: this.state.filteredData,
                    chartType: chart.type,
                    analysis: this.state.filteredAnalysis,
                    customOptions: chart.customOptions
                });
                chart.config = newConfig;
                this.renderRealChart(chart);
            } catch (error) {
                console.error('更新圖表失敗:', error);
            }
        });
    }

    /**
     * 重置篩選
     */
    resetFilters() {
        // 重置所有篩選條件
        document.querySelectorAll('.filter-column-item input').forEach(input => {
            input.checked = true;
        });
        
        // 重置數值範圍
        const analysis = this.state.analysisResult;
        analysis.欄位分析.數值欄位.forEach(col => {
            const stats = analysis.欄位分析.詳細分析[col].統計;
            const minInput = document.getElementById(`min_${col}`);
            const maxInput = document.getElementById(`max_${col}`);
            
            if (minInput && maxInput && stats) {
                minInput.value = stats.最小值;
                maxInput.value = stats.最大值;
            }
        });
        
        // 重置類別選擇
        document.querySelectorAll('.category-option input').forEach(input => {
            input.checked = true;
        });
        
        // 重置狀態
        this.state.filteredData = null;
        this.state.filteredAnalysis = null;
        
        // 更新預覽
        this.updateFilterPreview();
        
        this.showSuccess('篩選條件已重置');
    }

    /**
     * 關閉篩選模態框
     */
    closeFilterModal() {
        const modal = document.getElementById('filterModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    /**
     * 更新篩選後的數據概覽
     */
    updateDataOverviewForFiltered(filteredData, analysis) {
        const basicInfo = analysis.基本信息;
        const columnAnalysis = analysis.欄位分析;
        
        // 更新基本統計（添加篩選標記）
        document.getElementById('totalRows').innerHTML = 
            `${basicInfo.總行數.toLocaleString()} <span style="color: #1976d2;">(已篩選)</span>`;
        
        // 其他統計保持不變
        document.getElementById('totalColumns').textContent = basicInfo.欄位數;
        document.getElementById('numericColumns').textContent = columnAnalysis.數值欄位.join(', ') || '無';
        document.getElementById('categoricalColumns').textContent = columnAnalysis.類別欄位.join(', ') || '無';
        document.getElementById('timeColumns').textContent = columnAnalysis.時間欄位.join(', ') || '無';
        
        // 更新數據預覽表格
        this.generateDataPreviewTableForFiltered(filteredData);
    }

    /**
     * 生成篩選後的數據預覽表格
     */
    generateDataPreviewTableForFiltered(data) {
        const table = document.getElementById('dataPreviewTable');
        
        if (!data || data.length === 0) return;
        
        const columns = Object.keys(data[0]);
        const previewData = data.slice(0, 5);
        
        let html = '<thead><tr>';
        columns.forEach(col => {
            html += `<th>${col}</th>`;
        });
        html += '</tr></thead><tbody>';
        
        previewData.forEach(row => {
            html += '<tr>';
            columns.forEach(col => {
                const value = row[col];
                html += `<td>${value !== null && value !== undefined ? value : ''}</td>`;
            });
            html += '</tr>';
        });
        
        html += '</tbody>';
        table.innerHTML = html;
    }

    // 在生成圖表時使用篩選後的數據
    /**
     * 獲取當前有效數據（篩選後或原始數據）
     */
    getCurrentData() {
        return this.state.filteredData || this.state.rawData;
    }

    /**
     * 獲取當前有效分析結果
     */
    getCurrentAnalysis() {
        return this.state.filteredAnalysis || this.state.analysisResult;
    }

    // ==========================================
    // UI 更新方法
    // ==========================================

    /**
     * 更新上傳UI狀態
     */
    updateUploadUI(status) {
        const iconElement = document.getElementById('uploadIcon');
        const textElement = document.getElementById('uploadText');
        
        switch (status) {
            case 'uploading':
                iconElement.textContent = '⏳';
                textElement.textContent = '分析資料中...';
                break;
            case 'success':
                iconElement.textContent = '✅';
                textElement.textContent = '檔案已上傳並分析';
                break;
            case 'error':
                iconElement.textContent = '❌';
                textElement.textContent = '上傳失敗，請重試';
                break;
            default:
                iconElement.textContent = '📁';
                textElement.textContent = '拖放檔案或點擊上傳';
        }
    }

    /**
     * 顯示檔案信息
     */
    showFileInfo(file) {
        const fileInfoDiv = document.getElementById('fileInfo');
        const fileName = document.getElementById('fileName');
        const fileSize = document.getElementById('fileSize');
        
        fileName.textContent = file.name;
        fileSize.textContent = this.formatFileSize(file.size);
        fileInfoDiv.style.display = 'block';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * 更新數據概覽
     */
    updateDataOverview() {
        if (!this.state.analysisResult) return;
        
        const analysis = this.state.analysisResult;
        const basicInfo = analysis.基本信息;
        const columnAnalysis = analysis.欄位分析;
        
        // 更新基本統計
        document.getElementById('totalRows').textContent = basicInfo.總行數.toLocaleString();
        document.getElementById('totalColumns').textContent = basicInfo.欄位數;
        document.getElementById('numericColumns').textContent = columnAnalysis.數值欄位.join(', ') || '無';
        document.getElementById('categoricalColumns').textContent = columnAnalysis.類別欄位.join(', ') || '無';
        document.getElementById('timeColumns').textContent = columnAnalysis.時間欄位.join(', ') || '無';
        
        // 生成數據預覽表格
        this.generateDataPreviewTable();
        
        // 顯示概覽區域
        document.getElementById('dataOverview').style.display = 'block';
    }

    /**
     * 生成數據預覽表格
     */
    generateDataPreviewTable() {
        const table = document.getElementById('dataPreviewTable');
        const data = this.state.rawData;
        
        if (!data || data.length === 0) return;
        
        const columns = Object.keys(data[0]);
        const previewData = data.slice(0, 5); // 只顯示前5行
        
        let html = '<thead><tr>';
        columns.forEach(col => {
            html += `<th>${col}</th>`;
        });
        html += '</tr></thead><tbody>';
        
        previewData.forEach(row => {
            html += '<tr>';
            columns.forEach(col => {
                const value = row[col];
                html += `<td>${value !== null && value !== undefined ? value : ''}</td>`;
            });
            html += '</tr>';
        });
        
        html += '</tbody>';
        table.innerHTML = html;
    }

    /**
     * 更新洞察
     */
    updateInsights() {
        if (!this.state.analysisResult) return;
        
        const insights = this.state.analysisResult.數據洞察;
        const insightsDiv = document.getElementById('dataInsights');
        
        if (insights && insights.length > 0) {
            let html = '';
            insights.forEach((insight, index) => {
                html += `<div class="insight-item" style="margin-bottom: 10px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                    <span style="color: #1976d2; font-weight: bold;">${index + 1}.</span> ${insight}
                </div>`;
            });
            insightsDiv.innerHTML = html;
            document.getElementById('insightsSection').style.display = 'block';
        }
    }

    /**
     * 顯示載入推薦狀態
     */
    showLoadingRecommendation() {
        document.getElementById('loadingSection').style.display = 'block';
        document.getElementById('recommendationSection').style.display = 'none';
    }

    /**
     * 顯示推薦結果
     */
    displayRecommendation(recommendation) {
        document.getElementById('loadingSection').style.display = 'none';
        document.getElementById('recommendationSection').style.display = 'block';
        
        document.getElementById('confidenceLevel').textContent = Math.round(recommendation.confidence * 100) + '%';
        document.getElementById('recommendationReason').textContent = recommendation.reasoning;
        
        const chartsContainer = document.getElementById('recommendedCharts');
        chartsContainer.innerHTML = '';
        
        recommendation.chartTypes.forEach(chartType => {
            const chip = document.createElement('div');
            chip.className = 'chart-chip';
            chip.textContent = this.getChartName(chartType);
            chip.onclick = () => this.generateChart(chartType);
            chartsContainer.appendChild(chip);
        });
    }

    /**
     * 更新圖表計數
     */
    updateChartCount() {
        document.getElementById('chartCount').textContent = this.state.charts.length;
    }

    /**
     * 顯示浮動按鈕
     */
    showFloatingButton() {
        document.getElementById('floatingAddBtn').style.display = 'block';
    }

    // ==========================================
    // 其他功能
    // ==========================================

    /**
     * 自動排列圖表
     */
    autoLayout() {
        // 實現自動排列邏輯
        this.showSuccess('圖表已自動排列');
    }

    /**
     * 清除所有圖表
     */
    clearAllCharts() {
        if (this.state.charts.length === 0) return;
        
        if (confirm('確定要清除所有圖表嗎？')) {
            // 銷毀所有圖表實例
            this.chartInstances.forEach(chartInstance => {
                if (chartInstance.type === 'chartjs') {
                    // Chart.js 實例
                    if (chartInstance.instance && typeof chartInstance.instance.destroy === 'function') {
                        chartInstance.instance.destroy();
                    }
                } else if (chartInstance.type === 'plotly') {
                    // Plotly 圖表
                    if (chartInstance.element && typeof Plotly !== 'undefined') {
                        Plotly.purge(chartInstance.element);
                    }
                }
            });
            this.chartInstances.clear();
            
            // 斷開所有ResizeObserver
            this.resizeObservers.forEach(observer => observer.disconnect());
            this.resizeObservers.clear();
            
            this.state.charts = [];
            this.renderCharts();
            this.updateChartCount();
            this.showSuccess('所有圖表已清除');
        }
    }

    /**
     * 匯出儀表板
     */
    exportDashboard() {
        if (this.state.charts.length === 0) {
            this.showError('沒有圖表可以匯出');
            return;
        }
        
        // 這裡可以實現匯出功能
        this.showSuccess('儀表板匯出功能開發中...');
    }

    /**
     * 匯出報告
     */
    exportReport() {
        this.showSuccess('報告匯出功能開發中...');
    }


    /**
     * 重置推薦
     */
    resetRecommendation() {
        this.state.recommendation = null;
        document.getElementById('recommendationSection').style.display = 'none';
        document.getElementById('userInput').value = '';
        this.showSuccess('推薦已重置');
    }

    /**
     * 設定載入狀態
     */
    setLoading(loading) {
        this.state.loading = loading;
        
        const buttons = ['claudeBtn', 'vizmlBtn', 'hybridBtn'];
        buttons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.disabled = loading || !this.state.analysisResult;
            }
        });
    }

    /**
     * 顯示歡迎訊息
     */
    showWelcomeMessage() {
        console.log('🎯 智能視覺化推薦系統 v2.0 已啟動');
        console.log('📚 支援格式: CSV, JSON, Excel');
        console.log('🎨 支援圖表: 基礎、進階、商業圖表');
    }

    // ==========================================
    // 訊息顯示方法
    // ==========================================

    showError(message) {
        const alert = document.getElementById('errorAlert');
        const messageEl = document.getElementById('errorMessage');
        messageEl.textContent = message;
        alert.style.display = 'block';
        alert.className = 'alert';
        
        setTimeout(() => {
            alert.style.display = 'none';
        }, 5000);
    }

    showSuccess(message) {
        const alert = document.getElementById('errorAlert');
        const messageEl = document.getElementById('errorMessage');
        messageEl.textContent = message;
        alert.style.display = 'block';
        alert.className = 'alert success';
        
        setTimeout(() => {
            alert.style.display = 'none';
        }, 3000);
    }
}

// ==========================================
// 全域函數 (供HTML調用)
// ==========================================

function hideError() {
    document.getElementById('errorAlert').style.display = 'none';
}

function closeCustomizationModal() {
    app.closeCustomizationModal();
}

function closeDataViewModal() {
    app.closeDataViewModal();
}

function applyCustomization() {
    app.applyCustomization();
}

function resetRecommendation() {
    app.resetRecommendation();
}

// ==========================================
// 應用程式啟動
// ==========================================

// 等待 DOM 和所有外部庫載入完成
document.addEventListener('DOMContentLoaded', () => {
    // 延遲檢查依賴，給庫時間載入
    setTimeout(() => {
        console.log('🔍 檢查依賴...');
        
        // 檢查必要的依賴
        if (typeof Chart === 'undefined') {
            console.error('❌ Chart.js 未載入');
            document.body.innerHTML = `
                <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <div style="background: rgba(255,255,255,0.9); padding: 40px; border-radius: 20px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
                        <h2 style="color: #e74c3c; margin-bottom: 20px;">⚠️ 載入錯誤</h2>
                        <p style="margin-bottom: 20px;">Chart.js 庫未能正確載入</p>
                        <p style="color: #666; font-size: 14px;">請檢查網路連接或使用本地伺服器</p>
                        <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">重新載入</button>
                    </div>
                </div>
            `;
            return;
        }
        
        if (typeof Papa === 'undefined') {
            console.error('❌ PapaParse 未載入');
            return;
        }
        
        console.log('✅ Chart.js 版本:', Chart.version);
        console.log('✅ PapaParse 已載入');
        console.log('✅ 所有依賴檢查完成');
        
        // 創建全域應用程式實例
        try {
            window.app = new VizApp();
            console.log('🚀 應用程式啟動成功');
        } catch (error) {
            console.error('❌ 應用程式啟動失敗:', error);
        }
    }, 500);
});

// 處理頁面卸載
window.addEventListener('beforeunload', () => {
    if (window.app) {
        // 清理資源
        window.app.chartInstances.forEach(instance => instance.destroy());
        window.app.resizeObservers.forEach(observer => observer.disconnect());
    }
});