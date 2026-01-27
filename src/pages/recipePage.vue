<template>
  <div class="q-pa-md q-pa-lg-xl">
    <div class="column flex-center q-mb-xl text-center">
      <div class="text-h4 text-weight-bolder text-grey-9 q-mb-md">探索美味食譜</div>
      <div class="text-grey-6 q-mb-lg" style="max-width: 500px">
        輸入關鍵字或選擇分類，尋找你的下一道料理靈感
      </div>

      <div class="row items-center full-width q-gutter-sm" style="max-width: 600px">
        <q-input
          dense
          borderless
          v-model="search"
          placeholder="搜尋食譜"
          class="search-input col"
          input-class="q-px-md text-grey-8"
        >
          <template v-slot:prepend>
            <q-icon name="search" class="q-pl-md text-primary" />
          </template>
          <template v-slot:append v-if="search">
            <q-icon name="close" @click="search = ''" class="cursor-pointer q-pr-md" />
          </template>
        </q-input>
      </div>
    </div>

    <div class="row justify-center q-gutter-sm q-mb-xl">
      <q-btn
        unelevated
        rounded
        :color="activeCategory === 'All' ? 'primary' : 'white'"
        :text-color="activeCategory === 'All' ? 'white' : 'grey-9'"
        label="所有食譜"
        class="q-px-lg transition-btn"
        :class="activeCategory === 'All' ? 'shadow-3' : 'shadow-1'"
        @click="activeCategory = 'All'"
      />

      <q-btn
        v-for="category in categories"
        :key="category.label"
        unelevated
        rounded
        :color="activeCategory === category.label ? 'primary' : 'white'"
        :text-color="activeCategory === category.label ? 'white' : 'grey-9'"
        :icon="category.icon"
        :label="category.label"
        class="q-px-md transition-btn"
        :class="activeCategory === category.label ? 'shadow-3' : 'shadow-1'"
        @click="activeCategory = category.label"
      />
    </div>

    <div class="row q-col-gutter-lg" v-if="filteredRecipes.length > 0">
      <div class="col-12 col-sm-6 col-md-3" v-for="filter in filteredRecipes" :key="filter._id">
        <RecipeCard :recipe="filter" @click="getRecipeInfo(filter._id)" />
      </div>
    </div>

    <div v-else class="text-center q-py-xl text-grey-5">
      <q-icon name="soup_kitchen" size="64px" class="q-mb-md" />
      <div class="text-h6">找不到符合的食譜</div>
      <div>試試看其他的關鍵字或是分類吧！</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import recipeService from '@/services/recipe'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import RecipeCard from '@/components/RecipeCard.vue'

const search = ref('')
const activeCategory = ref('All')
const recipes = ref([])
const router = useRouter()
const $q = useQuasar()

const getRecipeInfo = (id) => {
  if (!id) {
    $q.notify({
      type: 'negative',
      message: '無法取得食譜',
      icon: 'report_problem',
    })
    return
  }
  router.push(`/recipes/${id}`)
}

// 分類數據
const categories = [
  { label: '中式', icon: 'dinner_dining' },
  { label: '日式', icon: 'ramen_dining' },
  { label: '西式', icon: 'restaurant' },
  { label: '甜點', icon: 'icecream' },
  { label: '其他', icon: 'category' },
]

const getRecipe = async () => {
  try {
    const { data } = await recipeService.getPublicRecipes()
    recipes.value = data.result
  } catch (error) {
    console.log(error)
    $q.notify({
      color: 'negative',
      message: '無法取得食譜',
      icon: 'report_problem',
      position: 'bottom',
    })
  }
}
getRecipe()

// 篩選邏輯
const filteredRecipes = computed(() => {
  if (!recipes.value) return []
  return recipes.value.filter((recipe) => {
    // 搜尋字串篩選 (不分大小寫)
    const matchesSearch = recipe.name.toLowerCase().includes(search.value.toLowerCase())

    // 2. 分類篩選
    const matchesCategory =
      activeCategory.value === 'All' || recipe.category === activeCategory.value

    return matchesSearch && matchesCategory
  })
})
</script>

<style lang="scss" scoped>
.search-input .q-field__control {
  border-radius: 28px !important;
}

/* 按鈕過渡動畫 */
.transition-btn {
  transition: all 0.3s ease;
}
</style>
