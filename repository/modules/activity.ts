import type { ApiResponsePaging } from '~/types'
import type { UserActivity } from '~/types/activity'

const callApi = () => {
  const { $api } = useNuxtApp()
  return $api
}

export const activityRepository = {
  async get (config?: Record<string, unknown>): Promise<{ data: UserActivity[], meta: ApiResponsePaging }> {
    return await callApi().get('/activity/list', config)
  },
}
