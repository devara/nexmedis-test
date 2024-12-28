<template>
  <div class="relative flex min-h-screen bg-neutral-100 pt-14">
    <LayoutSidebar class="z-40" />
    <LayoutNavbar />
    <div
      v-if="mobileMenuOpen"
      class="fixed inset-0 z-30 flex flex-col items-center justify-center overflow-hidden"
      style=""
      @click.passive="mobileMenuOpen = false">
      <div class="absolute inset-0 overlay bg-gradient-to-tr opacity-90 dark:from-gray-700 dark:via-gray-900 dark:to-gray-700" />
    </div>
    <main class="flex-1 bg-gray-100 lg:pl-60">
      <div class="p-3 md:p-4">
        <slot />
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
const { mobileMenuOpen } = storeToRefs(useGlobalStore())
</script>
