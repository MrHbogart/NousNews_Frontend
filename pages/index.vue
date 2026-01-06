<template>
  <section class="mx-auto flex min-h-[70vh] max-w-3xl flex-col gap-8 text-left">
    <div class="space-y-3">
      <p class="text-xs text-ink-500">NousNews</p>
      <h1 class="text-4xl text-ink-900 sm:text-5xl">Crawler brief</h1>
      <p class="text-sm text-ink-500">
        A concise snapshot of what the crawler has seen most recently.
      </p>
    </div>

    <div class="rounded-2xl border border-ink-900/10 bg-white px-6 py-8">
      <p v-if="summaryPending" class="text-sm text-ink-400">Collecting the latest summary...</p>
      <p v-else-if="summaryError" class="text-sm text-ember-600">
        We could not reach the crawler summary. Check the API base URL.
      </p>
      <p v-else class="text-lg leading-relaxed text-ink-900 sm:text-xl">
        {{ summaryText }}
      </p>
    </div>

    <div class="flex flex-wrap gap-4 text-xs text-ink-500">
      <span>Articles {{ summaryCount }}</span>
      <span v-if="healthStatus">API {{ healthStatus }}</span>
      <span v-if="summaryAsOf">Updated {{ summaryAsOf }}</span>
    </div>

    <div class="flex flex-wrap items-center gap-4 text-sm">
      <button
        type="button"
        class="rounded-md border border-ink-900/20 px-4 py-2 text-ink-700 transition hover:border-ink-900/40"
        @click="refreshAll"
      >
        Refresh
      </button>
      <NuxtLink
        to="/ops"
        class="rounded-md border border-ember-500/30 bg-ember-500/10 px-4 py-2 text-ember-600 transition hover:bg-ember-500/20"
      >
        Crawler status
      </NuxtLink>
    </div>

    <div v-if="latestItems.length" class="text-left">
      <div class="text-xs text-ink-500">Latest items</div>
      <ul class="mt-4 space-y-3 text-sm text-ink-700">
        <li v-for="item in latestItems" :key="item.id" class="border-b border-ink-900/5 pb-3">
          <p class="text-base text-ink-900">{{ item.title || 'Untitled' }}</p>
          <p class="text-xs text-ink-500">{{ item.source || 'Unknown source' }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
const api = useNewsApi()

const { data: summary, pending: summaryPending, error: summaryError, refresh: refreshSummary } =
  await useAsyncData('summary', () => api.getSummary())

const { data: health, refresh: refreshHealth } = await useAsyncData('health', () => api.getHealth())

const summaryText = computed(() => summary.value?.summary || 'No summary available yet.')
const summaryCount = computed(() => summary.value?.count ?? 0)
const latestItems = computed(() => (Array.isArray(summary.value?.items) ? summary.value.items : []))
const summaryAsOf = computed(() => formatDate(summary.value?.as_of))
const healthStatus = computed(() => health.value?.status || '')

function refreshAll() {
  refreshSummary()
  refreshHealth()
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
  title: 'NousNews · Brief',
})
</script>
