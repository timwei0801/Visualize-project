/* ==========================================
   完整版圖表生成器 - ChartGenerator v2.0
   補全所有 Chart.js 圖表方法
   ========================================== */

class ChartGenerator {
    constructor() {
        // Chart.js 圖表類型
        this.chartjsTypes = {
            // 基礎圖表
            bar: { name: '長條圖', category: 'basic', minColumns: 2, engine: 'chartjs' },
            line: { name: '線圖', category: 'basic', minColumns: 2, engine: 'chartjs' },
            pie: { name: '圓餅圖', category: 'basic', minColumns: 2, engine: 'chartjs' },
            scatter: { name: '散佈圖', category: 'basic', minColumns: 2, engine: 'chartjs' },
            doughnut: { name: '甜甜圈圖', category: 'basic', minColumns: 2, engine: 'chartjs' },
            area: { name: '面積圖', category: 'basic', minColumns: 2, engine: 'chartjs' },
            
            // 進階圖表
            radar: { name: '雷達圖', category: 'advanced', minColumns: 3, engine: 'chartjs' },
            polar: { name: '極坐標圖', category: 'advanced', minColumns: 2, engine: 'chartjs' },
            bubble: { name: '氣泡圖', category: 'advanced', minColumns: 3, engine: 'chartjs' },
            histogram: { name: '直方圖', category: 'advanced', minColumns: 1, engine: 'chartjs' }
        };

        // Plotly.js 圖表類型
        this.plotlyTypes = {
            // 商業圖表
            sankey: { name: '桑基圖', category: 'business', minColumns: 3, engine: 'plotly' },
            waterfall: { name: '瀑布圖', category: 'business', minColumns: 2, engine: 'plotly' },
            funnel: { name: '漏斗圖', category: 'business', minColumns: 2, engine: 'plotly' },
            treemap: { name: '樹狀圖', category: 'business', minColumns: 2, engine: 'plotly' },
            
            // 進階統計圖表
            boxplot: { name: '箱型圖', category: 'advanced', minColumns: 1, engine: 'plotly' },
            heatmap: { name: '熱力圖', category: 'advanced', minColumns: 2, engine: 'plotly' },
            scatter3d: { name: '3D散佈圖', category: 'advanced', minColumns: 3, engine: 'plotly' },
            
            // KPI 圖表
            gauge: { name: '儀表板', category: 'business', minColumns: 1, engine: 'plotly' },
            kpi: { name: 'KPI卡片', category: 'business', minColumns: 1, engine: 'plotly' }
        };

        // 合併所有圖表類型
        this.chartTypes = { ...this.chartjsTypes, ...this.plotlyTypes };

        this.colorPalettes = {
            default: {
                primary: ['#3498db', '#e74c3c', '#f39c12', '#2ecc71', '#9b59b6', '#1abc9c', '#34495e', '#e67e22'],
                secondary: ['#85c1e9', '#f1948a', '#f8c471', '#82e0aa', '#bb8fce', '#76d7c4', '#85929e', '#f0b27a']
            },
            blue: {
                primary: ['#3498db', '#2980b9', '#5dade2', '#85c1e9', '#aed6f1', '#d6eaf8'],
                secondary: ['#85c1e9', '#a9cce3', '#d4e6f1', '#eaf2f8', '#f4f6f7', '#fdfdfe']
            },
            green: {
                primary: ['#2ecc71', '#27ae60', '#58d68d', '#82e0aa', '#abebc6', '#d5f4e6'],
                secondary: ['#82e0aa', '#a3e4c4', '#c3e9d0', '#e8f6f3', '#f4fdf7', '#fdfefe']
            },
            red: {
                primary: ['#e74c3c', '#c0392b', '#ec7063', '#f1948a', '#f5b7b1', '#fadbd8'],
                secondary: ['#f1948a', '#f4a3a8', '#f7b6bb', '#f9cccc', '#fce4ec', '#fef7f7']
            },
            purple: {
                primary: ['#9b59b6', '#8e44ad', '#af7ac5', '#bb8fce', '#c39bd3', '#d7bde2'],
                secondary: ['#bb8fce', '#c8a4d8', '#d5b7e1', '#e2c9ea', '#f0e6f7', '#faf5fd']
            }
        };
    }

