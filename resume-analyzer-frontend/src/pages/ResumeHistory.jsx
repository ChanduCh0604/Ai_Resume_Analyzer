import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ResumeHistory() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  async function fetchResumes() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('http://localhost:2005/resumes');

      if (!response.ok) {
        throw new Error('Unable to fetch resume history.');
      }

      const data = await response.json();
      setResumes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchResumes();
  }, []);

  async function handleDelete(resumeId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this resume?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setError('');

      const response = await fetch(
        `http://localhost:2005/resumes/${resumeId}`,
        {
          method: 'DELETE'
        }
      );

      if (!response.ok) {
        throw new Error('Unable to delete this resume.');
      }

      setResumes((previousResumes) =>
        previousResumes.filter((resume) => resume.id !== resumeId)
      );
    } catch (err) {
      setError(err.message);
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
          <p>View your uploaded resumes and their analysis reports.</p>
        </div>

        <div className="history-actions">
          <Link to="/upload" className="primary-btn link-btn">
            Upload New Resume
          </Link>

          <button className="secondary-btn" onClick={fetchResumes}>
            Refresh
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <p className="loading-message">Loading your resumes...</p>
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
            {resumes.map((resume) => (
              <div className="resume-card" key={resume.id}>
                <div className="resume-details">
                  <div className="feature-icon">📄</div>

                  <div>
                    <h2>{resume.fileName || 'Untitled Resume'}</h2>
                    <p>Resume ID: {resume.id}</p>
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
                    className="primary-btn"
                    onClick={() => navigate(`/analysis/${resume.id}`)}
                  >
                    View Analysis
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(resume.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default ResumeHistory;