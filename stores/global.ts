import { acceptHMRUpdate, defineStore } from 'pinia'

export const useGlobalStore = defineStore('global-store', () => {
  const mobileMenuOpen = ref<boolean>(false)

  return { mobileMenuOpen }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useGlobalStore, import.meta.hot))
