<div align="center">

# ✨ Social Media Content Analyzer

### AI-Powered Document Intelligence for Social Media Engagement

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_App-8b5cf6?style=for-the-badge&logoColor=white)](https://unthinkable-vyshrawanps-projects.vercel.app)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tesseract](https://img.shields.io/badge/Tesseract.js-OCR_Engine-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://tesseract.projectnaptha.com)
[![Gemini](https://img.shields.io/badge/Gemini_AI-Powered-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

<br/>

> **Upload PDFs & images → Extract text with OCR → Get AI-powered engagement insights**
>
> All document processing runs **client-side** — your files never leave your device.

<br/>

</div>

---

## 🎯 Problem Statement

Social media managers and content creators spend hours manually analyzing posts to understand what drives engagement. This tool automates that process: upload any document (PDF reports, image screenshots, scanned content), extract the text intelligently, and receive **actionable, AI-generated recommendations** to boost social media performance.

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        BROWSER (Client-Side)                     │
│                                                                  │
│  ┌─────────────┐    ┌──────────────────────────────────────┐     │
│  │  File Upload │    │        Processing Engine             │     │
│  │             │    │                                      │     │
│  │ • Drag&Drop ├───►│  PDF? ──► pdfjs-dist (Text Extract) │     │
│  │ • Picker    │    │                                      │     │
│  │ • Validate  │    │  IMG? ──► Tesseract.js (OCR / WASM)  │     │
│  └─────────────┘    └──────────────┬───────────────────────┘     │
│                                    │                             │
│                                    ▼                             │
│                     ┌──────────────────────────┐                 │
│                     │    Extracted Text Panel   │                 │
│                     │  • Word/char count        │                 │
│                     │  • Copy to clipboard      │                 │
│                     │  • Formatted display      │                 │
│                     └────────────┬─────────────┘                 │
└──────────────────────────────────┼───────────────────────────────┘
                                   │
                                   ▼  (Only this step calls an API)
                     ┌──────────────────────────┐
                     │   Google Gemini 2.0 Flash │
                     │   REST API (Free Tier)    │
                     └────────────┬─────────────┘
                                  │
                                  ▼
              ┌───────────────────────────────────────┐
              │         Analysis Dashboard            │
              │                                       │
              │  📊 Engagement Score (1-10 ring gauge) │
              │  💬 Sentiment Analysis + Confidence    │
              │  📝 Content Summary                    │
              │  💡 5 Improvement Suggestions          │
              │  ✍️  Optimized Post Rewrite             │
              │  #️⃣  Hashtag Recommendations            │
              │  🎯 Best Platform Recommendation       │
              └───────────────────────────────────────┘
```

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 📄 Smart Document Upload
- **Drag & Drop** with animated visual feedback
- **File Picker** fallback for accessibility
- Supports **PDF, PNG, JPG, WEBP, GIF, BMP, TIFF**
- File validation (type + 20MB size limit)
- Inline file preview with type icon

</td>
<td width="50%">

### 🔍 Intelligent Text Extraction
- **PDF.js** — Parses multi-page PDFs with formatting preservation
- **Tesseract.js** — OCR via WebAssembly (runs entirely in-browser)
- **Real-time progress bars** with contextual status messages
- Copy-to-clipboard with word & character counts
- Handles edge cases: empty PDFs, password-protected files

</td>
</tr>
<tr>
<td width="50%">

### 🤖 AI-Powered Analysis
- **Engagement Score** — Visual ring gauge (1-10)
- **Sentiment Analysis** — Positive/Negative/Neutral with confidence %
- **5 Categorized Suggestions** — Tone, Hashtags, CTA, Formatting, Timing
- **Optimized Rewrite** — AI-generated improved version
- **Platform Recommendation** — Best social network for the content

</td>
<td width="50%">

### 🎨 Premium User Experience
- **Dark glassmorphism** theme with violet/cyan gradient accents
- **30+ micro-animations** — fade, slide, scale, float, glow, shimmer
- **Skeleton loading** states during AI processing
- **Responsive design** — mobile, tablet, desktop
- **Accessible** — keyboard navigation, ARIA labels, semantic HTML

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

| Layer | Technology | Why This Choice |
|:---|:---|:---|
| **Framework** | React 19 + Vite 6 | Blazing-fast HMR, optimized production builds |
| **PDF Parsing** | pdfjs-dist | Industry-standard, Mozilla-backed, handles complex PDFs |
| **OCR Engine** | Tesseract.js v7 | Client-side WebAssembly — zero backend, full privacy |
| **AI Analysis** | Google Gemini 2.0 Flash | Generous free tier, fast inference, structured JSON output |
| **Icons** | Lucide React | Tree-shakable, consistent, 1000+ icons |
| **Styling** | Vanilla CSS + Custom Properties | Zero runtime overhead, full design control, small bundle |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and npm
- A free **[Google Gemini API Key](https://aistudio.google.com/apikey)** (takes 30 seconds)

### Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/VyshrawanP/Unthinkable.git
cd Unthinkable

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

### Configure API Key

1. Open `http://localhost:5173` in your browser
2. Click **"Add API Key"** in the top status bar
3. Paste your Gemini API key → click **Save Key**
4. Done! Your key is stored locally and never sent to any server except Google's API

---

## 📁 Project Structure

```
src/
├── components/
│   ├── FileUploader.jsx      # Drag-and-drop + file picker with validation
│   ├── TextExtractor.jsx     # Extracted text display + progress tracking
│   ├── AnalysisPanel.jsx     # AI results dashboard (scores, suggestions)
│   └── ApiKeyModal.jsx       # API key management with test validation
│
├── services/
│   ├── pdfService.js         # PDF.js extraction with formatting + progress
│   ├── ocrService.js         # Tesseract.js OCR with real-time progress
│   └── aiService.js          # Gemini API integration + prompt engineering
│
├── App.jsx                   # Main orchestration & state management
├── main.jsx                  # React entry point
└── index.css                 # Complete design system (700+ lines)
```

---

## 🧠 Technical Approach

<details>
<summary><strong>📖 Click to expand — 200-word approach summary (as required)</strong></summary>

<br/>

I built a fully **client-side document processing pipeline** paired with cloud AI analysis. The architecture separates concerns into three service modules: PDF parsing (pdfjs-dist), OCR (Tesseract.js via WebAssembly), and AI analysis (Gemini REST API).

**Key design decisions:**

- **Client-side processing**: PDF parsing and OCR run entirely in the browser using WebAssembly workers. This eliminates backend infrastructure, reduces latency, and ensures document privacy — files never leave the user's device.

- **Structured AI prompts**: The Gemini prompt is carefully engineered to return consistent JSON with specific fields (sentiment, engagement score, categorized suggestions, rewritten post). This makes the response predictable and parseable without complex error recovery.

- **Progressive UX**: Each processing phase (upload → extraction → analysis) flows naturally with real-time progress indicators. Tesseract.js provides native progress events; PDF.js extraction tracks per-page progress. Skeleton loading states keep the UI responsive during AI analysis.

- **Error resilience**: Every service handles specific failure modes — password-protected PDFs, invalid API keys, rate limits, empty OCR results — with actionable user-facing error messages rather than generic failures.

The React frontend uses vanilla CSS with custom properties for a premium glassmorphism dark theme, keeping the bundle lean while delivering a polished experience.

</details>

---

## 🔒 Privacy & Security

| Aspect | Implementation |
|:---|:---|
| **Document Processing** | 100% client-side — files never uploaded to any server |
| **API Key Storage** | localStorage only — never transmitted except to Google's API |
| **No Backend** | Zero server infrastructure — no database, no cookies, no tracking |
| **Open Source** | Full source code available for audit |

---

## 📦 Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview the production build locally
npm run preview
```

Output: ~690KB JS (204KB gzipped) + 20KB CSS (4KB gzipped)

---

## 🗺️ Future Enhancements

- [ ] Multi-file batch processing
- [ ] Export analysis results as PDF report
- [ ] Side-by-side comparison of original vs. optimized content
- [ ] Support for additional languages (Tesseract supports 100+)
- [ ] Social media post scheduling integration
- [ ] Historical analysis dashboard with trends

---

<div align="center">

### Built with ❤️ by [Vyshrawan P](https://github.com/VyshrawanP)

**React** · **PDF.js** · **Tesseract.js** · **Google Gemini AI**

<br/>

⭐ **Star this repo** if you found it useful!

</div>
