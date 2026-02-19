import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/youTube',
      component: () => import('../layouts/main-layout/MainLayout.vue'),
      meta: {
        middleware: 'auth'
      },
      children: [
        {
          path: '/youTube',
          name: 'youTube',
          component: () => import('../views/YoutubeView.vue'),
          meta: { label: 'YouTube' }
        },
        {
          path: '/twitter',
          name: 'twitter',
          component: () => import('../views/TwitterView.vue'),
          meta: { label: 'Twitter' }
        },
        {
          path: '/twitch',
          name: 'twitch',
          component: () => import('../views/TwitchView.vue'),
          meta: { label: 'Twitch' }
        },
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue'),
          meta: { label: 'Dashboard' }
        },
        {
          path: '/howitworks',
          name: 'howitworks',
          component: () => import('../views/HowItWorksView.vue'),
          meta: { label: 'Come Funziona' }
        },
        {
          path: '/quizgenerator',
          name: 'quizgenerator',
          component: () => import('../views/QuizGeneratorView.vue'),
          meta: { label: 'Generatore Quiz' }
        },
        {
          path: '/settings',
          name: 'settings',
          component: () => import('../views/SettingsView.vue'),
          meta: { label: 'Impostazioni' }
        },
        {
          path: '/youTube/dettaglio/:id',
          name: 'youTubeDetail',
          component: () => import('../views/YoutubeCommentsView.vue'),
          meta: { label: 'Dettagli commento' }
        },
        {
          path: '/twitch/dettaglio/:id',
          name: 'twitchDetail',
          component: () => import('../views/TwitchCommentsView.vue'),
          meta: { label: 'Dettagli commento' }
        }
      ]
    },
    {
      path: '/',
      component: () => import('../layouts/AuthLayout.vue'),
      children: [
        {
          path: '/login',
          name: 'login',
          component: () => import('../views/LoginView.vue'),
          meta: {
            pageTitle: 'Sign In'
          }
        }
        // {
        //   path: "/sign-up",
        //   name: "sign-up",
        //   component: () =>
        //       import("@/views/crafted/authentication/basic-flow/SignUp.vue"),
        //   meta: {
        //     pageTitle: "Sign Up",
        //   },
        // },
        // {
        //   path: "/password-reset",
        //   name: "password-reset",
        //   component: () =>
        //       import("@/views/crafted/authentication/basic-flow/PasswordReset.vue"),
        //   meta: {
        //     pageTitle: "Password reset",
        //   },
        // },
      ]
    }

    // {
    //   path: "/",
    //   component: () => import("@/layouts/SystemLayout.vue"),
    //   children: [
    //     {
    //       // the 404 route, when none of the above matches
    //       path: "/404",
    //       name: "404",
    //       component: () => import("@/views/crafted/authentication/Error404.vue"),
    //       meta: {
    //         pageTitle: "Error 404",
    //       },
    //     },
    //     {
    //       path: "/500",
    //       name: "500",
    //       component: () => import("@/views/crafted/authentication/Error500.vue"),
    //       meta: {
    //         pageTitle: "Error 500",
    //       },
    //     },
    //   ],
    // },
    // {
    //   path: "/:pathMatch(.*)*",
    //   redirect: "/404",
    // },
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // verify auth token before each page change
  await authStore.verifyAuth()

  // before page access check if page requires authentication
  if (to.meta.middleware == 'auth') {
    if (authStore.isAuthenticated) {
      next()
    } else {
      next({ name: 'login' })
    }
  } else {
    next()
  }

  // Scroll page to top on every route change
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  })
})

export default router
