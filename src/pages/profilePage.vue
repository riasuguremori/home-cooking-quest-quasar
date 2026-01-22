<template>
  <q-page-container>
    <q-page class="row justify-center q-pa-md">
      <div class="col-12" style="max-width: 1200px">
        <div class="q-my-lg">
          <h1 class="text-h4 text-weight-bolder q-mb-xs">歡迎回來 {{ profile.account }}</h1>
        </div>

        <div class="row q-col-gutter-md q-mb-xl">
          <div class="col-12 col-md-4">
            <q-card flat class="stat-card q-pa-sm">
              <q-card-section>
                <div class="row justify-between items-start">
                  <q-avatar
                    color="orange-1"
                    text-color="orange-9"
                    icon="account_balance_wallet"
                    size="50px"
                    font-size="28px"
                    rounded
                  />
                  <q-icon name="trending_up" color="grey-4" size="md" />
                </div>
                <div class="text-overline text-grey-7 q-mt-md">TOTAL POINTS</div>
                <div class="text-h4 text-weight-bolder">
                  {{ profile.points?.totalEarned || 0 }}
                  <span class="text-subtitle1 text-grey text-weight-normal">pts</span>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <q-card flat class="stat-card q-pa-sm">
              <q-card-section>
                <div class="row justify-between items-start">
                  <q-avatar
                    color="green-1"
                    text-color="green-8"
                    icon="soup_kitchen"
                    size="50px"
                    font-size="28px"
                    rounded
                  />
                  <q-icon name="check_circle" color="green-2" size="md" />
                </div>
                <div class="text-overline text-grey-7 q-mt-md">收藏食譜數</div>
                <div class="text-h4 text-weight-bolder">
                  {{ profile.savedRecipes?.length || 0 }}
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <q-card flat class="stat-card q-pa-sm">
              <q-card-section>
                <div class="row justify-between items-start">
                  <q-avatar
                    color="blue-1"
                    text-color="blue-8"
                    icon="menu_book"
                    size="50px"
                    font-size="28px"
                    rounded
                  />
                  <q-icon name="lock_open" color="blue-2" size="md" />
                </div>
                <div class="text-overline text-grey-7 q-mt-md">解鎖食譜數</div>
                <div class="text-h4 text-weight-bolder">
                  {{ profile.unlockedRecipes?.length || 0 }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

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
                <q-table
                  flat
                  :rows="profile.pointLog || []"
                  :columns="columns"
                  row-key="_id"
                  v-model:pagination="pagination"
                  no-data-label="No history available."
                  separator="horizontal"
                >
                  <template v-slot:body-cell-type="props">
                    <q-td :props="props" auto-width>
                      <q-avatar
                        :color="getIconStyle(props.row.type).bgColor"
                        :text-color="getIconStyle(props.row.type).textColor"
                        :icon="getIconStyle(props.row.type).icon"
                        size="md"
                      />
                    </q-td>
                  </template>

                  <template v-slot:body-cell-info="props">
                    <q-td :props="props">
                      <div class="text-weight-bold">{{ props.row.title }}</div>
                      <div class="text-caption text-grey-7">
                        {{ props.row.description }}
                      </div>
                    </q-td>
                  </template>

                  <template v-slot:body-cell-date="props">
                    <q-td :props="props">
                      {{ props.value }}
                    </q-td>
                  </template>

                  <template v-slot:body-cell-amount="props">
                    <q-td :props="props">
                      <div
                        class="text-h6 text-weight-bold"
                        :class="props.row.type === '獲得' ? 'text-green' : 'text-deep-orange'"
                      >
                        {{ props.row.type === '獲得' ? '+' : '-' }}{{ props.row.amount }}
                      </div>
                    </q-td>
                  </template>

                  <template v-slot:no-data>
                    <div class="full-width row flex-center q-pa-lg text-grey">
                      No history available.
                    </div>
                  </template>
                </q-table>
              </q-tab-panel>

              <q-tab-panel name="savedRecipes" class="q-pa-none">
                <div
                  v-if="profile.savedRecipes && profile.savedRecipes.length > 0"
                  class="row q-col-gutter-md q-pa-md"
                >
                  <div
                    class="col-12 col-sm-6 col-md-4"
                    v-for="recipe in profile.savedRecipes"
                    :key="recipe._id"
                  >
                    <q-card
                      class="cursor-pointer hover-card full-height column"
                      @click="goToRecipe(recipe._id)"
                      flat
                      bordered
                    >
                      <q-img :src="recipe.imageUrl" :ratio="16 / 9" style="height: 180px" />
                      <q-card-section>
                        <div class="text-subtitle1 text-weight-bold ellipsis">
                          {{ recipe.name }}
                        </div>
                        <div
                          class="text-caption text-grey ellipsis-2-lines"
                          v-html="recipe.description"
                        ></div>
                      </q-card-section>
                      <q-card-section class="q-pt-none">
                        <div class="row items-center justify-end text-grey text-caption">
                          <q-icon name="visibility" class="q-mr-xs" />
                          {{ recipe.views || 0 }}
                        </div>
                      </q-card-section>
                    </q-card>
                    <q-space />
                  </div>
                </div>
                <div v-else class="text-center q-pa-xl text-grey">
                  <q-icon name="bookmark_border" size="64px" class="q-mb-md" />
                  <div class="text-h6">尚未收藏任何食譜</div>
                  <q-btn
                    to="/recipes"
                    label="去探索食譜"
                    color="deep-orange"
                    flat
                    class="q-mt-sm"
                  />
                </div>
              </q-tab-panel>

              <q-tab-panel name="unlockedRecipes" class="q-pa-none">
                <div
                  v-if="profile.unlockedRecipes && profile.unlockedRecipes.length > 0"
                  class="row q-col-gutter-md q-pa-md"
                >
                  <div
                    class="col-12 col-sm-6 col-md-4"
                    v-for="recipe in profile.unlockedRecipes"
                    :key="recipe._id"
                  >
                    <q-card
                      class="cursor-pointer hover-card full-height column"
                      @click="goToRecipe(recipe._id)"
                      flat
                      bordered
                    >
                      <q-img :src="recipe.imageUrl" :ratio="16 / 9" style="height: 180px" />
                      <q-card-section>
                        <div class="text-subtitle1 text-weight-bold ellipsis">
                          {{ recipe.name }}
                        </div>
                        <div
                          class="text-caption text-grey ellipsis-2-lines"
                          v-html="recipe.description"
                        ></div>
                      </q-card-section>
                      <q-card-section class="q-pt-none">
                        <div class="row items-center justify-end text-grey text-caption">
                          <q-icon name="visibility" class="q-mr-xs" />
                          {{ recipe.views || 0 }}
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
                <div v-else class="text-center q-pa-xl text-grey">
                  <q-icon name="lock_open" size="64px" class="q-mb-md" />
                  <div class="text-h6">尚未解鎖任何食譜</div>
                  <q-btn
                    to="/recipes"
                    label="去探索食譜"
                    color="deep-orange"
                    flat
                    class="q-mt-sm"
                  />
                </div>
              </q-tab-panel>

              <q-tab-panel name="myRecipes" class="q-pa-none">
                <div v-if="my && my.length > 0" class="row q-col-gutter-md q-pa-md">
                  <div class="col-12 col-sm-6 col-md-4" v-for="m in my" :key="m._id">
                    <q-card
                      class="cursor-pointer hover-card full-height column"
                      @click="goToRecipe(m._id)"
                      flat
                      bordered
                    >
                      <q-img :src="m.imageUrl" :ratio="16 / 9" style="height: 180px" />
                      <q-card-section>
                        <div class="text-subtitle1 text-weight-bold ellipsis">
                          {{ m.name }}
                        </div>
                        <div
                          class="text-caption text-grey ellipsis-2-lines"
                          v-html="m.description"
                        ></div>
                      </q-card-section>
                      <q-card-section class="q-pt-none">
                        <div class="row items-center justify-end text-grey text-caption">
                          <q-icon name="visibility" class="q-mr-xs" />
                          {{ m.views || 0 }}
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
                <div v-else class="text-center q-pa-xl text-grey">
                  <q-icon name="lock_open" size="64px" class="q-mb-md" />
                  <div class="text-h6">尚未新增任何食譜</div>
                  <q-btn
                    to="/recipes"
                    label="去探索食譜"
                    color="deep-orange"
                    flat
                    class="q-mt-sm"
                  />
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
      </div>
    </q-page>
  </q-page-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar, date } from 'quasar'
