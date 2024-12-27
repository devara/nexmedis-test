<template>
  <div class="flex flex-col space-y-6">
    <h4>User Activities</h4>

    <Card>
      <div class="flex flex-col space-y-2">
        <table class="activity__table">
          <thead>
            <tr class="bg-neutral-300">
              <th>Description</th>
              <th>By</th>
              <th>Type</th>
              <th>
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(activity, index) in activities"
              :key="index">
              <td>{{ activity.description }}</td>
              <td>{{ activity.by.name }}</td>
              <td>{{ activity.type }}</td>
              <td>{{ format(activity.createdAt, 'PPpp') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { format } from 'date-fns'
import { activityRepository } from '~/repository/modules/activity'
import type { ApiResponsePaging } from '~/types'
import type { UserActivity } from '~/types/activity'

const activities = ref<UserActivity[]>([])

const pageMeta = ref<ApiResponsePaging>({
  page      : 1,
  per_page  : 10,
  total     : 0,
  total_page: 1,
})

async function getActivities () {
  try {
    const response   = await activityRepository.get()
    activities.value = response.data ?? []
    pageMeta.value   = response.meta ?? undefined
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  await getActivities()
})
</script>

<style lang="postcss">
.activity {
  &__table {
    th, td {
      @apply p-2 text-left border border-neutral-200;
    }
    th {
      background-color: #f4f4f4;
    }
  }
}
</style>
