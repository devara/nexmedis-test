<template>
  <div class="flex h-screen">
    <!-- Sidebar Menu -->
    <aside class="hidden w-64 text-white bg-gray-800 md:block">
      <div class="p-4 text-xl font-bold border-b border-gray-700">
        Dashboard
      </div>
      <nav class="mt-4">
        <ul>
          <li>
            <nuxt-link
              class="block px-4 py-2 hover:bg-gray-700"
              active-class="bg-gray-700">
              Home
            </nuxt-link>
          </li>
          <li>
            <nuxt-link
              class="block px-4 py-2 hover:bg-gray-700"
              active-class="bg-gray-700">
              Settings
            </nuxt-link>
          </li>
          <li>
            <nuxt-link
              class="block px-4 py-2 hover:bg-gray-700"
              active-class="bg-gray-700">
              Profile
            </nuxt-link>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Mobile Menu Toggle -->
    <div class="block text-white bg-gray-800 md:hidden">
      <button
        class="p-4"
        @click="menuOpen = !menuOpen">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-6 h-6">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Mobile Sidebar -->
    <aside
      :class="{'block': menuOpen, 'hidden': !menuOpen}"
      class="absolute top-0 left-0 w-64 h-full text-white bg-gray-800 md:hidden">
      <div class="p-4 text-xl font-bold border-b border-gray-700">
        Dashboard
      </div>
      <nav class="mt-4">
        <ul>
          <li>
            <nuxt-link
              class="block px-4 py-2 hover:bg-gray-700"
              active-class="bg-gray-700">
              Home
            </nuxt-link>
          </li>
          <li>
            <nuxt-link
              class="block px-4 py-2 hover:bg-gray-700"
              active-class="bg-gray-700">
              Settings
            </nuxt-link>
          </li>
          <li>
            <nuxt-link
              class="block px-4 py-2 hover:bg-gray-700"
              active-class="bg-gray-700">
              Profile
            </nuxt-link>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 bg-gray-100">
      <div>
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const menuOpen = ref(false)
</script>

<style>
/* Add custom styles here if needed */
</style>
