<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="(val) => $emit('update:modelValue', val)"
  >
    <q-card style="min-width: 500px; max-width: 90vw" class="rounded-borders">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-weight-bold">留言</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section style="max-height: 60vh" class="scroll">
        <div v-if="loading" class="row justify-center q-pa-md">
          <q-spinner color="deep-orange" size="2em" />
        </div>
        <div v-else-if="comments.length === 0" class="text-center text-grey q-pa-md">
          尚未有留言，成為第一個留言的人吧！
        </div>
        <q-list v-else separator>
          <q-item v-for="comment in comments" :key="comment._id">
            <q-item-section avatar top>
              <q-avatar size="md">
                <img
                  :src="`https://api.dicebear.com/9.x/thumbs/svg?seed=${comment.author?.account}`"
                />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">{{
                comment.author?.account || '匿名'
              }}</q-item-label>
              <q-item-label caption>{{
                new Date(comment.createdAt).toLocaleString()
              }}</q-item-label>
              <q-item-label class="q-mt-xs text-body2 text-grey-9">{{
                comment.content
              }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-separator />

      <q-card-section class="bg-grey-1">
        <q-input
          v-model="commentContent"
          outlined
          dense
          placeholder="寫下你的想法..."
          bg-color="white"
          @keyup.enter="submitComment"
        >
          <template v-slot:after>
            <q-btn
              round
              dense
              flat
              icon="send"
              color="deep-orange"
              @click="submitComment"
              :disable="!commentContent.trim()"
            />
          </template>
        </q-input>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useUserStore } from 'stores/user'
import serviceComment from 'src/services/comment'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  articleId: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'comment-added'])

const $q = useQuasar()
const user = useUserStore()

const comments = ref([])
const loading = ref(false)
const commentContent = ref('')

const getComments = async () => {
  if (!props.articleId) return
  loading.value = true
  try {
    const { data } = await serviceComment.getArticleComment(props.articleId)
    comments.value = data.result
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      comments.value = []
      commentContent.value = ''
      getComments()
    }
  },
)

const submitComment = async () => {
  if (!user.isLoggedIn) {
    $q.notify({ color: 'warning', message: '請先登入', icon: 'warning', position: 'bottom' })
    return
  }

  if (!commentContent.value.trim()) return

  try {
    const payload = { content: commentContent.value, article: props.articleId }
    const { data } = await serviceComment.createComment(payload)

    comments.value.unshift({ ...data.result, author: { account: user.account } })
    commentContent.value = ''

    emit('comment-added')
  } catch (error) {
    console.log(error)
    $q.notify({
      color: 'negative',
      message: '留言失敗',
      icon: 'report_problem',
      position: 'bottom',
    })
  }
}
</script>
