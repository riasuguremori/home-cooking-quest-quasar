<template>
  <q-page-container>
    <q-page>
      <div class="hero-section relative-position" v-if="info">
        <q-img :src="info.imageUrl" style="height: 400px" class="hero-img"> </q-img>
      </div>

      <div class="container q-pa-md q-mx-auto" style="max-width: 1200px" v-if="info">
        <div class="row q-col-gutter-lg">
          <RecipeContent
            :recipe="info"
            :unlocked="unlocked"
            :is-collected="isCollected"
            :is-locked="isLocked"
            @collect="handleCollect"
            @unlock="handleUnlock"
          />

          <div class="col-12 col-md-4 q-gutter-y-lg">
            <q-card flat bordered class="q-pa-md radius-12 bg-orange-3">
              <q-item class="q-px-none">
                <q-item-section avatar>
                  <q-avatar size="60px">
                    <img
                      :src="`https://api.dicebear.com/9.x/thumbs/svg?seed=${info.author.account}`"
                    />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <div class="text-h6">{{ info.author.account }}</div>
                </q-item-section>
              </q-item>

              <q-btn outline rounded color="dark" label="追蹤" class="full-width" no-caps />
            </q-card>

            <CommentSection :recipe-id="route.params.id" />
          </div>
        </div>
      </div>
    </q-page>
  </q-page-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import serviceRecipe from 'src/services/recipe'
import serviceUser from 'src/services/user'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { useUserStore } from 'stores/user'
import RecipeContent from 'components/RecipeContent.vue'
import CommentSection from 'components/CommentSection.vue'

const user = useUserStore()
const info = ref({
  name: '',
  author: { account: '' },
  imageUrl: '',
  ingredient: [],
  steps: [],
  description: '',
  rating: 0,
  isUnlocked: true,
  unlockPrice: 0,
})
const unlocked = ref(false)
const $q = useQuasar()
const route = useRoute()
const isCollected = ref(false)

const getRecipeInfo = async () => {
  try {
    const { data } = await serviceRecipe.getRecipeInfo(route.params.id)
    info.value = data.result
    if (user.isLoggedIn) {
      const { data: un } = await serviceUser.unlockedRecipes()
      unlocked.value = un.result.includes(route.params.id)
      const { data: collection } = await serviceUser.getUser()
      isCollected.value = collection.result.savedRecipes.includes(route.params.id)
    }
  } catch (error) {
    console.log(error)
    $q.notify({
      color: 'negative',
      message: '無法取得食譜資訊',
      icon: 'report_problem',
      position: 'bottom',
    })
  }
}
getRecipeInfo()

const handleUnlock = async () => {
  try {
    await serviceRecipe.unlockRecipe(route.params.id)
    unlocked.value = true
    $q.notify({
      message: '解鎖成功',
      color: 'positive',
      icon: 'check_circle',
    })
  } catch (error) {
    console.log(error)
    $q.notify({
      color: 'negative',
      message: '解鎖失敗',
      icon: 'report_problem',
      position: 'bottom',
    })
  }
}

const handleCollect = async () => {
  if (!user.isLoggedIn) {
    $q.notify({
      color: 'warning',
      message: '請先登入才能收藏',
      icon: 'warning',
      position: 'bottom',
    })
    return
  }
  try {
    await serviceRecipe.bookMark(route.params.id)
    isCollected.value = !isCollected.value
    $q.notify({
      color: 'positive',
      message: isCollected.value ? '已加入收藏' : '已取消收藏',
      icon: 'favorite',
      position: 'bottom',
    })
  } catch (error) {
    console.log(error)
    $q.notify({
      color: 'negative',
      message: '操作失敗',
      icon: 'report_problem',
      position: 'bottom',
    })
  }
}

const isLocked = computed(() => {
  // 如果 (沒登入) 或 (沒解鎖 且 不是管理員 且 當前頁面狀態未解鎖)
  return !user.isLoggedIn || (!info.value.isUnlocked && !user.isAdmin && !unlocked.value)
})
</script>

<style lang="sass" scoped>

.radius-12
  border-radius: 12px

.hero-overlay
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)

.search-input
  width: 250px
  .q-field__control
    background: #f5f5f5
</style>
