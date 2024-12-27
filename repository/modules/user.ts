import type { AxiosResponse } from 'axios'
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  UpdateProfilePayload,
  UpdateUsernamePayload,
} from '~/types/user'

const callApi = () => {
  const { $api } = useNuxtApp()
  return $api
}

export const userRepository = {
  async login (payload: LoginPayload): Promise<AxiosResponse<LoginResponse>> {
    return await callApi().post('/auth/login', payload)
  },

  async register (payload: RegisterPayload): Promise<AxiosResponse<LoginResponse>> {
    return await callApi().post('/auth/register', payload)
  },

  async getProfile () {
    return await callApi().get('/user/profile')
  },

  async updateProfile (payload: UpdateProfilePayload) {
    return await callApi().put('/user/profile', payload)
  },

  async updateUsername (payload: UpdateUsernamePayload) {
    return await callApi().put('/user/username', payload)
  },
}
