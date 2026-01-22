<template>
  <q-page-container>
    <q-page>
      <div class="hero-section relative-position" v-if="info">
        <q-img :src="info.imageUrl" style="height: 400px" class="hero-img"> </q-img>
      </div>

      <div class="container q-pa-md q-mx-auto" style="max-width: 1200px" v-if="info">
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-8">
            <div class="q-mb-xl">
              <div class="row items-center q-mb-md">
                <q-icon name="restaurant" color="deep-orange" size="24px" class="q-mr-sm" />
                <div class="text-h5 text-weight-bold">{{ info.name }}</div>
                <q-btn
                  v-if="!unlocked"
                  flat
                  round
                  dense
                  :icon="isCollected ? 'favorite' : 'favorite_border'"
                  :color="isCollected ? 'pink' : 'grey-5'"
                  @click="handleCollect"
                >
                  <q-tooltip>{{ isCollected ? '取消收藏' : '加入收藏' }}</q-tooltip>
                </q-btn>
                <q-chip
                  v-if="unlocked"
                  color="green-1"
                  text-color="green"
                  icon="lock_open"
                  label="已解鎖"
                  size="sm"
                  class="q-ml-sm"
                />
              </div>
              <p
                class="text-body1 text-grey-9"
                style="line-height: 1.6"
                v-html="info.description"
              ></p>
            </div>
            <q-card
              class="my-card relative-position overflow-hidden"
              flat
              bordered
              :style="isLocked ? 'height: 400px' : 'min-height: 400px'"
            >
              <div
                class="q-pa-lg"
                :class="{
                  'blurred-content': isLocked,
                }"
              >
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-8">
                    <div class="text-h6 q-mb-md">準備食材</div>
                    <div
                      class="text-body2 text-grey-8 q-mb-xs"
                      v-for="ingredient in info.ingredients"
                      :key="ingredient._id"
                    >
                      <div
                        class="row justify-between"
                        style="max-width: 400px; border-bottom: 1px dashed #eee"
                      >
                        <span>{{ ingredient.name }}</span>
                        <span class="text-weight-bold">{{ ingredient.quantity }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="col-12 col-md-4">
                    <q-card
                      v-if="info.nutrition && info.nutrition.length > 0"
                      flat
                      bordered
                      class="bg-grey-1"
                    >
                      <q-card-section>
                        <div class="text-subtitle1 text-weight-bold q-mb-sm text-primary">
                          <q-icon name="analytics" class="q-mr-xs" /> 營養標示 (每份)
                        </div>

                        <q-list dense separator class="text-grey-9">
                          <q-item>
                            <q-item-section>熱量</q-item-section>
                            <q-item-section side class="text-black text-weight-bolder">
                              {{ info.nutrition[0].calories }} kcal
                            </q-item-section>
                          </q-item>

                          <q-item>
                            <q-item-section>蛋白質</q-item-section>
                            <q-item-section side>
                              {{ info.nutrition[0].protein }} g
                            </q-item-section>
                          </q-item>

                          <q-item>
                            <q-item-section>脂肪</q-item-section>
                            <q-item-section side> {{ info.nutrition[0].fat }} g </q-item-section>
                          </q-item>

                          <q-item>
                            <q-item-section>總碳水化合物</q-item-section>
                            <q-item-section side> {{ info.nutrition[0].carbs }} g </q-item-section>
                          </q-item>

                          <q-item class="bg-green-1">
                            <q-item-section class="text-green-9 text-weight-bold"
                              >淨碳水</q-item-section
                            >
                            <q-item-section side class="text-green-9 text-weight-bold">
                              {{ info.nutrition[0].netCarbs }} g
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
                <div
                  class="text-h6 q-mt-lg q-mb-md"
                  v-for="(step, idx) in info.steps"
                  :key="step._id"
                >
                  {{ `步驟 ${idx + 1}` }}
                  <p>{{ step.description }}</p>
                  <img :src="step.imageUrl" style="max-width: 100%; height: auto" />
                </div>
              </div>

              <div class="absolute-full flex flex-center glass-overlay" v-if="isLocked">
                <q-card
                  class="text-center shadow-10 q-pa-lg"
                  style="max-width: 350px; border-radius: 16px"
                >
                  <q-icon
                    name="lock"
                    color="deep-orange"
                    size="40px"
                    class="bg-orange-1 q-pa-md rounded-borders q-mb-md"
                  />

                  <q-btn
                    unelevated
                    rounded
                    color="deep-orange"
                    size="lg"
                    class="full-width text-weight-bold"
                    no-caps
                    @click="handleUnlock"
                  >
                    <div class="row items-center" v-if="info">
                      <span>Unlock for {{ info.unlockPrice }} Points</span>
                      <q-icon name="monetization_on" class="q-ml-sm" />
                    </div>
                  </q-btn>
                </q-card>
              </div>
            </q-card>
          </div>

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

            <q-card
              flat
              bordered
              class="q-pa-md radius-12 bg-orange-1"
              style="border-color: transparent"
            >
              <div class="row items-center q-mb-md">
                <q-icon name="forum" color="deep-orange" size="sm" class="q-mr-sm" />
                <div class="text-h6 text-deep-orange-9">食譜留言板</div>
                <q-chip size="sm" color="deep-orange-2" text-color="deep-orange-9" class="q-ml-sm">
                  {{ comments.length }} 則評論
                </q-chip>
              </div>

              <q-scroll-area style="height: 250px; max-height: 50vh" class="q-mb-md q-pr-sm">
                <div v-if="comments.length === 0" class="text-center text-grey-7 q-pa-md">
                  目前還沒有留言，成為第一個評論的人吧！
                </div>

                <div v-for="(comment, index) in comments" :key="index" class="q-mb-md">
                  <div class="row items-center q-gutter-xs">
                    <q-rating
                      v-model="comment.rating"
                      size="1.2em"
                      color="orange"
                      readonly
                      icon="star"
                    />
                  </div>
                  <div class="text-body2 q-mt-xs text-grey-9">"{{ comment.content }}"</div>
                  <div class="row items-center justify-between q-mt-xs">
                    <div class="text-caption text-weight-bold text-deep-orange-8">
                      <span class="text-grey-6 text-weight-regular">{{
                        new Date(comment.createdAt).toLocaleDateString()
                      }}</span>
                    </div>
                    <div class="row items-center">
                      <q-btn
                        flat
                        round
                        dense
                        :icon="comment.likes.includes(user._id) ? 'favorite' : 'favorite_border'"
                        :color="comment.likes.includes(user._id) ? 'red' : 'grey-5'"
                        size="sm"
                        @click="handleToggleLike(comment)"
                      />
                      <span class="text-grey-6 text-caption q-ml-xs">{{
                        comment.likes.length
                      }}</span>
                    </div>
                  </div>

                  <q-separator v-if="index < comments.length - 1" class="q-my-sm bg-orange-2" />
                </div>
              </q-scroll-area>

              <q-separator class="q-mb-md bg-deep-orange-3" />

              <div class="bg-white q-pa-sm rounded-borders shadow-1">
                <div class="q-mb-sm">
                  <span class="text-caption text-grey">您的評分：</span>
                  <q-rating
                    v-model="newComment.rating"
                    size="sm"
                    color="orange"
                    icon="star"
                    icon-selected="star"
                  />
                </div>

                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-sm-12">
                    <q-input
                      v-model="newComment.content"
                      dense
                      outlined
                      color="deep-orange"
                      label="分享您的心得..."
                      type="textarea"
                      rows="1"
                      autogrow
                      bg-color="orange-1"
                    />
                  </div>
                </div>

                <q-btn
                  unelevated
                  color="deep-orange"
                  label="發佈留言"
                  icon="send"
                  class="full-width q-mt-sm"
                  :disable="!canSubmit"
                  @click="submit"
                />
              </div>
            </q-card>
          </div>
        </div>
      </div>
    </q-page>
  </q-page-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import serviceRecipe from '@/services/recipe'
import serviceUser from '@/services/user'
import serviceComment from '@/services/comment'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const user = useUserStore()
const info = ref({
  name: '',
  author: { account: '' },
  imageUrl: '',
  ingredient: [],
  steps: [],
  description: '',
  isUnlocked: true,
  unlockPrice: 0,
})
const unlocked = ref(false)
const $q = useQuasar()
const route = useRoute()
const comments = ref([])
const newComment = ref({
  content: '',
  rating: 0,
})
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

const getComment = async () => {
  try {
    const { data } = await serviceComment.getRecipeComment(route.params.id)
    comments.value = data.result
  } catch (error) {
    console.log(error)
    $q.notify({
      color: 'negative',
      message: '無法取得食譜留言資訊',
      icon: 'report_problem',
      position: 'bottom',
    })
  }
}

const handleToggleLike = async (comment) => {
  if (!user.isLoggedIn) {
    $q.notify({
      color: 'warning',
      message: '請先登入',
      icon: 'warning',
      position: 'bottom',
    })
    return
  }
  try {
    const { data } = await serviceComment.toggleLike(comment._id)
    if (data.isLiked) {
      comment.likes.push(user._id)
    } else {
      const idx = comment.likes.indexOf(user._id)
      if (idx > -1) {
        comment.likes.splice(idx, 1)
      }
    }
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

// 使用 computed，這樣當 content 改變時，canSubmit 才會自動變 true/false
const canSubmit = computed(() => {
  return newComment.value.content.trim().length > 0 && newComment.value.rating > 0
})

const submit = async () => {
  // 如果不能送出就擋掉
  if (!canSubmit.value) return

  try {
    // 傳送的資料 (route.params.id)
    const payload = {
      content: newComment.value.content,
      rating: newComment.value.rating,
      // 這是哪篇食譜 id
      recipe: route.params.id,
    }

    const { data } = await serviceComment.createComment(payload)
    comments.value.unshift(data.result)

    // 重置表單
    newComment.value.content = ''
    newComment.value.rating = 0

    $q.notify({
      color: 'positive',
      message: '留言成功',
      icon: 'check_circle',
      position: 'bottom',
    })
  } catch (error) {
    console.log(error)
    $q.notify({
      color: 'negative',
      message: '留言失敗，請稍後再試',
      icon: 'report_problem',
      position: 'bottom',
    })
  }
}

getRecipeInfo()
getComment()
</script>

<style lang="sass" scoped>

.radius-12
  border-radius: 12px

.hero-overlay
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)

// 處理模糊解鎖效果
.blurred-content
  filter: blur(8px)
  user-select: none
  opacity: 0.5
  pointer-events: none

.glass-overlay
  backdrop-filter: blur(20px)
  background: rgba(255, 255, 255, 0.4)
  z-index: 10;

.search-input
  width: 250px
  .q-field__control
    background: #f5f5f5
</style>
