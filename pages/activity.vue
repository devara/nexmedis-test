<template>
  <div class="flex flex-col space-y-6">
    <h4>User Activities</h4>

    <Card>
      <div class="flex flex-col space-y-2 overflow-x-auto overscroll-contain max-h-[425px] md:max-h-[500px]">
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
              <td class="min-w-[200px]">
                {{ activity.description }}
              </td>
              <td class="min-w-[175px]">
                {{ activity.by.name }}
              </td>
              <td class="min-w-[100px]">
                {{ activity.type }}
              </td>
              <td class="min-w-[150px]">
                {{ format(activity.createdAt, 'PPpp') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>

    <Pagination
      v-model:page-value="pageMeta.page"
      v-model:per-page-value="pageMeta.per_page"
      :total="pageMeta.total"
      :total-page="pageMeta.total_pages"
      :disabled="loading" />
  </div>
</template>

<script lang="ts" setup>
import { format } from 'date-fns'
import { activityRepository } from '~/repository/modules/activity'
import type { ApiResponsePaging } from '~/types'
import type { UserActivity } from '~/types/activity'

const activities = ref<UserActivity[]>([])

const pageMeta = ref<ApiResponsePaging>({
  page       : 1,
  per_page   : 10,
  total      : 0,
  total_pages: 1,
})

const loading = ref<boolean>(false)

async function getActivities () {
  try {
    loading.value    = true
    const response   = await activityRepository.get({
      params: {
        page    : pageMeta.value.page,
        per_page: pageMeta.value.per_page,
      },
    })
    activities.value = response.data ?? []
    pageMeta.value   = response.meta ?? undefined
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const currentPage    = computed(() => pageMeta.value.page)
const currentPerPage = computed(() => pageMeta.value.per_page)

watch(currentPage, async (current, old) => {
  if (current !== old)
    await getActivities()
})

watch(currentPerPage, async (current, old) => {
  if (current !== old)
    await getActivities()
})

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
