export function urlAnalisis(base, tema) {
  if (!base) return null;
  try {
    const url = new URL(base);
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    if ((url.protocol !== 'https:' && !(local && url.protocol === 'http:')) ||
        url.username || url.password || url.search || url.hash) return null;
    url.searchParams.set('embed', 'true');
    url.searchParams.set('embed_options', tema === 'dark' ? 'dark_theme' : 'light_theme');
    return url.href;
  } catch { return null; }
}
