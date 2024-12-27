<template>
  <aside
    class="fixed top-0 left-0 z-40 flex h-screen overflow-hidden md:py-2 md:pl-2 w-60 transition-position lg:flex"
    :class="[mobileMenuOpen ? 'max-lg:!flex' : 'max-lg:!hidden']">
    <div class="flex flex-col flex-1 overflow-hidden text-white bg-slate-800 md:rounded-2xl">
      <div class="flex items-center justify-between bg-blue-600 h-14">
        <span class="mx-auto">
          <b class="font-black">Nexmedis</b>
        </span>
        <button
          class="p-3 lg:hidden"
          @click="mobileMenuOpen = false">
          <XMarkIcon class="size-4" />
        </button>
      </div>
      <div class="flex-1 overflow-y-auto overflow-x-hidden aside-scrollbars dark:aside-scrollbars-[slate]">
        <nav class="mt-4">
          <ul class="space-y-2">
            <li
              v-for="(item, index) in menuItems"
              :key="index">
              <NuxtLink
                :to="item.href"
                class="inline-flex items-center w-full px-4 py-2 space-x-2 hover:bg-gray-700"
                active-class="bg-gray-700">
                <component
                  :is="item.icon"
                  class="size-5" />
                <span>
                  {{ item.label }}
                </span>
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
      <div
        class="flex items-center justify-center px-3 py-4 space-x-4 bg-green-700 cursor-pointer"
        @click="doLogout">
        <ArrowRightStartOnRectangleIcon class="size-5" />
        <span>Logout</span>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import {
  HomeIcon,
  UserCircleIcon,
  BriefcaseIcon,
  QueueListIcon,
  XMarkIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/vue/24/outline'
import type { FunctionalComponent } from 'vue'

interface MenuItem {
  label: string,
  href: string,
  icon: FunctionalComponent,
}

const { logout }         = useAuth()
const { mobileMenuOpen } = storeToRefs(useGlobalStore())

const menuItems = computed<MenuItem[]>(() => {
  return [
    {
      label: 'Home',
      href : '/',
      icon : HomeIcon,
    },
    {
      label: 'Task',
      href : '/task',
      icon : BriefcaseIcon,
    },
    {
      label: 'Activity',
      href : '/activity',
      icon : QueueListIcon,
    },
    {
      label: 'Profile',
      href : '/profile',
      icon : UserCircleIcon,
    },
  ]
})

async function doLogout () {
  try {
    await logout()
  } catch (error) {
    console.error(error)
  }
}
</script>
