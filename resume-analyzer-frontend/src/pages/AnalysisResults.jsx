
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './AnalysisResults.css';

const API_URL = 'http://localhost:2005';

const scoreItems = [
  { key: 'atsScore', label: 'ATS Compatibility' },
  { key: 'skillsScore', label: 'Skills' },
  { key: 'experienceScore', label: 'Experience' },
  { key: 'projectScore', label: 'Projects' },
  { key: 'educationScore', label: 'Education' },
  { key: 'formatScore', label: 'Formatting' }
];

function AnalysisResults() {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadAnalysis() {
      setLoading(true);
      setError('');
      setAnalysis(null);

      try {
        const response = await fetch(
          `${API_URL}/resumeAnalysis/resume/${resumeId}`,
          { signal: controller.signal }
        );

        if (response.status === 404) {
          throw new Error(
            'No saved analysis was found for this resume. Upload and analyze it first.'
          );
        }

        if (!response.ok) {
          throw new Error(`Unable to load analysis (HTTP ${response.status}).`);
        }

        const data = await response.json();
        setAnalysis(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(
            err.message === 'Failed to fetch'
              ? 'Cannot connect to Spring Boot on port 2005.'
              : err.message || 'Unable to load the report.'
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    if (resumeId) {
      loadAnalysis();
    } else {
      setError('Resume ID is missing from the URL.');
      setLoading(false);
    }

    return () => controller.abort();
  }, [resumeId]);

  function scoreClass(value) {
    if (value === null || value === undefined || !Number.isFinite(Number(value))) {
      return 'score-na';
    }

    if (Number(value) >= 80) return 'score-good';
    if (Number(value) >= 60) return 'score-medium';
    return 'score-low';
  }

  if (loading) {
    return (
      <main className="report-state">
        <h2>Preparing your resume report...</h2>
        <p>Retrieving your saved analysis.</p>
      </main>
    );
  }

  if (error || !analysis) {
    return (
      <main className="report-state">
        <h1>Analysis unavailable</h1>
        <p className="error-message">
          {error || 'No analysis data was found.'}
        </p>

        <button
          className="report-button secondary"
          onClick={() => navigate('/history')}
        >
          Back to History
        </button>

        <button
          className="report-button primary"
          onClick={() => navigate('/upload')}
        >
          Upload a Resume
        </button>
      </main>
    );
  }

  const overallScore =
    analysis.overallScore === null || analysis.overallScore === undefined
      ? null
      : Number(analysis.overallScore);

  const pdfUrl = `${API_URL}/resumes/${resumeId}/pdf`;

  return (
    <div className="report-app">
      <header className="report-topbar">
        <button
          className="report-brand"
          onClick={() => navigate('/dashboard')}
        >
          <span className="brand-mark">RA</span>
          <span>Resume Analyzer</span>
        </button>

        <div className="topbar-actions">
          <Link to="/history">Resume History</Link>
          <Link to="/upload" className="report-button primary">
            Analyze New Resume
          </Link>
        </div>
      </header>

      <main className="report-main">
        <section className="report-intro" id="overview">
          <span className="eyebrow">YOUR PERSONAL RESUME REVIEW</span>
          <h1>Resume Analysis Report</h1>
          <p>Review your resume score, strengths, and areas to improve.</p>
          <p>Resume ID: {resumeId}</p>
        </section>

        <section className="report-panel">
          <h2>Overall Resume Score</h2>
          <div className={`overall-score ${scoreClass(overallScore)}`}>
            {overallScore !== null && Number.isFinite(overallScore)
              ? `${overallScore}/100`
              : 'Not available'}
          </div>
        </section>

        <section className="report-panel" id="scores">
          <h2>Score Breakdown</h2>

          <div className="score-breakdown-grid">
            {scoreItems.map((item) => {
              const value = analysis[item.key];
              const valid =
                value !== null &&
                value !== undefined &&
                Number.isFinite(Number(value));
              const numericValue = valid ? Number(value) : 0;

              return (
                <article className="breakdown-item" key={item.key}>
                  <div className="breakdown-label">
                    {item.label}
                  </div>

                  <div className={`breakdown-value ${scoreClass(value)}`}>
                    {valid ? `${numericValue}/100` : 'N/A'}
                  </div>

                  <div className="progress-track">
                    <div
                      className={`progress-fill ${scoreClass(value)}`}
                      style={{
                        width: `${Math.max(0, Math.min(100, numericValue))}%`
                      }}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="report-panel" id="strengths">
          <h2>✓ Your Strengths</h2>
          <p className="feedback-content">
            {analysis.strengths?.trim() ||
              'No strengths were returned by the analysis.'}
          </p>
        </section>

        <section className="report-panel" id="weaknesses">
          <h2>! Areas to Improve</h2>
          <p className="feedback-content">
            {analysis.weaknesses?.trim() ||
              'No weaknesses were returned by the analysis.'}
          </p>
        </section>

        <section className="report-panel" id="suggestions">
          <h2>✦ Suggestions for Improvement</h2>
          <p className="feedback-content">
            {analysis.suggestions?.trim() ||
              'No suggestions were returned by the analysis.'}
          </p>
        </section>

        <section className="report-panel">
          <h2>Resume PDF Preview</h2>
          <p>
            If the preview does not load, use the button below to open the PDF.
          </p>

          <iframe
            title={`Resume PDF ${resumeId}`}
            src={pdfUrl}
            className="resume-pdf-frame"
          />

          <a href={pdfUrl} target="_blank" rel="noreferrer">
            Open PDF in a new tab
          </a>
        </section>

        <div className="report-bottom-actions">
          <button
            className="report-button secondary"
            onClick={() => navigate('/history')}
          >
            Back to History
          </button>

          <button
            className="report-button primary"
            onClick={() => navigate('/upload')}
          >
            Analyze Another Resume
          </button>
        </div>
      </main>
    </div>
  );
}

export default AnalysisResults;
