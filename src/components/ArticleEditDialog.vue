<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    persistent
  >
    <q-card style="min-width: 500px; max-width: 90vw" class="rounded-borders">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-weight-bold">{{ id ? '編輯文章' : '新增文章' }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="form.title"
            label="標題"
            outlined
            :rules="[(val) => !!val || '請輸入標題']"
          />

          <div
            v-if="form.image.length === 0 && form.existingImage && form.existingImage.length > 0"
            class="q-mb-sm"
          >
            <div class="text-caption text-grey">目前圖片</div>
            <q-img
              :src="form.existingImage"
              style="width: 200px; height: auto; margin-bottom: 10px; border-radius: 8px"
              fit="cover"
            />
          </div>
          <VueFileAgent
            ref="mainImageAgent"
            v-model="form.image"
            v-model:raw-model-value="form.rawImage"
            accept="image/png,image/jpeg,image/jpg"
            deletable
            :maxFiles="4"
            multiple
            max-size="1MB"
            help-text="選擇檔案或拖曳到這裡"
            :error-text="{
              type: '檔案格式不支援',
              size: '檔案大小不能超過 1MB',
            }"
          />

          <q-select
            v-model="form.category"
            :options="categoryOptions"
            option-label="label"
            option-value="label"
            emit-value
            map-options
            label="分類"
            outlined
            :rules="[(val) => !!val || '請選擇分類']"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <q-icon :name="scope.opt.icon" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-input
            v-model="form.content"
            type="textarea"
            label="內容"
            outlined
            rows="10"
            :rules="[(val) => !!val || '請輸入內容']"
          />

          <q-card-actions align="right" class="q-pa-md">
            <q-btn flat label="取消" color="negative" v-close-popup :disable="loading" />
            <q-btn type="submit" label="送出" color="primary" :loading="loading" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, useTemplateRef } from 'vue'
import { useQuasar } from 'quasar'
import articleService from '@/services/article'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  id: { type: String, default: '' },
  initialData: { type: Object, default: () => ({}) },
  categoryOptions: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue', 'saved'])

const $q = useQuasar()
const loading = ref(false)
const mainImageAgent = useTemplateRef('mainImageAgent')

const getEmptyForm = () => ({
  title: '',
  content: '',
  description: '',
  category: '',
  image: [],
  rawImage: [],
  existingImage: null,
})
const form = ref(getEmptyForm())

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      if (props.id && props.initialData) {
        const tempForm = JSON.parse(JSON.stringify(props.initialData))
        form.value = { ...tempForm, image: [], existingImage: props.initialData.imageUrl }
      } else {
        form.value = getEmptyForm()
      }
      setTimeout(() => {
        if (mainImageAgent.value) mainImageAgent.value.deleteFileRecord()
      }, 100)
    }
  },
)

const onSubmit = async () => {
  if (form.value.image.some((file) => file.error))
    return $q.notify({ message: '主圖片格式不符或檔案過大', color: 'negative' })
  if (!props.id && form.value.image.length === 0)
    return $q.notify({ message: '請上傳主圖片', color: 'negative' })

  const fd = new FormData()
  fd.append('title', form.value.title)
  fd.append('content', form.value.content)
  fd.append('category', form.value.category)
  if (form.value.image.length > 0)
    form.value.image.forEach((image) => fd.append('image', image.file))

  try {
    loading.value = true
    await (props.id ? articleService.updateArticle(props.id, fd) : articleService.createArticle(fd))
    $q.notify({
      message: props.id ? '文章更新成功' : '文章發布成功',
      color: 'positive',
      icon: 'check_circle',
    })
    emit('saved')
    emit('update:modelValue', false)
  } catch (error) {
    console.log(error)
    $q.notify({
      color: 'negative',
      message: '發布失敗',
      icon: 'report_problem',
      position: 'bottom',
    })
  } finally {
    loading.value = false
  }
}
</script>
