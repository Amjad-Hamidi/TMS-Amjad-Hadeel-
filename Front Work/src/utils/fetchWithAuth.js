export async function fetchWithAuth(url, options = {}) {
  let accessToken = localStorage.getItem('accessToken');
  let refreshToken = localStorage.getItem('refreshToken');
  let headers = options.headers || {};
  headers['Authorization'] = `Bearer ${accessToken}`;
  options.headers = headers;

  let response = await fetch(url, options);

  if (response.status === 401) {
    // Try to refresh token
    const refreshRes = await fetch('https://amjad-hamidi-tms.runasp.net/api/Account/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: '*/*' },
      body: JSON.stringify({ accessToken, refreshToken }),
    });
    if (refreshRes.ok) {
      const data = await refreshRes.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      // Retry original request with new token
      headers['Authorization'] = `Bearer ${data.accessToken}`;
      options.headers = headers;
      return fetch(url, options);
    } else {
      // Redirect to login
      localStorage.clear();
      window.location.href = '/login';
      throw new Error('Session expired, please login again.');
    }
  }
  return response;
} 