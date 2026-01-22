import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import serviceUser from '@/services/user'
import { useUserStore } from '@/stores/user'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })

const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// axios 攔截器執行順序
// 1. axios.get() axios.post 等地方
// 2. 請求攔截器 interceptors.request
// 3. 送出
// 4. 回應攔截器 interceptors.response
// 5. await  axios.get 等地方

// 在每個請求送出自動加入 pinia 的使用者 token
// config = 請求方式、路徑、資料等設定
apiAuth.interceptors.request.use((config) => {
  const user = useUserStore()
  config.headers.Authorization = `Bearer ${user.token}`
  return config
})

// 當收到過期錯誤時，自動傳送 refresh 後重發一次
// 回應攔截器
// .use(成功處哩, 失敗處理)
apiAuth.interceptors.response.use(
  (res) => res,
  async (error) => {
    // refresh 條件
    // 1. 如果有收到回應，網路錯誤時不會有回應
    // 2. 不是 refresh 錯誤
    // 3. 是身分驗證失敗錯誤
    if (error.response && error.config.url !== '/user/refresh' && error.response.status === 401) {
      const user = useUserStore()
      try {
        // 傳送 refresh
        const { data } = await serviceUser.refresh()
        // 更新 token
        user.token = data.result.token
        // 修改發生錯誤的原請求設定，換上新的 token
        error.config.headers.Authorization = `Bearer ${user.token}`
        // 重新發送一次原請求
        return apiAuth(error.config)
      } catch {
        // refresh 失敗，強制前端登出
        user.logout()
      }
    }
    // 其他錯誤，回傳原本的錯誤
    throw error
  },
)

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  app.config.globalProperties.$apiAuth = apiAuth

  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api, apiAuth }
