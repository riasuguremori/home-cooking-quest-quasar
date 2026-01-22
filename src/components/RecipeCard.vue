<template>
  <q-card
    class="rounded-xl no-shadow full-height column relative-position overflow-hidden hover-card bg-white cursor-pointer"
    @click="$emit('click', recipe._id)"
  >
    <q-img :src="recipe.imageUrl" :ratio="4 / 3" class="col-grow">
      <div v-if="recipe.badge" class="absolute-top-left q-pa-none bg-transparent">
        <q-chip
          :color="recipe.badgeColor"
          text-color="white"
          size="sm"
          class="q-ma-md text-weight-bold text-uppercase shadow-2"
          v-if="recipe.isOfficial"
          >{{ recipe.badge }}
        </q-chip>
      </div>
      <div v-if="recipe.badge" class="absolute-top-right q-pa-none bg-transparent">
        <q-chip
          :color="recipe.badgeColor"
          text-color="white"
          size="sm"
          class="q-ma-md text-weight-bold text-uppercase shadow-2"
          v-if="recipe.isUnlocked"
          >{{ recipe.free }}</q-chip
        >
      </div>
    </q-img>

    <q-card-section class="q-pa-md">
      <div class="text-h6 text-weight-bold q-mb-xs ellipsis text-grey-9">
        {{ recipe.name }}
      </div>

      <div class="row items-center q-gutter-x-md text-grey-6 text-caption q-mb-md">
        <div class="row items-center">
          <q-icon name="schedule" class="q-mr-xs text-orange-8" />
          {{ recipe.timeAgo }}
        </div>
      </div>

      <div class="row items-center q-gutter-x-md text-grey-6 text-caption q-mb-md">
        <div class="row items-center">
          {{ `瀏覽數：${recipe.views}` }}
        </div>
      </div>

      <q-separator class="q-mb-md bg-grey-2" />

      <div class="row items-center justify-between" :class="{ 'opacity-50': recipe.locked }">
        <div class="row items-center">
          <q-avatar size="28px" class="q-mr-sm shadow-1">
            <img :src="`https://api.dicebear.com/9.x/thumbs/svg?seed=${user.account}`" />
          </q-avatar>
          <span class="text-weight-medium text-caption text-grey-8">{{
            recipe.author?.account || '匿名'
          }}</span>
        </div>
        <q-btn flat round color="primary" icon="arrow_forward" size="sm" class="bg-orange-1" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useUserStore } from '@/stores/user'

defineProps({
  recipe: {
    type: Object,
    required: true,
  },
})

defineEmits(['click'])

const user = useUserStore()
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
