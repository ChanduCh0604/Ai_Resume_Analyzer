const API_URL = 'http://localhost:2005/resumes';

export async function getResumes() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch resumes.');
  }

  return response.json();
}

export async function uploadResume(file, userId) {
  const formData = new FormData();

  formData.append('file', file);
  formData.append('userId', userId);

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || 'Failed to upload resume.');
  }

  return response.json();
}

export async function getResumeById(resumeId) {
  const response = await fetch(`${API_URL}/${resumeId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch resume.');
  }

  return response.json();
}

export async function deleteResume(resumeId) {
  const response = await fetch(`${API_URL}/${resumeId}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error('Failed to delete resume.');
  }

  if (response.status !== 204) {
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  return null;
}