import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import './ResumeBuilder.css';

const templateOptions = {
  professional: {
    name: 'Classic Professional',
    color: '#26364d',
    modern: false
  },
  minimal: {
    name: 'Minimal Clean',
    color: '#292929',
    modern: false
  },
  modern: {
    name: 'Modern Accent',
    color: '#7355d9',
    modern: true
  },
  creative: {
    name: 'Creative Profile',
    color: '#087e8b',
    modern: true
  }
};

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  summary: '',
  skills: '',
  experience: '',
  education: '',
  projects: '',
  certifications: ''
};

const sections = [
  { key: 'summary', label: 'Professional Summary', multiline: true },
  { key: 'skills', label: 'Skills', multiline: true },
  { key: 'experience', label: 'Work Experience', multiline: true },
  { key: 'education', label: 'Education', multiline: true },
  { key: 'projects', label: 'Projects', multiline: true },
  { key: 'certifications', label: 'Certifications', multiline: true }
];

function ResumeBuilder() {
  const { templateId = 'professional' } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [activeTemplate, setActiveTemplate] = useState(
    templateOptions[templateId] ? templateId : 'professional'
  );
  const [message, setMessage] = useState('');

  const template = templateOptions[activeTemplate];

  function updateField(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setMessage('');
  }

  function downloadPDF() {
    if (!form.fullName.trim()) {
      setMessage('Please enter your full name before downloading.');
      return;
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 17;
    const contentWidth = pageWidth - margin * 2;
    let y = 20;

    function ensureSpace(height) {
      if (y + height > pageHeight - 16) {
        pdf.addPage();
        y = 20;
      }
    }

    function writeSection(title, content) {
      if (!content.trim()) return;

      ensureSpace(17);

      y += 4;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(
        activeTemplate === 'minimal' ? 35 : 85,
        activeTemplate === 'minimal' ? 35 : 60,
        activeTemplate === 'minimal' ? 35 : 160
      );
      pdf.text(title.toUpperCase(), margin, y);
      y += 2;

      pdf.setDrawColor(...hexToRgb(template.color));
      pdf.setLineWidth(0.45);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 6;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9.5);
      pdf.setTextColor(55, 53, 65);

      const lines = pdf.splitTextToSize(content.trim(), contentWidth);

      lines.forEach((line) => {
        ensureSpace(5);
        pdf.text(line, margin, y);
        y += 5;
      });

      y += 2;
    }

    if (template.modern) {
      pdf.setFillColor(...hexToRgb(template.color));
      pdf.rect(0, 0, pageWidth, 49, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(23);
      pdf.text(form.fullName.trim(), margin, 22);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);

      const contact = [
        form.email,
        form.phone,
        form.location,
        form.linkedin
      ].filter(Boolean).join('  |  ');

      const contactLines = pdf.splitTextToSize(contact, contentWidth);
      pdf.text(contactLines, margin, 32);
      y = 57;
    } else {
      pdf.setTextColor(...hexToRgb(template.color));
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(23);
      const nameLines = pdf.splitTextToSize(form.fullName.trim(), contentWidth);
      pdf.text(nameLines, margin, y);
      y += nameLines.length * 9;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(80, 80, 90);

      const contact = [
        form.email,
        form.phone,
        form.location,
        form.linkedin
      ].filter(Boolean).join('  |  ');

      const contactLines = pdf.splitTextToSize(contact, contentWidth);
      pdf.text(contactLines, margin, y);
      y += contactLines.length * 5 + 3;
    }

    writeSection('Professional Summary', form.summary);
    writeSection('Skills', form.skills);
    writeSection('Work Experience', form.experience);
    writeSection('Education', form.education);
    writeSection('Projects', form.projects);
    writeSection('Certifications', form.certifications);

    const safeName = form.fullName
      .trim()
      .replace(/[^a-z0-9_-]+/gi, '_')
      .replace(/^_+|_+$/g, '');

    pdf.save(`${safeName || 'Resume'}_Resume.pdf`);
    setMessage('Your PDF download has started.');
  }

  function hexToRgb(hex) {
    const value = hex.replace('#', '');
    return [
      parseInt(value.slice(0, 2), 16),
      parseInt(value.slice(2, 4), 16),
      parseInt(value.slice(4, 6), 16)
    ];
  }

  return (
    <div className="builder-app">
      <header className="builder-navbar">
        <Link to="/dashboard" className="builder-brand">
          <span className="builder-brand-icon">RA</span>
          Resume Analyzer
        </Link>

        <div className="builder-nav-actions">
          <Link to="/templates">All Templates</Link>
          <button
            type="button"
            className="builder-exit-btn"
            onClick={() => navigate('/dashboard')}
          >
            Exit Builder
          </button>
        </div>
      </header>

      <main className="builder-main">
        <div className="builder-heading">
          <div>
            <span className="builder-eyebrow">CREATE YOUR NEXT OPPORTUNITY</span>
            <h1>Resume Builder</h1>
            <p>Enter your details and see your resume update live.</p>
          </div>

          <button
            type="button"
            className="builder-download-btn"
            onClick={downloadPDF}
          >
            ↓ Download PDF
          </button>
        </div>

        <div className="builder-template-picker">
          <span>Choose a design</span>

          {Object.entries(templateOptions).map(([id, option]) => (
            <button
              key={id}
              type="button"
              className={
                activeTemplate === id
                  ? 'builder-template-choice selected'
                  : 'builder-template-choice'
              }
              onClick={() => {
                setActiveTemplate(id);
                setMessage('');
              }}
            >
              <span
                className="builder-color-dot"
                style={{ background: option.color }}
              />
              {option.name}
            </button>
          ))}
        </div>

        {message && (
          <div className="builder-message" role="status">
            {message}
          </div>
        )}

        <div className="builder-workspace">
          <section className="builder-form-panel">
            <div className="builder-panel-heading">
              <span className="builder-step-number">01</span>
              <div>
                <h2>Your Information</h2>
                <p>Fill in the details you want on your resume.</p>
              </div>
            </div>

            <form
              className="builder-form"
              onSubmit={(event) => {
                event.preventDefault();
                downloadPDF();
              }}
            >
              <label>
                Full Name *
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={updateField}
                  placeholder="e.g. Chandra Sekhar Reddy"
                  required
                />
              </label>

              <div className="builder-two-columns">
                <label>
                  Email
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={updateField}
                    placeholder="you@example.com"
                  />
                </label>

                <label>
                  Phone
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={updateField}
                    placeholder="+91 98765 43210"
                  />
                </label>
              </div>

              <div className="builder-two-columns">
                <label>
                  Location
                  <input
                    name="location"
                    value={form.location}
                    onChange={updateField}
                    placeholder="City, Country"
                  />
                </label>

                <label>
                  LinkedIn / Portfolio
                  <input
                    name="linkedin"
                    value={form.linkedin}
                    onChange={updateField}
                    placeholder="linkedin.com/in/yourname"
                  />
                </label>
              </div>

              {sections.map((section) => (
                <label key={section.key}>
                  {section.label}
                  <textarea
                    name={section.key}
                    value={form[section.key]}
                    onChange={updateField}
                    rows={section.key === 'summary' ? 4 : 5}
                    placeholder={getPlaceholder(section.key)}
                  />
                  <span className="builder-field-hint">
                    {section.key === 'skills'
                      ? 'Separate skills with commas or new lines.'
                      : 'Use new lines to separate roles, qualifications, or projects.'}
                  </span>
                </label>
              ))}

              <button
                type="submit"
                className="builder-download-btn builder-mobile-download"
              >
                Download Completed Resume PDF
              </button>
            </form>
          </section>

          <section className="builder-preview-panel">
            <div className="builder-preview-heading">
              <div>
                <span className="builder-step-number">02</span>
                <h2>Live Preview</h2>
              </div>
              <span className="builder-live-indicator">
                <span /> LIVE
              </span>
            </div>

            <div
              className={`resume-live-preview ${
                template.modern ? 'resume-modern' : 'resume-ats'
              }`}
              style={{ '--resume-accent': template.color }}
            >
              <div className="resume-preview-header">
                <h1>{form.fullName || 'Your Name'}</h1>
                <p>
                  {[
                    form.email,
                    form.phone,
                    form.location,
                    form.linkedin
                  ].filter(Boolean).join(' | ') ||
                    'Email | Phone | Location | LinkedIn'}
                </p>
              </div>

              {sections.map((section) => {
                const value = form[section.key];

                if (!value.trim()) return null;

                return (
                  <section className="resume-preview-section" key={section.key}>
                    <h3>{section.label}</h3>
                    <div className="resume-preview-content">{value}</div>
                  </section>
                );
              })}

              {!sections.some((section) => form[section.key].trim()) && (
                <div className="resume-preview-placeholder">
                  <span>✦</span>
                  <p>Your resume sections will appear here as you type.</p>
                </div>
              )}
            </div>

            <p className="builder-preview-note">
              Preview is illustrative. The exported PDF uses a print-ready
              layout and may paginate differently for longer content.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

function getPlaceholder(key) {
  const placeholders = {
    summary: 'Briefly describe your background, key skills, and career goals.',
    skills: 'Java, Spring Boot, React, SQL, Git',
    experience: 'Job Title | Company | Dates\nDescribe your responsibilities and achievements.',
    education: 'Degree | College | Graduation year\nInclude relevant academic details.',
    projects: 'Project Name | Technologies used\nDescribe what you built and the result.',
    certifications: 'Certification Name | Issuing Organization | Year'
  };

  return placeholders[key] || '';
}

export default ResumeBuilder;
