import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <nav className="home-navbar">
        <Link to="/" className="home-logo">
          <span className="home-logo-icon">RA</span>
          <span>Resume Analyzer</span>
        </Link>

        <div className="home-nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <Link to="/templates">Resume Templates</Link>
          <Link to="/login" className="home-login-btn">
            Login
          </Link>
          <Link to="/register" className="home-register-btn">
            Get Started
          </Link>
        </div>
      </nav>

      <main>
        <section className="home-hero">
          <div className="home-hero-content">
            <span className="home-badge">
              AI-POWERED RESUME ANALYSIS
            </span>

            <h1>
              Make Your Resume
              <br />
              <span>Stand Out.</span>
            </h1>

            <p>
              Discover resume weaknesses, understand your ATS
              compatibility, and get actionable suggestions to
              improve your resume with AI-powered analysis.
            </p>

            <div className="home-hero-actions">
              <Link to="/upload" className="home-primary-btn">
                Analyze My Resume →
              </Link>

<Link to="/templates" className="home-secondary-btn">
  Explore Resume Templates
</Link>
              <a href="#features" className="home-secondary-btn">
                Explore Features
              </a>
            </div>

            <div className="home-trust-points">
              <span>✓ Detailed resume feedback</span>
              <span>✓ ATS score analysis</span>
              <span>✓ Improvement suggestions</span>
            </div>
          </div>

          <div className="home-preview">
            <div className="preview-top">
              <div>
                <span className="preview-label">YOUR RESUME REPORT</span>
                <h3>Resume Performance</h3>
              </div>
              <span className="preview-icon">✦</span>
            </div>

            <div className="preview-score">
              <div className="preview-score-circle">
                <span>85</span>
                <small>/100</small>
              </div>
              <div>
                <h4>Resume Score</h4>
                <p>Example report preview</p>
              </div>
            </div>

            <div className="preview-metric">
              <div>
                <span>ATS Compatibility</span>
                <strong>90%</strong>
              </div>
              <div className="preview-track">
                <div className="preview-fill fill-one" />
              </div>
            </div>

            <div className="preview-metric">
              <div>
                <span>Skills</span>
                <strong>80%</strong>
              </div>
              <div className="preview-track">
                <div className="preview-fill fill-two" />
              </div>
            </div>

            <div className="preview-metric">
              <div>
                <span>Projects</span>
                <strong>75%</strong>
              </div>
              <div className="preview-track">
                <div className="preview-fill fill-three" />
              </div>
            </div>

            <div className="preview-tip">
              <span>✦</span>
              <div>
                <strong>Improvement tip</strong>
                <p>Use measurable achievements to strengthen project descriptions.</p>
              </div>
            </div>

            <p className="preview-disclaimer">
              Illustrative scores only — not a real analysis.
            </p>
          </div>
        </section>

        <section className="home-features" id="features">
          <div className="home-section-heading">
            <span>SMARTER RESUME IMPROVEMENT</span>
            <h2>Everything You Need to Improve Your Resume</h2>
            <p>
              Understand what's working and discover where you can improve.
            </p>
          </div>

          <div className="home-feature-grid">
            <article className="home-feature-card">
              <div className="feature-icon purple">◎</div>
              <h3>ATS Compatibility</h3>
              <p>
                Review your resume's ATS-related formatting and compatibility.
              </p>
            </article>

            <article className="home-feature-card">
              <div className="feature-icon blue">✧</div>
              <h3>Skills Analysis</h3>
              <p>
                Review your skills and identify areas that may need improvement.
              </p>
            </article>

            <article className="home-feature-card">
              <div className="feature-icon orange">↗</div>
              <h3>Resume Feedback</h3>
              <p>
                Understand resume strengths, weaknesses, and opportunities.
              </p>
            </article>

            <article className="home-feature-card">
              <div className="feature-icon green">✓</div>
              <h3>Actionable Suggestions</h3>
              <p>
                Get practical suggestions for improving your resume.
              </p>
            </article>
          </div>
        </section>

        <section className="home-how" id="how-it-works">
          <div className="home-section-heading">
            <span>THREE SIMPLE STEPS</span>
            <h2>How It Works</h2>
          </div>

          <div className="home-steps">
            <article className="home-step">
              <span>01</span>
              <h3>Create Your Account</h3>
              <p>Sign up to access your personal resume workspace.</p>
            </article>

            <article className="home-step">
              <span>02</span>
              <h3>Upload Your Resume</h3>
              <p>Upload your resume PDF to begin the analysis.</p>
            </article>

            <article className="home-step">
              <span>03</span>
              <h3>Review Your Results</h3>
              <p>Explore your scores, feedback, and improvement suggestions.</p>
            </article>
          </div>
        </section>

        <section className="home-cta">
          <h2>Ready to Improve Your Resume?</h2>
          <p>Get started and discover what you can improve today.</p>
          <Link to="/upload" className="home-primary-btn">
            Get Started — Analyze My Resume →
          </Link>
        </section>
      </main>

      <footer className="home-footer">
        <Link to="/" className="home-logo">
          <span className="home-logo-icon">RA</span>
          <span>Resume Analyzer</span>
        </Link>
        <p>Make every application count.</p>
      </footer>
    </div>
  );
}

export default Home;