    /**
     * 智能生成圖表配置
     */
    async generateChart(options) {
        const { data, chartType, analysis, customOptions = {} } = options;

        if (!data || !Array.isArray(data) || data.length === 0) {
            throw new Error('數據不能為空');
        }

        const chartInfo = this.chartTypes[chartType];
        if (!chartInfo) {
            throw new Error(`不支援的圖表類型: ${chartType}`);
        }

        if (chartInfo.engine === 'plotly') {
            return await this.generatePlotlyChart(options);
        } else {
            return this.generateChartjsChart(options);
        }
    }

    /**
     * 生成 Chart.js 圖表
     */
    generateChartjsChart(options) {
        const { data, chartType, analysis, customOptions = {} } = options;
        const chartConfig = this.getChartConfig(data, chartType, analysis, customOptions);
        this.applyUniversalSettings(chartConfig, customOptions);
        
        return {
            engine: 'chartjs',
            config: chartConfig,
            renderMethod: 'canvas'
        };
    }

    /**
     * 生成 Plotly.js 圖表
     */
    async generatePlotlyChart(options) {
        if (typeof Plotly === 'undefined') {
            throw new Error('Plotly.js 未載入，無法生成此圖表');
        }

        if (typeof window.plotlyChartGenerator === 'undefined') {
            throw new Error('PlotlyChartGenerator 未載入');
        }

        const result = await window.plotlyChartGenerator.generatePlotlyChart(options);
        
        return {
            engine: 'plotly',
            data: result.plotlyData,
            layout: result.layout,
            config: {
                responsive: true,
                displaylogo: false,
                modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
            },
            renderMethod: 'plotly',
            metadata: result.metadata
        };
    }

    /**
     * 獲取圖表配置 - 支援所有 Chart.js 圖表
     */
    getChartConfig(data, chartType, analysis, customOptions) {
        const method = `generate${this.capitalize(chartType)}Chart`;
        
        if (typeof this[method] === 'function') {
            return this[method](data, analysis, customOptions);
        } else {
            console.warn(`方法 ${method} 不存在，使用長條圖代替`);
            return this.generateBarChart(data, analysis, customOptions);
        }
    }

    // ==========================================
    // Chart.js 圖表生成方法 - 補全所有類型
    // ==========================================

    /**
     * 長條圖生成器
     */
    generateBarChart(data, analysis, options = {}) {
        const smartColumns = this.selectSmartColumns(data, analysis, 'bar');
        const colors = this.getColors(options.colorScheme || 'default');
        const aggregatedData = this.aggregateData(data, smartColumns.category, smartColumns.value);
        
        return {
            type: 'bar',
            data: {
                labels: Object.keys(aggregatedData),
                datasets: [{
                    label: smartColumns.value,
                    data: Object.values(aggregatedData),
                    backgroundColor: colors.primary.slice(0, Object.keys(aggregatedData).length),
                    borderColor: colors.primary.slice(0, Object.keys(aggregatedData).length),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: options.title || `${smartColumns.category} vs ${smartColumns.value}`,
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: { display: options.showLegend !== false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: smartColumns.value }
                    },
                    x: {
                        title: { display: true, text: smartColumns.category }
                    }
                }
            }
        };
    }

    /**
     * 線圖生成器
     */
    generateLineChart(data, analysis, options = {}) {
        const smartColumns = this.selectSmartColumns(data, analysis, 'line');
        const colors = this.getColors(options.colorScheme || 'default');
        const xColumn = analysis.欄位分析.時間欄位[0] || smartColumns.category;
        const yColumn = smartColumns.value;
        const sortedData = this.sortDataByColumn(data, xColumn);
        
        return {
            type: 'line',
            data: {
                labels: sortedData.map(row => this.formatLabel(row[xColumn])),
                datasets: [{
                    label: yColumn,
                    data: sortedData.map(row => this.parseNumeric(row[yColumn])),
                    borderColor: colors.primary[0],
                    backgroundColor: colors.secondary[0],
                    tension: 0.1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: options.title || `${yColumn} 趨勢`,
                        font: { size: 16, weight: 'bold' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: yColumn }
                    },
                    x: {
                        title: { display: true, text: xColumn }
                    }
                }
            }
        };
    }

    /**
     * 圓餅圖生成器
     */
    generatePieChart(data, analysis, options = {}) {
        const smartColumns = this.selectSmartColumns(data, analysis, 'pie');
        const colors = this.getColors(options.colorScheme || 'default');
        const aggregatedData = this.aggregateData(data, smartColumns.category, smartColumns.value);
        
        // 限制類別數量（最多10個）
        const sortedEntries = Object.entries(aggregatedData)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);
        
