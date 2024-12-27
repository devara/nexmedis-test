<template>
  <nav class="fixed inset-x-0 top-0 z-30 w-screen bg-gray-50 h-14 transition-position md:w-auto lg:pl-60">
    <div class="flex items-center justify-between h-full px-3">
      <span
        class="cursor-pointer lg:hidden"
        @click="mobileMenuOpen = true">
        <Bars3Icon
          class="size-5" />
      </span>
      <span class="mx-auto">Nexmedis Test App</span>
      <div class="flex items-center space-x-5">
        <div class="flex items-center space-x-3">
          <UserCircleIcon class="text-green-700 size-5" />
          <span>{{ user?.name }}</span>
        </div>
        <span
          class="cursor-pointer"
          @click="doLogout">
          <ArrowRightStartOnRectangleIcon
            class="size-5" />
        </span>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import {
  Bars3Icon,
  UserCircleIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/vue/24/outline'

const { logout } = useAuth()

const { mobileMenuOpen } = storeToRefs(useGlobalStore())
const { user }           = storeToRefs(useUserStore())
const { getUserProfile } = useUserStore()

async function doLogout () {
  try {
    await logout()
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  if (!user.value) {
    try {
      await getUserProfile()
    } catch (error) {
      console.error(error)
    }
  }
})
</script>
