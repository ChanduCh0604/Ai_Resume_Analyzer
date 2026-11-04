import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const API_URL = 'http://localhost:2005';

function Dashboard() {
  const navigate = useNavigate();

  const userId = sessionStorage.getItem('userId');
  const userName = sessionStorage.getItem('userName') || 'User';

  const [resumes, setResumes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchResumes = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      setError('Please log in to view your dashboard.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        `${API_URL}/resumes/user/${userId}/history`
      );

      if (!response.ok) {
        throw new Error(`Unable to load resumes (HTTP ${response.status}).`);
      }

      const data = await response.json();
      setResumes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Cannot connect to Spring Boot on port 2005.'
          : err.message || 'Unable to load dashboard.'
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const filteredResumes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return resumes.filter((resume) =>
      (resume.fileName || '')
        .toLowerCase()
        .includes(query)
    );
  }, [resumes, search]);

  const analyzedCount = resumes.filter(
    (resume) => resume.analysis != null
  ).length;

  const latestResume = [...resumes].sort(
    (a, b) =>
      new Date(b.uploadDate || 0) -
      new Date(a.uploadDate || 0)
  )[0];

  function handleLogout() {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('userEmail');
    navigate('/');
  }

  function formatDate(date) {
    if (!date) return 'Date unavailable';

    const parsed = new Date(date);

    return Number.isNaN(parsed.getTime())
      ? 'Date unavailable'
      : parsed.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
  }

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <Link to="/dashboard" className="dashboard-brand">
          <span className="dashboard-logo">RA</span>
          <span>Resume Analyzer</span>
        </Link>

        <p className="sidebar-label">WORKSPACE</p>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="sidebar-link active">
            <span>▦</span> Dashboard
          </Link>

          <Link to="/upload" className="sidebar-link">
            <span>↥</span> Upload Resume
          </Link>

          <Link to="/history" className="sidebar-link">
            <span>◷</span> Resume History
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <span className="help-icon">✦</span>
            <strong>Improve your resume</strong>
            <p>Analyze your resume to discover what you can improve.</p>
            <Link to="/upload">Get started →</Link>
          </div>

          <button
            className="sidebar-logout"
            onClick={handleLogout}
          >
            ↪ Log out
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <p className="eyebrow">YOUR WORKSPACE</p>
            <h1>Dashboard</h1>
          </div>

          <div className="topbar-actions">
            <button
              className="refresh-button"
              onClick={fetchResumes}
              disabled={loading}
              title="Refresh dashboard"
            >
              ↻ <span>Refresh</span>
            </button>

            <div className="user-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>

            <div className="user-info">
              <strong>{userName}</strong>
              <span>Resume Analyzer</span>
            </div>
          </div>
        </header>

        <section className="welcome-banner">
          <div className="welcome-content">
            <span className="welcome-tag">✦ YOUR CAREER TOOLKIT</span>
            <h2>Welcome back, {userName}!</h2>
            <p>
              Your next career opportunity starts with a stronger resume.
              Upload your resume and let AI help you improve it.
            </p>

            <Link to="/upload" className="dashboard-primary-btn">
              + Analyze New Resume
            </Link>
          </div>

          <div className="welcome-art" aria-hidden="true">
            <div className="art-circle">✦</div>
            <div className="art-document">
              <div className="art-document-title">RESUME</div>
              <div className="art-line wide"></div>
              <div className="art-line"></div>
              <div className="art-line short"></div>
              <div className="art-score">AI ✓</div>
            </div>
          </div>
        </section>

        {error && (
          <div className="dashboard-error" role="alert">
            <span>{error}</span>
            {!userId && (
              <button onClick={() => navigate('/')}>
                Go to Login
              </button>
            )}
          </div>
        )}

        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <h2>Your Overview</h2>
              <p>Track your resume analysis activity.</p>
            </div>
          </div>

          <div className="stats-grid">
            <article className="stat-card">
              <div className="stat-card-top">
                <span className="stat-icon purple">▤</span>
                <span className="stat-caption">ALL TIME</span>
              </div>
              <p className="stat-label">Total Resumes</p>
              <h3>{loading ? '—' : resumes.length}</h3>
              <p className="stat-foot">Resumes uploaded</p>
            </article>

            <article className="stat-card">
              <div className="stat-card-top">
                <span className="stat-icon green">✓</span>
                <span className="stat-caption">COMPLETED</span>
              </div>
              <p className="stat-label">Analyzed Resumes</p>
              <h3>{loading ? '—' : analyzedCount}</h3>
              <p className="stat-foot">Analysis records available</p>
            </article>

            <article className="stat-card">
              <div className="stat-card-top">
                <span className="stat-icon orange">↗</span>
                <span className="stat-caption">LATEST</span>
              </div>
              <p className="stat-label">Latest Upload</p>
              <h3 className="stat-date">
                {loading
                  ? '—'
                  : latestResume
                    ? formatDate(latestResume.uploadDate)
                    : 'No uploads'}
              </h3>
              <p className="stat-foot">Most recent resume</p>
            </article>
          </div>
        </section>

        <section className="dashboard-section recent-section">
          <div className="section-heading recent-heading">
            <div>
              <h2>Recent Resumes</h2>
              <p>Your uploaded documents in one place.</p>
            </div>

            <Link to="/history" className="view-all-link">
              View all →
            </Link>
          </div>

          <div className="resume-toolbar">
            <div className="resume-search">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Search resumes by file name..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <span className="resume-count">
              {filteredResumes.length} document(s)
            </span>
          </div>

          {loading ? (
            <div className="dashboard-empty">
              <div className="loading-spinner"></div>
              <p>Loading your resumes...</p>
            </div>
          ) : filteredResumes.length === 0 ? (
            <div className="dashboard-empty">
              <div className="empty-document">▤</div>
              <h3>
                {search ? 'No matching resumes' : 'Your workspace is ready'}
              </h3>
              <p>
                {search
                  ? 'Try a different file name.'
                  : 'Upload your first resume to get personalized feedback.'}
              </p>

              {!search && (
                <Link to="/upload" className="dashboard-primary-btn">
                  Upload Your First Resume
                </Link>
              )}
            </div>
          ) : (
            <div className="resume-list">
              {filteredResumes.slice(0, 5).map((resume) => {
                const resumeId = resume.id ?? resume.resumeId;
                const analyzed = resume.analysis != null;

                return (
                  <article
                    className="resume-row"
                    key={resumeId}
                  >
                    <div className="pdf-icon">PDF</div>

                    <div className="resume-details">
                      <strong>
                        {resume.fileName || `Resume #${resumeId}`}
                      </strong>
                      <span>
                        Uploaded {formatDate(resume.uploadDate)}
                      </span>
                    </div>

                    <span
                      className={`resume-status ${
                        analyzed ? 'status-complete' : 'status-pending'
                      }`}
                    >
                      {analyzed ? '✓ Analyzed' : '○ Not analyzed'}
                    </span>

                    {analyzed ? (
                      <button
                        className="resume-action"
                        onClick={() =>
                          navigate(`/analysis/${resumeId}`)
                        }
                      >
                        View Report →
                      </button>
                    ) : (
                      <button
                        className="resume-action"
                        onClick={() =>
                          navigate('/upload')
                        }
                      >
                        Analyze →
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <footer className="dashboard-footer">
          <span>Resume Analyzer</span>
          <span>Build a stronger resume, one step at a time.</span>
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;