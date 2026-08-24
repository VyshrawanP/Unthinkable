import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, Image, X } from 'lucide-react';

const ACCEPTED_TYPES = {
  'application/pdf': 'PDF',
  'image/png': 'PNG',
  'image/jpeg': 'JPG',
  'image/gif': 'GIF',
  'image/bmp': 'BMP',
  'image/webp': 'WEBP',
  'image/tiff': 'TIFF',
};

const ACCEPT_STRING = Object.keys(ACCEPTED_TYPES).join(',');
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileType(file) {
  if (file.type === 'application/pdf') return 'pdf';
  if (file.type.startsWith('image/')) return 'image';
  return 'unknown';
}

export default function FileUploader({ onFileSelected, disabled }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const dragCounter = useRef(0);

  const validateFile = useCallback((file) => {
    if (!ACCEPTED_TYPES[file.type]) {
      return `Unsupported file type "${file.type || file.name.split('.').pop()}". Please upload a PDF or image file.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File size (${formatFileSize(file.size)}) exceeds the 20MB limit.`;
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (file) => {
      setError(null);

      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setSelectedFile(file);
      onFileSelected(file);
    },
    [onFileSelected, validateFile]
  );

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
      // Reset input so the same file can be selected again
      e.target.value = '';
    },
    [handleFile]
  );

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
    onFileSelected(null);
  }, [onFileSelected]);

  const fileType = selectedFile ? getFileType(selectedFile) : null;

  return (
    <div className="file-uploader glass-card animate-fade-in-up">
      <div className="section-header">
        <div className="section-header__icon section-header__icon--violet">
          <Upload size={20} />
        </div>
        <div className="section-header__text">
          <h2>Upload Document</h2>
          <p>Upload a PDF or image file to extract and analyze content</p>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <X size={16} className="error-banner__icon" />
          <span className="error-banner__text">{error}</span>
        </div>
      )}

      <div
        className={`drop-zone ${isDragging ? 'drop-zone--active' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload file"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_STRING}
          onChange={handleInputChange}
          style={{ display: 'none' }}
          disabled={disabled}
          id="file-upload-input"
        />

        <div className="drop-zone__icon">
          <Upload size={48} strokeWidth={1.5} />
        </div>

        <div className="drop-zone__text">
          <h3>{isDragging ? 'Drop your file here' : 'Drag & drop your file here'}</h3>
          <p>
            or <span>browse files</span> from your computer
          </p>
        </div>

        <div className="drop-zone__formats">
          {['PDF', 'PNG', 'JPG', 'WEBP', 'GIF', 'BMP', 'TIFF'].map((fmt) => (
            <span key={fmt} className="format-badge">
              {fmt}
            </span>
          ))}
        </div>
      </div>

      {selectedFile && (
        <div className="file-preview">
          <div className={`file-preview__icon file-preview__icon--${fileType}`}>
            {fileType === 'pdf' ? <FileText size={24} /> : <Image size={24} />}
          </div>
          <div className="file-preview__info">
            <div className="file-preview__name">{selectedFile.name}</div>
            <div className="file-preview__size">
              {formatFileSize(selectedFile.size)} · {fileType === 'pdf' ? 'PDF Document' : 'Image File'}
            </div>
          </div>
          {!disabled && (
            <button
              className="file-preview__remove"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              aria-label="Remove file"
              id="remove-file-btn"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
