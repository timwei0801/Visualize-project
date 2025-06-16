/**
 * HTML 轉 PDF 生成器 - 完美支援中文
 * 先生成美觀的 HTML，再轉換為 PDF
 */

class HTMLToPDFGenerator {
    constructor() {
        this.defaultStyles = {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#333',
            backgroundColor: '#ffffff'
        };
    }

    /**
     * 生成完整的 HTML 報告
     */
    generateReportHTML(reportData) {
        const html = `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI 智能數據分析報告</title>
    <style>
        ${this.getReportStyles()}
    </style>
</head>
<body>
    <div class="report-container">
        ${this.generateHeader(reportData)}
        ${this.generateMetadata(reportData)}
        ${this.generateTableOfContents(reportData)}
        ${this.generateAnalysisContent(reportData)}
        ${this.generateChartsSection(reportData)}
        ${this.generateFooter(reportData)}
    </div>
</body>
</html>`;
        
        return html;
    }

    /**
     * 生成報告樣式
     */
    getReportStyles() {
        return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: ${this.defaultStyles.fontFamily};
            font-size: ${this.defaultStyles.fontSize};
            line-height: ${this.defaultStyles.lineHeight};
            color: ${this.defaultStyles.color};
            background-color: ${this.defaultStyles.backgroundColor};
        }

