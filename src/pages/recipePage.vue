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
        <q-btn
          color="primary"
          icon="add"
          label="新增食譜"
          rounded
          unelevated
          @click="openDialog(null)"
        />
      </div>
    </div>
    <q-dialog v-model="dialog.open" persistent>
      <q-card style="min-width: 80vw; max-width: 80vw">
        <q-form @submit.prevent="submit">
          <q-card-section>
            <div class="text-h6">{{ dialog.id ? '編輯食譜' : '新增食譜' }}</div>
          </q-card-section>

          <q-card-section class="q-gutter-md">
            <q-input
              v-model="form.name"
              label="食譜名稱"
              :rules="[(val) => !!val || '請輸入食譜名稱']"
            />

            <div class="text-h6 q-mt-lg">封面</div>
            <q-img
              v-if="form.image.length === 0 && form.existingImage"
              :src="form.existingImage"
              style="width: 200px; height: auto; margin-bottom: 10px; border-radius: 8px"
            />
            <VueFileAgent
              ref="mainImageAgent"
              v-model="form.image"
              v-model:raw-model-value="form.rawImage"
              accept="image/png,image/jpeg,image/jpg"
              deletable
              :max-files="1"
              max-size="1MB"
              help-text="選擇檔案或拖曳到這裡"
              :error-text="{
                type: '檔案格式不支援',
                size: '檔案大小不能超過 1MB',
              }"
            />

            <q-editor v-model="form.description" min-height="10rem" placeholder="食譜說明" />

            <div class="q-py-md">
              <div class="text-h6 q-mb-sm">食材內容</div>

              <div
                v-for="(ingredient, idx) in form.ingredients"
                :key="idx"
                class="row q-col-gutter-sm q-mb-md items-start"
              >
                <div class="col">
                  <q-input
                    v-model="ingredient.name"
                    :rules="[(val) => !!val || '請輸入食材名稱']"
                    filled
                    label="食材名稱"
                    dense
                  />
                </div>

                <div class="col">
                  <q-input
                    v-model="ingredient.quantity"
                    :rules="[(val) => !!val || '請輸入食材份量']"
                    filled
                    label="食材份量"
                    dense
                  />
                </div>

                <div class="col-auto" v-if="form.ingredients.length > 1">
                  <q-btn
                    icon="delete"
                    flat
                    round
                    color="negative"
                    class="q-mt-xs"
                    @click="removeIngredient(idx)"
                  />
                </div>
              </div>

              <div class="col-auto">
                <q-btn
                  label="新增食材"
                  icon="add"
                  color="primary"
                  outline
                  class="full-width"
                  @click="addIngredient"
                />
              </div>
            </div>

            <div class="q-py-md">
              <div class="text-h6 q-mb-sm">營養標示</div>

              <div
                v-for="(nu, idx) in form.nutrition"
                :key="idx"
                class="row q-col-gutter-sm q-mb-md items-start"
              >
                <div class="col">
                  <q-input
                    v-model="nu.calories"
                    :rules="[(val) => !!val || '請輸入熱量']"
                    filled
                    label="熱量"
                    dense
                  />
                </div>
                <div class="col">
                  <q-input
                    v-model="nu.protein"
                    :rules="[(val) => !!val || '請輸入蛋白質']"
                    filled
                    label="蛋白質"
                    dense
                  />
                </div>
                <div class="col">
                  <q-input
                    v-model="nu.fat"
                    :rules="[(val) => !!val || '請輸入脂肪']"
                    filled
                    label="脂肪"
                    dense
                  />
                </div>
                <div class="col">
                  <q-input
                    v-model="nu.carbs"
                    :rules="[(val) => !!val || '請輸入碳水化合物']"
                    filled
                    label="碳水化合物"
                    dense
                  />
                </div>
                <div class="col">
                  <q-input
                    v-model="nu.netCarbs"
                    :rules="[(val) => !!val || '請輸入淨碳水']"
                    filled
                    label="淨碳水"
                    dense
                  />
                </div>
              </div>
            </div>

            <!-- DYNAMIC STEPS -->
            <div class="q-py-md">
              <div class="text-h6 q-mb-sm">步驟</div>
              <div v-for="(step, index) in form.steps" :key="index">
                <q-img
                  v-if="step.files.length === 0 && step.image"
                  :src="step.image"
                  style="width: 100px; margin-bottom: 5px"
                />
                <div class="row items-center q-mb-sm">
                  <div class="col-auto text-subtitle1">步驟 {{ index + 1 }}</div>
                  <q-space />
                  <q-btn
                    v-if="form.steps.length > 1"
                    icon="delete"
                    flat
                    round
                    color="negative"
                    @click="removeStep(index)"
                  />
                </div>
                <q-input
                  v-model="step.description"
                  type="textarea"
                  label="步驟說明"
                  :rules="[(val) => !!val || '請輸入步驟說明']"
                  filled
                  class="q-mb-sm"
                />
                <VueFileAgent
                  v-model="step.files"
                  v-model:raw-model-value="step.rawFiles"
                  accept="image/png,image/jpeg,image/jpg"
                  deletable
                  :max-files="50"
                  multiple
                  max-size="1MB"
                  help-text="選擇此步驟的圖片 (可選)"
                  :error-text="{ type: '檔案格式不支援', size: '檔案大小不能超過 1MB' }"
                />
              </div>
              <q-btn label="新增步驟" @click="addStep" color="primary" class="q-mt-md" />
            </div>

            <q-select
              v-model="form.category"
              :options="categoryOptions"
              label="分類"
              :rules="[(val) => !!val || '請選擇分類']"
            />
            <q-input
              v-model.number="form.unlockPrice"
              type="number"
              label="解鎖積分"
              :rules="[(val) => val >= 0 || '積分不能小於 0']"
            />
            <q-select
              v-model="form.status"
              :options="statusOptions"
              label="狀態"
              emit-value
              map-options
              :rules="[(val) => val !== null || '請選擇狀態']"
            />
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md">
            <q-btn flat label="取消" color="negative" @click="closeDialog" :disable="loading" />
            <q-btn type="submit" label="儲存" color="primary" :loading="loading" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

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
        <q-card
          class="rounded-xl no-shadow full-height column relative-position overflow-hidden hover-card bg-white cursor-pointer"
          @click="getRecipeInfo(filter._id)"
        >
          <q-img :src="filter.imageUrl" :ratio="4 / 3" class="col-grow">
            <div v-if="filter.badge" class="absolute-top-left q-pa-none bg-transparent">
              <q-chip
                :color="filter.badgeColor"
                text-color="white"
                size="sm"
                class="q-ma-md text-weight-bold text-uppercase shadow-2"
                v-if="filter.isOfficial"
                >{{ filter.badge }}
              </q-chip>
            </div>
            <div v-if="filter.badge" class="absolute-top-right q-pa-none bg-transparent">
              <q-chip
                :color="filter.badgeColor"
                text-color="white"
                size="sm"
                class="q-ma-md text-weight-bold text-uppercase shadow-2"
                v-if="filter.isUnlocked"
                >{{ filter.free }}</q-chip
              >
            </div>
          </q-img>

          <q-card-section class="q-pa-md">
            <div class="text-h6 text-weight-bold q-mb-xs ellipsis text-grey-9">
              {{ filter.name }}
            </div>

            <div class="row items-center q-gutter-x-md text-grey-6 text-caption q-mb-md">
              <div class="row items-center">
                <q-icon name="schedule" class="q-mr-xs text-orange-8" />
                {{ filter.timeAgo }}
              </div>
            </div>

            <div class="row items-center q-gutter-x-md text-grey-6 text-caption q-mb-md">
              <div class="row items-center">
                {{ `瀏覽數：${filter.views}` }}
              </div>
            </div>

            <q-separator class="q-mb-md bg-grey-2" />

            <div class="row items-center justify-between" :class="{ 'opacity-50': filter.locked }">
              <div class="row items-center">
                <q-avatar size="28px" class="q-mr-sm shadow-1">
                  <img :src="`https://api.dicebear.com/9.x/thumbs/svg?seed=${user.account}`" />
                </q-avatar>
                <span class="text-weight-medium text-caption text-grey-8">{{
                  filter.author?.account || '匿名'
                }}</span>
              </div>
              <q-btn
                flat
                round
                color="primary"
                icon="arrow_forward"
                size="sm"
                class="bg-orange-1"
              />
            </div>
          </q-card-section>
        </q-card>
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
import { ref, computed, useTemplateRef } from 'vue'
import recipeService from '@/services/recipe'
import { useQuasar } from 'quasar'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const search = ref('')
const activeCategory = ref('All')
const recipes = ref([])
const user = useUserStore()
const router = useRouter()

