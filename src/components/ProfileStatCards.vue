<template>
  <div class="row q-col-gutter-md q-mb-xl">
    <div class="col-12 col-md-3">
      <q-card flat class="stat-card q-pa-sm">
        <q-card-section>
          <div class="row justify-between items-start">
            <q-avatar
              color="orange-1"
              text-color="orange-9"
              icon="account_balance_wallet"
              size="50px"
              font-size="28px"
              rounded
            />
            <q-icon name="trending_up" color="grey-4" size="md" />
          </div>
          <div class="text-overline text-grey-7 q-mt-md">TOTAL POINTS</div>
          <div class="text-h4 text-weight-bolder">
            {{ totalPoints }}
            <span class="text-subtitle1 text-grey text-weight-normal">pts</span>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-md-3">
      <q-card flat class="stat-card q-pa-sm">
        <q-card-section>
          <div class="row justify-between items-start">
            <q-avatar
              color="green-1"
              text-color="green-8"
              icon="soup_kitchen"
              size="50px"
              font-size="28px"
              rounded
            />
            <q-icon name="check_circle" color="green-2" size="md" />
          </div>
          <div class="text-overline text-grey-7 q-mt-md">收藏食譜數</div>
          <div class="text-h4 text-weight-bolder">
            {{ savedCount }}
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-md-3">
      <q-card flat class="stat-card q-pa-sm">
        <q-card-section>
          <div class="row justify-between items-start">
            <q-avatar
              color="blue-1"
              text-color="blue-8"
              icon="menu_book"
              size="50px"
              font-size="28px"
              rounded
            />
            <q-icon name="lock_open" color="blue-2" size="md" />
          </div>
          <div class="text-overline text-grey-7 q-mt-md">解鎖食譜數</div>
          <div class="text-h4 text-weight-bolder">
            {{ unlockedCount }}
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-md-3">
      <q-card flat class="stat-card q-pa-sm">
        <q-card-section>
          <div class="row justify-between items-start">
            <q-avatar
              color="purple-1"
              text-color="purple-8"
              icon="assignment_turned_in"
              size="50px"
              font-size="28px"
              rounded
            />
            <div class="row items-center">
              <q-btn
                flat
                round
                color="purple-8"
                icon="list_alt"
                size="sm"
                @click="showMissions = true"
              >
                <q-tooltip>查看每日任務</q-tooltip>
              </q-btn>
              <q-icon name="emoji_events" color="purple-2" size="md" />
            </div>
          </div>
          <div class="text-overline text-grey-7 q-mt-md">任務完成率</div>
          <div class="row items-baseline">
            <div class="text-h4 text-weight-bolder">
              {{ Math.round(missionProgress * 100) }}
            </div>
            <div class="text-subtitle1 text-grey text-weight-normal q-ml-xs">%</div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- 每日任務彈窗 -->
    <q-dialog v-model="showMissions">
      <q-card style="min-width: 300px; border-radius: 12px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">每日任務牆</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="q-gutter-y-sm">
            <div v-for="mission in missions" :key="mission.name" class="row items-center">
              <q-icon
                :name="mission.isCompleted ? 'check_circle' : 'radio_button_unchecked'"
                :color="mission.isCompleted ? 'green' : 'grey-4'"
                size="xs"
                class="q-mr-sm"
              />
              <span
                class="text-body2"
                :class="mission.isCompleted ? 'text-grey-5' : 'text-grey-8'"
                >{{ mission.name }}
              </span>

              <q-space></q-space>

              <span
                class="text-caption"
                :class="mission.isCompleted ? 'text-grey-5' : 'text-grey-8'"
                >{{ mission.currentCount }}/{{ mission.dailyLimit }}
              </span>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  totalPoints: { type: Number, default: 0 },
  savedCount: { type: Number, default: 0 },
  unlockedCount: { type: Number, default: 0 },
  missionProgress: { type: Number, default: 0 },
  missions: { type: Array, default: () => [] },
})

const showMissions = ref(false)
</script>

<style lang="sass" scoped>
.stat-card
  border: 1px solid #f0f0f0
  border-radius: 12px
  transition: transform 0.2s
  &:hover
    transform: translateY(-2px)
    box-shadow: 0 4px 12px rgba(0,0,0,0.05)
</style>