        return {
            type: 'pie',
            data: {
                labels: sortedEntries.map(([label, ]) => label),
                datasets: [{
                    data: sortedEntries.map(([, value]) => value),
                    backgroundColor: colors.primary.slice(0, sortedEntries.length),
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: options.title || `${smartColumns.category} 分布`,
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: { position: 'right' }
                }
            }
        };
    }

    /**
     * 散佈圖生成器
     */
    generateScatterChart(data, analysis, options = {}) {
        const numericColumns = analysis.欄位分析.數值欄位;
        
        if (numericColumns.length < 2) {
            throw new Error('散佈圖需要至少兩個數值欄位');
        }
        
        const xColumn = options.xColumn || numericColumns[0];
        const yColumn = options.yColumn || numericColumns[1];
        const colors = this.getColors(options.colorScheme || 'default');
        
        const scatterData = data.map(row => ({
            x: this.parseNumeric(row[xColumn]),
            y: this.parseNumeric(row[yColumn])
        })).filter(point => !isNaN(point.x) && !isNaN(point.y));
        
        return {
            type: 'scatter',
            data: {
                datasets: [{
                    label: `${xColumn} vs ${yColumn}`,
                    data: scatterData,
                    backgroundColor: colors.primary[0],
                    borderColor: colors.primary[0],
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: options.title || `${xColumn} vs ${yColumn} 相關性分析`,
                        font: { size: 16, weight: 'bold' }
                    }
                },
                scales: {
                    x: { title: { display: true, text: xColumn } },
                    y: { title: { display: true, text: yColumn } }
                }
            }
        };
    }

    /**
     * 甜甜圈圖生成器
     */
    generateDoughnutChart(data, analysis, options = {}) {
        const config = this.generatePieChart(data, analysis, options);
        config.type = 'doughnut';
        return config;
    }

    /**
     * 面積圖生成器
     */
    generateAreaChart(data, analysis, options = {}) {
        const config = this.generateLineChart(data, analysis, options);
        config.data.datasets[0].fill = true;
        config.data.datasets[0].backgroundColor = this.getColors(options.colorScheme || 'default').secondary[0];
        return config;
    }