const $q = useQuasar()
const mainImageAgent = useTemplateRef('mainImageAgent')
const dialog = ref({
  open: false,
  id: '',
})

const loading = ref(false)

const getEmptyForm = () => ({
  name: '',
  description: '',
  ingredients: [{ name: '', quantity: '' }],
  steps: [{ description: '', files: [], rawFiles: [] }],
  category: '',
  unlockPrice: 0,
  status: '發佈',
  image: [],
  rawImage: [],
  existingImage: null, // 用來存舊圖網址顯示用
  nutrition: [{ calories: 0, protein: 0, fat: 0, carbs: 0, netCarbs: 0 }],
})

const form = ref(getEmptyForm())

const categoryOptions = ['中式', '日式', '西式', '甜點', '其他']
const statusOptions = ['草稿', '發佈', '隱藏']

const addIngredient = () => {
  form.value.ingredients.push({ name: '', quantity: '' })
}
const removeIngredient = (index) => {
  form.value.ingredients.splice(index, 1)
}

const addStep = () => {
  form.value.steps.push({ description: '', files: [], rawFiles: [] })
}

const removeStep = (index) => {
  form.value.steps.splice(index, 1)
}

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

const openDialog = (recipe) => {
  if (!user.isLoggedIn) {
    $q.notify({
      color: 'warning',
      message: '請先登入',
      icon: 'warning',
      position: 'bottom',
    })
    return
  }
  dialog.value.open = true
  if (recipe) {
    dialog.value.id = recipe._id

    const tempForm = JSON.parse(JSON.stringify(recipe))

    // 設定表單資料
    form.value = {
      ...tempForm,
      // 主圖：image 設為空陣列供上傳用，existingImage 存網址
      image: [],
      existingImage: recipe.imageUrl,
      nutrition:
        recipe.nutrition && recipe.nutrition.length > 0
          ? recipe.nutrition
          : [{ calories: 0, protein: 0, fat: 0, carbs: 0, netCarbs: 0 }],

      // 步驟：同樣邏輯，把 image 欄位留著顯示，files 用來上傳
      steps: recipe.steps.map((s) => ({
        description: s.description,
        image: s.imageUrl, // 舊圖網址 (在 v-for 裡可以用 <q-img v-if="!step.files.length" :src="step.image"> 顯示)
        files: [],
        rawFiles: [],
      })),
    }
  } else {
    dialog.value.id = ''
    form.value = getEmptyForm()
  }

  if (mainImageAgent.value) {
    mainImageAgent.value.deleteFileRecord()
  }
}

