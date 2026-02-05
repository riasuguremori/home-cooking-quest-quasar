import { apiAuth } from 'boot/axios'

export default {
  createMission: (data) => {
    return apiAuth.post('/mission', data)
  },
  getMission: () => {
    return apiAuth.get('/mission/')
  },
  getAllMission: () => {
    return apiAuth.get('/mission/all')
  },
  updateMission: (id, data) => {
    return apiAuth.patch('/mission/updateMission/' + id, data)
  },
}
