import {
  BarChart3,
  TrendingUp,
  Lightbulb,
  PenLine,
  Hash,
  Target,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Shuffle,
  Sparkles,
} from 'lucide-react';

function SentimentIcon({ label }) {
  switch (label) {
    case 'positive':
      return <ThumbsUp size={16} />;
    case 'negative':
      return <ThumbsDown size={16} />;
    case 'mixed':
      return <Shuffle size={16} />;
    default:
      return <Minus size={16} />;
  }
}

function ScoreRing({ score, max = 10, color }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / max) * circumference;

  return (
    <div className="score-ring">
      <svg viewBox="0 0 100 100">
        <circle className="score-ring__bg" cx="50" cy="50" r={radius} />
        <circle
          className="score-ring__fill"
          cx="50"
          cy="50"
          r={radius}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="score-ring__value" style={{ color }}>
        {score}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text" />
    </div>
  );
}

function SkeletonScoreCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-circle" />
      <div className="skeleton skeleton-text" style={{ width: '80%', margin: '0 auto' }} />
    </div>
  );
}

export default function AnalysisPanel({ analysis, isAnalyzing, analysisError }) {
  // Loading state
  if (isAnalyzing) {
    return (
      <div className="analysis-panel glass-card animate-fade-in-up">
        <div className="section-header">
          <div className="section-header__icon section-header__icon--emerald">
            <Sparkles size={20} />
          </div>
          <div className="section-header__text">
            <h2>Analyzing Content</h2>
            <p>AI is evaluating your content for engagement potential...</p>
          </div>
        </div>

        <div className="analysis-grid stagger-children">
          <SkeletonCard />
          <SkeletonScoreCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  // Error state
  if (analysisError) {
    return (
      <div className="analysis-panel glass-card animate-fade-in-up">
        <div className="section-header">
          <div className="section-header__icon section-header__icon--rose">
            <BarChart3 size={20} />
          </div>
          <div className="section-header__text">
            <h2>Analysis Failed</h2>
            <p>Unable to complete the analysis</p>
          </div>
        </div>

        <div className="error-banner">
          <span className="error-banner__icon">
            <BarChart3 size={16} />
          </span>
          <span className="error-banner__text">{analysisError}</span>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const sentimentLabel = analysis.sentiment?.label || 'neutral';
  const engagementScore = analysis.engagementScore?.score || 0;
  const scoreColor =
    engagementScore >= 7
      ? '#10b981'
      : engagementScore >= 4
        ? '#f59e0b'
        : '#f43f5e';

  return (
    <div className="analysis-panel glass-card animate-fade-in-up">
      <div className="section-header">
        <div className="section-header__icon section-header__icon--emerald">
          <BarChart3 size={20} />
        </div>
        <div className="section-header__text">
          <h2>Engagement Analysis</h2>
          <p>AI-powered insights to boost your social media performance</p>
        </div>
      </div>

      <div className="analysis-grid stagger-children">
        {/* Summary Card */}
        <div className="analysis-card">
          <div className="analysis-card__header">
            <div
              className="analysis-card__icon"
              style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}
            >
              <Target size={18} />
            </div>
            <span className="analysis-card__title">Content Summary</span>
          </div>
          <div className="analysis-card__content">{analysis.summary}</div>
          {analysis.targetPlatform && (
            <div style={{ marginTop: '12px' }}>
              <span
                className="extracted-text-header__badge"
                style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa' }}
              >
                Best for: {analysis.targetPlatform}
              </span>
            </div>
          )}
        </div>

        {/* Engagement Score Card */}
        <div className="analysis-card">
          <div className="analysis-card__header">
            <div
              className="analysis-card__icon"
              style={{
                background:
                  engagementScore >= 7
                    ? 'rgba(16, 185, 129, 0.15)'
                    : engagementScore >= 4
                      ? 'rgba(245, 158, 11, 0.15)'
                      : 'rgba(244, 63, 94, 0.15)',
                color: scoreColor,
              }}
            >
              <TrendingUp size={18} />
            </div>
            <span className="analysis-card__title">Engagement Score</span>
          </div>
          <ScoreRing score={engagementScore} color={scoreColor} />
          <div
            className="analysis-card__content"
            style={{ textAlign: 'center' }}
          >
            {analysis.engagementScore?.explanation}
          </div>
        </div>

        {/* Sentiment Card */}
        <div className="analysis-card">
          <div className="analysis-card__header">
            <div
              className="analysis-card__icon"
              style={{
                background:
                  sentimentLabel === 'positive'
                    ? 'rgba(16, 185, 129, 0.15)'
                    : sentimentLabel === 'negative'
                      ? 'rgba(244, 63, 94, 0.15)'
                      : 'rgba(245, 158, 11, 0.15)',
                color:
                  sentimentLabel === 'positive'
                    ? '#10b981'
                    : sentimentLabel === 'negative'
                      ? '#f43f5e'
                      : '#f59e0b',
              }}
            >
              <SentimentIcon label={sentimentLabel} />
            </div>
            <span className="analysis-card__title">Sentiment</span>
          </div>
          <div className={`sentiment-badge sentiment-badge--${sentimentLabel}`}>
            <SentimentIcon label={sentimentLabel} />
            {sentimentLabel.charAt(0).toUpperCase() + sentimentLabel.slice(1)}
            {analysis.sentiment?.score !== undefined && (
              <span style={{ opacity: 0.7 }}>
                ({Math.round(analysis.sentiment.score * 100)}%)
              </span>
            )}
          </div>
          <div className="analysis-card__content">
            {analysis.sentiment?.explanation}
          </div>
        </div>

        {/* Hashtags Card */}
        {analysis.hashtags && analysis.hashtags.length > 0 && (
          <div className="analysis-card">
            <div className="analysis-card__header">
              <div
                className="analysis-card__icon"
                style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}
              >
                <Hash size={18} />
              </div>
              <span className="analysis-card__title">Suggested Hashtags</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {analysis.hashtags.map((tag, i) => (
                <span
                  key={i}
                  className="format-badge"
                  style={{
                    background: 'rgba(6, 182, 212, 0.1)',
                    color: '#22d3ee',
                    borderColor: 'rgba(6, 182, 212, 0.2)',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions Card - full width */}
        {analysis.suggestions && analysis.suggestions.length > 0 && (
          <div className="analysis-card analysis-card--full">
            <div className="analysis-card__header">
              <div
                className="analysis-card__icon"
                style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}
              >
                <Lightbulb size={18} />
              </div>
              <span className="analysis-card__title">
                Improvement Suggestions
              </span>
            </div>
            <ul className="suggestions-list">
              {analysis.suggestions.map((s, i) => (
                <li key={i} className="suggestion-item">
                  <span className="suggestion-item__number">{i + 1}</span>
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>
                      {s.category}:
                    </strong>{' '}
                    {s.suggestion}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Rewritten Post Card - full width */}
        {analysis.rewrittenPost && (
          <div className="analysis-card analysis-card--full">
            <div className="analysis-card__header">
              <div
                className="analysis-card__icon"
                style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}
              >
                <PenLine size={18} />
              </div>
              <span className="analysis-card__title">
                Optimized Post Version
              </span>
            </div>
            <div className="rewritten-text">{analysis.rewrittenPost}</div>
          </div>
        )}
      </div>
    </div>
  );
}
