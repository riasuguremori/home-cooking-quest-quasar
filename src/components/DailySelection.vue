<template>
  <div class="q-my-xl q-pt-xl q-mx-auto q-px-md" style="max-width: 1400px">
    <div class="text-h4 text-weight-bold q-mb-md text-grey-9">每日精選</div>
    <div class="q-pb-lg" style="overflow-x: auto">
      <div class="row no-wrap q-gutter-md q-px-xs q-pb-sm">
        <div v-for="recipe in dailyRecipes" :key="recipe._id" style="width: 250px; flex-shrink: 0">
          <RecipeCard :recipe="recipe" @click="(id) => router.push(`/recipes/${id}`)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useRecipeStore } from 'stores/recipe'
import RecipeCard from 'components/RecipeCard.vue'

const router = useRouter()
const recipeStore = useRecipeStore()
const { dailyRecipes } = storeToRefs(recipeStore)
const { fetchDailyRecipes } = recipeStore

fetchDailyRecipes()
</script>
