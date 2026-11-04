
const API_URL = 'http://localhost:2005/users';

async function sendAuthRequest(endpoint, requestData) {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(requestData)
  });

  const responseText = await response.text();

  let data = {};

  if (responseText.trim()) {
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error('Invalid JSON response from Spring Boot:', responseText);

      throw new Error(
        'The server returned an invalid response. Check the Spring Boot console.'
      );
    }
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
      data.detail ||
      data.error ||
      'Request failed. Please check your details.'
    );
  }

  return data;
}

export function loginUser(credentials) {
  return sendAuthRequest('login', credentials);
}

export function registerUser(userData) {
  return sendAuthRequest('register', userData);
}
