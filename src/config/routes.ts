const routes = {
  LANDING: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  CREATE_PROFILE: '/onboard/profile',

  DASHBOARD: '/dashboard',
  GROUPS: '/groups',
  buildGroupInfo: (id: string) => `/groups/${id}`,
  buildUserProfile: (id: string) => `/profile/${id}`
}

export default routes
