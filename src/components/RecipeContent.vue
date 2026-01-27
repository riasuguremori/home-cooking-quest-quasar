<template>
  <div class="col-12 col-md-8">
    <div class="q-mb-xl">
      <div class="row items-center q-mb-md">
        <q-icon name="restaurant" color="deep-orange" size="24px" class="q-mr-sm" />
        <div class="text-h5 text-weight-bold">{{ recipe.name }}</div>
        <q-rating :model-value="recipe.rating" size="1.2em" color="orange" readonly icon="star" />
        <q-btn
          v-if="!unlocked"
          flat
          round
          dense
          :icon="isCollected ? 'favorite' : 'favorite_border'"
          :color="isCollected ? 'pink' : 'grey-5'"
          @click="$emit('collect')"
        >
          <q-tooltip>{{ isCollected ? '取消收藏' : '加入收藏' }}</q-tooltip>
        </q-btn>
        <q-chip
          v-if="unlocked"
          color="green-1"
          text-color="green"
          icon="lock_open"
          label="已解鎖"
          size="sm"
          class="q-ml-sm"
        />
      </div>
      <p class="text-body1 text-grey-9" style="line-height: 1.6" v-html="recipe.description"></p>
    </div>
    <q-card
      class="my-card relative-position overflow-hidden"
      flat
      bordered
      :style="isLocked ? 'height: 400px' : 'min-height: 400px'"
    >
      <div
        class="q-pa-lg"
        :class="{
          'blurred-content': isLocked,
        }"
      >
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-8">
            <div class="text-h6 q-mb-md">準備食材</div>
            <div
              class="text-body2 text-grey-8 q-mb-xs"
              v-for="ingredient in recipe.ingredients"
              :key="ingredient._id"
            >
              <div
                class="row justify-between"
                style="max-width: 400px; border-bottom: 1px dashed #eee"
              >
                <span>{{ ingredient.name }}</span>
                <span class="text-weight-bold">{{ ingredient.quantity }}</span>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <q-card
              v-if="recipe.nutrition && recipe.nutrition.length > 0"
              flat
              bordered
              class="bg-grey-1"
            >
              <q-card-section>
                <div class="text-subtitle1 text-weight-bold q-mb-sm text-primary">
                  <q-icon name="analytics" class="q-mr-xs" /> 營養標示 (每份)
                </div>

                <q-list dense separator class="text-grey-9">
                  <q-item>
                    <q-item-section>熱量</q-item-section>
                    <q-item-section side class="text-black text-weight-bolder">
                      {{ recipe.nutrition[0].calories }} kcal
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>蛋白質</q-item-section>
                    <q-item-section side> {{ recipe.nutrition[0].protein }} g </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>脂肪</q-item-section>
                    <q-item-section side> {{ recipe.nutrition[0].fat }} g </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>總碳水化合物</q-item-section>
                    <q-item-section side> {{ recipe.nutrition[0].carbs }} g </q-item-section>
                  </q-item>

                  <q-item class="bg-green-1">
                    <q-item-section class="text-green-9 text-weight-bold">淨碳水</q-item-section>
                    <q-item-section side class="text-green-9 text-weight-bold">
                      {{ recipe.nutrition[0].netCarbs }} g
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="text-h6 q-mt-lg q-mb-md" v-for="(step, idx) in recipe.steps" :key="step._id">
          {{ `步驟 ${idx + 1}` }}
          <p>{{ step.description }}</p>
          <img :src="step.imageUrl" style="max-width: 100%; height: auto" />
        </div>
      </div>

      <div class="absolute-full flex flex-center glass-overlay" v-if="isLocked">
        <q-card class="text-center shadow-10 q-pa-lg" style="max-width: 350px; border-radius: 16px">
          <q-icon
            name="lock"
            color="deep-orange"
            size="40px"
            class="bg-orange-1 q-pa-md rounded-borders q-mb-md"
          />

          <q-btn
            unelevated
            rounded
            color="deep-orange"
            size="lg"
            class="full-width text-weight-bold"
            no-caps
            @click="$emit('unlock')"
          >
            <div class="row items-center" v-if="recipe">
              <span>Unlock for {{ recipe.unlockPrice }} Points</span>
              <q-icon name="monetization_on" class="q-ml-sm" />
            </div>
          </q-btn>
        </q-card>
      </div>
    </q-card>
  </div>
</template>

<script setup>
defineProps({
  recipe: {
    type: Object,
    required: true,
  },
  unlocked: {
    type: Boolean,
    default: false,
  },
  isCollected: {
    type: Boolean,
    default: false,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['collect', 'unlock'])
</script>

<style scoped>
.blurred-content {
  filter: blur(8px);
  user-select: none;
  opacity: 0.5;
  pointer-events: none;
}

.glass-overlay {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.4);
  z-index: 10;
}
</style>
