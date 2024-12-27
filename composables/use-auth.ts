import { getCookie } from 'h3'
import { hash } from 'ohash'
import {
  withQuery,
  encodePath,
  joinURL,
} from 'ufo'
import getURL from 'requrl'
import {
  useState,
  useRequestEvent,
  useRuntimeConfig,
  navigateTo,
  useRequestHeaders,
} from '#imports'
import { createFetch } from 'ofetch'
import type { LoginResponse } from '~/types/user'
import type { AxiosResponse } from 'axios'

const $fetch = globalThis.$fetch ?? createFetch({ fetch: globalThis.fetch })

export function useAuth () {
  const config  = useRuntimeConfig()
  const event   = useRequestEvent()
  const headers = useRequestHeaders()
  const host    = getURL(event?.node?.req)
  const baseURL = joinURL(host, config.app.baseURL)

  const token        = useState<string | undefined>(hash('auth/token'), () => event && getCookie(event, 'auth/token'))
  const refreshToken = useState<string | undefined>(hash('auth/rtoken'), () => event && getCookie(event, 'auth/refresh-token'))
  const expires      = useState<string | undefined>(hash('auth/expires'), () => event && getCookie(event, 'auth/expires'))

  function isAlmostExpired (minutes = 15) {
    if (!expires.value)
      return true

    const end  = new Date(expires.value)
    const now  = new Date()
    const diff = Math.floor((end.getTime() - now.getTime()) / 60_000 /* millisecond in minute */)

    return diff > 0 && diff <= minutes
  }

  async function logout (path?: string) {
    const redirect = path ? encodePath(path) : undefined
    const url      = withQuery('/auth/logout', { redirect })

    return await navigateTo(joinURL(baseURL, url), { external: true })
  }

  async function refresh (): Promise<string | undefined> {
    if (refreshToken.value) {
      try {
        const response = await $fetch<AxiosResponse<LoginResponse>>('/api/auth/refresh', {
          baseURL,
          method : 'POST',
          headers: {
            ...headers,
            Authorization: `Bearer ${refreshToken.value}`,
          },
        })

        if (response.data) {
          token.value        = response.data.accessToken
          refreshToken.value = response.data.refreshToken

          const now = new Date()
          now.setSeconds(now.getSeconds() + response.data.expiresIn)
          expires.value = now.toISOString()

          return response.data.accessToken
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  return {
    token,
    refreshToken,
    expires,
    isAlmostExpired,
    logout,
    refresh,
  }
}
