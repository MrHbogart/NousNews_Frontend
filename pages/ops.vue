<template>
  <section class="space-y-10">
    <div class="enter-stage space-y-3" style="--delay: 80ms">
      <p class="text-xs uppercase tracking-[0.35em] text-ink-400">Operations</p>
      <h1 class="text-3xl text-ink-900 sm:text-4xl">Crawler status</h1>
      <p class="max-w-2xl text-sm text-ink-500">
        Live health, queue counts, and the newest crawler logs.
      </p>
    </div>

    <div class="enter-stage grid gap-6 md:grid-cols-2" style="--delay: 140ms">
      <div class="rounded-[28px] border border-ink-900/10 bg-white/80 p-6 shadow-soft">
        <h2 class="text-sm uppercase tracking-[0.3em] text-ink-400">Live status</h2>
        <div v-if="statusError" class="mt-4 text-sm text-ember-600">
          Unable to load status. Verify the API base URL.
        </div>
        <div v-else class="mt-4 space-y-2 text-sm text-ink-700">
          <p>
            <span class="font-semibold text-ink-900">Running:</span>
            {{ status?.running ? 'Yes' : 'No' }}
          </p>
          <p v-if="status?.last_error">
            <span class="font-semibold text-ink-900">Last error:</span>
            {{ status.last_error }}
          </p>
          <p v-if="status?.last_run">
            <span class="font-semibold text-ink-900">Last run:</span>
            {{ status.last_run.status }} · {{ formatDate(status.last_run.started_at) }}
          </p>
          <p v-if="status?.last_run">
            <span class="font-semibold text-ink-900">Articles created:</span>
            {{ status.last_run.articles_created }}
          </p>
          <p v-if="status?.last_run">
            <span class="font-semibold text-ink-900">Pages processed:</span>
            {{ status.last_run.pages_processed }}
          </p>
          <p v-if="status?.last_run">
            <span class="font-semibold text-ink-900">Queued URLs:</span>
            {{ status.last_run.queued_urls }}
          </p>
        </div>
      </div>

      <div class="rounded-[28px] border border-ink-900/10 bg-white/80 p-6 shadow-soft">
        <h2 class="text-sm uppercase tracking-[0.3em] text-ink-400">Queue</h2>
        <div v-if="statusError" class="mt-4 text-sm text-ember-600">
          Queue data unavailable.
        </div>
        <div v-else class="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div class="rounded-2xl border border-ink-900/5 bg-white/70 p-3">
            <p class="text-xs uppercase tracking-[0.25em] text-ink-400">Pending</p>
            <p class="text-lg text-ink-900">{{ status?.queue?.pending ?? 0 }}</p>
          </div>
          <div class="rounded-2xl border border-ink-900/5 bg-white/70 p-3">
            <p class="text-xs uppercase tracking-[0.25em] text-ink-400">In progress</p>
            <p class="text-lg text-ink-900">{{ status?.queue?.in_progress ?? 0 }}</p>
          </div>
          <div class="rounded-2xl border border-ink-900/5 bg-white/70 p-3">
            <p class="text-xs uppercase tracking-[0.25em] text-ink-400">Done</p>
            <p class="text-lg text-ink-900">{{ status?.queue?.done ?? 0 }}</p>
          </div>
          <div class="rounded-2xl border border-ink-900/5 bg-white/70 p-3">
            <p class="text-xs uppercase tracking-[0.25em] text-ink-400">Failed</p>
            <p class="text-lg text-ink-900">{{ status?.queue?.failed ?? 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="enter-stage" style="--delay: 200ms">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <h2 class="text-sm uppercase tracking-[0.3em] text-ink-400">Latest logs</h2>
        <button
          type="button"
          class="rounded-full border border-ink-900/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-ink-700 transition hover:border-ink-900/40"
          @click="refreshAll"
        >
          Refresh
        </button>
      </div>
      <div v-if="logsPending" class="mt-4 text-sm text-ink-400">Loading logs...</div>
      <div v-else-if="logsError" class="mt-4 text-sm text-ember-600">
        Logs are not accessible. Verify the API base URL.
      </div>
      <ul v-else class="mt-4 space-y-3">
        <li
          v-for="log in logs"
          :key="log.id"
          class="rounded-2xl border border-ink-900/10 bg-white/80 p-4 shadow-soft"
        >
          <div class="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.25em] text-ink-400">
            <span>{{ formatDate(log.created_at) || 'Unknown time' }}</span>
            <span class="rounded-full border border-ink-900/10 px-2 py-1">{{ log.level }}</span>
            <span class="rounded-full border border-ink-900/10 px-2 py-1">{{ log.step }}</span>
          </div>
          <p class="mt-2 text-sm text-ink-900">{{ log.message || 'Log entry' }}</p>
          <p v-if="log.content" class="mt-2 text-xs text-ink-500">
            {{ formatSnippet(log.content) }}
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
const api = useNewsApi()

const { data: statusData, error: statusError, refresh: refreshStatus } = await useAsyncData(
  'crawler-status',
  () => api.getCrawlerStatus()
)

const {
  data: logsData,
  pending: logsPending,
  error: logsError,
  refresh: refreshLogs,
} = await useAsyncData('crawler-logs', () => api.getCrawlerLogs({ limit: 20 }))

const status = computed(() => statusData.value || null)
const logs = computed(() => (Array.isArray(logsData.value?.results) ? logsData.value.results : []))

function refreshAll() {
  refreshStatus()
  refreshLogs()
}

function formatSnippet(text) {
  const cleaned = String(text).replace(/\s+/g, ' ').trim()
  if (!cleaned) return ''
  return cleaned.length > 200 ? `${cleaned.slice(0, 197)}...` : cleaned
}

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

useHead({
  title: 'NousNews · Ops',
})
</script>
