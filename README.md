# 🎯 智能視覺化推薦系統
## Intelligent Visualization Recommendation System

基於 AI 和機器學習的智能資料視覺化推薦系統，結合 Claude AI 自然語言處理和 VizML 特徵分析，為使用者提供最適合的圖表推薦。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![Python Version](https://img.shields.io/badge/python-%3E%3D3.9-blue)](https://www.python.org/)
[![React Version](https://img.shields.io/badge/react-%5E18.0.0-61dafb)](https://reactjs.org/)

---

## 🌟 核心功能特色

### 🤖 AI 驅動的混合推薦引擎
- **Claude AI 自然語言理解**：支援中文描述，理解使用者的視覺化需求
- **VizML 機器學習分析**：基於 841 種資料特徵的專業推薦算法
- **混合推薦系統**：結合大型語言模型與機器學習的雙重智能分析
- **教育導向設計**：每個推薦都附帶詳細解釋說明

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
  "核心框架": "React.js 18.x",
  "UI 組件庫": "Material-UI (MUI) 5.x",
  "圖表渲染引擎": {
    "基礎圖表": "Chart.js 4.x + react-chartjs-2",
    "統計圖表": "Plotly.js 3.x + react-plotly.js",
    "商業圖表": "D3.js v7 + 自定義組件",
    "進階圖表": "D3.js + 動態載入"
  },
  "狀態管理": "React Hooks + Context API",
  "資料處理": "PapaParse + SheetJS",
  "網路請求": "Axios",
  "樣式系統": "Material-UI styled components"
}
```

### 後端技術棧
```javascript
{
  "服務框架": "Node.js 16+ + Express 5.x",
  "AI 整合": {
    "Claude API": "@anthropic-ai/sdk",
    "VizML": "Python 3.9 + Scikit-learn"
  },
  "資料處理": {
    "檔案上傳": "Multer 2.x",
    "檔案解析": "csv-parser + xlsx",
    "資料分析": "自建統計模組"
  },
  "開發工具": "Nodemon + dotenv",
  "API 設計": "RESTful API + CORS"
}
```

### Python 分析引擎
```python
{
  "機器學習": "scikit-learn + pandas + numpy",
  "特徵提取": "841 種 VizML 特徵",
  "統計分析": "scipy + matplotlib",
  "資料預處理": "pandas + numpy"
}
```

---

## 📂 專案結構

```
intelligent-viz-system/
├── 📁 frontend/                     # React 前端應用
│   ├── src/
│   │   ├── App.js                   # 主應用組件
│   │   ├── components/
│   │   │   ├── charts/              # 圖表組件庫
│   │   │   │   ├── basic/           # Chart.js 基礎圖表
│   │   │   │   ├── plotly/          # Plotly 統計圖表
│   │   │   │   ├── business/        # 商業智慧圖表
│   │   │   │   └── UnifiedChart.js  # 統一圖表渲染器
│   │   │   └── DataManipulationComponents.js  # 資料處理組件
│   │   └── utils/chartSetup.js      # Chart.js 配置
│   ├── package.json                 # 前端依賴
│   └── public/
│
├── 📁 backend/                      # Node.js 後端服務
│   ├── server.js                    # Express 主服務器
│   ├── services/                    # 業務邏輯服務
│   │   ├── claudeService.js         # Claude AI 整合
│   │   ├── modernVizMLService.js    # VizML 推薦引擎
│   │   ├── dataService.js           # 資料處理服務
│   │   └── chartService.js          # 圖表配置生成
│   ├── python-scripts/              # Python 分析腳本
│   ├── uploads/                     # 檔案上傳目錄
│   └── package.json                 # 後端依賴
│
├── 📁 docs/                         # 專案文件
├── package.json                     # 專案根依賴
└── README.md                        # 本文件
```

---

## 🚀 安裝與啟動

### 環境需求
- **Node.js**: 16.0 或更高版本
- **Python**: 3.9 或更高版本
- **記憶體**: 建議 4GB 以上
- **儲存空間**: 1GB 可用空間

### 快速開始

#### 1. 克隆專案
```bash
git clone https://github.com/your-username/intelligent-viz-system.git
cd intelligent-viz-system
```

#### 2. 設置 Python 環境
```bash
# 使用 conda (推薦)
conda create -n vizml python=3.9 -y
conda activate vizml
conda install pandas numpy scikit-learn matplotlib -y

# 或使用 pip
pip install pandas numpy scikit-learn matplotlib
```

#### 3. 安裝後端依賴
```bash
cd backend
npm install
```

#### 4. 安裝前端依賴
```bash
cd ../frontend
npm install
```

#### 5. 環境配置
```bash
cd ../backend
cp .env.example .env
```

編輯 `.env` 文件：
```env
# Claude AI API 設定
ANTHROPIC_API_KEY=your_claude_api_key_here

# 服務埠號
PORT=3001

# 跨域設定
CORS_ORIGIN=http://localhost:3000

# 檔案上傳設定
MAX_FILE_SIZE=52428800  # 50MB

# Python 環境路徑
PYTHON_PATH=python  # 或您的 Python 路徑
```

#### 6. 啟動服務

**方式一：分別啟動（開發模式）**
```bash
# 終端 1：啟動後端
cd backend
npm run dev

# 終端 2：啟動前端
cd frontend
npm start
```

**方式二：生產模式啟動**
```bash
# 根目錄啟動後端
npm start
```

#### 7. 訪問應用
- 前端應用：http://localhost:3000
- 後端 API：http://localhost:3001
- 健康檢查：http://localhost:3001/health

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

#### 5. ⚙️ 自訂化調整
- 調整圖表標題和軸標籤
- 選擇不同的顏色主題
- 修改圖表大小和比例

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

### 混合推薦策略
```
資料上傳 → 特徵提取 → Claude 分析 ↘
                                    → 混合評分 → 最終推薦
VizML 模型 → 圖表匹配 → 結果排序 ↗
```

---

## 🔧 開發指南

### 添加新圖表類型

#### 1. 定義圖表類型
在 `frontend/src/App.js` 中的 `CHART_TYPES` 添加：
```javascript
const CHART_TYPES = {
  // ...現有圖表
  newchart: { 
    name: '新圖表', 
    category: 'basic|statistical|business|advanced', 
    color: '#FF6B6B', 
    icon: '📊' 
  }
};
```

#### 2. 後端圖表生成器
在 `backend/services/chartService.js` 中：
```javascript
// 註冊新圖表
this.supportedChartTypes['newchart'] = '新圖表';

// 添加生成邏輯
case 'newchart':
  return this.generateNewChart(data, options);

// 實現生成函數
generateNewChart(data, options) {
  return {
    type: 'newchart',
    data: { /* 處理後的資料 */ },
    options: { /* 圖表選項 */ }
  };
}
```

#### 3. 前端渲染組件
根據圖表類型選擇對應的渲染方式：
- **Chart.js圖表**：在 `renderChart` 函數中添加 case
- **Plotly圖表**：更新 Plotly 判斷條件和配置
- **自定義圖表**：創建新的 React 組件

### API 端點文件

#### POST `/api/upload`
上傳並解析資料檔案
```javascript
// Request: FormData with file
// Response:
{
  "success": true,
  "fileName": "data.csv",
  "data": {
    "data": [...],          // 原始資料
    "analysis": {...},      // 統計分析
    "rowCount": 1000,
    "columnCount": 5
  }
}
```

#### POST `/api/generate-chart`
生成圖表配置
```javascript
// Request:
{
  "data": [...],
  "chartType": "bar",
  "dataAnalysis": {...}
}

// Response:
{
  "success": true,
  "chartConfig": {...},
  "recommendedOptions": {...}
}
```

#### POST `/api/claude-recommend`
Claude AI 推薦
```javascript
// Request:
{
  "data": [...],
  "userDescription": "我想分析銷售趨勢"
}

// Response:
{
  "recommendation": [...],
  "reasoning": "...",
  "confidence": 0.95
}
```

---

## 🎯 核心創新點

### 1. 🔄 混合式 AI 推薦
結合大型語言模型的語義理解能力與傳統機器學習的統計分析，提供更準確、更具解釋性的視覺化建議。

### 2. 🇹🇼 中文自然語言支援
針對中文使用者優化的自然語言處理，支援中文描述的視覺化需求理解，填補現有系統的本土化空白。

### 3. 🎓 教育導向設計
不僅提供推薦結果，還詳細解釋推薦理由、適用場景和最佳實踐，幫助使用者學習資料視覺化知識。

### 4. 🏗️ 模組化可擴展架構
- **圖表工廠模式**：統一管理不同圖表庫
- **組件化設計**：易於添加新圖表類型
- **API 標準化**：一致的資料格式和介面

### 5. 📊 多層次圖表生態
從基礎統計圖表到專業商業智慧圖表，滿足不同層次使用者的需求。

---

## 🧪 測試與品質保證

### 已完成測試
- ✅ 基礎圖表渲染（12種）
- ✅ 檔案上傳與解析（CSV、Excel、JSON）
- ✅ Claude AI API 整合
- ✅ VizML 特徵提取
- ✅ 資料品質檢查
- ✅ 商業圖表生成（7種）
- ✅ 響應式設計

### 測試覆蓋範圍
- **功能測試**：所有核心功能正常運作
- **相容性測試**：主流瀏覽器支援
- **效能測試**：大檔案處理能力
- **錯誤處理**：異常情況優雅處理

---

## 🎯 開發背景與意義

### 學術價值
這個專案是數據科學研究所的創新專案，探索 AI 技術在資料視覺化領域的應用潛力：
- **技術整合**：整合多個開源專案（VizML、Data Formulator、OpenCharts）
- **創新應用**：AI 與視覺化的深度結合
- **本土化創新**：針對中文環境的優化設計

### 實用價值
- **降低門檻**：讓非專業人士也能快速生成專業圖表
- **提升效率**：AI 推薦大幅減少選擇圖表的時間
- **教育意義**：推薦解釋幫助使用者學習視覺化最佳實踐

### 技術價值
- **系統工程**：展示複雜系統的整合能力
- **全端開發**：涵蓋前端、後端、AI、資料處理
- **擴展性設計**：為未來功能擴展奠定基礎

---

## 📈 未來發展規劃

### 短期目標（1-2個月）
- 🔄 完成剩餘進階圖表類型（5種）
- 📊 新增地理視覺化圖表（4種）
- ⚡ 效能優化和使用者體驗改善
- 📱 移動端適配優化

### 中期目標（3-6個月）
- 🤖 個人化推薦學習機制
- 📊 圖表匯出功能（PNG、SVG、PDF）
- 🔗 資料庫連接支援
- 👥 多使用者協作功能

### 長期願景（6個月以上）
- 🌐 雲端部署和 SaaS 化
- 📚 圖表模板庫建立
- 🔧 低代碼視覺化編輯器
- 📊 商業智慧儀表板功能

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
- 📚 **文件改善**：完善使用說明和 API 文件
- 🎨 **UI/UX 改善**：提升使用者體驗
- ⚡ **效能優化**：改善系統效能

---

## 📄 授權與聲明

### 開源授權
本專案採用 **MIT 授權條款**，詳見 [LICENSE](LICENSE) 文件。

### 第三方致謝
- **VizML**: MIT Media Lab 的視覺化推薦研究
- **Data Formulator**: Microsoft Research 的資料視覺化工具
- **OpenCharts**: 開源圖表生成專案
- **Chart.js**: 開源 HTML5 圖表庫
- **Plotly.js**: 開源資料視覺化庫
- **D3.js**: 資料驅動的文件操作庫

### 學術引用
如果您在學術研究中使用本專案，請引用：
```
[作者姓名]. (2024). 智能視覺化推薦系統: 基於AI和機器學習的混合推薦方法. 
數據科學研究所專案. [您的學校名稱].
```

---

## 📞 聯絡方式

### 專案維護者
- **GitHub**: [@your-username](https://github.com/your-username)
- **Email**: your.email@example.com

### 問題回報
- **Bug 回報**: [GitHub Issues](https://github.com/your-username/intelligent-viz-system/issues)
- **功能建議**: [GitHub Discussions](https://github.com/your-username/intelligent-viz-system/discussions)
- **技術問題**: [Stack Overflow](https://stackoverflow.com/questions/tagged/intelligent-viz-system)

### 即時支援
- **開發文件**: [專案 Wiki](https://github.com/your-username/intelligent-viz-system/wiki)
- **API 文件**: [API 參考](docs/api-reference.md)
- **範例代碼**: [examples/](examples/)

---

## 🎉 快速體驗

想要快速體驗系統功能？

1. **📊 範例資料**: 使用 `docs/sample-data/` 中的範例檔案
2. **🚀 一鍵啟動**: 執行 `npm start` 快速啟動
3. **📖 使用指南**: 查看 `docs/user-guide.md` 詳細說明
4. **🎬 影片教學**: [YouTube 教學影片](https://youtube.com/watch?v=example)

---

<div align="center">

### 🌟 如果這個專案對您有幫助，請給我們一個星星！ ⭐

**讓 AI 為您的資料找到最完美的視覺化方式** 🎯

</div>