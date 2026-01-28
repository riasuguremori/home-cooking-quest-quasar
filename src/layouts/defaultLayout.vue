<template>
  <q-layout view="hHh lpR fFf" class="bg-cream font-sans">
    <q-header class="bg-cream q-py-xs" height-hint="80" style="color: #333333">
      <q-toolbar class="q-px-lg">
        <q-btn
          flat
          dense
          round
          icon="menu"
          class="lt-md q-mr-sm"
          @click="toggleLeftDrawer"
          color="primary"
        />

        <div class="row items-center cursor-pointer q-mr-md" @click="router.push('/')">
          <q-icon name="soup_kitchen" color="primary" size="32px" class="q-mr-sm" />
          <div class="text-h6 text-weight-bold text-primary tracking-wide text-shadow-title">
            私房的料理探索
          </div>
        </div>

        <q-space />

        <div class="row items-center q-gutter-x-md gt-sm">
          <template v-for="nav in navs" :key="nav.to">
            <q-btn
              v-if="nav.show"
              stretch
              flat
              :icon="nav.icon"
              :label="nav.title"
              :to="nav.to"
              class="text-weight-medium"
            />
          </template>

          <q-btn v-if="user.isLoggedIn" round flat icon="event_available" color="grey-7">
            <q-tooltip>簽到紀錄</q-tooltip>
            <q-menu>
              <div class="q-pa-md">
                <div class="text-subtitle1 q-mb-sm text-center text-weight-bold">簽到紀錄</div>
                <q-date
                  v-model="today"
                  :events="signInDates"
                  event-color="green"
                  minimal
                  flat
                  readonly
                />
              </div>
            </q-menu>
          </q-btn>

          <q-btn
            v-if="user.isLoggedIn"
            round
            flat
            icon="notifications"
            color="grey-7"
            @click="clearUnread"
          >
            <q-badge color="red" floating v-if="unreadCount > 0" rounded>{{ unreadCount }}</q-badge>
            <q-menu>
              <q-list style="min-width: 300px; max-height: 400px" class="scroll">
                <q-item-label header>通知</q-item-label>
                <div v-if="sortedPointLogs.length === 0" class="q-pa-md text-center text-grey">
                  暫無通知
                </div>
                <template v-for="log in sortedPointLogs" :key="log._id">
                  <q-item>
                    <q-item-section avatar>
                      <q-icon
                        :name="log.type === '獲得' ? 'check_circle' : 'lock_open'"
                        :color="log.type === '獲得' ? 'green' : 'deep-orange'"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ log.title }}</q-item-label>
                      <q-item-label caption>{{ log.description }}</q-item-label>
                      <q-item-label caption class="text-grey-5">{{
                        date.formatDate(log.createdAt, 'YYYY/MM/DD HH:mm')
                      }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <span :class="log.type === '獲得' ? 'text-green' : 'text-deep-orange'">
                        {{ log.type === '獲得' ? '+' : '-' }}{{ log.amount }}
                      </span>
                    </q-item-section>
                  </q-item>
                  <q-separator inset />
                </template>
              </q-list>
            </q-menu>
          </q-btn>

          <q-chip
            v-if="user.isLoggedIn"
            class="bg-primary text-white text-weight-bold q-px-md"
            icon="monetization_on"
          >
            {{ user.points ?? 0 }}
          </q-chip>

          <q-avatar v-if="user.isLoggedIn" size="40px" class="cursor-pointer shadow-1">
            <img :src="`https://api.dicebear.com/9.x/thumbs/svg?seed=${user.account}`" />
          </q-avatar>

          <q-btn v-if="user.isLoggedIn" flat round icon="mdi-logout" color="grey-7" @click="logout">
            <q-tooltip>登出</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      overlay
      behavior="mobile"
      class="bg-cream"
      :width="280"
    >
      <q-scroll-area class="fit">
        <div class="q-pa-md bg-orange-1">
          <div class="row items-center q-mb-md">
            <q-avatar size="56px" class="shadow-2 q-mr-md bg-white">
              <img
                :src="`https://api.dicebear.com/9.x/thumbs/svg?seed=${user.account || '訪客'}`"
              />
            </q-avatar>
            <div>
              <div class="text-subtitle1 text-weight-bold">{{ user.account || '訪客' }}</div>
              <q-chip
                size="sm"
                color="primary"
                text-color="white"
                icon="monetization_on"
                class="q-ma-none"
              >
                {{ user.isLoggedIn ? (user.points ?? 0) : '-' }}
              </q-chip>
            </div>
          </div>

          <q-btn v-if="user.isLoggedIn" round flat icon="event_available" color="grey-7">
            <q-tooltip>簽到紀錄</q-tooltip>
            <q-menu>
              <div class="q-pa-md">
                <div class="text-subtitle1 q-mb-sm text-center text-weight-bold">簽到紀錄</div>
                <q-date
                  v-model="today"
                  :events="signInDates"
                  event-color="green"
                  minimal
                  flat
                  readonly
                />
              </div>
            </q-menu>
          </q-btn>

          <q-btn
            v-if="user.isLoggedIn"
            round
            flat
            icon="notifications"
            color="grey-7"
            @click="clearUnread"
          >
            <q-badge color="red" floating v-if="unreadCount > 0" rounded>{{ unreadCount }}</q-badge>
            <q-menu>
              <q-list style="min-width: 300px; max-height: 400px" class="scroll">
                <q-item-label header>通知</q-item-label>
                <div v-if="sortedPointLogs.length === 0" class="q-pa-md text-center text-grey">
                  暫無通知
                </div>
                <template v-for="log in sortedPointLogs" :key="log._id">
                  <q-item>
                    <q-item-section avatar>
                      <q-icon
                        :name="log.type === '獲得' ? 'check_circle' : 'lock_open'"
                        :color="log.type === '獲得' ? 'green' : 'deep-orange'"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ log.title }}</q-item-label>
                      <q-item-label caption>{{ log.description }}</q-item-label>
                      <q-item-label caption class="text-grey-5">{{
                        date.formatDate(log.createdAt, 'YYYY/MM/DD HH:mm')
                      }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <span :class="log.type === '獲得' ? 'text-green' : 'text-deep-orange'">
                        {{ log.type === '獲得' ? '+' : '-' }}{{ log.amount }}
                      </span>
                    </q-item-section>
                  </q-item>
                  <q-separator inset />
                </template>
              </q-list>
            </q-menu>
          </q-btn>
        </div>

        <q-separator color="orange-2" />

        <q-list padding class="text-grey-9">
          <template v-for="nav in navs" :key="nav.to">
            <q-item
              v-if="nav.show"
              clickable
              v-ripple
              :to="nav.to"
              active-class="text-primary bg-orange-1"
            >
              <q-item-section avatar>
                <q-icon :name="nav.icon" />
              </q-item-section>
              <q-item-section class="text-weight-medium">
                {{ nav.title }}
              </q-item-section>
            </q-item>
          </template>

          <q-separator class="q-my-md" />

          <q-item v-if="user.isLoggedIn" clickable v-ripple @click="logout" class="text-red">
            <q-item-section avatar>
              <q-icon name="mdi-logout" />
            </q-item-section>
            <q-item-section>登出</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <div class="bg-white text-grey-8 q-pt-xl q-pb-lg q-mt-xl rounded-top-xl relative-position">
      <div class="absolute-top bg-primary" style="height: 4px; opacity: 0.1"></div>

      <div class="q-px-xl">
        <div class="row q-col-gutter-xl">
          <div class="col-12 col-md-8">
            <div class="row items-center q-mb-md cursor-pointer">
              <q-icon name="soup_kitchen" color="primary" size="32px" class="q-mr-sm" />
              <div class="text-h6 text-weight-bold text-primary tracking-wide text-shadow-title">
                私房的料理探索
              </div>
            </div>
            <div class="text-body2 text-grey-6 q-mb-lg" style="line-height: 1.8; max-width: 500px">
              連結每一位熱愛烹飪的靈魂，讓味道成為記憶的載體。加入我們，開啟你的味蕾探險之旅。
            </div>
            <div class="row q-gutter-sm">
              <q-btn round flat color="grey-6" icon="facebook" class="hover-primary" />
              <q-btn round flat color="grey-6" icon="smart_display" class="hover-primary" />
              <q-btn round flat color="grey-6" icon="photo_camera" class="hover-primary" />
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="bg-orange-1 rounded-borders q-pa-lg">
              <div class="text-subtitle1 text-weight-bold text-primary q-mb-sm">
                <q-icon name="mail" class="q-mr-xs" /> 訂閱每週靈感
              </div>
              <div class="text-caption text-grey-7 q-mb-md">
                不想錯過獨家食譜？輸入 Email，將美味送到你信箱！
              </div>

              <q-input
                dense
                outlined
                bg-color="white"
                placeholder="your@email.com"
                class="rounded-input"
              >
                <template v-slot:append>
                  <q-btn round dense flat icon="arrow_forward" color="primary" />
                </template>
              </q-input>
            </div>
          </div>
        </div>

        <q-separator class="q-my-lg bg-grey-3" />

        <div class="row justify-center items-center text-caption text-grey-5">
          <div>© 2026 私房的料理探索. All rights reserved.</div>
        </div>
      </div>
    </div>
  </q-layout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { date } from 'quasar'
import serviceUser from '@/services/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const user = useUserStore()
// 控制側邊欄開關
const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const today = ref(new Date().toISOString().slice(0, 10).replace(/-/g, '/'))

const signInDates = computed(() => {
  return (user.pointLog || [])
    .filter((log) => log.event === '每日簽到')
    .map((log) => date.formatDate(log.createdAt, 'YYYY/MM/DD'))
})

const sortedPointLogs = computed(() => {
  if (!user.pointLog) return []
  const lastRead = localStorage.getItem('lastReadLogDate')
  const lastReadDate = lastRead ? new Date(lastRead) : new Date(0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return [...user.pointLog]
    .filter((log) => {
      const logDate = new Date(log.createdAt)
      return logDate >= today || logDate > lastReadDate
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const unreadCount = ref(0)

watch(
  () => user.pointLog,
  (newLogs) => {
    if (!newLogs) return
    const lastRead = localStorage.getItem('lastReadLogDate')
    if (!lastRead) {
      unreadCount.value = newLogs.length
    } else {
      unreadCount.value = newLogs.filter(
        (log) => new Date(log.createdAt) > new Date(lastRead),
      ).length
    }
  },
  { immediate: true, deep: true },
)

const clearUnread = () => {
  unreadCount.value = 0
  if (sortedPointLogs.value.length > 0) {
    localStorage.setItem('lastReadLogDate', sortedPointLogs.value[0].createdAt)
  }
}

const navs = computed(() => [
  { title: '精選食譜', to: '/recipes', icon: 'menu_book', show: true },
  { title: '廚藝論壇', to: '/articles', icon: 'forum', show: true },
  { title: '登入', to: '/login', icon: 'mdi-login', show: !user.isLoggedIn },
  {
    title: '會員中心',
    to: '/userProfile',
    icon: 'mdi-account',
    show: user.isLoggedIn && !user.isAdmin,
  },
  { title: '管理', to: '/admin', icon: 'mdi-cog', show: user.isLoggedIn && user.isAdmin },
])

const logout = async () => {
  try {
    await serviceUser.logout()
  } catch (error) {
    console.log(error)
  }
  user.logout()
  leftDrawerOpen.value = false
  router.push('/')
}
</script>

<style lang="scss">
.text-shadow-title {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.bg-cream {
  background-color: #fff8e7;
}

.text-primary {
  color: #ff8c42 !important;
}

.bg-primary {
  background-color: #ff8c42 !important;
}

.search-input .q-field__control {
  background-color: #f0eee6 !important;
  border-radius: 24px !important;
  padding: 0 16px;
  box-shadow: none;
}

.search-input .q-field__control:before {
  border: none;
}

.footer-link {
  text-decoration: none;
  color: #757575;
  transition: color 0.3s;
  font-size: 0.95rem;

  &:hover {
    color: #ff6b00;
    padding-left: 4px;
  }
}

.footer-link-sm {
  text-decoration: none;
  color: #9e9e9e;
  transition: color 0.3s;

  &:hover {
    color: #616161;
  }
}

.hover-primary {
  transition: all 0.3s;
  &:hover {
    color: #ff6b00 !important;
    background: rgba(255, 107, 0, 0.1);
  }
}

.rounded-top-xl {
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
}

.rounded-input .q-field__control {
  border-radius: 8px !important;
}
</style>
