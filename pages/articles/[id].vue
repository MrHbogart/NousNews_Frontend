<template>
  <section class="space-y-10">
    <NuxtLink
      to="/"
      class="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-mist-200 transition hover:text-ember-400"
    >
      <span class="h-px w-10 bg-ember-500/70" />
      Back to signal desk
    </NuxtLink>

    <div
      v-if="pending"
      class="enter-stage rounded-3xl border border-white/10 bg-ink-900/70 p-8 text-mist-200"
      style="--delay: 140ms"
    >
      Loading report...
    </div>

    <div
      v-else-if="error"
      class="enter-stage rounded-3xl border border-ember-500/60 bg-ink-900/80 p-8 text-ember-200"
      style="--delay: 140ms"
    >
      This report could not be loaded. Verify the article ID and API base URL.
    </div>

    <article v-else class="enter-stage space-y-6" style="--delay: 160ms">
      <div class="rounded-3xl border border-white/10 bg-ink-900/70 p-8 shadow-glow">
        <div class="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-mist-200">
          <TagPill>{{ article.source || 'Unknown source' }}</TagPill>
          <TagPill v-if="article.language">{{ article.language }}</TagPill>
          <TagPill v-if="article.published_at">{{ publishedLabel }}</TagPill>
        </div>
        <h1 class="mt-6 text-4xl text-mist-50 sm:text-5xl">
          {{ article.title || 'Untitled report' }}
        </h1>
        <p class="mt-4 text-sm text-mist-200">
          Crawled at {{ fetchedLabel }} · Source URL
          <a
            :href="article.url"
            target="_blank"
            rel="noreferrer"
            class="text-ember-400 hover:text-ember-200"
          >
            {{ article.url }}
          </a>
        </p>
      </div>

      <div class="rounded-3xl border border-white/10 bg-ink-900/70 p-8 text-base text-mist-100">
        <p v-if="article.body" class="whitespace-pre-line">
          {{ article.body }}
        </p>
        <p v-else class="text-mist-200">No article body available yet.</p>
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
