<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="row">
        <div class="col-12">
          <q-table :rows="recipes" :columns="columns" row-key="_id" flat bordered :filter="filter">
            <template #top>
              <q-toolbar>
                <q-toolbar-title>食譜管理</q-toolbar-title>
                <q-space />
                <q-input v-model="filter" dense debounce="500" placeholder="搜尋" color="primary">
                  <template #append>
                    <q-icon name="search" />
                  </template>
                </q-input>
                <q-btn
                  color="primary"
                  icon="add"
                  label="新增食譜"
                  @click="openDialog(null)"
                  class="q-ml-md"
                />
              </q-toolbar>
            </template>
            <template #body-cell-image="props">
              <q-td :props="props">
                <q-img :src="props.value" style="width: 100px; height: auto" />
              </q-td>
            </template>
            <template #body-cell-actions="props">
              <q-td :props="props">
                <q-btn icon="edit" flat round @click="openDialog(props.row)" />
              </q-td>
            </template>
          </q-table>
        </div>
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

            <div class="row items-center q-mt-md">
              <div class="text-subtitle1 q-mr-md">難易度</div>
              <q-rating
                v-model="form.rating"
                max="5"
                size="2em"
                color="orange"
                icon="star_border"
                icon-selected="star"
              />
            </div>

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
  </q-page>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'
import { useQuasar } from 'quasar'
import recipeService from '@/services/recipe'

const $q = useQuasar()
const recipes = ref([])
const filter = ref('')
const loading = ref(false)
const mainImageAgent = useTemplateRef('mainImageAgent')

const dialog = ref({
  open: false,
  id: '',
})

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
  rating: 0,
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

const columns = [
  { name: 'image', label: '圖片', field: 'imageUrl', align: 'left' },
  { name: 'name', label: '食譜名字', field: 'name', align: 'left', sortable: true },
  { name: 'category', label: '分類', field: 'category', align: 'left', sortable: true },
  { name: 'unlockPrice', label: '解鎖積分', field: 'unlockPrice', align: 'right', sortable: true },
  {
    name: 'status',
    label: '食譜狀態',
    field: 'status',
    format: (val) => val || '未知',
    align: 'left',
    sortable: true,
  },
  {
    name: 'author',
    label: '作者',
    field: (row) => row.author.account,
    align: 'left',
    sortable: true,
  },
  {
    name: 'createdAt',
    label: '創建日期',
    field: 'createdAt',
    format: (val) => new Date(val).toLocaleString(),
    align: 'left',
    sortable: true,
  },
  { name: 'actions', label: '操作', align: 'center' },
]

const getRecipes = async () => {
  try {
    const { data } = await recipeService.getAllRecipes()
    recipes.value = data.result
  } catch {
    $q.notify({ message: '取得食譜失敗', color: 'negative' })
  }
}

const openDialog = (recipe) => {
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
    'rating',
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
    getRecipes()
  } catch (error) {
    console.log(error)
    const message = error?.response?.data?.message || '發生錯誤'
    $q.notify({ message, color: 'negative' })
  } finally {
    loading.value = false
  }
}

getRecipes()
</script>
