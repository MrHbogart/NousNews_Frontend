<template>
  <article
    class="group flex h-full flex-col justify-between gap-6 rounded-3xl border border-ink-900/10 bg-white/80 p-6 shadow-soft transition hover:-translate-y-1 hover:border-ink-900/30"
  >
    <div class="space-y-4">
      <div class="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.25em] text-ink-400">
        <TagPill>{{ article.source || 'Unknown source' }}</TagPill>
        <TagPill v-if="article.language">{{ article.language }}</TagPill>
      </div>
      <h3 class="text-2xl text-ink-900 transition group-hover:text-ink-700">
        {{ article.title || 'Untitled report' }}
      </h3>
      <p class="text-sm text-ink-600">
        {{ excerpt }}
      </p>
    </div>
    <div class="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-ink-400">
      <span>{{ publishedLabel }}</span>
      <NuxtLink
        :to="`/articles/${article.id}`"
        class="text-ink-700 transition hover:text-ink-900"
      >
        Read
      </NuxtLink>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
})

const excerpt = computed(() => {
  const text = props.article.body || props.article.title || ''
  const cleaned = text.replace(/\s+/g, ' ').trim()
  if (!cleaned) return 'No excerpt available yet.'
  return cleaned.length > 220 ? `${cleaned.slice(0, 217)}...` : cleaned
})

const publishedLabel = computed(() => {
  if (!props.article.published_at) return 'Unscheduled'
  const date = new Date(props.article.published_at)
  if (Number.isNaN(date.getTime())) return 'Unscheduled'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
})
</script>
