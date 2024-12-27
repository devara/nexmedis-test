<template>
  <div>dashboard page</div>
</template>

<script lang="ts" setup>
import { userRepository } from '~/repository/modules/user';
import { getUser } from '~/repository/user'

onMounted(async () => {
  try {
    const res = await userRepository.getProfile()
    console.log(res)
  } catch (error) {
    console.error(error)
  }
})
</script>
