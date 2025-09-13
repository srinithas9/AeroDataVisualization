// small JWT user extractor (no external lib)
export function parseJwt(token) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return json;
  } catch (e) {
    return null;
  }
}
