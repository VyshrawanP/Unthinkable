# Social Media Content Analyzer

An AI-powered web application that extracts text from uploaded PDFs and images (via OCR), then analyzes the content for social media engagement potential — providing sentiment analysis, engagement scoring, actionable improvement suggestions, and an optimized rewrite.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![Tesseract.js](https://img.shields.io/badge/Tesseract.js-OCR-4285F4)
![Gemini](https://img.shields.io/badge/Gemini_AI-Free_Tier-8E75B2)

## ✨ Features

- **📄 PDF Text Extraction** — Parse multi-page PDFs with formatting preservation using PDF.js
- **🖼️ OCR for Images** — Extract text from scanned documents and screenshots using Tesseract.js (fully client-side)
- **🤖 AI Content Analysis** — Google Gemini-powered analysis including:
  - Content summary & best platform recommendation
  - Sentiment analysis (positive/negative/neutral) with confidence score
  - Engagement score (1–10) with visual ring gauge
  - 5 actionable improvement suggestions across categories (tone, hashtags, CTA, formatting, timing)
  - Optimized rewritten post version
  - Hashtag recommendations
- **🎯 Drag & Drop Upload** — Intuitive file upload with drag-and-drop and file picker
- **⚡ Real-time Progress** — Live progress tracking for PDF parsing and OCR processing
- **🔒 Privacy-First** — All document processing happens client-side; only AI analysis hits an external API
- **🌙 Premium Dark UI** — Glassmorphism design with micro-animations

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| Framework | React 19 + Vite 6 |
| PDF Parsing | pdfjs-dist (PDF.js) |
| OCR | Tesseract.js (WebAssembly, client-side) |
| AI Analysis | Google Gemini 2.0 Flash (REST API) |
| Icons | Lucide React |
| Styling | Vanilla CSS (custom properties, glassmorphism) |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- A free [Google Gemini API key](https://aistudio.google.com/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/social-media-content-analyzer.git
cd social-media-content-analyzer

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Configuration

1. Open the app in your browser (default: `http://localhost:5173`)
2. Click **"Add API Key"** in the status bar
3. Paste your Gemini API key and click **Save Key**
4. Your key is stored in localStorage (never sent anywhere except Google's API)

## 📖 Usage

1. **Upload** a PDF or image file via drag-and-drop or the file picker
2. **Wait** for text extraction (progress is shown in real time)
3. **Review** the extracted text — copy it if needed
4. **Analyze** — the AI automatically analyzes the content (or click "Analyze for Engagement")
5. **Review insights** — sentiment, engagement score, suggestions, and an optimized post version

## 🏗️ Architecture

```
src/
├── components/
│   ├── FileUploader.jsx    # Drag-and-drop file upload with validation
│   ├── TextExtractor.jsx   # Extracted text display with progress & copy
│   ├── AnalysisPanel.jsx   # AI analysis dashboard (scores, suggestions)
│   └── ApiKeyModal.jsx     # API key configuration modal
├── services/
│   ├── pdfService.js       # PDF.js text extraction with formatting
│   ├── ocrService.js       # Tesseract.js OCR with progress tracking
│   └── aiService.js        # Gemini API integration & prompt engineering
├── App.jsx                 # Main orchestration & state management
├── main.jsx                # Entry point
└── index.css               # Design system (tokens, glassmorphism, animations)
```

## 📝 Approach (200 words)

I built a fully client-side document processing pipeline paired with cloud AI analysis. The architecture separates concerns into three service modules: PDF parsing (pdfjs-dist), OCR (Tesseract.js via WebAssembly), and AI analysis (Gemini REST API).

**Key design decisions:**

- **Client-side processing**: PDF parsing and OCR run entirely in the browser using WebAssembly workers. This eliminates backend infrastructure, reduces latency, and ensures document privacy — files never leave the user's device.

- **Structured AI prompts**: The Gemini prompt is carefully engineered to return consistent JSON with specific fields (sentiment, engagement score, categorized suggestions, rewritten post). This makes the response predictable and parseable without complex error recovery.

- **Progressive UX**: Each processing phase (upload → extraction → analysis) flows naturally with real-time progress indicators. Tesseract.js provides native progress events; PDF.js extraction tracks per-page progress. Skeleton loading states keep the UI responsive during AI analysis.

- **Error resilience**: Every service handles specific failure modes — password-protected PDFs, invalid API keys, rate limits, empty OCR results — with actionable user-facing error messages rather than generic failures.

The React frontend uses vanilla CSS with custom properties for a premium glassmorphism dark theme, keeping the bundle lean while delivering a polished experience.

## 📦 Build for Production

```bash
npm run build
npm run preview  # Preview the production build locally
```

## 📄 License

MIT
