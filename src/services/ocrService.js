import { createWorker } from 'tesseract.js';

/**
 * Extract text from an image file using Tesseract.js OCR.
 * @param {File} file - The image file to perform OCR on.
 * @param {function} onProgress - Callback for progress updates: (progress: 0-100, status: string)
 * @returns {Promise<{text: string, confidence: number}>}
 */
export async function extractTextFromImage(file, onProgress) {
  let worker = null;

  try {
    worker = await createWorker(
      'eng',
      1, // OEM.LSTM_ONLY
      {
        logger: (m) => {
          if (onProgress && m.progress !== undefined) {
            const percent = Math.round(m.progress * 100);
            const status = formatStatus(m.status);
            onProgress(percent, status);
          }
        },
      }
    );

    const imageUrl = URL.createObjectURL(file);

    try {
      const { data } = await worker.recognize(imageUrl);

      return {
        text: data.text.trim(),
        confidence: Math.round(data.confidence),
      };
    } finally {
      URL.revokeObjectURL(imageUrl);
    }
  } catch (err) {
    throw new Error(`OCR failed: ${err.message}`);
  } finally {
    if (worker) {
      await worker.terminate();
    }
  }
}

/**
 * Format Tesseract status messages for display.
 */
function formatStatus(status) {
  const statusMap = {
    'loading tesseract core': 'Loading OCR engine...',
    'initializing tesseract': 'Initializing...',
    'loading language traineddata': 'Loading language data...',
    'initializing api': 'Preparing OCR...',
    'recognizing text': 'Recognizing text...',
  };

  return statusMap[status] || status || 'Processing...';
}