const closeDialog = () => {
  dialog.value.open = false
}

const submit = async () => {
  if (form.value.image.some((file) => file.error)) {
    $q.notify({ message: '主圖片格式不符或檔案過大', color: 'negative' })
    return
  }

  if (!dialog.value.id && form.value.image.length === 0) {
    $q.notify({ message: '請上傳主圖片', color: 'negative' })
    return
  }

  for (let i = 0; i < form.value.steps.length; i++) {
    const step = form.value.steps[i]
    if (!step.description.trim()) {
      $q.notify({ message: `步驟 ${i + 1} 請輸入說明`, color: 'negative' })
      return
    }
    if (step.files.some((file) => file.error)) {
      $q.notify({ message: `步驟 ${i + 1} 的圖片格式不符或檔案過大`, color: 'negative' })
      return
    }
  }

  const fd = new FormData()

  const formKeys = [
    'name',
    'description',
    'ingredients',
    'nutrition',
    'category',
    'unlockPrice',
    'status',
  ]
  formKeys.forEach((key) => {
    if (key === 'ingredients' || key === 'nutrition') {
      fd.append(key, JSON.stringify(form.value[key]))
    } else fd.append(key, form.value[key])
  })

  // 處理步驟與圖片對應
  let fileIndex = 0 // 用來計數實際上有上傳檔案的順序

  const stepsPayload = form.value.steps.map((step) => {
    // 判斷這個步驟是否有新檔案
    const hasNewFile = step.files.length > 0 && step.files[0].file

    // 如果有新檔案，標記它對應到 req.files 陣列中的第幾個
    // 如果沒有新檔案，標記為 -1
    const idx = hasNewFile ? fileIndex++ : -1

    return {
      description: step.description,
      image: step.image || null, // 保留舊圖網址
      fileIndex: idx, // 告訴後端：如果有傳檔，去 files 陣列抓第 idx 個
    }
  })

  fd.append('steps', JSON.stringify(stepsPayload))
  if (form.value.image.length > 0) {
    fd.append('image', form.value.image[0].file)
  }

  // 實際 Append 檔案
  form.value.steps.forEach((step) => {
    if (step.files.length > 0 && step.files[0].file) {
      fd.append('stepImages', step.files[0].file)
    }
  })

  try {
    loading.value = true
    if (dialog.value.id) {
      await recipeService.updateRecipe(dialog.value.id, fd)
      $q.notify({ message: '更新成功', color: 'positive' })
    } else {
      await recipeService.createRecipe(fd)
      $q.notify({ message: '新增成功', color: 'positive' })
    }
    closeDialog()
    getRecipe()
  } catch (error) {
    console.log(error)
    const message = error?.response?.data?.message || '發生錯誤'
    $q.notify({ message, color: 'negative' })
  } finally {
    loading.value = false
  }
}

