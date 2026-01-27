<template>
  <q-card flat bordered class="q-pa-md radius-12 bg-orange-1" style="border-color: transparent">
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
            :model-value="comment.rating"
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
            <span class="text-grey-6 text-caption q-ml-xs">{{ comment.likes.length }}</span>
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
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useUserStore } from '@/stores/user'
import serviceComment from '@/services/comment'

const props = defineProps({
  recipeId: {
    type: String,
    required: true,
  },
})

const $q = useQuasar()
const user = useUserStore()
const comments = ref([])
const newComment = ref({
  content: '',
  rating: 0,
})

const getComment = async () => {
  if (!props.recipeId) return
  try {
    const { data } = await serviceComment.getRecipeComment(props.recipeId)
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

watch(
  () => props.recipeId,
  () => {
    getComment()
  },
  { immediate: true },
)

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

const canSubmit = computed(() => {
  return newComment.value.content.trim().length > 0 && newComment.value.rating > 0
})

const submit = async () => {
  if (!canSubmit.value) return

  try {
    const payload = {
      content: newComment.value.content,
      rating: newComment.value.rating,
      recipe: props.recipeId,
    }

    const { data } = await serviceComment.createComment(payload)
    comments.value.unshift(data.result)

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
</script>

<style scoped>
.radius-12 {
  border-radius: 12px;
}
</style>
