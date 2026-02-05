import { api, apiAuth } from 'boot/axios'

export default {
  createArticle: (data) => {
    return apiAuth.post('/article', data)
  },
  getAllArticle: () => {
    return api.get('/article/all')
  },
  updateArticle: (id, data) => {
    return apiAuth.patch('/article/updateArticle/' + id, data)
  },
  likeArticle: (id, data) => {
    return apiAuth.patch('/article/likeArticle/' + id, data)
  },
  deleteArticle: (id, data) => {
    return apiAuth.delete('/article/deleteArticle/' + id, data)
  },
}
