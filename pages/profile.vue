<template>
  <div class="grid grid-cols-12 gap-6">
    <Card class="col-span-12">
      <div class="flex items-center mx-auto space-x-4">
        <UserCircleIcon class="size-20" />
        <div class="flex flex-col space-y-3">
          <span>
            Hello, <strong>{{ user?.name }}</strong>!
          </span>
          <span class="text-xs">
            Last update: {{ user?.updatedAt }}
          </span>
        </div>
      </div>
    </Card>
    <Card class="col-span-12 space-y-5 md:col-span-6">
      <Field
        v-model="name"
        label="name">
        <template #icon>
          <UserIcon />
        </template>
      </Field>
      <Field
        :model-value="email"
        label="email"
        readonly>
        <template #icon>
          <EnvelopeIcon />
        </template>
      </Field>
      <Dropdown
        v-model="gender"
        :options="genderOptions"
        label="Gender" />
      <button
        class="flex items-center justify-center px-2 py-3 space-x-3 text-blue-500 border border-blue-500 hover:text-white hover:bg-blue-500"
        @click="onUpdateProfile">
        <span>Update</span>
        <ArrowPathIcon
          v-if="loadingUpdateProfile"
          class="size-4 animate-spin" />
      </button>
      <span
        v-if="updateError"
        class="!mt-2 text-sm text-red-600">
        {{ updateError }}
      </span>
      <span class="!mt-2 text-xs font-bold inline-flex items-center space-x-2">
        <label>Only can update every 1 minute (My MongoDB only free tier)</label>
        <FaceSmileIcon class="size-4" />
      </span>
    </Card>
    <Card class="col-span-12 md:col-span-6 h-fit">
      <Field
        v-model="username"
        label="username"
        class="mb-3">
        <template #icon>
          <UserIcon />
        </template>
      </Field>
      <button
        class="flex items-center justify-center px-2 py-3 space-x-3 text-blue-500 border border-blue-500 hover:text-white hover:bg-blue-500"
        @click="onChangeUsername">
        <span>Change</span>
        <ArrowPathIcon
          v-if="loadingUpdateUsername"
          class="size-4 animate-spin" />
      </button>
      <span
        v-if="usernameError"
        class="mt-2 text-sm text-red-600">
        {{ usernameError }}
      </span>
      <span
        v-else
        class="!mt-2 text-xs font-bold inline-flex items-center space-x-2">
        <label>Only can update every 1 minute (My MongoDB only free tier)</label>
        <FaceSmileIcon class="size-4" />
      </span>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import {
  type FetchError,
} from 'ofetch'
import {
  UserIcon,
  UserCircleIcon,
  EnvelopeIcon,
  FaceSmileIcon,
  ArrowPathIcon,
} from '@heroicons/vue/24/outline'
import { userRepository } from '~/repository/modules/user'
import type { UserGender } from '~/types/user'

interface GenderOption {
  label: string,
  value: UserGender,
}

const { user } = storeToRefs(useUserStore())
const {
  getUserProfile,
} = useUserStore()

const name     = ref<string>(user.value?.name ?? '')
const username = ref<string>(user.value?.username ?? '')
const email    = ref<string>(user.value?.email ?? '')
const gender   = ref<UserGender>(user.value?.gender ?? 'MALE')

const loadingUpdateProfile  = ref<boolean>(false)
const loadingUpdateUsername = ref<boolean>(false)

const usernameError = ref<string>()
const updateError   = ref<string>()

const genderOptions: GenderOption[] = [
  {
    label: 'Male',
    value: 'MALE',
  },
  {
    label: 'Female',
    value: 'FEMALE',
  },
]

async function onUpdateProfile () {
  try {
    loadingUpdateProfile.value = true
    updateError.value          = ''
    await userRepository.updateProfile({
      name  : name.value,
      gender: gender.value,
    })
    await getUserProfile()
  } catch (error) {
    const { response } = error as FetchError
    if (response?._data)
      showErrorUpdateProfile(response._data?.message)
  } finally {
    loadingUpdateProfile.value = false
  }
}

async function onChangeUsername () {
  try {
    loadingUpdateUsername.value = true
    usernameError.value         = ''
    await userRepository.updateUsername({ username: username.value })
    await getUserProfile()
  } catch (error) {
    const { response } = error as FetchError
    if (response?._data)
      showErrorChangeUsername(response._data?.message)
  } finally {
    loadingUpdateUsername.value = false
  }
}

function showErrorChangeUsername (message?: string) {
  if (message) {
    usernameError.value = message
    setTimeout(() => {
      usernameError.value = ''
    }, 3000)
  }
}

function showErrorUpdateProfile (message?: string) {
  if (message) {
    updateError.value = message
    setTimeout(() => {
      updateError.value = ''
    }, 3000)
  }
}
</script>
