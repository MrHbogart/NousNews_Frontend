<template>
  <header class="mb-10">
    <div class="enter-stage flex items-center justify-between gap-6" style="--delay: 80ms">
      <NuxtLink to="/" class="text-sm uppercase tracking-[0.35em] text-ink-500">
        NousNews
      </NuxtLink>
      <nav class="flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-ink-400">
        <NuxtLink to="/" class="transition hover:text-ink-900">Brief</NuxtLink>
        <NuxtLink to="/ops" class="transition hover:text-ink-900">Ops</NuxtLink>
      </nav>
    </div>
  </header>
</template>
