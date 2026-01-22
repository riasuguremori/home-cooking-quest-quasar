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

          <q-card
            v-for="article in paginatedArticles"
            :key="article._id"
            flat
            class="bg-white q-mb-lg rounded-borders post-card"
          >
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img
                    :src="`https://api.dicebear.com/9.x/thumbs/svg?seed=${article.author?.account}`"
                  />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-bold">{{
                  article.author?.account || '匿名'
                }}</q-item-label>
                <q-item-label caption>{{
                  new Date(article.createdAt).toLocaleDateString()
                }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-btn flat round icon="more_horiz">
                  <q-menu>
                    <q-list style="min-width: 100px">
                      <q-item clickable v-close-popup @click="openDialog(article)">
                        <q-item-section>編輯</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="handleDelete(article._id)">
                        <q-item-section class="text-negative">刪除</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-item-section>
            </q-item>

            <div
              v-if="article.imageUrl && article.imageUrl.length > 0"
              class="row q-col-gutter-xs q-mt-sm"
            >
              <div
                v-for="(img, idx) in article.imageUrl"
                :key="idx"
                :class="{
                  'col-12': article.imageUrl.length === 1,
                  'col-6': article.imageUrl.length === 2 || article.imageUrl.length === 4,
                  'col-4': article.imageUrl.length === 3 || article.imageUrl.length >= 5,
                }"
              >
                <q-img
                  :src="img"
                  :ratio="article.imageUrl.length === 1 ? 4 / 3 : 1"
                  fit="cover"
                  class="rounded-borders"
                  :style="article.imageUrl.length === 1 ? '' : 'height: 200px'"
                />
              </div>
            </div>

            <q-card-section>
              <div class="text-h6 text-weight-bold q-mt-sm q-mb-xs">{{ article.title }}</div>
              <div class="text-body2 text-grey-8 q-mb-md">
                {{ article.content }}
              </div>

              <div class="row q-gutter-sm q-mb-md">
                <q-chip
                  color="orange-1"
                  text-color="deep-orange"
                  size="sm"
                  class="text-weight-bold"
                  >{{ article.category }}</q-chip
                >
              </div>

              <q-separator class="q-my-md" color="grey-2" />

              <div class="row items-center justify-between">
                <div class="row q-gutter-x-md">
                  <div class="row items-center">
                    <q-btn
                      flat
                      round
                      dense
                      :icon="article.likes.includes(user._id) ? 'favorite' : 'favorite_border'"
                      :color="article.likes.includes(user._id) ? 'red' : 'grey-5'"
                      size="sm"
                      @click="handleLike(article)"
                    />
                    <span class="text-grey-6 text-caption q-ml-xs">{{ article.likes.length }}</span>
                  </div>
                  <div
                    class="flex items-center text-grey-6 cursor-pointer"
                    @click="openCommentDialog(article)"
                  >
                    <q-icon name="chat_bubble_outline" size="20px" class="q-mr-xs" />
                    <span class="text-weight-medium">{{ article.comments || 0 }}</span>
                  </div>
                  <div class="flex items-center text-grey-6 cursor-pointer" @click="handleShare">
                    <q-icon name="share" size="20px" />
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

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
          <q-card flat class="bg-white q-mb-lg rounded-borders">
            <q-card-section>
              <div class="row items-center q-mb-md">
                <q-icon name="emoji_events" color="deep-orange" class="q-mr-sm" size="xs" />
                <div class="text-subtitle1 text-weight-bold">總發文數排行榜</div>
              </div>

              <q-list class="q-gutter-y-sm">
                <q-item v-for="(rank, idx) in leaderboard" :key="rank._id" class="q-px-none">
                  <q-item-section avatar class="q-pr-sm" style="min-width: 20px">
                    <span class="text-grey-5 text-weight-bold">{{ idx + 1 }}</span>
                  </q-item-section>
                  <q-item-section avatar>
                    <q-avatar size="36px">
                      <img :src="`https://api.dicebear.com/9.x/thumbs/svg?seed=${rank.account}`" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">{{ rank.account }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <div class="text-weight-bold text-grey-9">{{ rank.count }}</div>
                    <div class="text-caption text-grey-5" style="font-size: 10px">POSTS</div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <q-dialog v-model="dialog.open" persistent>
        <q-card style="min-width: 500px; max-width: 90vw" class="rounded-borders">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6 text-weight-bold">{{ dialog.id ? '編輯文章' : '新增文章' }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-input
                v-model="form.title"
                label="標題"
                outlined
                :rules="[(val) => !!val || '請輸入標題']"
              />

              <div
                v-if="
                  form.image.length === 0 && form.existingImage && form.existingImage.length > 0
                "
                class="q-mb-sm"
              >
                <div class="text-caption text-grey">目前圖片</div>
                <q-img
                  :src="form.existingImage"
                  style="width: 200px; height: auto; margin-bottom: 10px; border-radius: 8px"
                  fit="cover"
                />
              </div>
              <VueFileAgent
                ref="mainImageAgent"
                v-model="form.image"
                v-model:raw-model-value="form.rawImage"
                accept="image/png,image/jpeg,image/jpg"
                deletable
                :maxFiles="4"
                multiple
                max-size="1MB"
                help-text="選擇檔案或拖曳到這裡"
                :error-text="{
                  type: '檔案格式不支援',
                  size: '檔案大小不能超過 1MB',
                }"
              />

              <q-select
                v-model="form.category"
                :options="createArticleCategoryOptions"
                option-label="label"
                option-value="label"
                emit-value
                map-options
                label="分類"
                outlined
                :rules="[(val) => !!val || '請選擇分類']"
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <q-icon :name="scope.opt.icon" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-input
                v-model="form.content"
                type="textarea"
                label="內容"
                outlined
                rows="10"
                :rules="[(val) => !!val || '請輸入內容']"
              />

              <q-card-actions align="right" class="q-pa-md">
                <q-btn flat label="取消" color="negative" @click="closeDialog" :disable="loading" />
                <q-btn type="submit" label="送出" color="primary" />
              </q-card-actions>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="commentDialog.open">
        <q-card style="min-width: 500px; max-width: 90vw" class="rounded-borders">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6 text-weight-bold">留言</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section style="max-height: 60vh" class="scroll">
            <div v-if="commentDialog.loading" class="row justify-center q-pa-md">
              <q-spinner color="deep-orange" size="2em" />
            </div>
            <div
              v-else-if="commentDialog.comments.length === 0"
              class="text-center text-grey q-pa-md"
            >
              尚未有留言，成為第一個留言的人吧！
            </div>
            <q-list v-else separator>
              <q-item v-for="comment in commentDialog.comments" :key="comment._id">
                <q-item-section avatar top>
                  <q-avatar size="md">
                    <img
                      :src="`https://api.dicebear.com/9.x/thumbs/svg?seed=${comment.author?.account}`"
                    />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{
                    comment.author?.account || '匿名'
                  }}</q-item-label>
                  <q-item-label caption>{{
                    new Date(comment.createdAt).toLocaleString()
                  }}</q-item-label>
                  <q-item-label class="q-mt-xs text-body2 text-grey-9">{{
                    comment.content
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-separator />

          <q-card-section class="bg-grey-1">
            <q-input
              v-model="commentContent"
              outlined
              dense
              placeholder="寫下你的想法..."
              bg-color="white"
              @keyup.enter="submitComment"
            >
              <template v-slot:after>
                <q-btn
                  round
                  dense
                  flat
                  icon="send"
                  color="deep-orange"
                  @click="submitComment"
                  :disable="!commentContent.trim()"
                />
              </template>
            </q-input>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-page>
  </q-page-container>
</template>

<script setup>
import { ref, useTemplateRef, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useUserStore } from '@/stores/user'
import articleService from '@/services/article'
import serviceComment from '@/services/comment'

const categoryOptions = [
  { label: '所有文章', icon: 'feed' },
  { label: '閒聊', icon: 'emoji_people' },
  { label: '提問', icon: 'psychology_alt' },
  { label: '分享', icon: 'volunteer_activism' },
  { label: '曬圖', icon: 'camera_enhance' },
  { label: '公告', icon: 'local_fire_department' },
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
const articles = ref([])
const mainImageAgent = useTemplateRef('mainImageAgent')
const loading = ref(false)

const getEmptyForm = () => ({
  title: '',
  content: '',
  description: '',
  category: '',
  image: [],
  rawImage: [],
  existingImage: null, // 用來存舊圖網址顯示用
})

const form = ref(getEmptyForm())

const commentDialog = ref({
  open: false,
  articleId: '',
  comments: [],
  loading: false,
})
const commentContent = ref('')

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

    const tempForm = JSON.parse(JSON.stringify(article))

    // 設定表單資料
    form.value = {
      ...tempForm,
      // 主圖：image 設為空陣列供上傳用，existingImage 存網址
      image: [],
      existingImage: article.imageUrl,
    }
  } else {
    dialog.value.id = ''
    form.value = getEmptyForm()
  }
  if (mainImageAgent.value) {
    mainImageAgent.value.deleteFileRecord()
  }
}

const closeDialog = () => {
  dialog.value.open = false
}

const onSubmit = async () => {
  if (form.value.image.some((file) => file.error)) {
    $q.notify({ message: '主圖片格式不符或檔案過大', color: 'negative' })
    return
  }

  if (!dialog.value.id && form.value.image.length === 0) {
    $q.notify({ message: '請上傳主圖片', color: 'negative' })
    return
  }

  const fd = new FormData()
  fd.append('title', form.value.title)
  fd.append('content', form.value.content)
  fd.append('category', form.value.category)
  if (form.value.image.length > 0) {
    form.value.image.forEach((image) => {
      fd.append('image', image.file)
    })
  }

  try {
    loading.value = true
    if (dialog.value.id) {
      await articleService.updateArticle(dialog.value.id, fd)
      $q.notify({ message: '文章更新成功', color: 'positive', icon: 'check_circle' })
    } else {
      await articleService.createArticle(fd)
      $q.notify({ message: '文章發布成功', color: 'positive', icon: 'check_circle' })
    }
    dialog.value.open = false
    closeDialog()
    getArticles()
  } catch (error) {
    console.log(error)
    $q.notify({
      color: 'negative',
      message: '發布失敗',
      icon: 'report_problem',
      position: 'bottom',
    })
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
  commentDialog.value.comments = []
  commentContent.value = ''
  commentDialog.value.loading = true

  try {
    const { data } = await serviceComment.getArticleComment(article._id)
    commentDialog.value.comments = data.result
  } catch (error) {
    console.error(error)
  } finally {
    commentDialog.value.loading = false
  }
}

const submitComment = async () => {
  if (!user.isLoggedIn) {
    $q.notify({
      color: 'warning',
      message: '請先登入',
      icon: 'warning',
      position: 'bottom',
    })
    return
  }

  if (!commentContent.value.trim()) return

  try {
    const payload = {
      content: commentContent.value,
      article: commentDialog.value.articleId,
    }
    const { data } = await serviceComment.createComment(payload)

    commentDialog.value.comments.unshift({ ...data.result, author: { account: user.account } })
    commentContent.value = ''

    getArticles()
  } catch (error) {
    console.log(error)
    $q.notify({
      color: 'negative',
      message: '留言失敗',
      icon: 'report_problem',
      position: 'bottom',
    })
  }
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
  background: linear-gradient(135deg, #f57c00 0%, #e64a19 100%)

.post-card
  transition: transform 0.2s
  &:hover
    box-shadow: 0 4px 12px rgba(0,0,0,0.05)

.rounded-borders
  border-radius: 16px !important
</style>
