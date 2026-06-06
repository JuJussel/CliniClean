import { getRequestURL } from 'h3'

export default defineEventHandler(async (event) => {
  const { pathname } = getRequestURL(event)

  // Only protect API routes
  if (pathname.startsWith('/api/')) {
    // Exclude login, nuxt-auth-utils internal endpoints, and icon loading
    if (
      pathname === '/api/login' ||
      pathname.startsWith('/api/_auth/') ||
      pathname.startsWith('/api/_nuxt_icon/')
    ) {
      return
    }

    // Check session
    const session = await getUserSession(event)
    if (!session || !session.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Authentication required'
      })
    }
  }
})
