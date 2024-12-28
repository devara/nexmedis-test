<template>
  <div class="w-full max-w-md px-4 py-3 bg-white rounded-lg shadow-lg md:px-8">
    <h2 class="mb-6 text-2xl font-bold text-center text-gray-700">
      Login
    </h2>
    <form @submit.prevent="doLogin">
      <div class="mb-4 space-y-3">
        <Field
          v-model="email"
          label="email"
          type="email"
          required />
        <Field
          v-model="password"
          label="password"
          type="password"
          required />
      </div>
      <button
        type="submit"
        class="inline-flex items-center justify-center w-full py-3 space-x-3 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600">
        <span>Login</span>
        <ArrowPathIcon
          v-if="loading"
          class="size-4 animate-spin" />
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
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import { userRepository } from '~/repository/modules/user'

definePageMeta({ layout: 'auth' })

const email    = ref<string>('')
const password = ref<string>('')

const loading = ref<boolean>(false)

async function doLogin () {
  try {
    loading.value  = true
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
  } finally {
    loading.value = false
  }
}
</script>
