<template>
  <q-card flat class="bg-white q-mb-lg rounded-borders post-card">
    <q-item>
      <q-item-section avatar>
        <q-avatar>
          <img :src="`https://api.dicebear.com/9.x/thumbs/svg?seed=${article.author?.account}`" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-weight-bold">{{
          article.author?.account || '匿名'
        }}</q-item-label>
        <q-item-label caption>{{ new Date(article.createdAt).toLocaleDateString() }}</q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-btn flat round icon="more_horiz">
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup @click="$emit('edit', article)">
                <q-item-section>編輯</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="$emit('delete', article._id)">
                <q-item-section class="text-negative">刪除</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-item-section>
    </q-item>

    <div v-if="article.imageUrl && article.imageUrl.length > 0" class="row q-col-gutter-xs q-mt-sm">
      <div
        v-for="(img, idx) in article.imageUrl"
        :key="idx"
        :class="{
          'col-12': article.imageUrl.length === 1,
          'col-6': article.imageUrl.length === 2 || article.imageUrl.length === 4,
          'col-4': article.imageUrl.length === 3 || article.imageUrl.length >= 5,
        }"
      >
        <q-img
          :src="img"
          :ratio="article.imageUrl.length === 1 ? 4 / 3 : 1"
          fit="cover"
          class="rounded-borders"
          :style="article.imageUrl.length === 1 ? '' : 'height: 200px'"
        />
      </div>
    </div>

    <q-card-section>
      <div class="text-h6 text-weight-bold q-mt-sm q-mb-xs">{{ article.title }}</div>
      <div class="text-body2 text-grey-8 q-mb-md">
        {{ article.content }}
      </div>

      <div class="row q-gutter-sm q-mb-md">
        <q-chip color="orange-1" text-color="deep-orange" size="sm" class="text-weight-bold">{{
          article.category
        }}</q-chip>
      </div>

      <q-separator class="q-my-md" color="grey-2" />

      <div class="row items-center justify-between">
        <div class="row q-gutter-x-md">
          <div class="row items-center">
            <q-btn
              flat
              round
              dense
              :icon="isLiked ? 'favorite' : 'favorite_border'"
              :color="isLiked ? 'red' : 'grey-5'"
              size="sm"
              @click="$emit('like', article)"
            />
            <span class="text-grey-6 text-caption q-ml-xs">{{ article.likes.length }}</span>
          </div>
          <div
            class="flex items-center text-grey-6 cursor-pointer"
            @click="$emit('comment', article)"
          >
            <q-icon name="chat_bubble_outline" size="20px" class="q-mr-xs" />
            <span class="text-weight-medium">{{ article.comments || 0 }}</span>
          </div>
          <div class="flex items-center text-grey-6 cursor-pointer" @click="$emit('share')">
            <q-icon name="share" size="20px" />
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
})

defineEmits(['edit', 'delete', 'like', 'comment', 'share'])

const user = useUserStore()

const isLiked = computed(() => {
  return props.article.likes.includes(user._id)
})
</script>

<style lang="sass" scoped>
.post-card
  transition: transform 0.2s
  &:hover
    box-shadow: 0 4px 12px rgba(0,0,0,0.05)

.rounded-borders
  border-radius: 16px !important
</style>
