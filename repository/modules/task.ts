import type { TaskCreatePayload, TaskUpdatePayload } from '~/types/task'

const callApi = () => {
  const { $api } = useNuxtApp()
  return $api
}

export const taskRepository = {
  async get () {
    return await callApi().get('/task/list')
  },

  async post (payload: TaskCreatePayload) {
    return await callApi().post('/task', payload)
  },

  async put (uuid: string, payload: TaskUpdatePayload) {
    return await callApi().put(`/task/${uuid}`, payload)
  },

  async delete (uuid: string) {
    return await callApi().delete(`/task/${uuid}`)
  },
}
