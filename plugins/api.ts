import { AxiosHeaders } from 'axios'
import { createApi } from '~/repository/factory'

export default defineNuxtPlugin(() => {
  const { token } = useAuth()
  const baseURL   = '/api'

  const apiModule = createApi({ baseURL })

  apiModule.addRequestInterceptor(async (config) => {
    if (token.value) {
      config.headers = new AxiosHeaders({
        ...config.headers,
        Authorization: `Bearer ${token.value}`,
      })
    }

    return config
  })

  return { provide: { api: apiModule } }
})
