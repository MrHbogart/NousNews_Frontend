<template>
  <div class="min-h-screen">
    <div class="mx-auto flex min-h-screen max-w-5xl flex-col px-5 pb-12 pt-8 sm:px-10">
      <SiteHeader />
      <main class="flex-1">
        <slot />
      </main>
      <SiteFooter />
    </div>
  </div>
</template>
