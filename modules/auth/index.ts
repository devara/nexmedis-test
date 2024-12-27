import {
  addServerHandler,
  createResolver,
  defineNuxtModule,
} from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name     : 'auth',
    configKey: 'auth',
  },
  setup (resolvedOptions, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    addServerHandler({ route: '/auth/logout', handler: resolve('./logout') })
    addServerHandler({ route: '/auth/login', handler: resolve('./login') })
  },
})
