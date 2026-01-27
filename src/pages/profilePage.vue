<template>
  <q-page-container>
    <q-page class="row justify-center q-pa-md">
      <div class="col-12" style="max-width: 1200px">
        <div class="q-my-lg">
          <h1 class="text-h4 text-weight-bolder q-mb-xs">歡迎回來 {{ profile.account }}</h1>
        </div>

        <ProfileStatCards
          :total-points="profile.points?.totalEarned || 0"
          :saved-count="profile.savedRecipes?.length || 0"
          :unlocked-count="profile.unlockedRecipes?.length || 0"
          :mission-progress="missionProgress"
          :missions="processedMissions"
        />

        <div class="q-pa-md q-ma-auto" style="max-width: 1200px">
          <q-card flat class="main-content-card">
            <q-tabs
              v-model="currentTab"
              class="text-grey-8"
              active-color="orange-9"
              indicator-color="orange-9"
              align="left"
              content-class="q-px-md"
            >
              <q-tab
                v-for="tab in tabs"
                :key="tab.name"
                :name="tab.name"
                :label="tab.title"
                class="text-weight-bold text-capitalize"
              />
            </q-tabs>

            <q-separator color="grey-2" />

            <q-tab-panels v-model="currentTab" animated>
              <q-tab-panel name="logs" class="q-pa-none">
                <PointLogTable :logs="profile.pointLog || []" />
              </q-tab-panel>

              <q-tab-panel name="savedRecipes" class="q-pa-none">
                <ProfileRecipeList
                  :recipes="filteredSavedRecipes"
                  v-model:search="searchSavedRecipes"
                  placeholder="搜尋收藏食譜"
                  empty-icon="bookmark_border"
                  empty-text="尚未收藏任何食譜"
                  empty-btn-label="去探索食譜"
                  empty-btn-to="/recipes"
                  @click-recipe="goToRecipe"
                />
              </q-tab-panel>

              <q-tab-panel name="unlockedRecipes" class="q-pa-none">
                <ProfileRecipeList
                  :recipes="filteredUnlockedRecipes"
                  v-model:search="searchUnlockedRecipes"
                  placeholder="搜尋解鎖食譜"
                  empty-icon="lock_open"
                  empty-text="尚未解鎖任何食譜"
                  empty-btn-label="去探索食譜"
                  empty-btn-to="/recipes"
                  @click-recipe="goToRecipe"
                />
              </q-tab-panel>

              <q-tab-panel name="myRecipes" class="q-pa-none">
                <ProfileRecipeList
                  :recipes="filteredMyRecipes"
                  v-model:search="searchMyRecipes"
                  placeholder="搜尋我的食譜"
                  empty-icon="menu_book"
                  empty-text="尚未新增任何食譜"
                  empty-btn-label="去探索食譜"
                  empty-btn-to="/recipes"
                  @click-recipe="goToRecipe"
                >
                  <template #actions>
                    <q-btn
                      color="deep-orange"
                      icon="add"
                      label="新增食譜"
                      @click="openRecipeDialog(null)"
                      unelevated
                    />
                  </template>
                  <template #image-overlay="{ recipe }">
                    <div class="absolute-top-right q-pa-sm bg-transparent">
                      <q-btn
                        icon="edit"
                        round
                        color="white"
                        text-color="primary"
                        size="sm"
                        class="shadow-3"
                        @click.stop="openRecipeDialog(recipe)"
                      />
                    </div>
                  </template>
                </ProfileRecipeList>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
      </div>
      <RecipeDialog ref="recipeDialogRef" @saved="getUser" />
    </q-page>
  </q-page-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar, date } from 'quasar'
import userService from '@/services/user'
import recipeService from '@/services/recipe'
import missionService from '@/services/mission'
import RecipeDialog from '@/components/RecipeDialog.vue'
import PointLogTable from '@/components/PointLogTable.vue'
import ProfileRecipeList from '@/components/ProfileRecipeList.vue'
import ProfileStatCards from '@/components/ProfileStatCards.vue'

