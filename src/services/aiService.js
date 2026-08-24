const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const ANALYSIS_PROMPT = `You are a social media marketing expert. Analyze the following text as if it were content intended for a social media post (or extracted from a document that will be used for social media content).

Provide a comprehensive analysis in the following JSON format (respond ONLY with valid JSON, no markdown code fences):

{
  "summary": "A brief 2-3 sentence summary of what the content is about",
  "sentiment": {
    "label": "positive" | "negative" | "neutral" | "mixed",
    "score": 0.0 to 1.0,
    "explanation": "Brief explanation of the sentiment"
  },
  "engagementScore": {
    "score": 1 to 10,
    "explanation": "Why this score was given"
  },
  "suggestions": [
    {
      "category": "Category name (e.g., Tone, Hashtags, Call-to-Action, Formatting, Timing, Visual)",
      "suggestion": "Specific actionable suggestion to improve engagement"
    }
  ],
  "rewrittenPost": "An optimized version of the content rewritten for maximum social media engagement (keep it concise, under 280 characters if possible, or a short paragraph)",
  "targetPlatform": "The social media platform this content would work best on (Twitter/X, LinkedIn, Instagram, Facebook, etc.)",
  "hashtags": ["relevant", "hashtag", "suggestions"]
}

Important guidelines:
- Provide exactly 5 suggestions covering different categories
- Make the rewritten post engaging with emojis where appropriate
- Be specific and actionable in your suggestions
- If the content doesn't seem like social media content, still analyze it and suggest how it could be adapted

Here is the content to analyze:

`;

/**
 * Analyze text content using Google Gemini API for social media engagement insights.
 * @param {string} text - The text content to analyze.
 * @param {string} apiKey - Google Gemini API key.
 * @returns {Promise<object>} Analysis results.
 */
export async function analyzeSocialMediaContent(text, apiKey) {
  if (!apiKey) {
    throw new Error('API key is required. Please set your Gemini API key.');
  }

  if (!text || text.trim().length === 0) {
    throw new Error('No text content to analyze.');
  }

  // Truncate very long texts to avoid token limits
  const truncatedText = text.length > 10000 ? text.substring(0, 10000) + '\n\n[Content truncated...]' : text;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: ANALYSIS_PROMPT + truncatedText,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 2048,
    },
  };

  let response;
  try {
    response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
  } catch (err) {
    throw new Error('Network error: Unable to reach Gemini API. Check your internet connection.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const status = response.status;

    if (status === 400) {
      throw new Error('Invalid request. The content may be too long or contain unsupported characters.');
    } else if (status === 401 || status === 403) {
      throw new Error('Invalid API key. Please check your Gemini API key and try again.');
    } else if (status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    } else {
      throw new Error(
        `API error (${status}): ${errorData?.error?.message || 'Unknown error'}`
      );
    }
  }

  const data = await response.json();

  const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!generatedText) {
    throw new Error('No analysis generated. The API returned an empty response.');
  }

  // Parse JSON from the response (handle potential markdown code fences)
  let analysis;
  try {
    const jsonStr = generatedText
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();
    analysis = JSON.parse(jsonStr);
  } catch {
    throw new Error('Failed to parse analysis results. Please try again.');
  }

  return analysis;
}

/**
 * Test if a Gemini API key is valid by making a minimal request.
 * @param {string} apiKey - The API key to test.
 * @returns {Promise<boolean>} True if the key is valid.
 */
export async function testApiKey(apiKey) {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Say "ok"' }] }],
        generationConfig: { maxOutputTokens: 5 },
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
