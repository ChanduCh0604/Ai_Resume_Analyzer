import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function AnalysisResults() {
  const { resumeId } = useParams();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(
          `http://localhost:2005/analysis/${resumeId}`
        );

        if (!response.ok) {
          throw new Error(
            'Analysis not found. Please generate the analysis first.'
          );
        }

        const data = await response.json();
        setAnalysis(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, [resumeId]);

  async function handleGenerateAnalysis() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        `http://localhost:2005/analysis/${resumeId}`,
        {
          method: 'POST'
        }
      );

      if (!response.ok) {
        throw new Error('Unable to generate resume analysis.');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function ScoreCard({ title, score }) {
    const value = Number(score);
    const validScore = Number.isFinite(value)
      ? Math.min(100, Math.max(0, value))
      : 0;

    return (
      <div className="score-card">
        <h3>{title}</h3>
        <div className="score-number">
          {score ?? 'N/A'}
          {score !== null && score !== undefined ? '/100' : ''}
        </div>
        <div className="score-track">
          <div
            className="score-fill"
            style={{ width: `${validScore}%` }}
          />
        </div>
      </div>
    );
  }

  function TextSection({ title, content }) {
    const items = Array.isArray(content)
      ? content
      : typeof content === 'string'
        ? content.split(/\n|•/).map((item) => item.trim()).filter(Boolean)
        : [];

    return (
      <section className="analysis-section">
        <h2>{title}</h2>

        {items.length > 0 ? (
          <ul>
            {items.map((item, index) => (
              <li key={`${title}-${index}`}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>No information available yet.</p>
        )}
      </section>
    );
  }

  if (loading) {
    return (
      <div className="analysis-page">
        <p className="loading-message">Loading resume analysis...</p>
      </div>
    );
  }

  return (
    <div className="analysis-page">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon small">RA</span>
          <span>Resume Analyzer</span>
        </div>

        <Link to="/dashboard" className="secondary-btn link-btn">
          Dashboard
        </Link>
      </header>

      <main className="analysis-content">
        <div className="analysis-heading">
          <p className="eyebrow">YOUR RESUME REPORT</p>
          <h1>Resume Analysis Results</h1>
          <p>Resume ID: {resumeId}</p>
        </div>

        {error && (
          <div className="analysis-error">
            <p className="error-message">{error}</p>

            <button
              className="primary-btn"
              onClick={handleGenerateAnalysis}
            >
              Generate Analysis
            </button>
          </div>
        )}

        {analysis && (
          <>
            <section className="overall-score">
              <h2>Overall Resume Score</h2>
              <p className="overall-number">
                {analysis.overallScore ?? 'N/A'}
                {analysis.overallScore !== null &&
                analysis.overallScore !== undefined
                  ? '/100'
                  : ''}
              </p>
              <p>Review the category scores and recommendations below.</p>
            </section>

            <section className="score-grid">
              <ScoreCard
                title="ATS Score"
                score={analysis.atsScore}
              />
              <ScoreCard
                title="Skills Score"
                score={analysis.skillsScore}
              />
              <ScoreCard
                title="Experience Score"
                score={analysis.experienceScore}
              />
              <ScoreCard
                title="Projects Score"
                score={analysis.projectScore}
              />
              <ScoreCard
                title="Education Score"
                score={analysis.educationScore}
              />
              <ScoreCard
                title="Format Score"
                score={analysis.formatScore}
              />
            </section>

            <TextSection
              title="Strengths"
              content={analysis.strengths}
            />

            <TextSection
              title="Weaknesses"
              content={analysis.weaknesses}
            />

            <TextSection
              title="Suggestions for Improvement"
              content={analysis.suggestions}
            />

            <div className="analysis-actions">
              <button
                className="primary-btn"
                onClick={handleGenerateAnalysis}
              >
                Regenerate Analysis
              </button>

              <Link
                to="/history"
                className="secondary-btn link-btn"
              >
                Resume History
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default AnalysisResults;