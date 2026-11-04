import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:2005';

function UploadResume() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0] || null;

    setFile(null);
    setError('');
    setMessage('');

    if (!selectedFile) return;

    if (
      !selectedFile.name.toLowerCase().endsWith('.pdf') ||
      (selectedFile.type &&
        selectedFile.type !== 'application/pdf')
    ) {
      setError('Please select a valid PDF file.');
      event.target.value = '';
      return;
    }

    setFile(selectedFile);
  }

  async function readError(response, fallback) {
    const text = await response.text();

    if (!text) {
      return `${fallback} (HTTP ${response.status})`;
    }

    try {
      const data = JSON.parse(text);
      return data.message || data.error || fallback;
    } catch {
      return `${fallback}: ${text.slice(0, 250)}`;
    }
  }

  async function handleUpload(event) {
    event.preventDefault();

    setError('');
    setMessage('');

    if (!file) {
      setError('Please select your resume PDF.');
      return;
    }

    // Get the logged-in user's ID automatically.
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      setError('Your session has expired. Please log in again.');
      return;
    }

    const formData = new FormData();

    // These names must match your Spring Boot controller.
    formData.append('resume', file);
    formData.append('user_id', userId);

    try {
      setLoading(true);
      setMessage('Uploading your resume...');

      // Step 1: Upload the PDF.
      const uploadResponse = await fetch(
        `${API_URL}/resumes/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!uploadResponse.ok) {
        throw new Error(
          await readError(uploadResponse, 'Resume upload failed')
        );
      }

      const resume = await uploadResponse.json();
      const resumeId = resume.id ?? resume.resumeId;

      if (resumeId == null) {
        throw new Error(
          'Resume uploaded, but the server did not return its ID.'
        );
      }

      setMessage('Resume uploaded. AI analysis is running...');

      // Step 2: Analyze the uploaded resume.
      const analysisResponse = await fetch(
        `${API_URL}/resumeAnalysis/analyze/${resumeId}`,
        {
          method: 'POST'
        }
      );

      if (!analysisResponse.ok) {
        throw new Error(
          await readError(
            analysisResponse,
            'Resume uploaded, but analysis failed'
          )
        );
      }

      setMessage('Analysis completed! Opening your report...');

      // Step 3: Open the analysis page.
      navigate(`/analysis/${resumeId}`);

    } catch (err) {
      console.error('Upload/analysis error:', err);

      setError(
        err.message === 'Failed to fetch'
          ? 'Cannot connect to Spring Boot. Check port 2005 and CORS settings.'
          : err.message || 'Something went wrong.'
      );

      setMessage('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="upload-page">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon small">RA</span>
          <span>Resume Analyzer</span>
        </div>

        <Link to="/dashboard" className="secondary-btn link-btn">
          Dashboard
        </Link>
      </header>

      <main className="upload-content">
        <div className="upload-card">
          <div className="feature-icon">📄</div>

          <h1>Upload Your Resume</h1>

          <p className="subtitle">
            Upload your PDF to discover your strengths and areas to improve.
          </p>

          <form onSubmit={handleUpload}>
            <label htmlFor="resumeFile">
              Choose Resume (PDF)
            </label>

            <input
              id="resumeFile"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              disabled={loading}
              required
            />

            {file && (
              <p className="file-info">
                Selected file: {file.name}
              </p>
            )}

            {error && (
              <p className="error-message" role="alert">
                {error}
              </p>
            )}

            {message && (
              <p className="success-message" role="status">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="primary-btn"
              disabled={loading || !file}
            >
              {loading
                ? 'Please wait...'
                : 'Upload & Analyze Resume'}
            </button>
          </form>

          <p className="auth-footer">
            <Link to="/history">View Resume History</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default UploadResume;