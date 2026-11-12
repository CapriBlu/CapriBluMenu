// Fetch only the selected language and fallback; reuse successful requests.
export function initialLanguages(config, language) {
  return [...new Set([config.fallbackLanguage, language])];
}
export function createLocaleStore(load) {
  const requests = new Map();
  return language => {
    if (!requests.has(language)) {
      const request = Promise.resolve().then(() => load(language)).catch(error => {
        requests.delete(language);
        throw error;
      });
      requests.set(language, request);
    }
    return requests.get(language);
  };
}
