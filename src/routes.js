import useSupabase from '@/hooks/useSupabase'
const supabase = useSupabase()

// Import routes
import AppRoute from '@/views/App/App.vue'
import AppNotesDisplayRoute from '@/views/App/App-NotesDisplay.vue'
import AppDeletedRoute from '@/views/App/App-Deleted.vue'
import AppArchiveRoute from '@/views/App/App-Archive.vue'
import AppSearchRoute from '@/views/App/App-Search.vue'
import AppAccountRoute from '@/views/App/App-Account.vue'

/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [
  /**
   * Notes
   */
  {
    path: '/app/:isHiddenMode(hidden)?',
    name: 'App',
    component: AppRoute,
    redirect: { name: 'App-Home' },
    meta: { requiresAuth: true }, 
    children: [
      { 
        path: 'home', 
        name: 'App-Home',
        meta: { requiresAuth: true }, 
        component: AppNotesDisplayRoute,
      },
      { 
        path: 'uncategorized', 
        name: 'App-Uncategorized',
        meta: { requiresAuth: true }, 
        component: AppNotesDisplayRoute,
      },
      {
        path: 'collection/:collectionId',
        name: 'App-Collection',
        meta: { requiresAuth: true }, 
        component: AppNotesDisplayRoute
      },
      {
        path: 'deleted',
        name: 'App-Deleted',
        meta: { requiresAuth: true }, 
        component: AppDeletedRoute,
      },
      {
        path: 'archive',
        name: 'App-Archive',
        meta: { requiresAuth: true }, 
        component: AppArchiveRoute,
      },
      {
        path: 'search',
        name: 'App-Search',
        meta: { requiresAuth: true }, 
        component: AppSearchRoute,
      }
    ] 
  },

  /**
   * Account
   */
  {
    path: '/app/account',
    component: AppRoute,
    redirect: { name: 'App-Account' },
    meta: { requiresAuth: true }, 
    children: [
      {
        path: '',
        name: 'App-Account',
        meta: { requiresAuth: true }, 
        component: AppAccountRoute,
      }
    ]
  },

  /**
   * Auth
   */
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
        path: 'sign-up',
        name: 'Auth-SignUp',
        meta: { requiresAuth: false }, 
        component: () => import('./views/Auth/Auth-SignUp.vue'),
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
    path: '/:path(.*)', 
    component: () => import('./views/404.vue')
  },
]
