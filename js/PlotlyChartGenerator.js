/* ==========================================
   Plotly 圖表生成器 - PlotlyChartGenerator
   支援進階商業圖表的智能生成
   ========================================== */

class PlotlyChartGenerator {
    constructor() {
        this.plotlyTypes = {
            // 商業流程圖表
            sankey: { name: '桑基圖', category: 'business', minColumns: 3 },
            waterfall: { name: '瀑布圖', category: 'business', minColumns: 2 },
            funnel: { name: '漏斗圖', category: 'business', minColumns: 2 },
            treemap: { name: '樹狀圖', category: 'business', minColumns: 2 },
            
            // 進階統計圖表
            boxplot: { name: '箱型圖', category: 'advanced', minColumns: 1 },
            violin: { name: '小提琴圖', category: 'advanced', minColumns: 1 },
            heatmap: { name: '熱力圖', category: 'advanced', minColumns: 2 },
            parallel: { name: '平行座標圖', category: 'advanced', minColumns: 3 },
            
            // 3D 圖表
            scatter3d: { name: '3D散佈圖', category: 'advanced', minColumns: 3 },
            
            // KPI 和監控圖表
            gauge: { name: '儀表板', category: 'business', minColumns: 1 },
            kpi: { name: 'KPI卡片', category: 'business', minColumns: 1 }
        };

        this.colorSchemes = {
            default: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'],
            business: ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D', '#592A3D'],
            cool: ['#0D7377', '#14A085', '#7FB069', '#B2DF8A', '#FDE24F'],
            warm: ['#FF6B35', '#F7931E', '#FFD23F', '#06FFA5', '#B19CD9']
        };
    }

    /**
     * 生成 Plotly 圖表
     */
    async generatePlotlyChart(options) {
        const { data, chartType, analysis, customOptions = {} } = options;

        if (!data || !Array.isArray(data) || data.length === 0) {
            throw new Error('數據不能為空');
        }

        // 檢查 Plotly 是否可用
        if (typeof Plotly === 'undefined') {
            throw new Error('Plotly.js 未載入，無法生成此圖表');
        }

        const method = `generate${this.capitalize(chartType)}Chart`;
        
        if (typeof this[method] === 'function') {
            return await this[method](data, analysis, customOptions);
        } else {
            throw new Error(`不支援的 Plotly 圖表類型: ${chartType}`);
        }
    }

