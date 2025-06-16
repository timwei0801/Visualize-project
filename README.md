# 🎯 智能視覺化推薦系統
## Intelligent Visualization Recommendation System

基於 AI 和機器學習的智能資料視覺化推薦系統，結合 Claude AI 自然語言處理和 VizML 特徵分析，為使用者提供最適合的圖表推薦。支援 Model Context Protocol (MCP) 整合，讓 AI 助手能夠直接調用視覺化功能。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Python Version](https://img.shields.io/badge/python-%3E%3D3.9-blue)](https://www.python.org/)
[![MCP Protocol](https://img.shields.io/badge/MCP-1.12.3-purple)](https://github.com/modelcontextprotocol)

---

## 🌟 核心功能特色

### 🤖 AI 驅動的混合推薦引擎
- **Claude AI 自然語言理解**：支援中文描述，理解使用者的視覺化需求
- **VizML 機器學習分析**：基於 841 種資料特徵的專業推薦算法
- **混合推薦系統**：結合大型語言模型與機器學習的雙重智能分析
- **教育導向設計**：每個推薦都附帶詳細解釋說明

### 🔗 **NEW** Model Context Protocol (MCP) 整合
```typescript
// MCP 工具集
✅ analyze_dashboard_data      // 儀表板數據分析
✅ generate_statistical_report // 統計報告生成
✅ create_presentation_outline // 簡報大綱創建
✅ explain_chart_insights      // 圖表洞察解釋
✅ export_dashboard_data       // 數據匯出功能
```
- **AI 助手整合**：Claude、ChatGPT 等 AI 助手可直接調用視覺化功能
- **標準化協議**：遵循 MCP 1.12.3 標準，確保跨平台相容性
- **自動化工作流**：AI 可自主完成數據分析到報告生成的完整流程

### 📊 **ENHANCED** 增強版 AI 報告生成器
#### 🔧 多 AI 提供商支援
```javascript
✅ OpenAI GPT-4o           // 最先進的大語言模型
✅ Claude 4 Sonnet         // 專業分析型 AI
✅ Google Gemini 1.5 Pro   // 多模態 AI
✅ 智能模擬分析            // 離線分析模式
```

#### 📸 圖表視覺分析
- **自動截圖**：為所有圖表生成高解析度截圖
- **圖像分析**：AI 分析圖表視覺模式和趨勢
- **縮圖預覽**：實時預覽圖表選擇狀態
- **批量處理**：一次性分析多個圖表

#### 📄 多格式報告輸出
```
✅ HTML報告    // 互動式網頁報告，支援響應式設計
✅ PDF文檔     // 專業印刷級報告，適合分享和存檔
✅ Markdown    // 開發者友好格式，支援版本控制
✅ 實時預覽    // 即時查看報告結構和內容
```

#### 🔍 智能分析功能
- **統計顯著性檢驗**：自動執行相關性分析和異常值檢測
- **商業洞察生成**：基於數據模式提供可執行的商業建議
- **趨勢預測**：識別數據中的潛在趨勢和模式
- **風險評估**：標識數據品質問題和潛在風險

### 📊 已實現圖表生態系統（30+ 種）

#### 🔵 基礎圖表 (Chart.js) - 12種
```
✅ 長條圖 (Bar Chart)          ✅ 線圖 (Line Chart)
✅ 散佈圖 (Scatter Plot)       ✅ 圓餅圖 (Pie Chart)
✅ 甜甜圈圖 (Doughnut Chart)   ✅ 面積圖 (Area Chart)
✅ 雷達圖 (Radar Chart)        ✅ 極坐標圖 (Polar Area)
✅ 氣泡圖 (Bubble Chart)       ✅ 堆疊長條圖 (Stacked Bar)
✅ 分組長條圖 (Grouped Bar)    ✅ 水平長條圖 (Horizontal Bar)
```

#### 📈 統計分析圖表 (Plotly.js) - 6種
```
✅ 直方圖 (Histogram)          ✅ 箱線圖 (Box Plot)
✅ 小提琴圖 (Violin Plot)      ✅ 熱力圖 (Heatmap)
✅ 階梯線圖 (Step Line)        ✅ 堆疊面積圖 (Stacked Area)
```

#### 💼 商業智慧圖表 (D3.js + 自定義) - 7種
```
✅ 儀表板圖 (Gauge Chart)      ✅ 子彈圖 (Bullet Chart)
✅ KPI 卡片 (KPI Card)         ✅ 漏斗圖 (Funnel Chart)
✅ 瀑布圖 (Waterfall Chart)    ✅ 桑基圖 (Sankey Diagram)
✅ 矩形樹圖 (Treemap)
```

#### 🌐 進階圖表 (擴展中) - 5種
```
🔄 網絡圖 (Network Graph)      🔄 旭日圖 (Sunburst Chart)
🔄 樹狀圖 (Tree Diagram)       🔄 和弦圖 (Chord Diagram)
🔄 平行座標圖 (Parallel Coordinates)
```

### 📁 全方位資料處理能力
- **檔案格式支援**：CSV、Excel (.xlsx, .xls)、JSON
- **智能編碼偵測**：UTF-8、Big5、GB2312 自動識別
- **大檔案處理**：支援最大 50MB 檔案上傳
- **即時資料分析**：
  - 自動資料類型識別（數值型、分類型、時間型）
  - 統計分析（平均值、中位數、標準差、四分位數）
  - 資料品質檢查（完整度、重複值、異常值）
  - 缺失值分析與處理建議

### 🎯 使用者體驗設計
- **直觀拖拽介面**：支援檔案拖拽上傳
- **即時資料預覽**：上傳後立即顯示資料摘要
- **智能欄位選擇**：自動建議最佳欄位組合
- **響應式設計**：完美支援桌面、平板、手機
- **一鍵圖表生成**：根據推薦直接生成圖表
- **圖表自訂化**：支援顏色、標題、軸標籤調整

---

## 🏗️ 技術架構

### 前端技術棧
```typescript
{
  "核心框架": "Vanilla JavaScript ES6+",
  "圖表渲染引擎": {
    "基礎圖表": "Chart.js 4.x",
    "統計圖表": "Plotly.js 3.x",
    "商業圖表": "D3.js v7 + 自定義組件",
    "進階圖表": "D3.js + 動態載入"
  },
  "UI 框架": "Bootstrap 5.x + 自定義 CSS",
  "資料處理": "Papa Parse + SheetJS",
  "圖表截圖": "html2canvas + Canvas API",
  "網路請求": "Fetch API + Axios",
  "模組化": "ES6 Modules"
}
```

### MCP 服務層
```javascript
{
  "協議版本": "@modelcontextprotocol/sdk 1.12.3",
  "服務架構": "Node.js 18+ + Express 5.x",
  "工具註冊": "動態工具發現和註冊",
  "數據驗證": "Zod + JSON Schema",
  "錯誤處理": "結構化錯誤回應",
  "安全性": "CORS + Rate Limiting"
}
```

### AI 整合層
```python
{
  "多提供商支援": {
    "OpenAI": "gpt-4o, gpt-4-turbo",
    "Anthropic": "claude-sonnet-4",
    "Google": "gemini-1.5-pro"
  },
  "功能特性": {
    "圖像分析": "多模態 AI 圖表分析",
    "自然語言": "中文優化的提示工程",
    "報告生成": "結構化統計報告",
    "錯誤恢復": "智能模擬分析備援"
  }
}
```

### 資料分析引擎
```python
{
  "機器學習": "scikit-learn + pandas + numpy",
  "特徵提取": "841 種 VizML 特徵",
  "統計分析": "scipy + matplotlib",
  "資料預處理": "pandas + numpy",
  "品質檢查": "自建統計模組"
}
```

---

## 📂 專案結構

```
intelligent-viz-system/
├── 📁 frontend/                     # 前端應用
│   ├── index.html                   # 主頁面
│   ├── js/
│   │   ├── script.js                # 主應用邏輯
│   │   ├── enhancedReportGenerator.js  # AI 報告生成器
│   │   ├── chartRenderers.js       # 圖表渲染器
│   │   └── dataProcessor.js        # 資料處理模組
│   ├── css/
│   │   ├── style.css               # 主樣式
│   │   └── components.css          # 組件樣式
│   └── assets/                     # 靜態資源
│
├── 📁 mcp-server/                   # **NEW** MCP 服務器
│   ├── mcp-viz-server.js           # MCP 主服務器
│   ├── package.json                # MCP 依賴配置
│   └── tools/                      # MCP 工具集
│       ├── analyzer.js             # 數據分析工具
│       ├── reporter.js             # 報告生成工具
│       └── exporter.js             # 匯出工具
│
├── 📁 backend/ (如有)               # 後端服務 (可選)
│   ├── server.js                   # Express 主服務器
│   ├── services/                   # 業務邏輯服務
│   │   ├── claudeService.js        # Claude AI 整合
│   │   ├── vizmlService.js         # VizML 推薦引擎
│   │   └── dataService.js          # 資料處理服務
│   └── python-scripts/             # Python 分析腳本
│
├── 📁 docs/                        # 專案文件
│   ├── api-reference.md            # API 參考文件
│   ├── mcp-integration.md          # MCP 整合指南
│   └── examples/                   # 使用範例
│
├── package.json                    # 主專案依賴
├── package-lock.json               # 依賴鎖定檔案
└── README.md                       # 本文件
```

---

## 🚀 安裝與啟動

### 環境需求
- **Node.js**: 18.0 或更高版本 ⬆️
- **Python**: 3.9 或更高版本
- **記憶體**: 建議 4GB 以上
- **儲存空間**: 1GB 可用空間

### 快速開始

#### 1. 克隆專案
```bash
git clone https://github.com/your-username/intelligent-viz-system.git
cd intelligent-viz-system
```

#### 2. 安裝依賴
```bash
# 安裝主專案依賴
npm install

# 安裝 MCP 服務器依賴
cd mcp-server
npm install
cd ..
```

#### 3. 設置 Python 環境 (可選)
```bash
# 使用 conda (推薦)
conda create -n vizml python=3.9 -y
conda activate vizml
conda install pandas numpy scikit-learn matplotlib -y

# 或使用 pip
pip install pandas numpy scikit-learn matplotlib
```

#### 4. 啟動 MCP 服務器
```bash
# 開發模式
cd mcp-server
npm run dev

# 或生產模式
npm start
```

#### 5. 啟動前端應用
```bash
# 使用本地服務器 (推薦)
python -m http.server 8000

# 或使用 Node.js
npx http-server -p 8000
```

#### 6. 訪問應用
- **前端應用**: http://localhost:8000
- **MCP 服務器**: 監聽 stdin/stdout (AI 助手調用)

---

## 🔗 MCP 整合指南

### AI 助手配置

#### Claude Desktop 配置
在 `claude_desktop_config.json` 中添加：
```json
{
  "mcpServers": {
    "viz-report-generator": {
      "command": "node",
      "args": ["path/to/mcp-server/mcp-viz-server.js"]
    }
  }
}
```

#### 可用 MCP 工具
```typescript
// 1. 數據分析
analyze_dashboard_data(data, charts, analysisResult)

// 2. 統計報告生成
generate_statistical_report(dashboardData, reportType, targetAudience)

// 3. 簡報大綱創建
create_presentation_outline(dashboardData, presentationStyle, timeLimit)

// 4. 圖表洞察解釋
explain_chart_insights(chartType, chartData, statisticalContext)

// 5. 數據匯出
export_dashboard_data(format, includeCharts)
```

### AI 助手使用範例
```
用戶: "請分析我的銷售數據並生成一份詳細的統計報告"

AI 助手將自動：
1. 調用 analyze_dashboard_data 分析數據
2. 使用 generate_statistical_report 生成報告
3. 提供專業的統計洞察和建議
```

---

## 📖 使用指南

### 基本使用流程

#### 1. 📁 上傳資料
- 拖拽 CSV/Excel/JSON 檔案到上傳區域
- 或點擊上傳按鈕選擇檔案
- 系統自動解析並顯示資料摘要

#### 2. 📊 查看資料分析
- **資料概覽**：行數、欄數、資料類型分佈
- **統計摘要**：數值欄位的基本統計資訊
- **品質檢查**：完整度、重複值、缺失值分析
- **欄位詳情**：每個欄位的類型和範例值

#### 3. 🤖 獲取 AI 推薦
- 點擊「**🤖 AI 推薦**」按鈕
- 系統分析資料特徵並提供智能建議
- 查看推薦理由和適用場景說明

#### 4. 🎨 生成視覺化
- 點擊推薦的圖表類型按鈕
- 系統自動生成最佳的圖表配置
- 即時預覽生成的圖表

#### 5. 📄 **NEW** 生成 AI 報告
- 點擊「**🤖 AI 深度分析**」按鈕
- 選擇 AI 提供商 (OpenAI/Claude/Gemini)
- 配置報告參數和分析深度
- 獲得專業統計分析報告

### 進階功能

#### 🔍 資料篩選與處理
- **欄位選擇**：選擇特定欄位進行視覺化
- **資料排序**：按指定欄位排序資料
- **資料限制**：限制顯示的資料行數
- **缺失值處理**：移除或填充缺失值

#### 📈 多圖表比較
- 同時生成多種圖表類型
- 並排比較不同視覺化效果
- 一鍵重新生成圖表

#### 🎯 圖表自訂化
- **顏色主題**：多種預設配色方案
- **樣式調整**：圖表大小、邊距、字體
- **標籤設定**：軸標籤、圖例、標題
- **互動功能**：縮放、篩選、工具提示

#### 📊 **NEW** 報告自訂化
- **AI 提供商選擇**：根據需求選擇最適合的 AI
- **分析深度設定**：淺層、中等、深入三個級別
- **目標受眾**：商業、技術、學術導向
- **輸出格式**：HTML、PDF、Markdown 多選
- **圖表截圖**：自動為所有圖表生成高品質截圖

---

## 🧠 AI 推薦系統

### Claude AI 自然語言處理
- **中文語義理解**：準確理解中文視覺化需求描述
- **意圖識別**：自動識別分析目的（趨勢、分佈、關係等）
- **上下文分析**：結合資料特徵提供情境化建議
- **解釋生成**：為每個推薦提供清晰的理由說明

### VizML 機器學習分析
- **特徵提取**：841 種統計和視覺特徵
- **模式識別**：識別資料中的潛在模式
- **圖表匹配**：基於特徵匹配最適合的圖表類型
- **信心評分**：為每個推薦提供信心度評分

### **NEW** 多模態 AI 分析
```
資料上傳 → 特徵提取 → 圖表生成 → 圖像截圖 ↘
                                                → AI 視覺分析 → 專業報告
Claude 語言分析 → VizML 推薦 → 統計驗證 ↗
```

---

## 🔧 開發指南

### 添加新的 MCP 工具

#### 1. 定義工具結構
在 `mcp-server/mcp-viz-server.js` 中添加：
```javascript
{
  name: 'new_analysis_tool',
  description: '新的分析工具',
  inputSchema: {
    type: 'object',
    properties: {
      data: { type: 'array', description: '輸入數據' },
      options: { type: 'object', description: '分析選項' }
    },
    required: ['data']
  }
}
```

#### 2. 實現工具邏輯
```javascript
this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'new_analysis_tool') {
    const { data, options } = request.params.arguments;
    
    // 實現分析邏輯
    const result = await this.performNewAnalysis(data, options);
    
    return {
      content: [{ type: 'text', text: JSON.stringify(result) }]
    };
  }
});
```

### 添加新圖表類型

#### 1. 前端圖表註冊
在 `js/script.js` 中的 `CHART_TYPES` 添加：
```javascript
const CHART_TYPES = {
  // ...現有圖表
  newchart: { 
    name: '新圖表', 
    category: 'basic|statistical|business|advanced',
    library: 'chartjs|plotly|d3|custom',
    color: '#FF6B6B', 
    icon: '📊' 
  }
};
```

#### 2. 渲染邏輯實現
```javascript
// 在對應的渲染器中添加
renderChart(type, data, options) {
  switch(type) {
    case 'newchart':
      return this.renderNewChart(data, options);
    // ...其他圖表
  }
}
```

### API 端點文件

#### MCP 工具調用
```javascript
// AI 助手調用範例
const result = await callMCPTool('analyze_dashboard_data', {
  data: rawData,
  charts: chartConfigs,
  analysisResult: statisticsResult
});
```

#### 前端 API
```javascript
// 生成圖表
const response = await fetch('/api/generate-chart', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    data: rawData,
    chartType: 'bar',
    options: customOptions
  })
});
```

---

## 🎯 核心創新點

### 1. 🔄 **NEW** MCP 標準整合
全球首個支援 Model Context Protocol 的視覺化系統，讓 AI 助手能夠直接生成和分析圖表，實現真正的人機協作數據分析工作流。

### 2. 🤖 **ENHANCED** 多模態 AI 分析
結合文字和圖像的雙重 AI 分析能力：
- **文字分析**：理解數據結構和統計特徵
- **圖像分析**：識別視覺模式和設計優化建議
- **跨模態融合**：綜合多種感知維度提供深度洞察

### 3. 🇹🇼 中文自然語言支援
針對中文使用者優化的自然語言處理，支援中文描述的視覺化需求理解，填補現有系統的本土化空白。

### 4. 🎓 教育導向設計
不僅提供推薦結果，還詳細解釋推薦理由、適用場景和最佳實踐，幫助使用者學習資料視覺化知識。

### 5. 🏗️ 模組化可擴展架構
- **MCP 工具系統**：標準化的工具註冊和調用機制
- **圖表工廠模式**：統一管理不同圖表庫
- **組件化設計**：易於添加新圖表類型
- **API 標準化**：一致的資料格式和介面

### 6. 📊 **NEW** 智能報告引擎
- **多 AI 備援**：支援多個主流 AI 提供商，確保服務可用性
- **離線分析**：智能模擬分析功能，無需 API 金鑰也可使用
- **專業排版**：自動生成符合學術和商業標準的報告
- **互動性報告**：HTML 格式支援圖表互動和響應式設計

---

## 🧪 測試與品質保證

### 已完成測試
- ✅ 基礎圖表渲染（12種）
- ✅ 檔案上傳與解析（CSV、Excel、JSON）
- ✅ **NEW** MCP 工具調用和回應
- ✅ **NEW** 多 AI 提供商整合
- ✅ **NEW** 圖表截圖功能
- ✅ **NEW** HTML/PDF 報告生成
- ✅ VizML 特徵提取
- ✅ 資料品質檢查
- ✅ 商業圖表生成（7種）
- ✅ 響應式設計

### 測試覆蓋範圍
- **功能測試**：所有核心功能正常運作
- **MCP 相容性**：與主流 AI 助手的整合測試
- **多瀏覽器支援**：Chrome、Firefox、Safari、Edge
- **效能測試**：大檔案處理和圖表渲染效能
- **錯誤處理**：異常情況優雅處理和自動恢復

---

## 🎯 開發背景與意義

### 學術價值
這個專案是淡江大學數據科學研究所的創新專案，探索 AI 技術在資料視覺化領域的應用潛力：
- **標準制定**：率先實現 MCP 協議在視覺化領域的應用
- **技術整合**：整合多個開源專案（VizML、Data Formulator、OpenCharts）
- **創新應用**：AI 與視覺化的深度結合
- **本土化創新**：針對中文環境的優化設計

### 實用價值
- **降低門檻**：讓非專業人士也能快速生成專業圖表
- **AI 協作**：AI 助手可直接調用視覺化功能，實現自動化分析
- **提升效率**：AI 推薦大幅減少選擇圖表的時間
- **教育意義**：推薦解釋幫助使用者學習視覺化最佳實踐

### 技術價值
- **協議創新**：首個 MCP 視覺化服務實現
- **系統工程**：展示複雜系統的整合能力
- **全端開發**：涵蓋前端、MCP 服務、AI 整合、資料處理
- **擴展性設計**：為未來功能擴展奠定基礎

---

## 📈 未來發展規劃

### 短期目標（1-2個月）
- 🔄 完成剩餘進階圖表類型（5種）
- 📊 **NEW** MCP 工具集擴展（地理視覺化、時間序列分析）
- ⚡ 效能優化和使用者體驗改善
- 📱 移動端適配優化
- 🤖 **NEW** 更多 AI 提供商支援（Cohere、PaLM）

### 中期目標（3-6個月）
- 🔗 **NEW** 與主流 AI 平台的官方整合（OpenAI GPTs、Claude Apps）
- 🤖 個人化推薦學習機制
- 📊 圖表模板庫和預設分析模板
- 🔗 資料庫連接支援
- 👥 多使用者協作功能
- 📈 **NEW** 即時數據流分析支援

### 長期願景（6個月以上）
- 🌐 雲端部署和 SaaS 化
- 🏢 **NEW** 企業級 MCP 服務部署
- 📚 社群驅動的圖表模板市場
- 🔧 低代碼視覺化編輯器
- 📊 商業智慧儀表板功能
- 🎓 **NEW** 教育機構專用版本

---

## 🤝 貢獻指南

### 如何貢獻
1. Fork 本專案
2. 創建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

### 貢獻領域
- 🐛 **Bug 修復**：報告和修復問題
- ✨ **新功能**：添加新圖表類型或功能
- 🔗 **MCP 工具**：開發新的 MCP 工具和整合
- 🤖 **AI 整合**：新增 AI 提供商支援
- 📚 **文件改善**：完善使用說明和 API 文件
- 🎨 **UI/UX 改善**：提升使用者體驗
- ⚡ **效能優化**：改善系統效能

### 開發規範
- **程式碼風格**：遵循 ESLint 和 Prettier 配置
- **提交格式**：使用 Conventional Commits 格式
- **測試要求**：新功能必須包含對應測試
- **文件更新**：API 變更需同步更新文件
- **MCP 標準**：新工具必須符合 MCP 協議規範

---

## 📄 授權與聲明

### 開源授權
本專案採用 **MIT 授權條款**，詳見 [LICENSE](LICENSE) 文件。

### 第三方致謝
- **Model Context Protocol**: 標準化的 AI 工具調用協議
- **VizML**: MIT Media Lab 的視覺化推薦研究
- **Data Formulator**: Microsoft Research 的資料視覺化工具
- **OpenCharts**: 開源圖表生成專案
- **Chart.js**: 開源 HTML5 圖表庫
- **Plotly.js**: 開源資料視覺化庫
- **D3.js**: 資料驅動的文件操作庫

### 學術引用
如果您在學術研究中使用本專案，請引用：
```bibtex
@misc{wei2024intelligent,
  title={智能視覺化推薦系統: 基於AI和機器學習的混合推薦方法},
  author={魏祺紘},
  year={2025},
  school={淡江大學數據科學研究所},
  note={支援 Model Context Protocol 的智能視覺化系統}
}
```

---

## 📞 聯絡方式

### 專案維護者
- **作者**: 魏祺紘
- **學校**: 淡江大學數據科學研究所
- **GitHub**: [timwei0801](https://github.com/timwei0801)
- **Email**: chwei9181@gmail.com
---

## 🎉 快速體驗

### 本地體驗
1. **📊 範例資料**: 使用 `docs/sample-data/` 中的範例檔案
2. **🚀 一鍵啟動**: 執行 `python -m http.server 8000` 快速啟動
3. **📖 使用指南**: 查看 `docs/user-guide.md` 詳細說明

### MCP 整合體驗
1. **🤖 Claude Desktop**: 配置 MCP 服務器體驗 AI 直接調用
2. **🔧 開發測試**: 使用 `mcp-server/test-client.js` 測試工具調用
3. **📚 範例對話**: 查看 `docs/mcp-examples.md` 了解對話模式

---

<div align="center">

### 🌟 如果這個專案對您有幫助，請給我們一個星星！ ⭐

**讓 AI 為您的資料找到最完美的視覺化方式** 🎯

**全球首個支援 MCP 的智能視覺化系統 - 開創 AI 協作新時代** 🚀

</div>
