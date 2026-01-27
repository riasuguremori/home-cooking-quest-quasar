<template>
  <div class="q-my-xl q-pt-xl q-mx-auto q-px-md" style="max-width: 1400px">
    <div class="text-h4 text-weight-bold q-mb-md text-grey-9">每日精選</div>
    <div class="q-pb-lg" style="overflow-x: auto">
      <div class="row no-wrap q-gutter-md q-px-xs q-pb-sm">
        <div v-for="recipe in randomRecipes" :key="recipe._id" style="width: 250px; flex-shrink: 0">
          <RecipeCard :recipe="recipe" @click="(id) => router.push(`/recipes/${id}`)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import recipeService from '@/services/recipe'
import RecipeCard from '@/components/RecipeCard.vue'

const router = useRouter()
const randomRecipes = ref([])

// 獨立出 Fisher-Yates Shuffle
const shuffleArray = (array) => {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// 封裝 LocalStorage 操作
const STORAGE_KEY = 'daily_recipes'

const getCachedRecipes = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null

    const { date, recipes } = JSON.parse(stored)
    const today = new Date().toDateString()

    if (date === today && Array.isArray(recipes) && recipes.length > 0) {
      return recipes
    }
  } catch (e) {
    console.warn('Cache corrupted, clearing...', e)
    localStorage.removeItem(STORAGE_KEY)
  }
  return null
}

const setCachedRecipes = (recipes) => {
  try {
    const data = JSON.stringify({
      date: new Date().toDateString(),
      recipes,
    })
    localStorage.setItem(STORAGE_KEY, data)
  } catch (e) {
    console.error('Failed to save to LocalStorage (Quota exceeded?):', e)
  }
}

const getRandomRecipes = async () => {
  const cached = getCachedRecipes()
  if (cached) {
    randomRecipes.value = cached
    console.log('Loaded from cache')
    return
  }

  try {
    const { data } = await recipeService.getPublicRecipes()

    if (data?.success && Array.isArray(data.result)) {
      const selected = shuffleArray(data.result).slice(0, 10)
      randomRecipes.value = selected
      setCachedRecipes(selected)
    } else {
      console.warn('API Response invalid:', data)
    }
  } catch (error) {
    console.error('Fetch error:', error)
  }
}

getRandomRecipes()
</script>
