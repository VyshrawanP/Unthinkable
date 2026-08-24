import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

/**
 * Extract text from a PDF file while preserving basic formatting.
 * @param {File} file - The PDF file to extract text from.
 * @param {function} onProgress - Callback for progress updates: (page, totalPages)
 * @returns {Promise<{text: string, pageCount: number}>}
 */
export async function extractTextFromPdf(file, onProgress) {
  const arrayBuffer = await file.arrayBuffer();

  let pdf;
  try {
    pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  } catch (err) {
    if (err.message?.includes('password')) {
      throw new Error('This PDF is password-protected. Please provide an unprotected file.');
    }
    throw new Error(`Failed to load PDF: ${err.message}`);
  }

  const totalPages = pdf.numPages;
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    if (onProgress) onProgress(i, totalPages);

    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();

    // Reconstruct text with basic formatting
    let lastY = null;
    let pageText = '';

    for (const item of textContent.items) {
      if (item.str === undefined) continue;

      // Detect line breaks by checking Y position changes
      const currentY = item.transform ? item.transform[5] : null;
      if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 2) {
        pageText += '\n';
      } else if (lastY !== null && pageText.length > 0 && !pageText.endsWith('\n')) {
        // Add space between items on the same line
        if (item.str.trim()) {
          pageText += ' ';
        }
      }

      pageText += item.str;
      lastY = currentY;
    }

    pages.push(pageText.trim());
  }

  const fullText = pages
    .map((text, i) => (totalPages > 1 ? `--- Page ${i + 1} ---\n${text}` : text))
    .join('\n\n');

  return {
    text: fullText.trim(),
    pageCount: totalPages,
  };
}
