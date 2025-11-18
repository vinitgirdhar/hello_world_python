// src/api/report.ts

export async function postReport(payload: any) {
  const res = await fetch("http://localhost:8000/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error("Failed to save report: " + text);
  }

  return res.json();
}
