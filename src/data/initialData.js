// initialData.js - Default data and utility formatters for React POS KABEL

export const DEFAULT_TRANSACTIONS = [];

export const DEFAULT_EXPENSES = [];

export const DEFAULT_INITIAL_BALANCE = 0;

export function formatRp(amount) {
  const num = Number(amount) || 0;
  return "Rp " + num.toLocaleString("id-ID");
}

export function formatDateOnly(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const day = String(d.getDate()).padStart(2, "0");
  const month = months[d.getMonth()] || "";
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export function formatDateTime(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const day = String(d.getDate()).padStart(2, "0");
  const month = months[d.getMonth()] || "";
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${day} ${month}, ${hours}.${mins}`;
}
