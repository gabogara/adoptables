export function isZip5(value) {
  const v = String(value || "").trim();
  return /^[0-9]{5}$/.test(v);
}