const router = useRouter()
const $q = useQuasar()
const profile = ref({})
const my = ref([])
// 當前選中的 Tab
const currentTab = ref('logs')
const searchMyRecipes = ref('')
const searchSavedRecipes = ref('')
const searchUnlockedRecipes = ref('')
const recipeDialogRef = ref(null)
const missions = ref([])

const getMission = async () => {
  try {
    const { data } = await missionService.getMission()
    missions.value = data.result
  } catch (error) {
    console.log(error)
  }
}
getMission()

const processedMissions = computed(() => {
  const status = profile.value.missionStatus || {}
  return missions.value.map((mission) => {
    let isCompleted = false
    let currentCount = 0
    if (mission.code === '每日簽到') {
      if (date.isSameDate(new Date(status.lastLoginDate), new Date(), 'day')) {
        isCompleted = true
        currentCount = 1
      }
    }
    if (mission.code === '發文') {
      currentCount = status.dailyPostCount
      if (currentCount >= mission.dailyLimit) {
        isCompleted = true
      }
    }
    if (mission.code === '新增食譜') {
      currentCount = status.dailyRecipeCount
      if (currentCount >= mission.dailyLimit) {
        isCompleted = true
      }
    }
    return {
      ...mission,
      isCompleted,
      currentCount,
    }
  })
})

const missionProgress = computed(() => {
  if (processedMissions.value.length === 0) return 0
  return (
    processedMissions.value.filter((m) => m.isCompleted).length / processedMissions.value.length
  )
})

const tabs = computed(() => [
  { title: '我的食譜', name: 'myRecipes' },
  { title: '收藏食譜', name: 'savedRecipes' },
  { title: '解鎖食譜', name: 'unlockedRecipes' },
  { title: '積分紀錄', name: 'logs' },
])

const filteredMyRecipes = computed(() => {
  if (!searchMyRecipes.value) return my.value
  const lower = searchMyRecipes.value.toLowerCase()
  return my.value.filter((r) => r.name.toLowerCase().includes(lower))
})

const filteredSavedRecipes = computed(() => {
  const list = profile.value.savedRecipes || []
  if (!searchSavedRecipes.value) return list
  const lower = searchSavedRecipes.value.toLowerCase()
  return list.filter((r) => r.name.toLowerCase().includes(lower))
})

const filteredUnlockedRecipes = computed(() => {
  const list = profile.value.unlockedRecipes || []
  if (!searchUnlockedRecipes.value) return list
  const lower = searchUnlockedRecipes.value.toLowerCase()
  return list.filter((r) => r.name.toLowerCase().includes(lower))
})

const openRecipeDialog = (recipe) => {
  recipeDialogRef.value.open(recipe)
}

// 取得使用者資料
const getUser = async () => {
  try {
    const { data } = await userService.getUser()
    profile.value = data.result
    try {
      const { data: myRecipe } = await recipeService.getMyRecipes()
      my.value = myRecipe.result
    } catch (error) {
      console.log('取不到我的食譜', error)
    }
  } catch (error) {
    console.log(error)
    $q.notify({
      color: 'negative',
      message: '無法取得使用者資訊',
      icon: 'report_problem',
      position: 'bottom',
    })
  }
}
getUser()

const goToRecipe = (id) => {
  router.push(`/recipes/${id}`)
}
</script>

<style lang="sass" scoped>
.main-content-card
  border: 1px solid #f0f0f0
  border-radius: 16px

// 列表 hover 效果
.q-item
  transition: background-color 0.2s
  &:hover
    background-color: #fafafa

// 簡單的頂部邊框樣式
.border-top
  border-top: 1px solid #e0e0e0

// 覆寫 Quasar 預設
.text-orange-9
  color: #FF8C42 !important

.bg-orange-9
  background-color: #FF8C42 !important

.bg-orange-1
  background-color: #FFF4EC !important

.hover-orange:hover
  color: #FF8C42
  transition: color 0.3s
</style>
