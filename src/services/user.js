import { api, apiAuth } from '@/boot/axios'

export default {
  create: (data) => {
    return api.post('/user', data)
  },
  login: (data) => {
    return api.post('/user/login', data)
  },
  profile: () => {
    return apiAuth.get('/user/profile')
  },
  getAccountCount: () => {
    return apiAuth.get('/user/accountCount')
  },
  getAllAccount: () => {
    return apiAuth.get('/user/allAccount')
  },
  unlockedRecipes: () => {
    return apiAuth.get('/user/unlockedRecipes')
  },
  refresh: () => {
    return apiAuth.patch('/user/refresh')
  },
  updateUser: (id, data) => {
    return apiAuth.patch('/user/updateUser/' + id, data)
  },
  logout: () => {
    return apiAuth.delete('/user/logout')
  },
  todayPoints: (data) => {
    return apiAuth.get('/user/todayPoints', data)
  },
  getUser: () => {
    return apiAuth.get('/user/getUser')
  },
  updateLastReadLog: () => {
    return apiAuth.patch('/user/updateLastReadLog')
  },
}
