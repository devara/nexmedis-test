const callApi = () => {
  const { $api } = useNuxtApp()
  return $api
}

export const activityRepository = {
  async get () {
    return await callApi().get('/activity/list')
  },
}
