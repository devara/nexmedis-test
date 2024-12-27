// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools         : { enabled: false },
  modules          : ['./modules/auth'],
  css              : ['~/assets/css/main.css'],
  postcss          : {
    plugins: {
      'tailwindcss'        : {},
      'tailwindcss/nesting': {},
      'autoprefixer'       : {},
    },
  },
  nitro: { routeRules: { '/api/**': { proxy: { to: `${import.meta.env.API_URL as string}/**` } } } },
})
