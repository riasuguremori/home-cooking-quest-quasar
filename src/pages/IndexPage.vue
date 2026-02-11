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
        <q-img :src="banner01" class="absolute-full" fit="cover" />

        <div class="absolute-full flex column flex-center">
          <div class="text-h2 text-weight-bold q-mb-md text-shadow">探索私房美味</div>
          <div class="text-h5 q-px-md q-mb-xl opacity-80 bg-dark-gradient">
            超過 1,000+ 道精選食譜等你發掘
          </div>
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>

  <FeatureSection />

  <DailySelection />

  <div class="q-my-xl q-py-xl">
    <q-card class="rounded-xl no-shadow overflow-hidden bg-white">
      <div class="row">
        <div class="col-12 col-md-6 relative-position">
          <q-img
            :src="banner02"
            :class="{ 'absolute-full': $q.screen.gt.sm }"
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
import DailySelection from 'components/DailySelection.vue'
import FeatureSection from 'components/FeatureSection.vue'

const banner01 = new URL('src/assets/banner01.webp', import.meta.url).href
const banner02 = new URL('src/assets/banner02.webp', import.meta.url).href

const $q = useQuasar()
const slide = ref('style')
</script>

<style lang="scss">
/* 讓文字有陰影 */
.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.bg-dark-gradient {
  border-radius: 20px;
  background: linear-gradient(135deg, #f76e19 0%, #ff9f43 100%);
  text-align: center;
  background-size: 200% 200%;
  animation: gradientMove 3s ease infinite alternate;
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

/* 背景漸層流動動畫 */
@keyframes gradientMove {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 0% 100%;
  }
}
</style>
