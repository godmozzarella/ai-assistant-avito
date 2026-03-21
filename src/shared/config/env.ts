export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  ollamaBaseUrl:
    import.meta.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434',
};