import userService from '@/services/user'
import recipeService from '@/services/recipe'

const router = useRouter()
const $q = useQuasar()
const profile = ref({})
const my = ref([])

// 當前選中的 Tab
const currentTab = ref('logs')

const tabs = computed(() => [
  { title: '我的食譜', name: 'myRecipes' },
  { title: '收藏食譜', name: 'savedRecipes' },
  { title: '解鎖食譜', name: 'unlockedRecipes' },
  { title: '積分紀錄', name: 'logs' },
])

const iconStyles = {
  獲得: { icon: 'check_circle', bgColor: 'green-1', textColor: 'green' },
  消耗: { icon: 'lock_open', bgColor: 'orange-1', textColor: 'deep-orange' },
  default: { icon: 'info', bgColor: 'grey-1', textColor: 'grey' },
}

const getIconStyle = (type) => iconStyles[type] || iconStyles.default

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

// 日期格式化 Helper
const formatLogDate = (timestamp) => {
  if (!timestamp) return ''

  const logDate = new Date(timestamp)
  const today = new Date()
  const yesterday = date.subtractFromDate(today, { days: 1 })
  const timeStr = date.formatDate(logDate, 'hh:mm A')

  if (date.isSameDate(logDate, today, 'day')) {
    return `Today, ${timeStr}`
  } else if (date.isSameDate(logDate, yesterday, 'day')) {
    return `Yesterday, ${timeStr}`
  } else {
    return date.formatDate(logDate, 'MMM DD, YYYY, hh:mm A')
  }
}

// 表格欄位設定
const columns = [
  {
    name: 'type',
    label: '',
    align: 'left',
    field: 'type',
    style: 'width: 50px',
  },
  {
    name: 'info',
    label: 'Details',
    align: 'left',
    field: (row) => `${row.title} ${row.description}`,
    sortable: false,
  },
  {
    name: 'date',
    label: 'Date',
    align: 'right',
    field: 'createdAt',
    sortable: true,
    format: (val) => formatLogDate(val),
  },
  {
    name: 'amount',
    label: 'Points',
    align: 'right',
    field: 'amount',
    sortable: true,
  },
]

// 分頁設定
const pagination = ref({
  sortBy: 'date',
  descending: true,
  page: 1,
  rowsPerPage: 10,
})
</script>

<style lang="sass" scoped>
// 卡片與主內容的樣式
.stat-card
  border: 1px solid #f0f0f0
  border-radius: 12px
  transition: transform 0.2s
  &:hover
    transform: translateY(-2px)
    box-shadow: 0 4px 12px rgba(0,0,0,0.05)

.hover-card
  transition: all 0.3s ease
  &:hover
    transform: translateY(-5px)
    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important

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
