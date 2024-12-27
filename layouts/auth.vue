<template>
  <div class="flex min-h-screen bg-gray-100">
    <div
      class="items-center justify-center hidden text-white md:flex md:w-1/2"
      :class="[routeName === 'login' ? 'bg-blue-500' : 'bg-green-500']">
      <div class="px-8 text-center">
        <h1 class="mb-4 text-4xl font-bold">
          Selamat Datang!
        </h1>
        <p class="text-lg">
          Silakan mendaftar atau login jika sudah punya akun.
        </p>
      </div>
    </div>

    <div class="flex items-center justify-center w-full px-6 lg:px-4 md:w-1/2">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()

const routeName = computed(() => route.name)
</script>
