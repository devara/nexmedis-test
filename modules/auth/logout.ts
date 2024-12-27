import {
  defineEventHandler,
  deleteCookie,
} from 'h3'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth/token')
  deleteCookie(event, 'auth/refresh-token')
  deleteCookie(event, 'auth/type')
  deleteCookie(event, 'auth/expires')

  await sendRedirect(event, '/login')
})
