<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated class="bg-cream text-primary lt-lg">
      <q-toolbar>
        <q-btn flat round icon="menu" @click="drawerOpen = !drawerOpen" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawerOpen"
      :width="250"
      show-if-above
      bordered
      side="left"
      class="bg-cream"
      style="color: #333333"
    >
      <q-list>
        <q-item class="q-py-md">
          <q-item-section avatar>
            <q-avatar>
              <img :src="`https://api.dicebear.com/9.x/thumbs/svg?seed=${user.account}`" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-subtitle1 text-weight-bold">{{ user.account }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item
          v-for="nav in navs"
          :key="nav.to"
          :to="nav.to"
          clickable
          active-class="text-primary"
        >
          <q-item-section avatar>
            <q-icon :name="nav.icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ nav.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue' // 1. 引入 ref
import { useUserStore } from '@/stores/user'

const user = useUserStore()

// 2. 定義側邊欄狀態
// 預設 false，show-if-above，Quasar 會自動把它變 true
const drawerOpen = ref(false)

const navs = [
  { title: '營運管理', to: '/admin/dashboardPage', icon: 'mdi-chart-areaspline' },
  { title: '食譜管理', to: '/admin/recipesPage', icon: 'mdi-cookie-edit' },
  { title: '任務管理', to: '/admin/missionsPage', icon: 'mdi-view-list' },
  { title: '使用者管理', to: '/admin/accountsPage', icon: 'mdi-account' },
  { title: '文章管理', to: '/admin/articlesPage', icon: 'mdi-book-open' },
  { title: '留言管理', to: '/admin/commentsPage', icon: 'mdi-comment' },
  { title: '回首頁', to: '/', icon: 'mdi-home' },
]
</script>

<style lang="scss">
.bg-cream {
  background-color: #fff8e7;
}

.text-primary {
  color: #ff8c42 !important;
}
.bg-primary {
  background-color: #ff8c42 !important;
}
</style>
