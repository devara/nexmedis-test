import { userRepository } from '~/repository/modules/user'
import type { User } from '~/types/user'

export const useUserStore = defineStore('user-store', () => {
  const user = ref<User>()

  async function getUserProfile () {
    try {
      const response = await userRepository.getProfile()

      user.value = response.data ?? undefined
    } catch (error) {
      console.error(error)
    }
  }

  return { user, getUserProfile }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