        .report-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            background: white;
        }

        /* 標題樣式 */
        .report-header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #1976d2;
        }

        .report-title {
            font-size: 28px;
            font-weight: bold;
            color: #1976d2;
            margin-bottom: 10px;
        }

        .report-subtitle {
            font-size: 16px;
            color: #666;
            font-weight: normal;
        }

        /* 元數據樣式 */
        .metadata-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #1976d2;
        }

        .metadata-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }

        .metadata-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }

        .metadata-label {
            font-weight: 600;
            color: #555;
        }

        .metadata-value {
            color: #1976d2;
            font-weight: 500;
        }

        /* 目錄樣式 */
        .toc-section {
            background: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
        }

        .toc-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
            border-bottom: 2px solid #1976d2;
            padding-bottom: 8px;
        }

        .toc-list {
            list-style: none;
        }

        .toc-item {
            padding: 5px 0;
            border-bottom: 1px dotted #ddd;
        }

        .toc-link {
            color: #1976d2;
            text-decoration: none;
            font-weight: 500;
        }

        /* 內容區塊樣式 */
        .content-section {
            margin-bottom: 30px;
            padding: 20px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #1976d2;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e3f2fd;
        }

        .subsection-title {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin: 20px 0 10px 0;
        }

        .content-text {
            margin-bottom: 15px;
            text-align: justify;
        }

        /* 清單樣式 */
        .insights-list,
        .recommendations-list {
            list-style: none;
            margin: 15px 0;
        }

        .insights-list li,
        .recommendations-list li {
            padding: 10px 0;
            border-left: 4px solid #4caf50;
            padding-left: 15px;
            margin-bottom: 10px;
            background: #f8fffe;
        }

        .recommendations-list li {
            border-left-color: #ff9800;
            background: #fffbf0;
        }

        /* 圖表區域樣式 */
        .charts-section {
            margin-top: 40px;
        }

        .chart-container {
            margin-bottom: 30px;
            padding: 20px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .chart-title {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin-bottom: 15px;
            text-align: center;
        }

        .chart-image {
            width: 100%;
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .chart-description {
            margin-top: 10px;
            font-size: 13px;
            color: #666;
            text-align: center;
            font-style: italic;
        }

        /* 頁腳樣式 */
        .report-footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
            text-align: center;
            color: #666;
            font-size: 12px;
        }

        .footer-note {
            margin-bottom: 10px;
        }

        /* 強調樣式 */
        .highlight {
            background: linear-gradient(120deg, #a8e6cf 0%, #dcedc1 100%);
            padding: 15px;
            border-radius: 6px;
            margin: 15px 0;
            border-left: 4px solid #4caf50;
        }

        .warning {
            background: linear-gradient(120deg, #ffeaa7 0%, #fab1a0 100%);
            padding: 15px;
            border-radius: 6px;
            margin: 15px 0;
            border-left: 4px solid #e17055;
        }

        /* 表格樣式 */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 13px;
        }

        .data-table th,
        .data-table td {
            border: 1px solid #ddd;
            padding: 8px 12px;
            text-align: left;
        }

        .data-table th {
            background: #1976d2;
            color: white;
            font-weight: 600;
        }

        .data-table tr:nth-child(even) {
            background: #f8f9fa;
        }

        /* 響應式設計 */
        @media print {
            .report-container {
                padding: 20px;
                box-shadow: none;
            }
            
            .content-section {
                break-inside: avoid;
                page-break-inside: avoid;
            }
            
            .chart-container {
                break-inside: avoid;
                page-break-inside: avoid;
            }
        }

        @page {
            margin: 2cm;
            size: A4;
        }
        `;
    }

    /**
     * 生成報告標題
     */
    generateHeader(reportData) {
        return `
        <div class="report-header">
            <h1 class="report-title">🤖 AI 智能數據分析報告</h1>
            <p class="report-subtitle">基於機器學習的深度數據洞察與商業建議</p>
        </div>
        `;
    }

    /**
     * 生成元數據區塊
     */
    generateMetadata(reportData) {
        const metadata = reportData.metadata || {};
        const generatedTime = new Date().toLocaleString('zh-TW');
        
        return `
        <div class="metadata-section">
            <h2 class="section-title">📊 報告資訊</h2>
            <div class="metadata-grid">
                <div class="metadata-item">
                    <span class="metadata-label">生成時間：</span>
                    <span class="metadata-value">${generatedTime}</span>
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">AI 分析引擎：</span>
                    <span class="metadata-value">${metadata.aiProvider || '智能模擬分析'}</span>
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">數據記錄數：</span>
                    <span class="metadata-value">${(metadata.dataSize || 0).toLocaleString()} 筆</span>
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">視覺化圖表：</span>
                    <span class="metadata-value">${metadata.chartCount || 0} 個</span>
                </div>
            </div>
        </div>
        `;
    }

    /**
     * 生成目錄
     */
    generateTableOfContents(reportData) {
        return `
        <div class="toc-section">
            <h2 class="toc-title">📋 報告目錄</h2>
            <ul class="toc-list">
                <li class="toc-item"><a href="#executive-summary" class="toc-link">1. 執行摘要</a></li>
                <li class="toc-item"><a href="#data-quality" class="toc-link">2. 數據品質評估</a></li>
                <li class="toc-item"><a href="#chart-analysis" class="toc-link">3. 圖表深度分析</a></li>
                <li class="toc-item"><a href="#key-insights" class="toc-link">4. 關鍵洞察發現</a></li>
                <li class="toc-item"><a href="#recommendations" class="toc-link">5. 建議行動方案</a></li>
                <li class="toc-item"><a href="#charts" class="toc-link">6. 視覺化圖表</a></li>
                <li class="toc-item"><a href="#conclusion" class="toc-link">7. 結論與展望</a></li>
            </ul>
        </div>
        `;
    }

    /**
     * 生成分析內容
     */
    generateAnalysisContent(reportData) {
        const analysisText = reportData.content?.aiAnalysis || '分析內容生成中...';
        
        // 將 Markdown 轉換為 HTML
        const htmlContent = this.markdownToHTML(analysisText);
        
        return `
        <div class="content-section" id="analysis-content">
            ${htmlContent}
        </div>
        `;
    }

    /**
     * 生成圖表區塊
     */
    generateChartsSection(reportData) {
        const charts = reportData.content?.charts || [];
        
        if (charts.length === 0) {
            return `
            <div class="charts-section" id="charts">
                <h2 class="section-title">📈 視覺化圖表</h2>
                <p class="content-text">目前沒有可顯示的圖表。</p>
            </div>
            `;
        }

        let chartsHTML = `
        <div class="charts-section" id="charts">
            <h2 class="section-title">📈 視覺化圖表</h2>
        `;

        charts.forEach((chart, index) => {
            chartsHTML += `
            <div class="chart-container">
                <h3 class="chart-title">${index + 1}. ${chart.title}</h3>
                <img src="${chart.image}" alt="${chart.title}" class="chart-image">
                <p class="chart-description">
                    圖表類型：${this.getChartTypeName(chart.type)} | 
                    生成時間：${new Date(chart.timestamp).toLocaleString('zh-TW')}
                </p>
            </div>
            `;
        });

        chartsHTML += `</div>`;
        return chartsHTML;
    }

    /**
     * 生成頁腳
     */
    generateFooter(reportData) {
        return `
        <div class="report-footer">
            <div class="footer-note">
                本報告由智能視覺化系統 v2.0 自動生成
            </div>
            <div class="footer-note">
                分析引擎：${reportData.metadata?.aiProvider || '智能模擬分析'} | 
                生成時間：${new Date().toLocaleString('zh-TW')}
            </div>
            <div class="footer-note">
                © 2025 AI 智能數據分析平台 - 專業版
            </div>
        </div>
        `;
    }

    /**
     * 簡單的 Markdown 轉 HTML
     */
    markdownToHTML(markdown) {
        if (!markdown) return '';

        return markdown
            // 標題轉換
            .replace(/^### (.*$)/gim, '<h3 class="subsection-title" id="$1">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="section-title" id="$1">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="section-title" id="$1">$1</h1>')
            
            // 粗體
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            
            // 斜體
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            
            // 程式碼
            .replace(/`([^`]*)`/gim, '<code>$1</code>')
            
            // 分隔線
            .replace(/^---$/gim, '<hr>')
            
            // 清單項目
            .replace(/^- (.*$)/gim, '<li>$1</li>')
            
            // 段落
            .split('\n\n')
            .map(paragraph => {
                paragraph = paragraph.trim();
                if (!paragraph) return '';
                
                if (paragraph.includes('<h1>') || paragraph.includes('<h2>') || 
                    paragraph.includes('<h3>') || paragraph.includes('<hr>')) {
                    return paragraph;
                }
                
                if (paragraph.includes('<li>')) {
                    return `<ul class="insights-list">${paragraph}</ul>`;
                }
                
                return `<p class="content-text">${paragraph}</p>`;
            })
            .join('\n');
    }

    /**
     * 獲取圖表類型中文名稱
     */
    getChartTypeName(chartType) {
        const names = {
            bar: '長條圖',
            line: '線圖',
            pie: '圓餅圖',
            scatter: '散佈圖',
            boxplot: '箱型圖',
            heatmap: '熱力圖',
            histogram: '直方圖',
            doughnut: '甜甜圈圖',
            area: '面積圖',
            radar: '雷達圖',
            bubble: '氣泡圖',
            sankey: '桑基圖',
            treemap: '樹狀圖',
            kpi: 'KPI 卡片'
        };
        return names[chartType] || chartType;
    }

    /**
     * 轉換為 PDF
     */
    async convertToPDF(htmlContent, filename = null) {
        console.log('📄 開始將 HTML 轉換為 PDF...');

        // 檢查 html2pdf 是否可用
        if (typeof html2pdf === 'undefined') {
            throw new Error('html2pdf 庫未載入');
        }

        try {
            const fileName = filename || `AI分析報告_${new Date().toISOString().split('T')[0]}.pdf`;
            
            // PDF 設定
            const options = {
                margin: [10, 10, 10, 10],
                filename: fileName,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff'
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait',
                    compress: true
                }
            };

            // 創建臨時元素
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            tempDiv.style.width = '210mm';
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '-9999px';
            tempDiv.style.top = '0';
            document.body.appendChild(tempDiv);

            // 轉換為 PDF
            await html2pdf()
                .from(tempDiv)
                .set(options)
                .save();

            // 清理臨時元素
            document.body.removeChild(tempDiv);

            console.log('✅ PDF 生成成功');
            return true;

        } catch (error) {
            console.error('❌ HTML 轉 PDF 失敗:', error);
            throw error;
        }
    }

    /**
     * 預覽 HTML
     */
    previewHTML(htmlContent) {
        const newWindow = window.open('', '_blank');
        newWindow.document.write(htmlContent);
        newWindow.document.close();
    }

    /**
     * 下載 HTML 檔案
     */
    downloadHTML(htmlContent, filename = null) {
        const fileName = filename || `AI分析報告_${new Date().toISOString().split('T')[0]}.html`;
        
        const blob = new Blob([htmlContent], { 
            type: 'text/html;charset=utf-8' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// 全域註冊
window.HTMLToPDFGenerator = HTMLToPDFGenerator;