    /**
     * 雷達圖生成器
     */
    generateRadarChart(data, analysis, options = {}) {
        const numericColumns = analysis.欄位分析.數值欄位.slice(0, 8);
        
        if (numericColumns.length < 3) {
            throw new Error('雷達圖需要至少3個數值欄位');
        }
        
        const colors = this.getColors(options.colorScheme || 'default');
        const averages = numericColumns.map(col => {
            const values = data.map(row => this.parseNumeric(row[col])).filter(v => !isNaN(v));
            return values.reduce((sum, val) => sum + val, 0) / values.length;
        });
        
        return {
            type: 'radar',
            data: {
                labels: numericColumns,
                datasets: [{
                    label: '平均值',
                    data: averages,
                    backgroundColor: colors.secondary[0],
                    borderColor: colors.primary[0],
                    borderWidth: 2,
                    pointBackgroundColor: colors.primary[0]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: options.title || '多維度分析',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 10
                        }
                    }
                },
                scales: { 
                    r: { 
                        beginAtZero: true,
                        pointLabels: {
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            circular: true
                        }
                    } 
                },
                elements: {
                    point: {
                        radius: 4,
                        hoverRadius: 6
                    },
                    line: {
                        borderWidth: 2
                    }
                }
            }
        };
    }

    /**
     * 極坐標圖生成器
     */
    generatePolarChart(data, analysis, options = {}) {
        const smartColumns = this.selectSmartColumns(data, analysis, 'polar');
        const colors = this.getColors(options.colorScheme || 'default');
        const aggregatedData = this.aggregateData(data, smartColumns.category, smartColumns.value);
        
        return {
            type: 'polarArea',
            data: {
                labels: Object.keys(aggregatedData),
                datasets: [{
                    data: Object.values(aggregatedData),
                    backgroundColor: colors.primary.slice(0, Object.keys(aggregatedData).length)
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: options.title || `${smartColumns.category} 極坐標分布`,
                        font: { size: 16, weight: 'bold' }
                    }
                }
            }
        };
    }

    /**
     * 氣泡圖生成器
     */
    generateBubbleChart(data, analysis, options = {}) {
        const numericColumns = analysis.欄位分析.數值欄位;
        
        if (numericColumns.length < 3) {
            throw new Error('氣泡圖需要至少3個數值欄位');
        }
        
        const xColumn = options.xColumn || numericColumns[0];
        const yColumn = options.yColumn || numericColumns[1];
        const sizeColumn = options.sizeColumn || numericColumns[2];
        const colors = this.getColors(options.colorScheme || 'default');

        // Add baseColor and translucentColor before return
        const baseColor = colors.primary[0];
        const translucentColor = this.adjustOpacity(baseColor, 0.5);
        
        const sizeValues = data.map(row => this.parseNumeric(row[sizeColumn])).filter(v => !isNaN(v));
        const maxSize = Math.max(...sizeValues);
        const minSize = Math.min(...sizeValues);
        const sizeRange = maxSize - minSize || 1;

        const bubbleData = data.map(row => {
            const sizeValue = this.parseNumeric(row[sizeColumn]);
            const normalizedSize = (sizeValue - minSize) / sizeRange;
            return {
                x: this.parseNumeric(row[xColumn]),
                y: this.parseNumeric(row[yColumn]),
                r: Math.max(5, 5 + normalizedSize * 20) // 大小範圍從5到25
            };
        }).filter(point => !isNaN(point.x) && !isNaN(point.y) && !isNaN(point.r));
        
        return {
            type: 'bubble',
            data: {
                datasets: [{
                    label: '數據點',
                    data: bubbleData,
                    backgroundColor: translucentColor,
                    borderColor: translucentColor
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: options.title || `${xColumn} vs ${yColumn} (大小: ${sizeColumn})`,
                        font: { size: 16, weight: 'bold' }
                    }
                },
                scales: {
                    x: { title: { display: true, text: xColumn } },
                    y: { title: { display: true, text: yColumn } }
                }
            }
        };
    }

    /**
     * 直方圖生成器
     */
    generateHistogramChart(data, analysis, options = {}) {
        const numericColumns = analysis.欄位分析.數值欄位;
        
        if (numericColumns.length === 0) {
            throw new Error('直方圖需要數值欄位');
        }
        
        const column = options.column || numericColumns[0];
        const values = data.map(row => this.parseNumeric(row[column])).filter(v => !isNaN(v));
        const bins = this.calculateHistogramBins(values, options.binCount || 10);
        const colors = this.getColors(options.colorScheme || 'default');
        
        return {
            type: 'bar',
            data: {
                labels: bins.labels,
                datasets: [{
                    label: '頻率',
                    data: bins.counts,
                    backgroundColor: colors.primary[0],
                    borderColor: colors.primary[0],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: options.title || `${column} 分布直方圖`,
                        font: { size: 16, weight: 'bold' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: '頻率' }
                    },
                    x: {
                        title: { display: true, text: column }
                    }
                }
            }
        };
    }

    // ==========================================
    // 輔助方法
    // ==========================================

    selectSmartColumns(data, analysis, chartType) {
        const { 數值欄位, 類別欄位, 時間欄位 } = analysis.欄位分析;
        
        switch (chartType) {
            case 'line':
                return {
                    category: 時間欄位[0] || 類別欄位[0] || Object.keys(data[0])[0],
                    value: 數值欄位[0] || this.findBestNumericColumn(data)
                };
            case 'bar':
            case 'pie':
            case 'doughnut':
            case 'polar':
                return {
                    category: 類別欄位[0] || Object.keys(data[0])[0],
                    value: 數值欄位[0] || this.findBestNumericColumn(data)
                };
            default:
                return {
                    category: 類別欄位[0] || Object.keys(data[0])[0],
                    value: 數值欄位[0] || Object.keys(data[0])[1]
                };
        }
    }

    findBestNumericColumn(data) {
        const columns = Object.keys(data[0] || {});
        for (const column of columns) {
            const sample = data.slice(0, 10);
            const numericCount = sample.filter(row => !isNaN(this.parseNumeric(row[column]))).length;
            if (numericCount / sample.length > 0.8) {
                return column;
            }
        }
        return columns[1] || columns[0];
    }

    aggregateData(data, categoryColumn, valueColumn) {
        const aggregated = {};
        data.forEach(row => {
            const category = String(row[categoryColumn] || '未分類');
            const value = this.parseNumeric(row[valueColumn]);
            if (!isNaN(value)) {
                aggregated[category] = (aggregated[category] || 0) + value;
            }
        });
        return aggregated;
    }

    parseNumeric(value) {
        if (typeof value === 'number') return value;
        const cleaned = String(value).replace(/[,\s$%]/g, '');
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : parsed;
    }

    formatLabel(value) {
        if (value instanceof Date) {
            return value.toLocaleDateString();
        }
        const str = String(value);
        const date = new Date(str);
        if (!isNaN(date.getTime()) && str.length > 4) {
            return date.toLocaleDateString();
        }
        return str;
    }

    sortDataByColumn(data, column) {
        return [...data].sort((a, b) => {
            const aVal = a[column];
            const bVal = b[column];
            
            const aDate = new Date(aVal);
            const bDate = new Date(bVal);
            
            if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
                return aDate - bDate;
            }
            
            const aNum = this.parseNumeric(aVal);
            const bNum = this.parseNumeric(bVal);
            
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return aNum - bNum;
            }
            
            return String(aVal).localeCompare(String(bVal));
        });
    }

    calculateHistogramBins(values, binCount) {
        const min = Math.min(...values);
        const max = Math.max(...values);
        const binWidth = (max - min) / binCount;
        
        const bins = Array(binCount).fill(0);
        const labels = [];
        
        for (let i = 0; i < binCount; i++) {
            const binStart = min + i * binWidth;
            const binEnd = min + (i + 1) * binWidth;
            labels.push(`${binStart.toFixed(1)}-${binEnd.toFixed(1)}`);
        }
        
        values.forEach(value => {
            const binIndex = Math.min(Math.floor((value - min) / binWidth), binCount - 1);
            bins[binIndex]++;
        });
        
        return { labels, counts: bins };
    }

    getColors(scheme) {
        return this.colorPalettes[scheme] || this.colorPalettes.default;
    }

    applyUniversalSettings(chartConfig, options) {
        chartConfig.options.responsive = true;
        chartConfig.options.maintainAspectRatio = false;
        
        if (options.enableAnimation !== false) {
            chartConfig.options.animation = {
                duration: 1000,
                easing: 'easeInOutQuart'
            };
        }
        
        chartConfig.options.plugins = chartConfig.options.plugins || {};
        chartConfig.options.plugins.tooltip = {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            cornerRadius: 8,
            displayColors: true
        };
        
        if (options.opacity && options.opacity !== 1) {
            chartConfig.data.datasets.forEach(dataset => {
                if (dataset.backgroundColor) {
                    if (Array.isArray(dataset.backgroundColor)) {
                        dataset.backgroundColor = dataset.backgroundColor.map(color => 
                            this.adjustOpacity(color, options.opacity));
                    } else {
                        dataset.backgroundColor = this.adjustOpacity(dataset.backgroundColor, options.opacity);
                    }
                }
            });
        }
    }

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

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    getAvailableChartsByCategory() {
        const chartsByCategory = { basic: {}, advanced: {}, business: {} };
        Object.entries(this.chartTypes).forEach(([key, info]) => {
            chartsByCategory[info.category][key] = info;
        });
        return chartsByCategory;
    }

    checkEngineAvailability() {
        return {
            chartjs: typeof Chart !== 'undefined',
            plotly: typeof Plotly !== 'undefined',
            plotlyGenerator: typeof window.plotlyChartGenerator !== 'undefined'
        };
    }

    validateChartViability(data, chartType, analysis) {
        const chartInfo = this.chartTypes[chartType];
        
        if (!chartInfo) {
            return { valid: false, reason: '不支援的圖表類型' };
        }

        const availability = this.checkEngineAvailability();
        if (chartInfo.engine === 'plotly' && (!availability.plotly || !availability.plotlyGenerator)) {
            return { valid: false, reason: 'Plotly.js 或 PlotlyChartGenerator 未正確載入' };
        }

        if (chartInfo.engine === 'chartjs' && !availability.chartjs) {
            return { valid: false, reason: 'Chart.js 未正確載入' };
        }
        
        const { 數值欄位, 類別欄位 } = analysis.欄位分析;
        const totalColumns = 數值欄位.length + 類別欄位.length;
        
        if (totalColumns < chartInfo.minColumns) {
            return { 
                valid: false, 
                reason: `${chartInfo.name}需要至少${chartInfo.minColumns}個欄位` 
            };
        }
        
        if (chartInfo.engine === 'plotly') {
            return window.plotlyChartGenerator.validatePlotlyChartViability(data, chartType, analysis);
        }
        
        switch (chartType) {
            case 'scatter':
            case 'bubble':
                if (數值欄位.length < 2) {
                    return { valid: false, reason: '需要至少2個數值欄位' };
                }
                break;
            case 'radar':
                if (數值欄位.length < 3) {
                    return { valid: false, reason: '需要至少3個數值欄位' };
                }
                break;
        }
        
        return { valid: true };
    }
}

// 全域實例
window.chartGenerator = new ChartGenerator();