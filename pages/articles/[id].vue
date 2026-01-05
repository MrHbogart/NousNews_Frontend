<template>
  <section class="space-y-10">
    <NuxtLink
      to="/"
      class="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-ink-400 transition hover:text-ink-900"
    >
      <span class="h-px w-10 bg-ink-900/20" />
      Back to brief
    </NuxtLink>

    <div
      v-if="pending"
      class="enter-stage rounded-3xl border border-ink-900/10 bg-white/80 p-8 text-ink-500"
      style="--delay: 140ms"
    >
      Loading report...
    </div>

    <div
      v-else-if="error"
      class="enter-stage rounded-3xl border border-ember-500/40 bg-white/80 p-8 text-ember-600"
      style="--delay: 140ms"
    >
      This report could not be loaded. Verify the article ID and API base URL.
    </div>

    <article v-else class="enter-stage space-y-6" style="--delay: 160ms">
      <div class="rounded-3xl border border-ink-900/10 bg-white/80 p-8 shadow-soft">
        <div class="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.25em] text-ink-400">
          <TagPill>{{ article.source || 'Unknown source' }}</TagPill>
          <TagPill v-if="article.language">{{ article.language }}</TagPill>
          <TagPill v-if="article.published_at">{{ publishedLabel }}</TagPill>
        </div>
        <h1 class="mt-6 text-3xl text-ink-900 sm:text-4xl">
          {{ article.title || 'Untitled report' }}
        </h1>
        <p class="mt-4 text-sm text-ink-500">
          Crawled at {{ fetchedLabel }} · Source URL
          <a
            :href="article.url"
            target="_blank"
            rel="noreferrer"
            class="text-ink-700 hover:text-ink-900"
          >
            {{ article.url }}
          </a>
        </p>
      </div>

      <div class="rounded-3xl border border-ink-900/10 bg-white/80 p-8 text-base text-ink-700">
        <p v-if="article.body" class="whitespace-pre-line">
          {{ article.body }}
        </p>
        <p v-else class="text-ink-400">No article body available yet.</p>
      </div>
    </article>
  </section>
</template>

<script setup>
const route = useRoute()
const api = useNewsApi()
const articleId = route.params.id

const { data: article, pending, error } = await useAsyncData(`article-${articleId}`,
  () => api.getArticle(articleId)
)

const publishedLabel = computed(() => formatDate(article.value?.published_at))
const fetchedLabel = computed(() => formatDate(article.value?.fetched_at))

function formatDate(value) {
  if (!value) return 'unknown time'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'unknown time'
  return date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

useHead(() => ({
  title: article.value?.title ? `NousNews · ${article.value.title}` : 'NousNews · Report',
}))
</script>
