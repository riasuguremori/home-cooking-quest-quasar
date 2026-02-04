<template>
  <q-page-container>
    <q-page class="q-pa-md flex justify-center">
      <div class="row q-col-gutter-lg max-width-container full-width">
        <div class="col-12 col-md-3 gt-sm">
          <q-list class="q-mb-lg">
            <q-item
              v-for="(category, idx) in categoryOptions"
              :key="idx"
              clickable
              v-ripple
              :active="selectedCategory === category.label"
              active-class="bg-orange-2 text-deep-orange-7"
              class="rounded-borders"
              @click="selectedCategory = category.label"
            >
              <q-item-section avatar>
                <q-icon :name="category.icon" />
              </q-item-section>
              <q-item-section class="text-weight-bold">{{ category.label }}</q-item-section>
            </q-item>
          </q-list>
        </div>

        <div class="col-12 col-md-6">
          <div class="row q-mb-md items-center">
            <q-input
              v-model="search"
              dense
              outlined
              rounded
              placeholder="搜尋文章"
              class="col"
              bg-color="white"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-btn
              class="q-ml-md"
              color="deep-orange"
              icon="add"
              label="新增文章"
              rounded
              unelevated
              @click="openDialog"
            />
          </div>
          <q-separator class="q-mb-md" color="orange-2" />

          <ArticleCard
            v-for="article in paginatedArticles"
            :key="article._id"
            :article="article"
            @edit="openDialog"
            @delete="handleDelete"
            @like="handleLike"
            @comment="openCommentDialog"
            @share="handleShare"
          />

          <div class="row justify-center q-mt-md" v-if="totalPages > 1">
            <q-pagination
              v-model="currentPage"
              :max="totalPages"
              :max-pages="6"
              boundary-numbers
              direction-links
              color="deep-orange"
              active-color="deep-orange"
            />
          </div>
        </div>

        <div class="col-12 col-md-3 gt-sm">
          <ArticleLeaderboard :leaderboard="leaderboard" />
        </div>
      </div>

      <ArticleEditDialog
        v-model="dialog.open"
        :id="dialog.id"
        :initial-data="dialogData"
        :category-options="createArticleCategoryOptions"
        @saved="getArticles"
      />

      <ArticleCommentDialog
        v-model="commentDialog.open"
        :article-id="commentDialog.articleId"
        @comment-added="getArticles"
      />
    </q-page>
  </q-page-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useUserStore } from '@/stores/user'
import articleService from '@/services/article'
import ArticleEditDialog from '@/components/ArticleEditDialog.vue'
import ArticleCommentDialog from '@/components/ArticleCommentDialog.vue'
import ArticleCard from '@/components/ArticleCard.vue'
import ArticleLeaderboard from '@/components/ArticleLeaderboard.vue'

const categoryOptions = [
  { label: '所有文章', icon: 'feed' },
  { label: '公告', icon: 'local_fire_department' },
  { label: '閒聊', icon: 'emoji_people' },
  { label: '提問', icon: 'psychology_alt' },
  { label: '分享', icon: 'volunteer_activism' },
  { label: '曬圖', icon: 'camera_enhance' },
]
const selectedCategory = ref(categoryOptions[0].label)
const search = ref('')

const user = useUserStore()
const $q = useQuasar()

const createArticleCategoryOptions = computed(() => {
  return categoryOptions.filter((category) => {
    if (category.label === '所有文章') return false
    if (category.label === '公告') return user.isAdmin
    return true
  })
})

const dialog = ref({
  open: false,
  id: '',
})
const dialogData = ref({})
const articles = ref([])

const commentDialog = ref({
  open: false,
  articleId: '',
})

const currentPage = ref(1)
const itemsPerPage = 10

const filteredArticles = computed(() => {
  return articles.value.filter((article) => {
    const matchesCategory =
      selectedCategory.value === '所有文章' || article.category === selectedCategory.value
    const matchesSearch =
      !search.value ||
      (article.title && article.title.toLowerCase().includes(search.value.toLowerCase())) ||
      (article.content && article.content.toLowerCase().includes(search.value.toLowerCase()))
    return matchesCategory && matchesSearch
  })
})

const totalPages = computed(() => Math.ceil(filteredArticles.value.length / itemsPerPage))

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredArticles.value.slice(start, start + itemsPerPage)
})

watch([selectedCategory, search], () => {
  currentPage.value = 1
})

const leaderboard = computed(() => {
  const map = new Map()
  articles.value.forEach((article) => {
    const author = article.author
    if (!author || !author._id) return

    if (!map.has(author._id)) {
      map.set(author._id, {
        _id: author._id,
        account: author.account,
        count: 0,
      })
    }
    map.get(author._id).count++
  })

  return Array.from(map.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
})

const getArticles = async () => {
  try {
    const { data } = await articleService.getAllArticle()
    articles.value = data.result
  } catch {
    $q.notify({ message: '取得文章失敗', color: 'negative' })
  }
}

getArticles()

const openDialog = (article) => {
  if (!user.isLoggedIn) {
    $q.notify({
      color: 'warning',
      message: '請先登入後再發布文章',
      icon: 'warning',
      position: 'bottom',
    })
    return
  }
  dialog.value.open = true
  if (article) {
    dialog.value.id = article._id
    dialogData.value = article
  } else {
    dialog.value.id = ''
    dialogData.value = {}
  }
}

const handleDelete = async (id) => {
  try {
    await articleService.deleteArticle(id)
    $q.notify({ message: '刪除成功', color: 'positive', icon: 'check_circle' })
    getArticles()
  } catch {
    $q.notify({
      message: '刪除失敗',
      color: 'negative',
      icon: 'report_problem',
    })
  }
}

const handleLike = async (article) => {
  if (!user.isLoggedIn) {
    $q.notify({
      color: 'warning',
      message: '請先登入',
      icon: 'warning',
      position: 'bottom',
    })
    return
  }
  try {
    const { data } = await articleService.likeArticle(article._id)

    if (data.isLiked) {
      article.likes.push(user._id)
    } else {
      const idx = article.likes.indexOf(user._id)
      if (idx > -1) {
        article.likes.splice(idx, 1)
      }
    }
  } catch {
    $q.notify({ message: '操作失敗', color: 'negative' })
  }
}

const handleShare = () => {
  navigator.clipboard.writeText(window.location.href)
  $q.notify({
    message: '連結已複製',
    color: 'positive',
    icon: 'content_copy',
    position: 'bottom',
  })
}

const openCommentDialog = async (article) => {
  commentDialog.value.open = true
  commentDialog.value.articleId = article._id
}
</script>

<style lang="sass" scoped>
// 定義最大寬度容器，類似於 container
.max-width-container
  max-width: 1200px
  margin: 0 auto

// 導航鏈接樣式
.nav-link
  text-decoration: none
  color: inherit
  padding-bottom: 4px
  border-bottom: 2px solid transparent
  transition: all 0.3s

  &:hover
    color: $deep-orange-6

  &.active
    color: $deep-orange-8
    border-bottom: 2px solid $deep-orange

// 漸層背景
.bg-gradient-orange
  background: linear-gradient(135deg, #ff8c42 0%, #f57c00 100%)

.rounded-borders
  border-radius: 16px !important
</style>
