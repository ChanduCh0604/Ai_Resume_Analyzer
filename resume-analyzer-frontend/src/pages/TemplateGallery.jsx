
import { Link } from 'react-router-dom';
import './TemplateGallery.css';

const templates = [
  {
    id: 'professional',
    name: 'Classic Professional',
    category: 'ATS-friendly',
    description: 'A clean, single-column layout for most job applications.',
    color: '#26364d',
    style: 'classic'
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    category: 'ATS-friendly',
    description: 'Simple typography and clear sections for easy scanning.',
    color: '#242424',
    style: 'minimal'
  },
  {
    id: 'modern',
    name: 'Modern Accent',
    category: 'Modern',
    description: 'Contemporary styling with elegant color accents.',
    color: '#7355d9',
    style: 'modern'
  },
  {
    id: 'creative',
    name: 'Creative Profile',
    category: 'Modern',
    description: 'A colorful design for portfolios and creative roles.',
    color: '#087e8b',
    style: 'creative'
  }
];

function TemplateGallery() {
  return (
    <main className="template-gallery">
      <header className="template-nav">
        <Link to="/" className="template-brand">
          <span className="template-brand-icon">RA</span>
          Resume Analyzer
        </Link>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register" className="template-nav-cta">
            Create Account
          </Link>
        </nav>
      </header>

      <section className="template-heading">
        <span className="template-eyebrow">RESUME BUILDER</span>
        <h1>Find a resume template that fits you.</h1>
        <p>
          Choose a design, add your information, preview your resume,
          and download a PDF ready for your next application.
        </p>
      </section>

      <section className="template-filters">
        <span>All templates</span>
        <span>ATS-friendly</span>
        <span>Modern designs</span>
      </section>

      <section className="template-grid">
        {templates.map((template) => (
          <article className="template-card" key={template.id}>
            <div className={`template-paper ${template.style}`}>
              <div
                className="paper-header"
                style={{ '--template-color': template.color }}
              >
                <div className="paper-name">YOUR NAME</div>
                <div className="paper-contact">
                  email@example.com | +91 00000 00000
                </div>
              </div>

              <div className="paper-body">
                <div className="paper-section-title">SUMMARY</div>
                <div className="paper-line long" />
                <div className="paper-line" />

                <div className="paper-section-title">EXPERIENCE</div>
                <div className="paper-subtitle">Job Title · Company</div>
                <div className="paper-line long" />
                <div className="paper-line" />
                <div className="paper-line medium" />

                <div className="paper-section-title">EDUCATION</div>
                <div className="paper-subtitle">Degree · University</div>
                <div className="paper-line medium" />

                <div className="paper-section-title">SKILLS</div>
                <div className="paper-line long" />
              </div>

              <div className="paper-watermark">PREVIEW</div>
            </div>

            <div className="template-card-info">
              <div className="template-card-topline">
                <h2>{template.name}</h2>
                <span
                  className={
                    template.category === 'Modern'
                      ? 'template-tag modern-tag'
                      : 'template-tag'
                  }
                >
                  {template.category}
                </span>
              </div>

              <p>{template.description}</p>

              <Link
                to={`/resume-builder/${template.id}`}
                className="template-use-btn"
              >
                Use This Template <span>→</span>
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="template-bottom-cta">
        <h2>Your next opportunity starts with a stronger resume.</h2>
        <p>Build your resume and then use our AI analyzer to review it.</p>
        <Link to="/register" className="template-use-btn">
          Get Started
        </Link>
      </section>
    </main>
  );
}

export default TemplateGallery;
