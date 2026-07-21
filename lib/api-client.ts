"use client";

function redirectIfUnauthorized(res: Response) {
  if (res.status === 401) {
    window.location.href = "/enter-code";
    throw new Error("Unauthorized");
  }
}

export async function fetchTable<T>(table: string): Promise<T[]> {
  const res = await fetch(`/api/${table}`);
  redirectIfUnauthorized(res);
  if (!res.ok) throw new Error(`Failed to load ${table}`);
  return res.json();
}

export async function upsertRow<T extends { id: string }>(table: string, row: T): Promise<void> {
  const res = await fetch(`/api/${table}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(row),
  });
  redirectIfUnauthorized(res);
  if (!res.ok) throw new Error(`Failed to save to ${table}`);
}

export async function deleteRow(table: string, id: string): Promise<void> {
  const res = await fetch(`/api/${table}/${id}`, { method: "DELETE" });
  redirectIfUnauthorized(res);
  if (!res.ok) throw new Error(`Failed to delete from ${table}`);
}
