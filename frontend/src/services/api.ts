const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

function getToken() {
  return localStorage.getItem("accessToken");
}

function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

async function refreshAccessToken() {
  const rt = getRefreshToken();
  if (!rt) return null;
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: rt }),
  });
  if (!res.ok) return null;
  const json = await res.json();
  if (json.success) {
    localStorage.setItem("accessToken", json.data.tokens.accessToken);
    localStorage.setItem("refreshToken", json.data.tokens.refreshToken);
    return json.data.tokens.accessToken;
  }
  return null;
}

async function request(method: string, endpoint: string, body?: unknown, retry = true) {
  const url = `${API_BASE}${endpoint}`;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && retry) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      const retryRes = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
      return retryRes.json();
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return null;
    }
  }

  return res.json();
}

export const api = {
  get: (endpoint: string) => request("GET", endpoint, undefined),
  post: (endpoint: string, body?: unknown) => request("POST", endpoint, body),
  patch: (endpoint: string, body?: unknown) => request("PATCH", endpoint, body),
  delete: (endpoint: string) => request("DELETE", endpoint),
};
