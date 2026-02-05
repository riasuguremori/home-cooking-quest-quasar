import { api, apiAuth } from 'boot/axios'

export default {
  createRecipe: (data) => {
    return apiAuth.post('/recipe', data)
  },
  getPublicRecipes: () => {
    return api.get('/recipe/public')
  },
  getAllRecipes: () => {
    return apiAuth.get('/recipe/all')
  },
  getMyRecipes: () => {
    return apiAuth.get('/recipe/my')
  },
  getRecipeInfo: (id) => {
    return api.get(`/recipe/${id}`)
  },
  getAllRecipeNumber: () => {
    return apiAuth.get(`/recipe/allRecipeNumber`)
  },
  unlockRecipe: (id) => {
    return apiAuth.patch(`/recipe/unlock/${id}`)
  },
  updateRecipe: (id, data) => {
    return apiAuth.patch(`/recipe/${id}`, data)
  },
  bookMark: (id) => {
    return apiAuth.patch('/recipe/bookmark/' + id)
  },
  deleteRecipe: (id, data) => {
    return apiAuth.delete(`/recipe/${id}`, data)
  },
}
