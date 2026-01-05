export const useNewsApi = () => {
  const config = useRuntimeConfig()
  const baseUrl = (process.server ? config.apiBaseUrl : config.public.apiBaseUrl).replace(/\/$/, '')

  const getArticles = () => $fetch(`${baseUrl}/articles/`)
  const getArticle = (id) => $fetch(`${baseUrl}/articles/${id}/`)
  const getSummary = (limit = 5) => $fetch(`${baseUrl}/articles/summary/?limit=${limit}`)
  const getHealth = () => $fetch(`${baseUrl}/health/`)
  const getCrawlerStatus = () => $fetch(`${baseUrl}/crawler/status/`)
  const getCrawlerLogs = (params = {}) => $fetch(`${baseUrl}/crawler/logs/`, { params })

  return {
    getArticles,
    getArticle,
    getSummary,
    getHealth,
    getCrawlerStatus,
    getCrawlerLogs,
  }
}
