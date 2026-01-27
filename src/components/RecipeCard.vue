<template>
  <q-card
    class="rounded-xl no-shadow full-height column relative-position overflow-hidden hover-card bg-white cursor-pointer"
    @click="$emit('click', recipe._id)"
  >
    <q-img :src="props.recipe.imageUrl" :ratio="4 / 3" class="col-grow">
      <div v-if="badge" class="absolute-top-left q-pa-none bg-transparent">
        <q-chip
          :color="badgeColor"
          text-color="white"
          size="sm"
          class="q-ma-md text-weight-bold text-uppercase shadow-2"
          v-if="props.recipe.isOfficial"
          >{{ badge }}
        </q-chip>
      </div>
      <div v-if="free" class="absolute-top-right q-pa-none bg-transparent">
        <q-chip
          :color="badgeColor"
          text-color="white"
          size="sm"
          class="q-ma-md text-weight-bold text-uppercase shadow-2"
          v-if="props.recipe.isUnlocked"
          >{{ free }}</q-chip
        >
      </div>
      <slot name="image-overlay"></slot>
    </q-img>

    <q-card-section class="q-pa-md">
      <div class="text-h6 text-weight-bold q-mb-xs ellipsis text-grey-9">
        {{ props.recipe.name }}
      </div>

      <div class="row items-center q-mb-sm">
        <span class="text-caption text-grey-7 q-mr-sm">難易度</span>
        <q-rating
          :model-value="props.recipe.rating"
          max="5"
          size="1.5em"
          color="orange"
          icon="star_border"
          icon-selected="star"
          readonly
        />
      </div>

      <div class="row items-center q-gutter-x-md text-grey-6 text-caption q-mb-md">
        <div class="row items-center">
          <q-icon name="schedule" class="q-mr-xs text-orange-8" />
          {{ timeAgo }}
        </div>
      </div>

      <div class="row items-center q-gutter-x-md text-grey-6 text-caption q-mb-md">
        <div class="row items-center">
          {{ `瀏覽數：${props.recipe.views}` }}
        </div>
      </div>

      <q-separator class="q-mb-md bg-grey-2" />

      <div class="row items-center justify-between" :class="{ 'opacity-50': props.recipe.locked }">
        <div class="row items-center">
          <q-avatar size="28px" class="q-mr-sm shadow-1">
            <img
              :src="`https://api.dicebear.com/9.x/thumbs/svg?seed=${props.recipe.author?.account || 'default'}`"
            />
          </q-avatar>
          <span class="text-weight-medium text-caption text-grey-8">{{
            props.recipe.author?.account || '匿名'
          }}</span>
        </div>
        <q-btn flat round color="primary" icon="arrow_forward" size="sm" class="bg-orange-1" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  recipe: {
    type: Object,
    required: true,
  },
})

defineEmits(['click'])

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

const badge = computed(() => (props.recipe.isOfficial ? '官方推薦' : ''))
const free = computed(() => (props.recipe.isUnlocked ? 'Free' : ''))
const badgeColor = computed(() => props.recipe.badgeColor || 'positive')
const timeAgo = computed(() => formatTimeAgo(props.recipe.createdAt))
</script>

<style scoped>
/* 卡片懸浮效果 */
.hover-card {
  transition: all 0.3s ease;
  border: 1px solid transparent;
}
.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08) !important;
}
</style>
