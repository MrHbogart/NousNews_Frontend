<template>
  <section class="flex min-h-[70vh] flex-col items-center justify-center gap-10 text-center">
    <div class="enter-stage space-y-4" style="--delay: 80ms">
      <p class="text-xs uppercase tracking-[0.35em] text-ink-400">NousNews</p>
      <h1 class="text-4xl text-ink-900 sm:text-5xl">Compact crawl brief</h1>
      <p class="mx-auto max-w-2xl text-base text-ink-500">
        A quiet, concise snapshot of what the crawler has seen most recently.
      </p>
    </div>

    <div class="enter-stage w-full max-w-3xl" style="--delay: 140ms">
      <div
        class="rounded-[32px] border border-ink-900/10 bg-white/80 px-6 py-10 shadow-soft backdrop-blur"
      >
        <p v-if="summaryPending" class="text-base text-ink-400">Collecting the latest summary...</p>
        <p v-else-if="summaryError" class="text-base text-ember-600">
          We could not reach the crawler summary. Check the API base URL.
        </p>
        <p v-else class="text-xl leading-relaxed text-ink-900 sm:text-2xl">
          {{ summaryText }}
        </p>
      </div>
    </div>

    <div class="enter-stage flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.25em] text-ink-400" style="--delay: 200ms">
      <span class="rounded-full border border-ink-900/10 px-3 py-1">Articles {{ summaryCount }}</span>
      <span v-if="healthStatus" class="rounded-full border border-ink-900/10 px-3 py-1">
        API {{ healthStatus }}
      </span>
      <span v-if="summaryAsOf" class="rounded-full border border-ink-900/10 px-3 py-1">
        Updated {{ summaryAsOf }}
      </span>
    </div>

    <div class="enter-stage flex flex-wrap items-center justify-center gap-4 text-sm" style="--delay: 240ms">
      <button
        type="button"
        class="rounded-full border border-ink-900/20 px-5 py-2 text-xs uppercase tracking-[0.3em] text-ink-700 transition hover:border-ink-900/40"
        @click="refreshAll"
      >
        Refresh
      </button>
      <NuxtLink
        to="/ops"
        class="rounded-full border border-ember-500/30 bg-ember-500/10 px-5 py-2 text-xs uppercase tracking-[0.3em] text-ember-600 transition hover:bg-ember-500/20"
      >
        Crawler status
      </NuxtLink>
    </div>

    <div v-if="latestItems.length" class="enter-stage w-full max-w-3xl text-left" style="--delay: 280ms">
      <div class="text-xs uppercase tracking-[0.3em] text-ink-400">Latest items</div>
      <ul class="mt-4 space-y-3 text-sm text-ink-700">
        <li v-for="item in latestItems" :key="item.id" class="flex flex-col gap-1 border-b border-ink-900/5 pb-3">
          <span class="text-base text-ink-900">{{ item.title || 'Untitled' }}</span>
          <span class="text-xs uppercase tracking-[0.25em] text-ink-400">{{ item.source || 'Unknown source' }}</span>
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
