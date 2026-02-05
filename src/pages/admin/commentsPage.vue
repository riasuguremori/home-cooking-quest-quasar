<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="row">
        <div class="col-12">
          <q-table :rows="comments" :columns="columns" row-key="_id" flat bordered :filter="filter">
            <template #top>
              <q-toolbar>
                <q-toolbar-title>留言管理</q-toolbar-title>
                <q-space />
                <q-input v-model="filter" dense debounce="500" placeholder="搜尋" color="primary">
                  <template #append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </q-toolbar>
            </template>
            <template #body-cell-actions="props">
              <q-td :props="props">
                <q-btn icon="delete" flat round @click="deleteComment(props.row)" />
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
import commentService from 'src/services/comment'

const $q = useQuasar()
const comments = ref([])
const filter = ref('')

const columns = [
  {
    name: 'content',
    label: '內容',
    field: 'content',
    align: 'left',
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
    label: '按讚人數',
    field: (row) => row.likes?.length || 0,
    align: 'right',
    sortable: true,
  },
  {
    name: 'recipe',
    label: '食譜留言',
    field: (row) => row.recipe?.name || '',
    align: 'left',
    sortable: true,
  },
  {
    name: 'article',
    label: '文章留言',
    field: (row) => row.article?.title || '',
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

const getComments = async () => {
  try {
    const { data } = await commentService.getAllComment()
    comments.value = data.result
  } catch (error) {
    console.log(error)
    $q.notify({ message: '取得留言失敗', color: 'negative' })
  }
}

const deleteComment = (comment) => {
  $q.dialog({
    title: '確認刪除',
    message: `你確定要刪除留言 "${comment.content}" 嗎？`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await commentService.deleteComment(comment._id)
      $q.notify({
        color: 'positive',
        message: '刪除成功',
      })
      getComments()
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

getComments()
</script>