// 分類數據
const categories = [
  { label: '中式', icon: 'dinner_dining' },
  { label: '日式', icon: 'ramen_dining' },
  { label: '西式', icon: 'restaurant' },
  { label: '甜點', icon: 'icecream' },
  { label: '其他', icon: 'category' },
]

const formatTimeAgo = (value) => {
  if (!value) return ''
  const date = new Date(value)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)
  if (seconds < 60) return '剛剛'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} 分鐘前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} 小時前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} 天前`
  return date.toLocaleDateString()
}

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
  return recipes.value
    .filter((recipe) => {
      // 搜尋字串篩選 (不分大小寫)
      const matchesSearch = recipe.name.toLowerCase().includes(search.value.toLowerCase())

      // 2. 分類篩選
      const matchesCategory =
        activeCategory.value === 'All' || recipe.category === activeCategory.value

      return matchesSearch && matchesCategory
    })
    .map((recipe) => ({
      ...recipe,
      badge: recipe.isOfficial ? '官方推薦' : '',
      free: recipe.isUnlocked ? 'Free' : '',
      badgeColor: recipe.badgeColor || 'positive',
      timeAgo: formatTimeAgo(recipe.createdAt),
    }))
})
</script>

<style lang="scss" scoped>
.search-input .q-field__control {
  border-radius: 28px !important;
}

/* 卡片懸浮效果 */
.hover-card {
  transition: all 0.3s ease;
  border: 1px solid transparent;
}
.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08) !important;
}

/* 鎖定遮罩模糊效果 */
.bg-dark-blur {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

/* 按鈕過渡動畫 */
.transition-btn {
  transition: all 0.3s ease;
}

/* 鎖定狀態下，底部內容稍微透明 */
.opacity-50 {
  opacity: 0.5;
}
</style>
