<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="row">
        <div class="col-12">
          <q-table :rows="articles" :columns="columns" row-key="_id" flat bordered :filter="filter">
            <template #top>
              <q-toolbar>
                <q-toolbar-title>文章管理</q-toolbar-title>
                <q-space />
                <q-input v-model="filter" dense debounce="500" placeholder="搜尋" color="primary">
                  <template #append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </q-toolbar>
            </template>
            <template #body-cell-image="props">
              <q-td :props="props">
                <q-img
                  v-if="props.row.imageUrl && props.row.imageUrl.length > 0"
                  :src="props.row.imageUrl[0]"
                  style="width: 100px; height: 60px; border-radius: 8px; object-fit: cover"
                />
              </q-td>
            </template>
            <template #body-cell-content="props">
              <q-td :props="props" style="max-width: 300px">
                <div class="ellipsis">{{ props.row.content }}</div>
                <q-tooltip>{{ props.row.content }}</q-tooltip>
              </q-td>
            </template>
            <template #body-cell-actions="props">
              <q-td :props="props">
                <q-btn icon="delete" flat round @click="deleteArticle(props.row)" />
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import articleService from 'src/services/article'

const $q = useQuasar()
const articles = ref([])
const filter = ref('')

const columns = [
  {
    name: 'image',
    label: '圖片',
    field: 'image',
    align: 'left',
  },
  { name: 'title', label: '標題', field: 'title', align: 'left' },
  {
    name: 'content',
    label: '內容',
    field: 'content',
    align: 'left',
  },
  {
    name: 'category',
    label: '分類',
    field: 'category',
    format: (val) => val || '未知',
    align: 'left',
    sortable: true,
  },
  {
    name: 'author',
    label: '發文者',
    field: (row) => row.author.account,
    align: 'left',
    sortable: true,
  },
  {
    name: 'likes',
    label: '追蹤人數',
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

const getArticles = async () => {
  try {
    const { data } = await articleService.getAllArticle()
    articles.value = data.result
  } catch (error) {
    console.log(error)
    $q.notify({ message: '取得文章失敗', color: 'negative' })
  }
}

const deleteArticle = async (article) => {
  $q.dialog({
    title: '確認刪除',
    message: `你確定要刪除文章 "${article.title}" 嗎？`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await articleService.deleteArticle(article._id)
      $q.notify({
        color: 'positive',
        message: '刪除成功',
      })
    } catch (error) {
      console.log(error)
      const message = error?.response?.data?.message || '發生錯誤'
      $q.notify({
        color: 'negative',
        message,
      })
    }
  })
}

getArticles()
</script>