    /**
     * 桑基圖生成器 (改寫自你的 React 版本)
     */
    async generateSankeyChart(data, analysis, options = {}) {
        const processedData = this.processSankeyData(data, options);
        
        if (!processedData) {
            throw new Error('桑基圖需要來源、目標和數值三個欄位');
        }

        const plotlyData = [{
            type: 'sankey',
            node: {
                pad: 15,
                thickness: 20,
                line: { color: 'black', width: 0.5 },
                label: processedData.nodes,
                color: processedData.nodeColors,
                hovertemplate: '<b>%{label}</b><br>總流量: %{value}<extra></extra>'
            },
            link: {
                source: processedData.links.source,
                target: processedData.links.target,
                value: processedData.links.value,
                label: processedData.links.label,
                color: processedData.links.source.map(sourceIndex => {
                    const baseColor = processedData.nodeColors[sourceIndex];
                    return this.addAlpha(baseColor, 0.4);
                }),
                hovertemplate: '%{label}<extra></extra>'
            }
        }];

        const layout = {
            title: {
                text: options.title || `${processedData.sourceColumn} → ${processedData.targetColumn} 流向圖`,
                font: { size: 16 }
            },
            font: { family: 'Arial, sans-serif', size: 12 },
            margin: { l: 50, r: 50, t: 60, b: 50 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
        };

        return {
            plotlyData,
            layout,
            metadata: processedData
        };
    }

    /**
     * 瀑布圖生成器
     */
    async generateWaterfallChart(data, analysis, options = {}) {
        const categoryColumn = this.selectCategoryColumn(data, analysis);
        const valueColumn = this.selectValueColumn(data, analysis);
        
        const categories = data.map(row => row[categoryColumn]);
        const values = data.map(row => this.parseNumeric(row[valueColumn]));
        
        // 計算累積值
        const measures = values.map((val, index) => {
            if (index === 0 || index === values.length - 1) return 'absolute';
            return val >= 0 ? 'relative' : 'relative';
        });

        const plotlyData = [{
            type: 'waterfall',
            x: categories,
            y: values,
            measure: measures,
            text: values.map(v => v.toLocaleString()),
            textposition: 'outside',
            connector: {
                line: { color: 'rgb(63, 63, 63)' }
            },
            increasing: { marker: { color: '#2E8B57' } },
            decreasing: { marker: { color: '#DC143C' } },
            totals: { marker: { color: '#1f77b4' } }
        }];

        const layout = {
            title: { text: options.title || `${categoryColumn} 瀑布分析`, font: { size: 16 } },
            xaxis: { title: categoryColumn },
            yaxis: { title: valueColumn },
            margin: { l: 60, r: 50, t: 60, b: 50 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
        };

        return { plotlyData, layout };
    }

    /**
     * 漏斗圖生成器
     */
    async generateFunnelChart(data, analysis, options = {}) {
        const categoryColumn = this.selectCategoryColumn(data, analysis);
        const valueColumn = this.selectValueColumn(data, analysis);
        
        // 按數值排序（漏斗圖通常從大到小）
        const sortedData = [...data].sort((a, b) => 
            this.parseNumeric(b[valueColumn]) - this.parseNumeric(a[valueColumn])
        );

        const plotlyData = [{
            type: 'funnel',
            y: sortedData.map(row => row[categoryColumn]),
            x: sortedData.map(row => this.parseNumeric(row[valueColumn])),
            text: sortedData.map(row => this.parseNumeric(row[valueColumn]).toLocaleString()),
            textinfo: 'value+percent initial',
            textposition: 'inside',
            marker: {
                color: this.colorSchemes.business
            }
        }];

        const layout = {
            title: { text: options.title || `${categoryColumn} 轉換漏斗`, font: { size: 16 } },
            margin: { l: 100, r: 50, t: 60, b: 50 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
        };

        return { plotlyData, layout };
    }

    /**
     * 樹狀圖生成器
     */
    async generateTreemapChart(data, analysis, options = {}) {
        const categoryColumn = this.selectCategoryColumn(data, analysis);
        const valueColumn = this.selectValueColumn(data, analysis);
        
        // 聚合數據
        const aggregatedData = this.aggregateData(data, categoryColumn, valueColumn);
        
        const plotlyData = [{
            type: 'treemap',
            labels: Object.keys(aggregatedData),
            values: Object.values(aggregatedData),
            parents: Object.keys(aggregatedData).map(() => ''),
            textinfo: 'label+value+percent parent',
            textfont: { size: 12 },
            marker: {
                colorscale: 'Viridis',
                showscale: true
            }
        }];

        const layout = {
            title: { text: options.title || `${categoryColumn} 樹狀分布`, font: { size: 16 } },
            margin: { l: 20, r: 20, t: 60, b: 20 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
        };

        return { plotlyData, layout };
    }

    /**
     * 箱型圖生成器
     */
    async generateBoxplotChart(data, analysis, options = {}) {
        const numericColumns = analysis.欄位分析.數值欄位;
        
        if (numericColumns.length === 0) {
            throw new Error('箱型圖需要數值欄位');
        }

        const targetColumn = options.column || numericColumns[0];
        const groupByColumn = options.groupBy || analysis.欄位分析.類別欄位[0];

        let plotlyData;

        if (groupByColumn) {
            // 分組箱型圖
            const groups = this.groupBy(data, groupByColumn);
            plotlyData = Object.entries(groups).map(([group, groupData]) => ({
                type: 'box',
                y: groupData.map(row => this.parseNumeric(row[targetColumn])),
                name: group,
                boxpoints: 'outliers',
                marker: { size: 4 }
            }));
        } else {
            // 單一箱型圖
            plotlyData = [{
                type: 'box',
                y: data.map(row => this.parseNumeric(row[targetColumn])),
                name: targetColumn,
                boxpoints: 'outliers',
                marker: { size: 4 }
            }];
        }

        const layout = {
            title: { text: options.title || `${targetColumn} 分布分析`, font: { size: 16 } },
            yaxis: { title: targetColumn },
            xaxis: { title: groupByColumn || '數據' },
            margin: { l: 60, r: 50, t: 60, b: 50 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
        };

        return { plotlyData, layout };
    }

    /**
     * 3D 散佈圖生成器
     */
    async generateScatter3dChart(data, analysis, options = {}) {
        const numericColumns = analysis.欄位分析.數值欄位;
        
        if (numericColumns.length < 3) {
            throw new Error('3D散佈圖需要至少3個數值欄位');
        }

        const xColumn = options.xColumn || numericColumns[0];
        const yColumn = options.yColumn || numericColumns[1];
        const zColumn = options.zColumn || numericColumns[2];
        const colorColumn = options.colorColumn || analysis.欄位分析.類別欄位[0];

        const plotlyData = [{
            type: 'scatter3d',
            mode: 'markers',
            x: data.map(row => this.parseNumeric(row[xColumn])),
            y: data.map(row => this.parseNumeric(row[yColumn])),
            z: data.map(row => this.parseNumeric(row[zColumn])),
            text: data.map(row => `${xColumn}: ${row[xColumn]}<br>${yColumn}: ${row[yColumn]}<br>${zColumn}: ${row[zColumn]}`),
            marker: {
                size: 5,
                color: colorColumn ? data.map(row => row[colorColumn]) : this.colorSchemes.default[0],
                colorscale: 'Viridis',
                showscale: !!colorColumn
            }
        }];

        const layout = {
            title: { text: options.title || '3D 數據探索', font: { size: 16 } },
            scene: {
                xaxis: { title: xColumn },
                yaxis: { title: yColumn },
                zaxis: { title: zColumn }
            },
            margin: { l: 0, r: 0, t: 60, b: 0 },
            paper_bgcolor: 'rgba(0,0,0,0)'
        };

        return { plotlyData, layout };
    }

    /**
     * 補充的 Plotly 圖表生成方法
     * 添加到你的 PlotlyChartGenerator.js 中
     */

    /**
     * 小提琴圖生成器
     */
    async generateViolinChart(data, analysis, options = {}) {
        const numericColumns = analysis.欄位分析.數值欄位;
        
        if (numericColumns.length === 0) {
            throw new Error('小提琴圖需要數值欄位');
        }

        const targetColumn = options.column || numericColumns[0];
        const groupByColumn = options.groupBy || analysis.欄位分析.類別欄位[0];

        let plotlyData;

        if (groupByColumn) {
            // 分組小提琴圖
            const groups = this.groupBy(data, groupByColumn);
            plotlyData = Object.entries(groups).map(([group, groupData]) => ({
                type: 'violin',
                y: groupData.map(row => this.parseNumeric(row[targetColumn])),
                name: group,
                box: { visible: true },
                meanline: { visible: true }
            }));
        } else {
            // 單一小提琴圖
            plotlyData = [{
                type: 'violin',
                y: data.map(row => this.parseNumeric(row[targetColumn])),
                name: targetColumn,
                box: { visible: true },
                meanline: { visible: true }
            }];
        }

        const layout = {
            title: { text: options.title || `${targetColumn} 分布分析（小提琴圖）`, font: { size: 16 } },
            yaxis: { title: targetColumn },
            xaxis: { title: groupByColumn || '數據' },
            margin: { l: 60, r: 50, t: 60, b: 50 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
        };

        return { plotlyData, layout };
    }

    /**
     * 平行座標圖生成器
     */
    async generateParallelChart(data, analysis, options = {}) {
        const numericColumns = analysis.欄位分析.數值欄位;
        
        if (numericColumns.length < 3) {
            throw new Error('平行座標圖需要至少3個數值欄位');
        }

        // 限制維度數量（避免過於複雜）
        const selectedColumns = numericColumns.slice(0, 8);
        
        // 為每個維度準備數據
        const dimensions = selectedColumns.map(col => {
            const values = data.map(row => this.parseNumeric(row[col]));
            return {
                label: col,
                values: values,
                range: [Math.min(...values), Math.max(...values)]
            };
        });

        const plotlyData = [{
            type: 'parcoords',
            line: {
                color: data.map((row, index) => index), // 使用索引作為顏色
                colorscale: 'Viridis',
                showscale: true,
                colorbar: {
                    title: '數據點索引'
                }
            },
            dimensions: dimensions
        }];

        const layout = {
            title: { text: options.title || '多維度平行座標分析', font: { size: 16 } },
            margin: { l: 60, r: 60, t: 60, b: 50 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
        };

        return { plotlyData, layout };
    }

    /**
     * 進階熱力圖生成器
     */
    async generateHeatmapChart(data, analysis, options = {}) {
        const numericColumns = analysis.欄位分析.數值欄位;
        
        if (numericColumns.length < 2) {
            throw new Error('熱力圖需要至少2個數值欄位');
        }

        // 計算相關係數矩陣
        const correlationMatrix = this.calculateCorrelationMatrix(data, numericColumns);
        
        const plotlyData = [{
            type: 'heatmap',
            z: correlationMatrix.values,
            x: correlationMatrix.columns,
            y: correlationMatrix.columns,
            colorscale: 'RdBu',
            zmid: 0,
            colorbar: {
                title: '相關係數'
            },
            hoverongaps: false,
            hovertemplate: '<b>%{x}</b> vs <b>%{y}</b><br>相關係數: %{z:.3f}<extra></extra>'
        }];

        const layout = {
            title: { text: options.title || '變數相關性熱力圖', font: { size: 16 } },
            xaxis: { title: '變數' },
            yaxis: { title: '變數' },
            margin: { l: 100, r: 50, t: 60, b: 100 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
        };

        return { plotlyData, layout };
    }

    /**
     * 儀表板圖生成器
     */
    async generateGaugeChart(data, analysis, options = {}) {
        const numericColumns = analysis.欄位分析.數值欄位;
        
        if (numericColumns.length === 0) {
            throw new Error('儀表板需要數值欄位');
        }

        const targetColumn = options.column || numericColumns[0];
        const values = data.map(row => this.parseNumeric(row[targetColumn])).filter(v => !isNaN(v));
        
        if (values.length === 0) {
            throw new Error('沒有有效的數值數據');
        }

        // 計算統計值
        const currentValue = options.value || values[values.length - 1]; // 使用最後一個值或指定值
        const min = Math.min(...values);
        const max = Math.max(...values);
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;

        const plotlyData = [{
            type: 'indicator',
            mode: 'gauge+number+delta',
            value: currentValue,
            domain: { x: [0, 1], y: [0, 1] },
            title: { text: targetColumn },
            delta: { reference: avg },
            gauge: {
                axis: { range: [min, max] },
                bar: { color: 'darkblue' },
                steps: [
                    { range: [min, avg], color: 'lightgray' },
                    { range: [avg, max], color: 'gray' }
                ],
                threshold: {
                    line: { color: 'red', width: 4 },
                    thickness: 0.75,
                    value: avg
                }
            }
        }];

        const layout = {
            title: { text: options.title || `${targetColumn} 儀表板`, font: { size: 16 } },
            margin: { l: 20, r: 20, t: 60, b: 20 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
        };

        return { plotlyData, layout };
    }

    /**
     * KPI 卡片生成器
     */
    async generateKpiChart(data, analysis, options = {}) {
        const numericColumns = analysis.欄位分析.數值欄位;
        
        if (numericColumns.length === 0) {
            throw new Error('KPI卡片需要數值欄位');
        }

        // 取前4個數值欄位作為 KPI
        const kpiColumns = numericColumns.slice(0, 4);
        const kpiData = kpiColumns.map((col, index) => {
            const values = data.map(row => this.parseNumeric(row[col])).filter(v => !isNaN(v));
            const currentValue = values[values.length - 1] || 0;
            const previousValue = values[values.length - 2] || 0;
            const change = currentValue - previousValue;
            const changePercent = previousValue !== 0 ? (change / previousValue) * 100 : 0;

            return {
                type: 'indicator',
                mode: 'number+delta',
                value: currentValue,
                number: {
                    font: { size: 40 }
                },
                delta: {
                    reference: previousValue,
                    relative: true,
                    valueformat: '.1%'
                },
                title: {
                    text: col,
                    font: { size: 20 }
                },
                domain: {
                    x: [(index % 2) * 0.5, ((index % 2) + 1) * 0.5],
                    y: [Math.floor(index / 2) * 0.5, (Math.floor(index / 2) + 1) * 0.5]
                }
            };
        });

        const layout = {
            title: { text: options.title || 'KPI 儀表板', font: { size: 16 } },
            grid: { rows: 2, columns: 2, pattern: 'independent' },
            margin: { l: 20, r: 20, t: 60, b: 20 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
        };

        return { plotlyData: kpiData, layout };
    }

    /**
     * 計算相關係數矩陣
     */
    calculateCorrelationMatrix(data, columns) {
        const matrix = [];
        
        for (let i = 0; i < columns.length; i++) {
            const row = [];
            for (let j = 0; j < columns.length; j++) {
                if (i === j) {
                    row.push(1); // 對角線為1
                } else {
                    const correlation = this.pearsonCorrelation(data, columns[i], columns[j]);
                    row.push(isNaN(correlation) ? 0 : correlation);
                }
            }
            matrix.push(row);
        }
        
        return {
            values: matrix,
            columns: columns
        };
    }

    /**
     * 計算皮爾森相關係數
     */
    pearsonCorrelation(data, col1, col2) {
        const pairs = data.map(row => ({
            x: this.parseNumeric(row[col1]),
            y: this.parseNumeric(row[col2])
        })).filter(pair => !isNaN(pair.x) && !isNaN(pair.y));

        if (pairs.length < 2) return NaN;

        const n = pairs.length;
        const sumX = pairs.reduce((sum, pair) => sum + pair.x, 0);
        const sumY = pairs.reduce((sum, pair) => sum + pair.y, 0);
        const sumXY = pairs.reduce((sum, pair) => sum + pair.x * pair.y, 0);
        const sumX2 = pairs.reduce((sum, pair) => sum + pair.x * pair.x, 0);
        const sumY2 = pairs.reduce((sum, pair) => sum + pair.y * pair.y, 0);

        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

        return denominator === 0 ? 0 : numerator / denominator;
    }

    // ==========================================
    // 輔助方法
    // ==========================================

    /**
     * 處理桑基圖數據 (改寫自你的 React 版本)
     */
    processSankeyData(data, options) {
        const { sourceColumn, targetColumn, valueColumn } = options;
        const firstRow = data[0];
        const columns = Object.keys(firstRow);

        // 自動識別欄位
        const source = sourceColumn || columns[0];
        const target = targetColumn || columns[1];
        const value = valueColumn || columns.find(col => 
            !isNaN(parseFloat(firstRow[col]))
        ) || columns[2];

        if (!source || !target || !value) {
            return null;
        }

        // 提取所有唯一節點
        const allNodes = new Set();
        data.forEach(row => {
            if (row[source]) allNodes.add(String(row[source]));
            if (row[target]) allNodes.add(String(row[target]));
        });

        const nodeList = Array.from(allNodes);
        const nodeMap = {};
        nodeList.forEach((node, index) => {
            nodeMap[node] = index;
        });

        // 建立連結數據
        const links = { source: [], target: [], value: [], label: [] };

        // 聚合相同來源和目標的數值
        const linkMap = {};
        data.forEach(row => {
            const sourceNode = String(row[source]);
            const targetNode = String(row[target]);
            const linkValue = parseFloat(row[value]) || 0;
            
            if (sourceNode && targetNode && linkValue > 0) {
                const linkKey = `${sourceNode}_${targetNode}`;
                linkMap[linkKey] = (linkMap[linkKey] || 0) + linkValue;
            }
        });

        // 轉換為 Plotly 格式
        Object.entries(linkMap).forEach(([linkKey, linkValue]) => {
            const [sourceNode, targetNode] = linkKey.split('_');
            
            if (nodeMap.hasOwnProperty(sourceNode) && nodeMap.hasOwnProperty(targetNode)) {
                links.source.push(nodeMap[sourceNode]);
                links.target.push(nodeMap[targetNode]);
                links.value.push(linkValue);
                links.label.push(`${sourceNode} → ${targetNode}: ${linkValue.toLocaleString()}`);
            }
        });

        if (links.source.length === 0) {
            return null;
        }

        // 生成節點顏色
        const nodeColors = nodeList.map((node, index) => {
            return this.colorSchemes.business[index % this.colorSchemes.business.length];
        });

        return {
            nodes: nodeList,
            links: links,
            nodeColors: nodeColors,
            sourceColumn: source,
            targetColumn: target,
            valueColumn: value
        };
    }

    /**
     * 聚合數據
     */
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

    /**
     * 分組數據
     */
    groupBy(data, column) {
        return data.reduce((groups, row) => {
            const key = row[column] || '未分類';
            if (!groups[key]) groups[key] = [];
            groups[key].push(row);
            return groups;
        }, {});
    }

    /**
     * 選擇最佳類別欄位
     */
    selectCategoryColumn(data, analysis) {
        return analysis.欄位分析.類別欄位[0] || Object.keys(data[0])[0];
    }

    /**
     * 選擇最佳數值欄位
     */
    selectValueColumn(data, analysis) {
        return analysis.欄位分析.數值欄位[0] || Object.keys(data[0])[1];
    }

    /**
     * 解析數值
     */
    parseNumeric(value) {
        if (typeof value === 'number') return value;
        const cleaned = String(value).replace(/[,\s$%]/g, '');
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : parsed;
    }

    /**
     * 添加透明度到顏色
     */
    addAlpha(color, alpha) {
        if (color.startsWith('#')) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
        return color;
    }

    /**
     * 首字母大寫
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * 驗證 Plotly 圖表可行性
     */
    validatePlotlyChartViability(data, chartType, analysis) {
        const chartInfo = this.plotlyTypes[chartType];
        
        if (!chartInfo) {
            return { valid: false, reason: '不支援的 Plotly 圖表類型' };
        }

        const { 數值欄位, 類別欄位 } = analysis.欄位分析;
        const totalColumns = 數值欄位.length + 類別欄位.length;

        if (totalColumns < chartInfo.minColumns) {
            return { 
                valid: false, 
                reason: `${chartInfo.name}需要至少${chartInfo.minColumns}個欄位` 
            };
        }

        // 特定圖表驗證
        switch (chartType) {
            case 'sankey':
                if (totalColumns < 3) {
                    return { valid: false, reason: '桑基圖需要來源、目標、數值三個欄位' };
                }
                break;
            case 'scatter3d':
                if (數值欄位.length < 3) {
                    return { valid: false, reason: '3D散佈圖需要至少3個數值欄位' };
                }
                break;
        }

        return { valid: true };
    }
}

// 全域實例
window.plotlyChartGenerator = new PlotlyChartGenerator();