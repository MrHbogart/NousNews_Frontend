<template>
  <header class="mb-10">
    <div
      class="enter-stage flex flex-col gap-6 rounded-3xl border border-white/10 bg-ink-900/70 p-6 shadow-glow backdrop-blur"
      style="--delay: 80ms"
    >
      <div class="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p class="text-sm uppercase tracking-[0.3em] text-mist-200">NousNews</p>
          <h1 class="mt-3 text-4xl font-semibold text-mist-50 sm:text-5xl">
            Signal-first journalism for the restless.
          </h1>
        </div>
        <div class="flex flex-wrap gap-3 text-sm text-mist-200">
          <div class="rounded-full border border-white/20 px-4 py-2">Realtime crawler feed</div>
          <div class="rounded-full border border-ember-500/40 px-4 py-2 text-ember-400">
            Public API
          </div>
          <div class="rounded-full border border-ocean-500/40 px-4 py-2 text-ocean-400">
            SSR ready
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p class="max-w-2xl text-base text-mist-100">
          NousNews connects to the crawler pipeline at crawler.miyangroup.com and curates
          the freshest articles across the sources you trust.
        </p>
        <div class="flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-mist-200">
          <span class="h-px w-12 bg-mist-200/50" />
          <span>Last mile intelligence</span>
        </div>
      </div>
    </div>
  </header>
</template>
