import useSupabase from '@/hooks/useSupabase'
const supabase = useSupabase()

// Import routes
import AppRoute from '@/views/App/App.vue'
import AppNotesDisplay from '@/views/App/App-NotesDisplay.vue'
import AppDeleted from '@/views/App/App-Deleted.vue'
import AppArchive from '@/views/App/App-Archive.vue'
import AppSearch from '@/views/App/App-Search.vue'
import AppAccount from '@/views/App/App-Account.vue'

/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [
  /**
   * App
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
        component: AppNotesDisplay,
      },
      { 
        path: 'uncategorized', 
        name: 'App-Uncategorized',
        meta: { requiresAuth: true }, 
        component: AppNotesDisplay,
      },
      {
        path: 'collection/:collectionId',
        name: 'App-Collection',
        meta: { requiresAuth: true }, 
        component: AppNotesDisplay
      },
      {
        path: 'deleted',
        name: 'App-Deleted',
        meta: { requiresAuth: true }, 
        component: AppDeleted,
      },
      {
        path: 'archive',
        name: 'App-Archive',
        meta: { requiresAuth: true }, 
        component: AppArchive,
      },
      {
        path: 'search',
        name: 'App-Search',
        meta: { requiresAuth: true }, 
        component: AppSearch,
      },
      {
        path: 'account',
        name: 'App-Account',
        meta: { requiresAuth: true }, 
        component: AppAccount,
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
