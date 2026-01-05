<template>
  <section class="space-y-10">
    <div class="enter-stage grid gap-8 lg:grid-cols-[1.2fr_0.8fr]" style="--delay: 140ms">
      <div class="space-y-6">
        <SectionTitle>Signal Desk</SectionTitle>
        <h2 class="text-3xl text-mist-50 sm:text-4xl">
          The latest crawled reports, distilled into a living newsroom.
        </h2>
        <p class="text-base text-mist-100">
          Search by source, headline, or language. NousNews stays in sync with the crawler
          and keeps your team aligned on the newest stories.
        </p>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            v-model="query"
            type="search"
            placeholder="Search headlines, sources, or body text"
            class="w-full rounded-full border border-white/20 bg-ink-900/80 px-5 py-3 text-sm text-mist-50 placeholder:text-mist-200 focus:border-ember-500/70 focus:outline-none"
          />
          <button
            type="button"
            class="rounded-full border border-ember-500/70 px-6 py-3 text-xs uppercase tracking-[0.3em] text-ember-400 transition hover:bg-ember-500 hover:text-ink-900"
            @click="refresh"
          >
            Refresh
          </button>
        </div>
        <div class="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-mist-200">
          <TagPill>Articles: {{ totalCount }}</TagPill>
          <TagPill v-if="healthStatus">API {{ healthStatus }}</TagPill>
        </div>
      </div>
      <div class="rounded-3xl border border-white/10 bg-ink-900/70 p-6 shadow-glow">
        <SectionTitle>Editorial Pulse</SectionTitle>
        <div class="mt-6 space-y-4 text-sm text-mist-100">
          <p>
            NousNews blends automation with human judgement. Each article arrives through the
            crawler pipeline and is curated into a clean, focused reading experience.
          </p>
          <p>
            Use the live feed to track sources, validate signals, and pull stories into
            your daily briefings.
          </p>
          <div class="rounded-2xl border border-ember-500/40 bg-ember-500/10 p-4 text-ember-200">
            <p class="text-xs uppercase tracking-[0.25em]">Next action</p>
            <p class="mt-2 text-base">Open a report to view the full crawler payload.</p>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="pending"
      class="enter-stage rounded-3xl border border-white/10 bg-ink-900/70 p-8 text-mist-200"
      style="--delay: 220ms"
    >
      Loading the newsroom feed...
    </div>

    <div
      v-else-if="error"
      class="enter-stage rounded-3xl border border-ember-500/60 bg-ink-900/80 p-8 text-ember-200"
      style="--delay: 220ms"
    >
      We could not reach the crawler API. Check the API base URL in your environment.
    </div>

    <div v-else class="enter-stage" style="--delay: 240ms">
      <SectionTitle>Latest Reports</SectionTitle>
      <div v-if="filteredArticles.length" class="mt-6 grid gap-6 md:grid-cols-2">
        <ArticleCard v-for="article in filteredArticles" :key="article.id" :article="article" />
      </div>
      <div v-else class="mt-6 rounded-3xl border border-white/10 bg-ink-900/70 p-8 text-mist-200">
        No matching articles yet. Try a different keyword or refresh the feed.
      </div>
    </div>
  </section>
</template>

<script setup>
const api = useNewsApi()
const query = ref('')

const { data: articles, pending, error, refresh } = await useAsyncData('articles', () => api.getArticles())

const { data: health } = await useAsyncData('health', () => api.getHealth())

const healthStatus = computed(() => health.value?.status || '')

const normalizedQuery = computed(() => query.value.trim().toLowerCase())

const filteredArticles = computed(() => {
  const list = Array.isArray(articles.value) ? articles.value : []
  if (!normalizedQuery.value) return list
  return list.filter((article) => {
    const haystack = `${article.title || ''} ${article.source || ''} ${article.body || ''} ${article.language || ''}`
      .toLowerCase()
      .trim()
    return haystack.includes(normalizedQuery.value)
  })
})

const totalCount = computed(() => (Array.isArray(articles.value) ? articles.value.length : 0))

useHead({
  title: 'NousNews · Signal Desk',
})
</script>
