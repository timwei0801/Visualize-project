/* ==========================================
   通用數據分析引擎 - DataAnalyzer
   支援各種格式和結構的數據分析
   ========================================== */

class DataAnalyzer {
    constructor() {
        this.supportedFormats = ['csv', 'json', 'xlsx', 'xls'];
        this.datePatterns = [
            /^\d{4}-\d{2}-\d{2}$/,           // YYYY-MM-DD
            /^\d{2}\/\d{2}\/\d{4}$/,         // MM/DD/YYYY
            /^\d{2}-\d{2}-\d{4}$/,           // DD-MM-YYYY
            /^\d{4}\/\d{2}\/\d{2}$/,         // YYYY/MM/DD
            /^\d{1,2}\/\d{1,2}\/\d{4}$/,     // M/D/YYYY
            /^\d{4}-\d{1,2}-\d{1,2}$/,       // YYYY-M-D
        ];
        this.timePatterns = [
            /^\d{1,2}:\d{2}(:\d{2})?$/,      // HH:MM or HH:MM:SS
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, // ISO datetime
        ];
    }

    /**
     * 分析數據並返回詳細的分析結果
     * @param {Array} data - 數據陣列
     * @returns {Object} 分析結果
     */
    analyzeData(data) {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return this.getEmptyAnalysis();
        }

        const analysis = {
            基本信息: this.getBasicInfo(data),
            欄位分析: this.analyzeColumns(data),
            數據質量: this.analyzeDataQuality(data),
            統計摘要: this.getStatisticalSummary(data),
            推薦圖表: this.recommendCharts(data),
            數據洞察: this.generateInsights(data)
        };

