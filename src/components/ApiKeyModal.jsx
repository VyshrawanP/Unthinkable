import { useState } from 'react';
import { Key, ExternalLink, Loader, CheckCircle, XCircle } from 'lucide-react';
import { testApiKey } from '../services/aiService';

export default function ApiKeyModal({ onSave, onClose, initialKey }) {
  const [apiKey, setApiKey] = useState(initialKey || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // null | 'success' | 'error'

  const handleTest = async () => {
    if (!apiKey.trim()) return;
    setTesting(true);
    setTestResult(null);
    const isValid = await testApiKey(apiKey.trim());
    setTestResult(isValid ? 'success' : 'error');
    setTesting(false);
  };

  const handleSave = () => {
    const trimmed = apiKey.trim();
    if (trimmed) {
      onSave(trimmed);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <div className="modal__icon">
            <Key size={22} />
          </div>
          <h2 className="modal__title">Gemini API Key</h2>
        </div>

        <p className="modal__description">
          This app uses Google&apos;s Gemini AI to analyze your content. You need a free API key to enable the analysis features.
          <br />
          <br />
          Get your free key from{' '}
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google AI Studio <ExternalLink size={12} style={{ verticalAlign: 'middle' }} />
          </a>
        </p>

        <div className="modal__input-group">
          <label className="modal__label" htmlFor="api-key-input">
            API Key
          </label>
          <input
            id="api-key-input"
            type="password"
            className="modal__input"
            placeholder="AIzaSy..."
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              setTestResult(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
            }}
            autoFocus
          />

          {testResult === 'success' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '8px',
                fontSize: '0.875rem',
                color: '#10b981',
              }}
            >
              <CheckCircle size={14} />
              API key is valid!
            </div>
          )}

          {testResult === 'error' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '8px',
                fontSize: '0.875rem',
                color: '#f43f5e',
              }}
            >
              <XCircle size={14} />
              Invalid API key. Please check and try again.
            </div>
          )}
        </div>

        <div className="modal__actions">
          <button
            className="btn btn--primary btn--full"
            onClick={handleSave}
            disabled={!apiKey.trim()}
            id="save-api-key-btn"
          >
            Save Key
          </button>
          <button
            className="btn btn--secondary"
            onClick={handleTest}
            disabled={!apiKey.trim() || testing}
            id="test-api-key-btn"
          >
            {testing ? <Loader size={14} className="progress-label__spinner" /> : null}
            {testing ? 'Testing...' : 'Test'}
          </button>
        </div>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <button className="btn btn--ghost" onClick={onClose} id="close-modal-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
