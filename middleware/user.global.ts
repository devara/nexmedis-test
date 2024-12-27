import type { User } from '~/types/user'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default defineNuxtRouteMiddleware(async (to) => {
  const event     = useRequestEvent()
  const headers   = useRequestHeaders()
  const userStore = useUserStore()
  const { token } = useAuth()
  if (event && import.meta.server && token.value && !userStore.user) {
    try {
      const response = await $fetch<{ data: User }>('/api/user/profile', {
        method : 'GET',
        headers: {
          ...headers,
          Authorization: `Bearer ${token.value}`,
        },
      })
      if (response.data)
        userStore.user = response.data
    } catch (error) {
      console.error(error)
    }
  }
})
