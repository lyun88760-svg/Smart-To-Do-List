const API_BASE = '/api';

async function api(path, options = {}) {
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const res = await fetch(`${API_BASE}${path}`, config);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  if (res.status === 204) return null;
  return res.json();
}

export { api };