        return analysis;
    }

    /**
     * 獲取基本信息
     */
    getBasicInfo(data) {
        const firstRow = data[0] || {};
        const columns = Object.keys(firstRow);
        
        return {
            總行數: data.length,
            欄位數: columns.length,
            欄位列表: columns,
            檔案大小估計: this.estimateDataSize(data),
            最後更新: new Date().toISOString()
        };
    }

    /**
     * 分析欄位類型和特徵
     */
    analyzeColumns(data) {
        if (data.length === 0) return {};

        const columns = Object.keys(data[0]);
        const analysis = {};

        columns.forEach(column => {
            analysis[column] = this.analyzeColumn(data, column);
        });

        // 分類匯總
        const 數值欄位 = columns.filter(col => analysis[col].類型 === 'numeric');
        const 類別欄位 = columns.filter(col => analysis[col].類型 === 'categorical');
        const 時間欄位 = columns.filter(col => analysis[col].類型 === 'datetime' || analysis[col].類型 === 'date');
        const 文字欄位 = columns.filter(col => analysis[col].類型 === 'text');

        return {
            詳細分析: analysis,
            數值欄位,
            類別欄位,
            時間欄位,
            文字欄位,
            欄位統計: {
                數值: 數值欄位.length,
                類別: 類別欄位.length,
                時間: 時間欄位.length,
                文字: 文字欄位.length
            }
        };
    }

    /**
     * 分析單一欄位
     */
    analyzeColumn(data, columnName) {
        const values = data.map(row => row[columnName]).filter(val => val !== null && val !== undefined && val !== '');
        const totalCount = data.length;
        const validCount = values.length;
        const nullCount = totalCount - validCount;

        if (validCount === 0) {
            return {
                類型: 'empty',
                缺失率: 100,
                唯一值數量: 0,
                範例值: []
            };
        }

        // 類型檢測
        const type = this.detectColumnType(values);
        
        // 基本統計
        const uniqueValues = [...new Set(values)];
        const analysis = {
            類型: type,
            缺失率: Math.round((nullCount / totalCount) * 100),
            唯一值數量: uniqueValues.length,
            重複率: Math.round(((validCount - uniqueValues.length) / validCount) * 100),
            範例值: uniqueValues.slice(0, 5)
        };

        // 根據類型添加特定分析
        switch (type) {
            case 'numeric':
                analysis.統計 = this.getNumericStats(values);
                break;
            case 'categorical':
                analysis.分布 = this.getCategoricalDistribution(values);
                break;
            case 'datetime':
            case 'date':
                analysis.時間範圍 = this.getDateTimeRange(values);
                break;
            case 'text':
                analysis.文字統計 = this.getTextStats(values);
                break;
        }

        return analysis;
    }

    /**
     * 檢測欄位類型
     */
    detectColumnType(values) {
        const sampleSize = Math.min(values.length, 100);
        const sample = values.slice(0, sampleSize);
        
        let numericCount = 0;
        let dateCount = 0;
        let textCount = 0;

        sample.forEach(value => {
            const strValue = String(value).trim();
            
            // 檢查是否為數值
            if (this.isNumeric(strValue)) {
                numericCount++;
            }
            // 檢查是否為日期時間
            else if (this.isDateTime(strValue)) {
                dateCount++;
            }
            // 其他為文字
            else {
                textCount++;
            }
        });

        const total = sample.length;
        const numericRatio = numericCount / total;
        const dateRatio = dateCount / total;

        // 決定類型 (80% 閾值)
        if (numericRatio >= 0.8) {
            return 'numeric';
        } else if (dateRatio >= 0.8) {
            return this.hasTimeComponent(sample) ? 'datetime' : 'date';
        } else if (numericRatio > 0.5) {
            return 'mixed_numeric';
        } else {
            // 進一步判斷是類別還是文字
            const uniqueRatio = [...new Set(sample)].length / total;
            return uniqueRatio < 0.5 ? 'categorical' : 'text';
        }
    }

    /**
     * 檢查是否為數值
     */
    isNumeric(value) {
        if (value === '' || value === null || value === undefined) return false;
        
        // 移除常見的非數值字符
        const cleaned = String(value).replace(/[,\s$%]/g, '');
        
        return !isNaN(cleaned) && !isNaN(parseFloat(cleaned)) && isFinite(cleaned);
    }

    /**
     * 檢查是否為日期時間
     */
    isDateTime(value) {
        if (!value) return false;
        
        const strValue = String(value).trim();
        
        // 檢查正則表達式
        for (const pattern of [...this.datePatterns, ...this.timePatterns]) {
            if (pattern.test(strValue)) {
                return true;
            }
        }
        
        // 使用 Date 建構子檢查
        const date = new Date(strValue);
        return !isNaN(date.getTime()) && strValue.length > 4;
    }

    /**
     * 檢查是否包含時間組件
     */
    hasTimeComponent(values) {
        return values.some(value => {
            const strValue = String(value);
            return strValue.includes(':') || strValue.includes('T');
        });
    }

    /**
     * 獲取數值統計
     */
    getNumericStats(values) {
        const numbers = values.map(v => {
            const cleaned = String(v).replace(/[,\s$%]/g, '');
            return parseFloat(cleaned);
        }).filter(n => !isNaN(n));

        if (numbers.length === 0) return null;

        const sorted = numbers.sort((a, b) => a - b);
        const sum = numbers.reduce((a, b) => a + b, 0);
        const mean = sum / numbers.length;

        return {
            最小值: Math.min(...numbers),
            最大值: Math.max(...numbers),
            平均值: Math.round(mean * 100) / 100,
            中位數: this.getMedian(sorted),
            標準差: Math.round(this.getStandardDeviation(numbers, mean) * 100) / 100,
            範圍: Math.max(...numbers) - Math.min(...numbers),
            四分位數: {
                Q1: this.getPercentile(sorted, 25),
                Q3: this.getPercentile(sorted, 75)
            }
        };
    }

    /**
     * 獲取類別分布
     */
    getCategoricalDistribution(values) {
        const distribution = {};
        values.forEach(value => {
            const key = String(value);
            distribution[key] = (distribution[key] || 0) + 1;
        });

        // 排序並取前10個
        const sorted = Object.entries(distribution)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);

        return {
            分布統計: Object.fromEntries(sorted),
            類別數量: Object.keys(distribution).length,
            最常見: sorted[0] ? sorted[0][0] : null,
            最常見次數: sorted[0] ? sorted[0][1] : 0
        };
    }

    /**
     * 獲取日期時間範圍
     */
    getDateTimeRange(values) {
        const dates = values.map(v => new Date(v)).filter(d => !isNaN(d.getTime()));
        
        if (dates.length === 0) return null;

        const sortedDates = dates.sort((a, b) => a - b);
        
        return {
            最早日期: sortedDates[0].toISOString().split('T')[0],
            最晚日期: sortedDates[sortedDates.length - 1].toISOString().split('T')[0],
            時間跨度天數: Math.ceil((sortedDates[sortedDates.length - 1] - sortedDates[0]) / (1000 * 60 * 60 * 24)),
            日期數量: dates.length
        };
    }

    /**
     * 獲取文字統計
     */
    getTextStats(values) {
        const textValues = values.map(v => String(v));
        const lengths = textValues.map(v => v.length);
        
        return {
            平均長度: Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length),
            最短長度: Math.min(...lengths),
            最長長度: Math.max(...lengths),
            包含數字: textValues.filter(v => /\d/.test(v)).length,
            包含特殊字符: textValues.filter(v => /[^a-zA-Z0-9\s]/.test(v)).length
        };
    }

    /**
     * 分析數據質量
     */
    analyzeDataQuality(data) {
        const columns = Object.keys(data[0] || {});
        let totalCells = data.length * columns.length;
        let emptyCells = 0;
        let duplicateRows = 0;

        // 計算缺失值
        data.forEach(row => {
            columns.forEach(col => {
                if (row[col] === null || row[col] === undefined || row[col] === '') {
                    emptyCells++;
                }
            });
        });

        // 檢查重複行
        const uniqueRows = new Set(data.map(row => JSON.stringify(row)));
        duplicateRows = data.length - uniqueRows.size;

        const completeness = Math.round(((totalCells - emptyCells) / totalCells) * 100);
        
        return {
            完整性: completeness,
            缺失值數量: emptyCells,
            重複行數量: duplicateRows,
            質量評分: this.calculateQualityScore(completeness, duplicateRows, data.length),
            建議: this.getQualityRecommendations(completeness, duplicateRows, data.length)
        };
    }

    /**
     * 獲取統計摘要
     */
    getStatisticalSummary(data) {
        const analysis = this.analyzeColumns(data);
        const numericColumns = analysis.數值欄位;
        
        if (numericColumns.length === 0) {
            return { 訊息: '沒有數值欄位可進行統計分析' };
        }

        const correlations = this.calculateCorrelations(data, numericColumns);
        
        return {
            數值欄位統計: numericColumns.reduce((acc, col) => {
                acc[col] = analysis.詳細分析[col].統計;
                return acc;
            }, {}),
            相關性分析: correlations,
            主要發現: this.getKeyFindings(data, analysis)
        };
    }

    /**
     * 推薦圖表類型
     */
    recommendCharts(data) {
        const analysis = this.analyzeColumns(data);
        const recommendations = [];

        const { 數值欄位, 類別欄位, 時間欄位 } = analysis;

        // 基於數據特徵推薦
        if (時間欄位.length > 0 && 數值欄位.length > 0) {
            recommendations.push({
                類型: 'line',
                原因: '有時間序列數據，適合顯示趨勢',
                優先級: 'high'
            });
        }

        if (類別欄位.length > 0 && 數值欄位.length > 0) {
            recommendations.push({
                類型: 'bar',
                原因: '有類別和數值數據，適合比較分析',
                優先級: 'high'
            });

            if (類別欄位.length === 1) {
                const categoryAnalysis = analysis.詳細分析[類別欄位[0]];
                if (categoryAnalysis.唯一值數量 <= 10) {
                    recommendations.push({
                        類型: 'pie',
                        原因: '類別較少，適合顯示比例關係',
                        優先級: 'medium'
                    });
                }
            }
        }

        if (數值欄位.length >= 2) {
            recommendations.push({
                類型: 'scatter',
                原因: '有多個數值欄位，可分析相關性',
                優先級: 'medium'
            });

            if (數值欄位.length >= 3) {
                recommendations.push({
                    類型: 'bubble',
                    原因: '有三個以上數值欄位，可做多維度分析',
                    優先級: 'medium'
                });
            }
        }

        if (數值欄位.length >= 3 && 數值欄位.length <= 8) {
            recommendations.push({
                類型: 'radar',
                原因: '適合多維度指標比較',
                優先級: 'low'
            });
        }

        // 根據數據大小調整建議
        if (data.length > 1000) {
            recommendations.push({
                類型: 'heatmap',
                原因: '大量數據適合使用熱力圖',
                優先級: 'medium'
            });
        }

        return recommendations;
    }

    /**
     * 生成數據洞察
     */
    generateInsights(data) {
        const analysis = this.analyzeColumns(data);
        const insights = [];

        // 數據規模洞察
        if (data.length > 10000) {
            insights.push('這是一個大型數據集，包含超過1萬筆記錄，適合進行深度分析。');
        } else if (data.length < 100) {
            insights.push('這是一個小型數據集，分析結果可能有限，建議收集更多數據。');
        }

        // 數據質量洞察
        const quality = this.analyzeDataQuality(data);
        if (quality.完整性 < 80) {
            insights.push(`數據完整性為${quality.完整性}%，建議處理缺失值以提高分析準確性。`);
        }

        // 欄位類型洞察
        const { 數值欄位, 類別欄位, 時間欄位 } = analysis;
        if (時間欄位.length > 0) {
            insights.push('檢測到時間欄位，可進行時間序列分析和趨勢預測。');
        }

        if (數值欄位.length > 類別欄位.length) {
            insights.push('數值欄位較多，適合進行統計分析和機器學習建模。');
        } else if (類別欄位.length > 數值欄位.length) {
            insights.push('類別欄位較多，適合進行分類分析和交叉表分析。');
        }

        // 相關性洞察
        if (數值欄位.length >= 2) {
            const correlations = this.calculateCorrelations(data, 數值欄位);
            const strongCorrelations = Object.entries(correlations)
                .filter(([key, value]) => Math.abs(value) > 0.7);
            
            if (strongCorrelations.length > 0) {
                insights.push(`發現強相關性：${strongCorrelations.map(([key, value]) => 
                    `${key} (${value > 0 ? '正' : '負'}相關 ${Math.abs(value).toFixed(2)})`
                ).join(', ')}`);
            }
        }

        return insights;
    }

    /**
     * 計算相關性
     */
    calculateCorrelations(data, numericColumns) {
        const correlations = {};
        
        for (let i = 0; i < numericColumns.length; i++) {
            for (let j = i + 1; j < numericColumns.length; j++) {
                const col1 = numericColumns[i];
                const col2 = numericColumns[j];
                
                const correlation = this.pearsonCorrelation(data, col1, col2);
                if (!isNaN(correlation)) {
                    correlations[`${col1} vs ${col2}`] = Math.round(correlation * 100) / 100;
                }
            }
        }
        
        return correlations;
    }

    /**
     * 計算皮爾森相關係數
     */
    pearsonCorrelation(data, col1, col2) {
        const pairs = data.map(row => ({
            x: parseFloat(String(row[col1]).replace(/[,\s$%]/g, '')),
            y: parseFloat(String(row[col2]).replace(/[,\s$%]/g, ''))
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

    /**
     * 輔助函數
     */
    getMedian(sortedArray) {
        const mid = Math.floor(sortedArray.length / 2);
        return sortedArray.length % 2 !== 0 
            ? sortedArray[mid] 
            : (sortedArray[mid - 1] + sortedArray[mid]) / 2;
    }

    getPercentile(sortedArray, percentile) {
        const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
        return sortedArray[Math.max(0, index)];
    }

    getStandardDeviation(numbers, mean) {
        const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
        const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / numbers.length;
        return Math.sqrt(avgSquaredDiff);
    }

    estimateDataSize(data) {
        const jsonString = JSON.stringify(data);
        const sizeInBytes = new Blob([jsonString]).size;
        
        if (sizeInBytes < 1024) return `${sizeInBytes} B`;
        if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
        return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    calculateQualityScore(completeness, duplicateRows, totalRows) {
        const completenessScore = completeness;
        const uniquenessScore = ((totalRows - duplicateRows) / totalRows) * 100;
        return Math.round((completenessScore + uniquenessScore) / 2);
    }

    getQualityRecommendations(completeness, duplicateRows, totalRows) {
        const recommendations = [];
        
        if (completeness < 90) {
            recommendations.push('建議處理缺失值');
        }
        if (duplicateRows > 0) {
            recommendations.push('建議移除重複資料');
        }
        if (recommendations.length === 0) {
            recommendations.push('數據質量良好');
        }
        
        return recommendations;
    }

    getKeyFindings(data, analysis) {
        const findings = [];
        const { 數值欄位 } = analysis;
        
        // 找出數值最大的欄位
        if (數值欄位.length > 0) {
            const maxColumn = 數值欄位.reduce((max, col) => {
                const currentMax = analysis.詳細分析[col].統計?.最大值 || 0;
                const prevMax = analysis.詳細分析[max].統計?.最大值 || 0;
                return currentMax > prevMax ? col : max;
            });
            
            findings.push(`${maxColumn} 欄位有最大的數值範圍`);
        }
        
        return findings;
    }

    getEmptyAnalysis() {
        return {
            基本信息: { 總行數: 0, 欄位數: 0, 欄位列表: [] },
            欄位分析: { 數值欄位: [], 類別欄位: [], 時間欄位: [], 文字欄位: [] },
            數據質量: { 完整性: 0, 質量評分: 0 },
            統計摘要: { 訊息: '無數據可分析' },
            推薦圖表: [],
            數據洞察: ['請上傳數據檔案開始分析']
        };
    }
}

// 全域實例
window.dataAnalyzer = new DataAnalyzer();