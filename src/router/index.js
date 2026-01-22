import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import serviceUser from '@/services/user'
import { useUserStore } from '@/stores/user'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(import.meta.env.BASE_URL),
  })

  Router.beforeEach(async (to, _from, next) => {
    const user = useUserStore()
    // 如果有 token 就取使用者資料
    if (user.isLoggedIn) {
      try {
        const { data } = await serviceUser.profile()
        user.login(data.result)
      } catch (error) {
        console.log(error)
        user.logout()
      }
    }

    // 根據登入狀態和權限判斷能不能去目標頁面
    if (to.meta.login === 'no-login-only' && user.isLoggedIn) {
      // 去未登入限定頁面，且使用者有登入，回首頁
      next('/')
    } else if (to.meta.login === 'login-only' && !user.isLoggedIn) {
      // 去登入限定頁面，且使用者沒有登入，回登入頁面
      next('/login')
    } else if (to.meta.admin && !user.isAdmin) {
      // 去管理員限定頁面，且使用者不是管理員，回首頁
      next('/')
    } else {
      // 繼續
      next()
    }
  })

  Router.afterEach((to) => {
    document.title = `私房的料理探索 | ${to.meta.title}`
  })

  return Router
})
