import type { CookieOptions } from '#app'
import {
  defineEventHandler,
  getQuery,
  setCookie,
  setResponseStatus,
  sendRedirect,
} from 'h3'
import type { LoginResponse } from '~/types/user'

export default defineEventHandler(async (event) => {
  try {
    const {
      accessToken,
      refreshToken,
      expiresIn,
      tokenType,
    } = getQuery<LoginResponse>(event)
    if (accessToken) {
      const expires = new Date()
      expires.setSeconds(expires.getSeconds() + (
        typeof expiresIn === 'number'
          ? expiresIn
          : Number.parseInt(expiresIn)),
      )

      const options: CookieOptions = {
        expires,
        sameSite: 'strict',
        httpOnly: true,
      }

      setCookie(event, 'auth/token', accessToken, options)
      setCookie(event, 'auth/refresh-token', refreshToken, options)
      setCookie(event, 'auth/type', tokenType, options)
      setCookie(event, 'auth/expires', expires.toISOString(), options)

      await sendRedirect(event, '/')
    } else
      await sendRedirect(event, '/login')
  } catch (error) {
    setResponseStatus(event, 500)

    return {
      code   : 500,
      message: (error as Error).message,
    }
  }
})
