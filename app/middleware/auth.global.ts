export default defineNuxtRouteMiddleware((to, from) => {
  const { loggedIn } = useUserSession()
  // Pages that do not need authentication
  const publicPages=['/login']
  if(publicPages.includes(to.path)) {
    return
  }

  // redirect the user to the login screen if they're not authenticated
  if (!loggedIn.value) { 
    return navigateTo('/login')
  }
})