<template>
  <div class="q-mb-xl">
    <q-carousel
      v-model="slide"
      transition-prev="slide-right"
      transition-next="slide-left"
      swipeable
      animated
      control-color="white"
      navigation
      padding
      arrows
      infinite
      :autoplay="4500"
      height="500px"
      class="bg-grey-2 text-white rounded-xl shadow-2 overflow-hidden"
    >
      <q-carousel-slide name="style" class="column no-wrap flex-center q-pa-none relative-position">
        <q-img src="@/assets/banner01.webp" class="absolute-full" fit="cover" />

        <div class="absolute-full flex column flex-center bg-dark-gradient">
          <div class="text-h2 text-weight-bold q-mb-md text-shadow">探索私房美味</div>
          <div class="text-h5 q-mb-xl opacity-80">超過 1,000 道精選食譜等你發掘</div>
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>

  <div class="row q-col-gutter-lg q-mb-xl">
    <div class="col-12 col-md-4" v-for="feature in features" :key="feature.to">
      <q-card
        class="rounded-xl no-shadow cursor-pointer hover-card full-height relative-position overflow-hidden bg-white"
        v-ripple
        @click="handleLinkClick(feature)"
      >
        <q-card-section class="q-pa-lg row items-center justify-between">
          <div class="col-8 z-top">
            <div class="text-h6 text-weight-bolder text-grey-9 q-mb-xs">{{ feature.title }}</div>
            <div class="text-caption text-grey-6" style="line-height: 1.4">{{ feature.desc }}</div>

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

  <div class="q-mb-xl">
    <q-card class="rounded-xl no-shadow overflow-hidden bg-white">
      <div class="row">
        <div class="col-12 col-md-6 relative-position">
          <q-img
            src="@/assets/banner02.webp"
            class="absolute-full"
            style="min-height: 400px"
            fit="cover"
          >
            <div
              class="absolute-full"
              style="
                background: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 100%);
              "
            ></div>
          </q-img>
        </div>

        <div class="col-12 col-md-6 q-pa-xl flex column justify-center">
          <div class="q-mb-md">
            <q-chip
              color="orange-1"
              text-color="primary"
              class="text-weight-bold tracking-wide text-uppercase"
              size="sm"
            >
              Our Story
            </q-chip>
          </div>

          <div class="text-h3 text-weight-bolder text-grey-9 q-mb-md" style="line-height: 1.2">
            不僅僅是食譜，<br />
            更是<span class="text-primary">生活的味道</span>。
          </div>

          <div class="text-body1 text-grey-7 q-mb-lg" style="line-height: 1.8">
            「私房的料理探索」成立於 2026
            年，我們致力於連結每一位熱愛烹飪的靈魂。在這裡，沒有艱澀難懂的技巧，只有對食材的熱愛與分享的喜悅。無論你是米其林大廚還是廚房新手，這裡都有屬於你的舞台。
          </div>

          <div class="row q-gutter-x-xl q-mb-xl">
            <div>
              <div class="text-h4 text-weight-bold text-primary">20k+</div>
              <div class="text-caption text-grey-6 text-uppercase text-weight-medium">活躍會員</div>
            </div>
            <div>
              <div class="text-h4 text-weight-bold text-primary">5,000+</div>
              <div class="text-caption text-grey-6 text-uppercase text-weight-medium">食譜</div>
            </div>
            <div>
              <div class="text-h4 text-weight-bold text-primary">100%</div>
              <div class="text-caption text-grey-6 text-uppercase text-weight-medium">熱情分享</div>
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const slide = ref('style')
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
  // 檢查是否需要登入權限
  if (feature.requiresAuth && !user.isLoggedIn) {
    $q.notify({
      color: 'warning',
      message: '請先登入',
      icon: 'warning',
      position: 'bottom',
    })
    return // 阻擋導航
  }

  // 通過檢查，進行頁面跳轉
  router.push(feature.to)
}
</script>

<style lang="scss">
/* 讓文字有陰影，在淺色圖片上也看得清楚 */
.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* 漸層遮罩，讓文字更凸顯 */
.bg-dark-gradient {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.2) 50%,
    rgba(0, 0, 0, 0.1) 100%
  );
}

/* 毛玻璃效果背景 */
.bg-dark-blur {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
}

/* 調整透明度 */
.opacity-80 {
  opacity: 0.8;
}

/* 卡片懸停效果 */
.hover-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid transparent;
}

.hover-card:hover {
  transform: translateY(-5px); /* 輕微上浮 */
  box-shadow: 0 12px 24px rgba(255, 107, 0, 0.15) !important; /* 橘色系柔和陰影 */
}

/* 讓箭頭在 hover 時會移動 */
.hover-card:hover .transition-icon {
  transform: translateX(4px);
}

/* 確保層級正確 (文字在裝飾圖之上) */
.z-top {
  z-index: 1;
  position: relative;
}

/* 讓文字區塊在大螢幕上有足夠的呼吸感 */
.q-pa-xl {
  padding: 48px !important;
}

/* 針對手機版的調整 (RWD) */
@media (max-width: 1023px) {
  /* 手機版圖片高度固定，避免太扁 */
  .col-md-6.relative-position {
    min-height: 300px;
  }

  /* 手機版內距縮小 */
  .q-pa-xl {
    padding: 32px !important;
  }

  /* 手機版標題字體縮小 */
  .text-h3 {
    font-size: 2rem !important;
  }
}
</style>
