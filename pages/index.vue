<template>
  <section class="news-card enter-stage" style="--delay: 80ms">
    <p v-if="summaryPending" class="news-title">Loading the latest brief...</p>
    <p v-else-if="summaryError" class="news-title">
      We could not reach the crawler summary. Check the API base URL.
    </p>
    <p v-else class="news-title">
      {{ summaryText }}
    </p>

    <div class="news-meta">
      <div class="news-chip">
        <div class="chip-label">Last hour</div>
        <div class="chip-title">{{ lastHourTitle }}</div>
      </div>
      <div class="news-chip">
        <div class="chip-label">3 hours ago</div>
        <div class="chip-title">{{ threeHourTitle }}</div>
      </div>
    </div>

    <div class="news-refresh">Updated {{ summaryAsOf || 'just now' }}</div>
  </section>
</template>

<script setup>
const refreshIntervalMs = 20000
let refreshTimer
const api = useNewsApi()

const {
  data: summary,
  pending: summaryPending,
  error: summaryError,
  refresh: refreshSummary,
} = await useAsyncData('summary', () => api.getSummary(), {
  server: false,
})

const summaryText = computed(() => summary.value?.summary || 'No summary available yet.')
const latestItems = computed(() => (Array.isArray(summary.value?.items) ? summary.value.items : []))
const summaryAsOf = computed(() => formatDate(summary.value?.as_of))
const lastHourTitle = computed(() => selectRecentTitle(60) || 'No updates in the last hour.')
const threeHourTitle = computed(() => selectRecentTitle(180, 60) || 'No updates in the last 3 hours.')

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function selectRecentTitle(maxMinutes, minMinutes = 0) {
  const now = Date.now()
  const minMs = minMinutes * 60 * 1000
  const maxMs = maxMinutes * 60 * 1000
  const withinWindow = latestItems.value
    .map((item) => ({
      title: item.title || 'Untitled',
      time: new Date(item.published_at || item.fetched_at || item.created_at || '').getTime(),
    }))
    .filter((item) => !Number.isNaN(item.time))
    .filter((item) => now - item.time >= minMs && now - item.time <= maxMs)
    .sort((a, b) => b.time - a.time)
  return withinWindow[0]?.title || ''
}

onMounted(() => {
  refreshSummary()
  refreshTimer = setInterval(() => {
    refreshSummary()
  }, refreshIntervalMs)
})

onBeforeUnmount(() => {
  if (refreshTimer) clearInterval(refreshTimer)
})

useHead({
  title: 'NousNews · Brief',
})
</script>
