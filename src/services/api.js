const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5126/api";

async function request(path, options) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      message = body.error || message;
    } catch {
      // response had no JSON body
    }
    throw new Error(message);
  }

  return response.json();
}

export function analyzeContent({ inputType, content, secondaryContent }) {
  return request("/fraud/analyze", {
    method: "POST",
    body: JSON.stringify({ inputType, content, secondaryContent }),
  });
}

export function getHistory() {
  return request("/fraud/history");
}

export function getCase(caseId) {
  return request(`/fraud/history/${caseId}`);
}
