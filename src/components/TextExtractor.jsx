import { useState } from 'react';
import { FileText, Copy, Check, Loader, AlertCircle } from 'lucide-react';

export default function TextExtractor({
  extractedText,
  extractionProgress,
  isExtracting,
  extractionError,
  fileType,
  pageCount,
  ocrConfidence,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = extractedText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Loading state
  if (isExtracting) {
    return (
      <div className="text-extractor glass-card animate-fade-in-up">
        <div className="section-header">
          <div className="section-header__icon section-header__icon--cyan">
            <FileText size={20} />
          </div>
          <div className="section-header__text">
            <h2>Extracting Text</h2>
            <p>
              {fileType === 'pdf'
                ? 'Parsing PDF document...'
                : 'Running OCR on image...'}
            </p>
          </div>
        </div>

        <div className="progress-container">
          <div className="progress-label">
            <Loader size={16} className="progress-label__spinner" />
            <span>{extractionProgress.status || 'Processing...'}</span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${extractionProgress.percent}%` }}
            />
          </div>
          <div className="progress-percent">{extractionProgress.percent}%</div>
        </div>
      </div>
    );
  }

  // Error state
  if (extractionError) {
    return (
      <div className="text-extractor glass-card animate-fade-in-up">
        <div className="section-header">
          <div className="section-header__icon section-header__icon--rose">
            <AlertCircle size={20} />
          </div>
          <div className="section-header__text">
            <h2>Extraction Failed</h2>
            <p>An error occurred while extracting text</p>
          </div>
        </div>

        <div className="error-banner">
          <AlertCircle size={16} className="error-banner__icon" />
          <span className="error-banner__text">{extractionError}</span>
        </div>
      </div>
    );
  }

  // No text yet
  if (!extractedText) return null;

  const wordCount = extractedText.split(/\s+/).filter(Boolean).length;
  const charCount = extractedText.length;

  return (
    <div className="text-extractor glass-card animate-fade-in-up">
      <div className="section-header">
        <div className="section-header__icon section-header__icon--cyan">
          <FileText size={20} />
        </div>
        <div className="section-header__text">
          <h2>Extracted Text</h2>
          <p>
            {fileType === 'pdf'
              ? `${pageCount} page${pageCount !== 1 ? 's' : ''} parsed`
              : `OCR confidence: ${ocrConfidence}%`}
          </p>
        </div>
      </div>

      <div className="extracted-text-container">
        <div className="extracted-text-header">
          <div className="extracted-text-header__info">
            <span className="extracted-text-header__badge">
              {wordCount.toLocaleString()} words
            </span>
            <span className="extracted-text-header__badge">
              {charCount.toLocaleString()} chars
            </span>
          </div>
          <button
            className={`copy-btn ${copied ? 'copy-btn--copied' : ''}`}
            onClick={handleCopy}
            id="copy-text-btn"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div className="extracted-text-body">{extractedText}</div>
      </div>
    </div>
  );
}
