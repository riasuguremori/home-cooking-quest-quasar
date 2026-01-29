<template>
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
</template>

<script setup>
import { ref, useTemplateRef, computed } from 'vue'
import { useQuasar } from 'quasar'
import recipeService from '@/services/recipe'
import { useUserStore } from '@/stores/user'

const emit = defineEmits(['saved'])

const $q = useQuasar()
const user = useUserStore()
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
  existingImage: null,
  rating: 0,
  nutrition: [{ calories: 0, protein: 0, fat: 0, carbs: 0, netCarbs: 0 }],
})

const form = ref(getEmptyForm())

const categoryOptions = ['中式', '日式', '西式', '甜點', '其他']
const statusOptions = computed(() => {
  const options = ['草稿', '發佈']
  if (user.isAdmin) {
    options.push('隱藏')
  }
  return options
})

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

const open = (recipe) => {
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
    form.value = {
      ...tempForm,
      image: [],
      existingImage: recipe.imageUrl,
      nutrition:
        recipe.nutrition && recipe.nutrition.length > 0
          ? recipe.nutrition
          : [{ calories: 0, protein: 0, fat: 0, carbs: 0, netCarbs: 0 }],
      steps: recipe.steps.map((s) => ({
        description: s.description,
        image: s.imageUrl,
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

  let fileIndex = 0

  const stepsPayload = form.value.steps.map((step) => {
    const hasNewFile = step.files.length > 0 && step.files[0].file
    const idx = hasNewFile ? fileIndex++ : -1

    return {
      description: step.description,
      image: step.image || null,
      fileIndex: idx,
    }
  })

  fd.append('steps', JSON.stringify(stepsPayload))
  if (form.value.image.length > 0) {
    fd.append('image', form.value.image[0].file)
  }

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
      const { data } = await recipeService.createRecipe(fd)
      if (data.recipe) user.pointLog.push(data.recipe)
      $q.notify({ message: '新增成功', color: 'positive' })
    }
    closeDialog()
    emit('saved')
  } catch (error) {
    console.log(error)
    const message = error?.response?.data?.message || '發生錯誤'
    $q.notify({ message, color: 'negative' })
  } finally {
    loading.value = false
  }
}

defineExpose({
  open,
})
</script>
