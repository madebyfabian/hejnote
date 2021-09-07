import useSupabase from '@/hooks/useSupabase'
const supabase = useSupabase()

/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [
  { 
    path: '/',
    meta: { requiresAuth: false }, 
    redirect: { name: 'App-Home' } 
  },

  {
    path: '/auth',
    name: 'Auth',
    component: () => import('./views/Auth/Auth.vue'),
    redirect: { name: 'Auth-SignIn' },
    meta: { requiresAuth: false }, 
    children: [
      {
        path: 'sign-in',
        name: 'Auth-SignIn',
        meta: { requiresAuth: false }, 
        component: () => import('./views/Auth/Auth-SignIn.vue'),
      },
      {
        path: 'sign-out',
        name: 'Auth-SignOut',
        meta: { requiresAuth: true },
        beforeEnter: async ( to, from, next ) => {
          supabase.auth.signOut()
          return next({ name: 'Auth' })
        },
      }
    ]
  },
  {
    path: '/notes/:isHiddenMode(hidden)?',
    name: 'App',
    component: () => import('./views/App/App.vue'),
    redirect: { name: 'App-Home' },
    meta: { requiresAuth: true }, 
    children: [
      { 
        path: 'home', 
        name: 'App-Home',
        meta: { requiresAuth: true }, 
        component: () => import('./views/App/App-NotesDisplay.vue'),
      },
      {
        path: 'collection/:collectionId',
        name: 'App-Collection',
        meta: { requiresAuth: true }, 
        component: () => import('./views/App/App-NotesDisplay.vue')
      },
      {
        path: 'deleted',
        name: 'App-Deleted',
        meta: { requiresAuth: true }, 
        component: () => import('./views/App/App-Deleted.vue'),
      },
      {
        path: 'archive',
        name: 'App-Archive',
        meta: { requiresAuth: true }, 
        component: () => import('./views/App/App-Archive.vue'),
      },
      {
        path: 'test',
        name: 'App-Test',
        meta: { requiresAuth: true }, 
        component: () => import('./views/App/App-Test.vue'),
      }
    ] 
  },
  {
    path: '/account',
    name: 'App-Account-Wrapper',
    component: () => import('./views/App/App.vue'),
    redirect: { name: 'App-Account' },
    meta: { requiresAuth: true }, 
    children: [
      {
        path: '',
        name: 'App-Account',
        meta: { requiresAuth: true }, 
        component: () => import('./views/App/App-Account.vue'),
      }
    ]
  },

  { 
    path: '/:path(.*)', 
    component: () => import('./views/404.vue')
  },
]
