<template>
  <div class="w-full max-w-md px-4 py-3 bg-white rounded-lg shadow-lg md:px-8">
    <h2 class="mb-6 text-2xl font-bold text-center text-gray-700">
      Login
    </h2>
    <form @submit.prevent="doLogin">
      <div class="mb-4">
        <label
          for="email"
          class="block mb-1 text-sm font-medium text-gray-600">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <div class="mb-6">
        <label
          for="password"
          class="block mb-1 text-sm font-medium text-gray-600">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <button
        type="submit"
        class="w-full py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600">
        Login
      </button>
    </form>
    <p class="mt-4 text-sm text-center text-gray-600">
      Belum punya akun?
      <NuxtLink
        to="/register"
        class="text-blue-500 hover:underline">
        Daftar di sini
      </NuxtLink>.
    </p>
  </div>
</template>

<script lang="ts" setup>
import { userRepository } from '~/repository/modules/user'

definePageMeta({ layout: 'auth' })

const email    = ref<string>('')
const password = ref<string>('')

async function doLogin () {
  try {
    const response = await userRepository.login(
      {
        email   : email.value,
        password: password.value,
      },
    )

    if (response.data.accessToken) {
      const {
        accessToken,
        refreshToken,
        expiresIn,
        tokenType,
      } = response.data
      return navigateTo({
        path : '/auth/login',
        query: {
          accessToken, refreshToken, expiresIn, tokenType,
        },
      }, { external: true })
    }
  } catch (error) {
    console.error(error)
  }
}
</script>
