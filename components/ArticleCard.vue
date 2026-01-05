<template>
  <article
    class="group flex h-full flex-col justify-between gap-6 rounded-3xl border border-white/10 bg-ink-900/70 p-6 shadow-glow backdrop-blur transition hover:-translate-y-1 hover:border-ember-500/60"
  >
    <div class="space-y-4">
      <div class="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-mist-200">
        <TagPill>{{ article.source || 'Unknown source' }}</TagPill>
        <TagPill v-if="article.language">{{ article.language }}</TagPill>
      </div>
      <h3 class="text-2xl text-mist-50 transition group-hover:text-ember-400">
        {{ article.title || 'Untitled report' }}
      </h3>
      <p class="text-sm text-mist-100">
        {{ excerpt }}
      </p>
    </div>
    <div class="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-mist-200">
      <span>{{ publishedLabel }}</span>
      <NuxtLink
        :to="`/articles/${article.id}`"
        class="text-ember-400 transition hover:text-ember-200"
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
