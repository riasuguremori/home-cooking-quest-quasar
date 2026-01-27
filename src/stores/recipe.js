import { defineStore } from 'pinia'
import { ref } from 'vue'
import recipeService from '@/services/recipe'

export const useRecipeStore = defineStore(
  'recipe',
  () => {
    const dailyRecipes = ref([])
    const dailyDate = ref('')

    // Fisher-Yates Shuffle
    const shuffleArray = (array) => {
      const result = [...array]
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[result[i], result[j]] = [result[j], result[i]]
      }
      return result
    }

    const fetchDailyRecipes = async () => {
      const today = new Date().toDateString()

      // Check if we have valid cached data in state (persistence will handle loading it from storage)
      if (dailyDate.value === today && dailyRecipes.value.length > 0) {
        return
      }

      try {
        const { data } = await recipeService.getPublicRecipes()

        if (data?.result && Array.isArray(data.result)) {
          const selected = shuffleArray(data.result).slice(0, 10)
          dailyRecipes.value = selected
          dailyDate.value = today
        }
      } catch (error) {
        console.log(error)
      }
    }

    return {
      dailyRecipes,
      dailyDate,
      fetchDailyRecipes,
    }
  },
  {
    persist: {
      key: 'recipe-store',
      pick: ['dailyRecipes', 'dailyDate'],
    },
  },
)
