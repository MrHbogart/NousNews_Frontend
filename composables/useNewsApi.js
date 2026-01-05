export const useNewsApi = () => {
  const config = useRuntimeConfig()
  const baseUrl = (process.server ? config.apiBaseUrl : config.public.apiBaseUrl).replace(/\/$/, '')

  const getArticles = () => $fetch(`${baseUrl}/articles/`)
  const getArticle = (id) => $fetch(`${baseUrl}/articles/${id}/`)
  const getHealth = () => $fetch(`${baseUrl}/health/`)

  return {
    getArticles,
    getArticle,
    getHealth,
  }
}
