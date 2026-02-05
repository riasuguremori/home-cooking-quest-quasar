import { api, apiAuth } from 'boot/axios'

export default {
  createComment: (data) => {
    return apiAuth.post('/comment', data)
  },
  getRecipeComment: (id) => {
    return api.get('/comment/recipe/' + id)
  },
  getArticleComment: (id) => {
    return api.get('/comment/article/' + id)
  },
  getAllComment: () => {
    return apiAuth.get('/comment/all/')
  },
  updateComment: (id, data) => {
    return apiAuth.patch('/comment/updateComment/' + id, data)
  },
  toggleLike: (id, data) => {
    return apiAuth.patch('/comment/' + id, data)
  },
  deleteComment: (id, data) => {
    return apiAuth.delete('/comment/deleteComment/' + id, data)
  },
}
