const API_URL = 'http://localhost:2005/analysis';

export async function generateAnalysis(resumeId) {
  const response = await fetch(`${API_URL}/${resumeId}`, {
    method: 'POST'
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || 'Failed to generate resume analysis.');
  }

  return response.json();
}

export async function getAnalysisByResumeId(resumeId) {
  const response = await fetch(`${API_URL}/${resumeId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch resume analysis.');
  }

  return response.json();
}