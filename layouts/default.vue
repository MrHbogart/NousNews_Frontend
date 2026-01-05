<template>
  <div class="min-h-screen bg-noise">
    <div class="mx-auto flex min-h-screen max-w-6xl flex-col px-5 pb-12 pt-8 sm:px-10">
      <SiteHeader />
      <main class="flex-1">
        <slot />
      </main>
      <SiteFooter />
    </div>
  </div>
</template>
