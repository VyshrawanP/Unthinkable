import { useState, useCallback } from 'react';
import { Sparkles, Key, Settings } from 'lucide-react';

import FileUploader from './components/FileUploader';
import TextExtractor from './components/TextExtractor';
import AnalysisPanel from './components/AnalysisPanel';
import ApiKeyModal from './components/ApiKeyModal';

import { extractTextFromPdf } from './services/pdfService';
import { extractTextFromImage } from './services/ocrService';
import { analyzeSocialMediaContent } from './services/aiService';

const API_KEY_STORAGE_KEY = 'smca_gemini_api_key';

function getStoredApiKey() {
  try {
    return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

function storeApiKey(key) {
  try {
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
  } catch {
    // localStorage may be unavailable
  }
}

function removeApiKey() {
  try {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export default function App() {
  // API Key state
  const [apiKey, setApiKey] = useState(getStoredApiKey);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  // File state
  const [selectedFile, setSelectedFile] = useState(null);

  // Extraction state
  const [extractedText, setExtractedText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState({ percent: 0, status: '' });
  const [extractionError, setExtractionError] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [ocrConfidence, setOcrConfidence] = useState(0);

  // Analysis state
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  // Reset all extraction and analysis state
  const resetState = useCallback(() => {
    setExtractedText('');
    setIsExtracting(false);
    setExtractionProgress({ percent: 0, status: '' });
    setExtractionError(null);
    setFileType(null);
    setPageCount(0);
    setOcrConfidence(0);
    setAnalysis(null);
    setIsAnalyzing(false);
    setAnalysisError(null);
  }, []);

  // Handle file selection
  const handleFileSelected = useCallback(
    async (file) => {
      resetState();

      if (!file) {
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);

      const isPdf = file.type === 'application/pdf';
      const isImage = file.type.startsWith('image/');
      const type = isPdf ? 'pdf' : isImage ? 'image' : null;
      setFileType(type);

      if (!type) {
        setExtractionError('Unsupported file type.');
        return;
      }

      // Start extraction
      setIsExtracting(true);

      try {
        let text = '';

        if (isPdf) {
          const result = await extractTextFromPdf(file, (page, total) => {
            const percent = Math.round((page / total) * 100);
            setExtractionProgress({
              percent,
              status: `Extracting page ${page} of ${total}...`,
            });
          });
          text = result.text;
          setPageCount(result.pageCount);
        } else {
          const result = await extractTextFromImage(file, (percent, status) => {
            setExtractionProgress({ percent, status });
          });
          text = result.text;
          setOcrConfidence(result.confidence);
        }

        if (!text || text.trim().length === 0) {
          setExtractionError(
            isPdf
              ? 'No text found in this PDF. It may be a scanned document — try uploading it as an image instead.'
              : 'No text could be extracted from this image. Try a clearer or higher-resolution image.'
          );
          setIsExtracting(false);
          return;
        }

        setExtractedText(text);
        setIsExtracting(false);

        // Auto-trigger analysis if API key is set
        if (apiKey) {
          runAnalysis(text, apiKey);
        }
      } catch (err) {
        setExtractionError(err.message || 'An unexpected error occurred during extraction.');
        setIsExtracting(false);
      }
    },
    [apiKey, resetState]
  );

  // Run AI analysis
  const runAnalysis = async (text, key) => {
    setAnalysis(null);
    setAnalysisError(null);
    setIsAnalyzing(true);

    try {
      const result = await analyzeSocialMediaContent(text, key);
      setAnalysis(result);
    } catch (err) {
      setAnalysisError(err.message || 'Analysis failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle analyze button click (when API key wasn't set during extraction)
  const handleAnalyzeClick = () => {
    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }
    if (extractedText) {
      runAnalysis(extractedText, apiKey);
    }
  };

  // Handle API key save
  const handleApiKeySave = (key) => {
    setApiKey(key);
    storeApiKey(key);
    setShowApiKeyModal(false);

    // If we have extracted text waiting, trigger analysis
    if (extractedText && !analysis && !isAnalyzing) {
      runAnalysis(extractedText, key);
    }
  };

  const handleApiKeyRemove = () => {
    setApiKey('');
    removeApiKey();
  };

  const hasApiKey = !!apiKey;
  const showAnalyzeBtn = extractedText && !analysis && !isAnalyzing && !analysisError;

  return (
    <>
      {/* Header */}
      <header className="app-header">
        <div className="app-header__logo">
          <Sparkles size={32} />
        </div>
        <h1 className="app-header__title">Social Media Content Analyzer</h1>
        <p className="app-header__subtitle">
          Upload documents, extract text with AI-powered OCR, and get actionable
          suggestions to boost your social media engagement.
        </p>
      </header>

      <main className="app-container">
        {/* API Key Status Bar */}
        <div className="api-key-bar">
          <div className="api-key-bar__status">
            <span
              className={`api-key-bar__dot ${hasApiKey ? 'api-key-bar__dot--active' : 'api-key-bar__dot--inactive'}`}
            />
            {hasApiKey
              ? 'Gemini API connected'
              : 'No API key configured'}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn--ghost"
              onClick={() => setShowApiKeyModal(true)}
              id="configure-api-key-btn"
            >
              <Key size={14} />
              {hasApiKey ? 'Change Key' : 'Add API Key'}
            </button>
            {hasApiKey && (
              <button
                className="btn btn--ghost"
                onClick={handleApiKeyRemove}
                style={{ color: 'var(--color-rose)' }}
                id="remove-api-key-btn"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {/* Workflow */}
        <div className="workflow">
          {/* Step 1: Upload */}
          <div className="workflow__step">
            <FileUploader
              onFileSelected={handleFileSelected}
              disabled={isExtracting}
            />
          </div>

          {/* Step 2: Extracted Text */}
          {(isExtracting || extractedText || extractionError) && (
            <div className="workflow__step">
              <TextExtractor
                extractedText={extractedText}
                extractionProgress={extractionProgress}
                isExtracting={isExtracting}
                extractionError={extractionError}
                fileType={fileType}
                pageCount={pageCount}
                ocrConfidence={ocrConfidence}
              />

              {/* Analyze button (shown when text is extracted but no analysis yet) */}
              {showAnalyzeBtn && (
                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                  <button
                    className="btn btn--primary btn--lg"
                    onClick={handleAnalyzeClick}
                    id="analyze-btn"
                  >
                    <Sparkles size={18} />
                    {hasApiKey ? 'Analyze for Engagement' : 'Set API Key & Analyze'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Analysis Results */}
          {(isAnalyzing || analysis || analysisError) && (
            <div className="workflow__step">
              <AnalysisPanel
                analysis={analysis}
                isAnalyzing={isAnalyzing}
                analysisError={analysisError}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        Social Media Content Analyzer · Built with React, PDF.js, Tesseract.js & Gemini AI
      </footer>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <ApiKeyModal
          onSave={handleApiKeySave}
          onClose={() => setShowApiKeyModal(false)}
          initialKey={apiKey}
        />
      )}
    </>
  );
}
