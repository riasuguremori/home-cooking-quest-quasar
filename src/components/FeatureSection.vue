<template>
  <div class="q-my-xl q-mx-auto q-px-md" style="max-width: 1400px">
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-4" v-for="feature in features" :key="feature.to">
        <q-card
          class="rounded-xl no-shadow cursor-pointer hover-card full-height relative-position overflow-hidden bg-white"
          v-ripple
          @click="handleLinkClick(feature)"
        >
          <q-card-section class="q-pa-lg row items-center justify-between">
            <div class="col-8 z-top">
              <div class="text-h6 text-weight-bolder text-grey-9 q-mb-xs">{{ feature.title }}</div>
              <div class="text-caption text-grey-6" style="line-height: 1.4">
                {{ feature.desc }}
              </div>

              <div class="q-mt-md text-primary text-weight-bold row items-center text-caption">
                前往查看 <q-icon name="arrow_forward" class="q-ml-xs transition-icon" />
              </div>
            </div>

            <div class="col-auto">
              <q-avatar
                size="64px"
                font-size="32px"
                color="orange-1"
                text-color="primary"
                :icon="feature.icon"
                class="shadow-1"
              />
            </div>

            <div
              class="absolute-right"
              style="opacity: 0.05; right: -20px; bottom: -20px; pointer-events: none"
            >
              <q-icon :name="feature.icon" size="140px" color="primary" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const $q = useQuasar()
const router = useRouter()
const user = useUserStore()

const features = [
  {
    title: '精選食譜',
    icon: 'menu_book',
    desc: '探索超過千道私房料理與烘焙靈感',
    to: '/recipes',
    requiresAuth: false,
  },
  {
    title: '廚藝論壇',
    icon: 'forum',
    desc: '與大廚們交流心得，分享你的烹飪故事',
    to: '/articles',
    requiresAuth: false,
  },
  {
    title: '會員中心',
    icon: 'manage_accounts',
    desc: '管理個人資料、查看積分與收藏紀錄',
    to: '/userProfile',
    requiresAuth: true,
  },
]

const handleLinkClick = (feature) => {
  if (feature.requiresAuth && !user.isLoggedIn) {
    $q.notify({
      color: 'warning',
      message: '請先登入',
      icon: 'warning',
      position: 'bottom',
    })
    return
  }
  router.push(feature.to)
}
</script>

<style scoped>
.hover-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid transparent;
}

.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(255, 107, 0, 0.15) !important;
}

.hover-card:hover .transition-icon {
  transform: translateX(4px);
}

.transition-icon {
  transition: transform 0.3s ease;
}

.z-top {
  z-index: 1;
  position: relative;
}
</style>
