#!/usr/bin/env node

/**
 * MCP 服務器 - 智能視覺化報告生成工具
 * 讓 AI 能夠調用視覺化系統生成專業統計報告
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

class VizReportMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'viz-report-generator',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupToolHandlers() {
    // 列出可用工具
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'analyze_dashboard_data',
            description: '分析儀表板數據並生成統計洞察',
            inputSchema: {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  description: '原始數據陣列',
                },
                charts: {
                  type: 'array',
                  description: '圖表配置陣列',
                },
                analysisResult: {
                  type: 'object',
                  description: '數據分析結果',
                },
              },
              required: ['data', 'charts', 'analysisResult'],
            },
          },
          {
            name: 'generate_statistical_report',
            description: '生成詳細的統計分析報告',
            inputSchema: {
              type: 'object',
              properties: {
                dashboardData: {
                  type: 'object',
                  description: '儀表板完整數據',
                },
                reportType: {
                  type: 'string',
                  enum: ['executive', 'detailed', 'technical'],
                  description: '報告類型：executive(高管摘要), detailed(詳細分析), technical(技術報告)',
                },
                targetAudience: {
                  type: 'string',
                  enum: ['business', 'technical', 'academic'],
                  description: '目標受眾',
                },
              },
              required: ['dashboardData'],
            },
          },
          {
            name: 'create_presentation_outline',
            description: '創建簡報大綱和內容',
            inputSchema: {
              type: 'object',
              properties: {
                dashboardData: {
                  type: 'object',
                  description: '儀表板數據',
                },
                presentationStyle: {
                  type: 'string',
                  enum: ['business', 'academic', 'storytelling'],
                  description: '簡報風格',
                },
                timeLimit: {
                  type: 'number',
                  description: '簡報時間限制（分鐘）',
                  default: 15,
                },
              },
              required: ['dashboardData'],
            },
          },
          {
            name: 'explain_chart_insights',
            description: '深入解釋特定圖表的統計意義',
            inputSchema: {
              type: 'object',
              properties: {
                chartType: {
                  type: 'string',
                  description: '圖表類型',
                },
                chartData: {
                  type: 'object',
                  description: '圖表數據和配置',
                },
                statisticalContext: {
                  type: 'object',
                  description: '統計背景信息',
                },
              },
              required: ['chartType', 'chartData'],
            },
          },
          {
            name: 'export_dashboard_data',
            description: '匯出儀表板數據為各種格式',
            inputSchema: {
              type: 'object',
              properties: {
                format: {
                  type: 'string',
                  enum: ['json', 'csv', 'excel', 'pdf'],
                  description: '匯出格式',
                },
                includeCharts: {
                  type: 'boolean',
                  description: '是否包含圖表圖像',
                  default: true,
                },
              },
              required: ['format'],
            },
          },
        ],
      };
    });

    // 處理工具調用
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'analyze_dashboard_data':
            return await this.analyzeDashboardData(args);
          case 'generate_statistical_report':
            return await this.generateStatisticalReport(args);
          case 'create_presentation_outline':
            return await this.createPresentationOutline(args);
          case 'explain_chart_insights':
            return await this.explainChartInsights(args);
          case 'export_dashboard_data':
            return await this.exportDashboardData(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `錯誤：${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  // 分析儀表板數據
  async analyzeDashboardData(args) {
    const { data, charts, analysisResult } = args;
    
    const insights = {
      dataProfile: this.analyzeDataProfile(data, analysisResult),
      chartAnalysis: this.analyzeCharts(charts, data),
      statisticalFindings: this.extractStatisticalFindings(analysisResult),
      recommendations: this.generateRecommendations(data, charts, analysisResult),
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(insights, null, 2),
        },
      ],
    };
  }

  // 生成統計報告
  async generateStatisticalReport(args) {
    const { dashboardData, reportType = 'detailed', targetAudience = 'business' } = args;
    
    const report = {
      metadata: {
        title: '智能視覺化數據分析報告',
        generateTime: new Date().toISOString(),
        reportType,
        targetAudience,
      },
      executiveSummary: this.generateExecutiveSummary(dashboardData),
      dataOverview: this.generateDataOverview(dashboardData),
      chartAnalysis: this.generateChartAnalysis(dashboardData.charts, dashboardData.data),
      statisticalInsights: this.generateStatisticalInsights(dashboardData.analysisResult),
      keyFindings: this.generateKeyFindings(dashboardData),
      recommendations: this.generateActionableRecommendations(dashboardData),
      methodology: this.generateMethodologySection(dashboardData),
      appendix: this.generateAppendix(dashboardData),
    };

    // 根據報告類型調整內容
    const formattedReport = this.formatReportByType(report, reportType, targetAudience);

    return {
      content: [
        {
          type: 'text',
          text: formattedReport,
        },
      ],
    };
  }

  // 創建簡報大綱
  async createPresentationOutline(args) {
    const { dashboardData, presentationStyle = 'business', timeLimit = 15 } = args;
    
    const slideCount = Math.max(5, Math.min(timeLimit, 20)); // 5-20 張投影片
    const presentation = {
      metadata: {
        title: '數據洞察簡報',
        slideCount,
        estimatedTime: timeLimit,
        style: presentationStyle,
      },
      outline: this.generatePresentationOutline(dashboardData, slideCount, presentationStyle),
      slides: this.generateSlideContent(dashboardData, slideCount, presentationStyle),
      speakerNotes: this.generateSpeakerNotes(dashboardData, presentationStyle),
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(presentation, null, 2),
        },
      ],
    };
  }

  // 解釋圖表洞察
  async explainChartInsights(args) {
    const { chartType, chartData, statisticalContext = {} } = args;
    
    const explanation = {
      chartType,
      visualElements: this.explainVisualElements(chartType, chartData),
      statisticalMeaning: this.explainStatisticalMeaning(chartType, chartData, statisticalContext),
      interpretation: this.generateInterpretation(chartType, chartData),
      limitations: this.identifyLimitations(chartType, chartData),
      recommendations: this.suggestImprovements(chartType, chartData),
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(explanation, null, 2),
        },
      ],
    };
  }

  // 匯出儀表板數據
  async exportDashboardData(args) {
    const { format, includeCharts = true } = args;
    
    // 模擬匯出功能（實際實作需要根據前端狀態）
    const exportInfo = {
      format,
      exportPath: `./exports/dashboard_${Date.now()}.${format}`,
      includeCharts,
      timestamp: new Date().toISOString(),
      status: 'ready_for_export',
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(exportInfo, null, 2),
        },
      ],
    };
  }

  // === 分析方法實作 ===

  analyzeDataProfile(data, analysisResult) {
    const profile = {
      sampleSize: data.length,
      dataQuality: analysisResult.數據質量,
      columnTypes: analysisResult.欄位分析,
      missingValues: this.calculateMissingValues(data),
      dataDistribution: this.analyzeDataDistribution(data, analysisResult),
    };

    return profile;
  }

  analyzeCharts(charts, data) {
    return charts.map(chart => ({
      id: chart.id,
      type: chart.type,
      title: chart.title,
      dataUtilization: this.calculateDataUtilization(chart, data),
      visualEffectiveness: this.assessVisualEffectiveness(chart),
      statisticalValidity: this.checkStatisticalValidity(chart, data),
    }));
  }

  generateExecutiveSummary(dashboardData) {
    const { data, charts, analysisResult } = dashboardData;
    
    return `
## 執行摘要

本報告基於 ${data.length.toLocaleString()} 筆數據記錄，包含 ${analysisResult.基本信息.欄位數} 個變數，
透過 ${charts.length} 個視覺化圖表進行深度分析。

### 關鍵發現：
${analysisResult.數據洞察.map((insight, index) => `${index + 1}. ${insight}`).join('\n')}

### 數據品質評估：
- 完整性：${analysisResult.數據質量.完整性}%
- 質量評分：${analysisResult.數據質量.質量評分}/100

### 建議行動：
${analysisResult.數據質量.建議.map(rec => `- ${rec}`).join('\n')}
    `.trim();
  }

  generateChartAnalysis(charts, data) {
    return charts.map(chart => {
      const analysis = this.analyzeIndividualChart(chart, data);
      return `
### ${chart.title} (${chart.type})

**圖表目的：** ${this.getChartPurpose(chart.type)}

**統計意義：**
${analysis.statisticalMeaning}

**主要發現：**
${analysis.keyFindings.map(finding => `- ${finding}`).join('\n')}

**解讀建議：**
${analysis.interpretationTips.map(tip => `- ${tip}`).join('\n')}
      `.trim();
    }).join('\n\n');
  }

  generateStatisticalInsights(analysisResult) {
    const insights = [];

    // 相關性分析
    if (analysisResult.統計摘要.相關性分析) {
      insights.push('### 變數關係分析');
      Object.entries(analysisResult.統計摘要.相關性分析).forEach(([pair, correlation]) => {
        const strength = this.interpretCorrelation(correlation);
        insights.push(`- ${pair}: ${correlation.toFixed(3)} (${strength})`);
      });
    }

    // 分布特徵
    if (analysisResult.欄位分析.數值欄位.length > 0) {
      insights.push('\n### 數值變數分布特徵');
      analysisResult.欄位分析.數值欄位.forEach(column => {
        const stats = analysisResult.欄位分析.詳細分析[column].統計;
        if (stats) {
          insights.push(`- ${column}: 平均值 ${stats.平均值}, 標準差 ${stats.標準差}, 偏態分析建議進一步檢視`);
        }
      });
    }

    return insights.join('\n');
  }

  // === 輔助方法 ===

  interpretCorrelation(correlation) {
    const abs = Math.abs(correlation);
    if (abs >= 0.8) return '非常強相關';
    if (abs >= 0.6) return '強相關';
    if (abs >= 0.4) return '中度相關';
    if (abs >= 0.2) return '弱相關';
    return '幾乎無相關';
  }

  getChartPurpose(chartType) {
    const purposes = {
      bar: '比較不同類別間的數值大小',
      line: '展示數值隨時間或順序的變化趨勢',
      pie: '顯示各部分佔整體的比例關係',
      scatter: '探索兩個數值變數間的相關性',
      heatmap: '視覺化多變數間的關係強度',
      boxplot: '比較不同組別的分布特徵和異常值',
    };
    return purposes[chartType] || '呈現數據的特定面向';
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Server Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('智能視覺化報告生成 MCP 服務器已啟動');
  }
}

// 啟動服務器
const server = new VizReportMCPServer();
server.start().catch(console.error);