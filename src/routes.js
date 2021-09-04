import beforeAppRouteEnterUpdate from '@/utils/beforeAppRouteEnterUpdate'


/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [
  { 
    path: '/',
    redirect: { name: 'App-Home' } 
  },

  {
    path: '/auth',
    name: 'Auth',
    component: () => import('./views/Auth/Auth.vue'),
    redirect: { name: 'Auth-SignIn' },
    children: [
      {
        path: 'sign-in',
        name: 'Auth-SignIn',
        component: () => import('./views/Auth/Auth-SignIn.vue'),
      }
    ]
  },
  {
    path: '/notes/:isHiddenMode(hidden)?',
    name: 'App',
    component: () => import('./views/App/App.vue'),
    redirect: { name: 'App-Home' },
    beforeEnter: beforeAppRouteEnterUpdate,
    children: [
      { 
        path: 'home', 
        name: 'App-Home',
        component: () => import('./views/App/App-NotesDisplay.vue'),
      },
      {
        path: 'collection/:collectionId',
        name: 'App-Collection',
        component: () => import('./views/App/App-NotesDisplay.vue')
      },
      {
        path: 'deleted',
        name: 'App-Deleted',
        component: () => import('./views/App/App-Deleted.vue'),
      },
      {
        path: 'archive',
        name: 'App-Archive',
        component: () => import('./views/App/App-Archive.vue'),
      },
      {
        path: 'test',
        name: 'App-Test',
        component: () => import('./views/App/App-Test.vue'),
      }
    ] 
  },
  {
    path: '/account',
    name: 'App-Account-Wrapper',
    component: () => import('./views/App/App.vue'),
    redirect: { name: 'App-Account' },
    children: [
      {
        path: '',
        name: 'App-Account',
        component: () => import('./views/App/App-Account.vue'),
      },
    ]
  },

  /*{ 
    path: '/:path(.*)', 
    component: () => import('./views/NotFound.vue')
  },*/
]
