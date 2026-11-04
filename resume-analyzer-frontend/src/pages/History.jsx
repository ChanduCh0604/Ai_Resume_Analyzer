
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:2005';

function ResumeHistory() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const fetchResumes = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/resumes`);

      if (!response.ok) {
        throw new Error(`Unable to fetch resume history (HTTP ${response.status}).`);
      }

      const data = await response.json();
      setResumes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Cannot connect to Spring Boot on port 2005.'
          : err.message || 'Unable to fetch resume history.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  async function handleDelete(resumeId) {
    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      setError('');

      const response = await fetch(
        `${API_URL}/resumes/${resumeId}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error(`Unable to delete resume (HTTP ${response.status}).`);
      }

      setResumes((current) =>
        current.filter((resume) => (resume.id ?? resume.resumeId) !== resumeId)
      );
    } catch (err) {
      setError(err.message || 'Unable to delete this resume.');
    }
  }

  return (
    <div className="history-page">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon small">RA</span>
          <span>Resume Analyzer</span>
        </div>

        <Link to="/dashboard" className="secondary-btn link-btn">
          Dashboard
        </Link>
      </header>

      <main className="history-content">
        <div className="history-heading">
          <p className="eyebrow">YOUR DOCUMENTS</p>
          <h1>Resume History</h1>
          <p>View uploaded resumes and open their analysis reports.</p>
        </div>

        <div className="history-actions">
          <Link to="/upload" className="primary-btn link-btn">
            Upload New Resume
          </Link>

          <button
            type="button"
            className="secondary-btn"
            onClick={fetchResumes}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <p className="loading-message">Loading resumes...</p>
        ) : resumes.length === 0 ? (
          <div className="empty-state">
            <h2>No resumes found</h2>
            <p>Upload your first resume to get started.</p>
            <Link to="/upload" className="primary-btn link-btn">
              Upload Resume
            </Link>
          </div>
        ) : (
          <div className="resume-list">
            {resumes.map((resume) => {
              const resumeId = resume.id ?? resume.resumeId;

              return (
                <article className="resume-card" key={resumeId}>
                  <div className="resume-details">
                    <div className="feature-icon">📄</div>

                    <div>
                      <h2>{resume.fileName || 'Untitled Resume'}</h2>
                      <p>Resume ID: {resumeId}</p>
                      <p>
                        Uploaded:{' '}
                        {resume.uploadDate
                          ? new Date(resume.uploadDate).toLocaleString()
                          : 'Date unavailable'}
                      </p>
                    </div>
                  </div>

                  <div className="resume-actions">
                    <button
                      type="button"
                      className="primary-btn"
                      onClick={() => navigate(`/analysis/${resumeId}`)}
                      disabled={!resumeId}
                    >
                      View Analysis
                    </button>

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleDelete(resumeId)}
                      disabled={!resumeId}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default ResumeHistory;
