export default defineNuxtRouteMiddleware(async (to) => {
  const event = useRequestEvent()
  if (event) {
    const { token, isAlmostExpired, refresh } = useAuth()

    if (token.value && ['login', 'register'].includes(to.name as string))
      return await navigateTo('/')

    if (!token.value && !['login', 'register'].includes(to.name as string))
      return await navigateTo('/login')

    if (token.value && isAlmostExpired())
      await refresh()
  }
})
