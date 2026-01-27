<template>
  <div>
    <div class="row items-center q-pa-md q-gutter-sm">
      <q-input
        dense
        outlined
        :model-value="search"
        @update:model-value="$emit('update:search', $event)"
        :placeholder="placeholder"
        class="col"
        bg-color="white"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <slot name="actions"></slot>
    </div>

    <div v-if="recipes && recipes.length > 0" class="row q-col-gutter-md q-pa-md">
      <div class="col-12 col-sm-6 col-md-4" v-for="recipe in recipes" :key="recipe._id">
        <RecipeCard :recipe="recipe" @click="$emit('click-recipe', recipe._id)">
          <template #image-overlay>
            <slot name="image-overlay" :recipe="recipe"></slot>
          </template>
        </RecipeCard>
      </div>
    </div>
    <div v-else-if="!search" class="text-center q-pa-xl text-grey">
      <q-icon :name="emptyIcon" size="64px" class="q-mb-md" />
      <div class="text-h6">{{ emptyText }}</div>
      <q-btn
        v-if="emptyBtnLabel"
        :to="emptyBtnTo"
        :label="emptyBtnLabel"
        color="deep-orange"
        flat
        class="q-mt-sm"
      />
    </div>
    <div v-else class="text-center q-pa-xl text-grey">
      <div class="text-h6">找不到符合的食譜</div>
    </div>
  </div>
</template>

<script setup>
import RecipeCard from '@/components/RecipeCard.vue'

defineProps({
  recipes: { type: Array, default: () => [] },
  search: { type: String, default: '' },
  placeholder: { type: String, default: '搜尋' },
  emptyIcon: { type: String, default: 'info' },
  emptyText: { type: String, default: '尚無資料' },
  emptyBtnLabel: { type: String, default: '' },
  emptyBtnTo: { type: [String, Object], default: '' },
})

defineEmits(['update:search', 'click-recipe'])
</script>
