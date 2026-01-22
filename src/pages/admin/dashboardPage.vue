<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-xs-12 col-sm-6 col-md-4">
        <q-card class="bg-blue-5 text-white">
          <q-card-section>
            <div class="row items-center">
              <div class="col-auto">
                <q-icon name="group" size="3.5em" />
              </div>
              <div class="col q-pl-md">
                <div class="text-h6">總使用者數</div>
                <div class="text-h4">{{ totalUsers }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-4">
        <q-card class="bg-green-5 text-white">
          <q-card-section>
            <div class="row items-center">
              <div class="col-auto">
                <q-icon name="mdi-cookie" size="3.5em" />
              </div>
              <div class="col q-pl-md">
                <div class="text-h6">食譜總數</div>
                <div class="text-h4">{{ allRecipes }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-4">
        <q-card class="bg-orange-5 text-white">
          <q-card-section>
            <div class="row items-center">
              <div class="col-auto">
                <q-icon name="mdi-cash-plus" size="3.5em" />
              </div>
              <div class="col q-pl-md">
                <div class="text-h6">今日積分發放量</div>
                <div class="text-h4">{{ getTodayPoints }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-4">
        <q-card class="bg-green-5 text-white">
          <q-card-section>
            <div class="row items-center">
              <div class="col-auto">
                <q-icon name="mdi-cash-minus" size="3.5em" />
              </div>
              <div class="col q-pl-md">
                <div class="text-h6">今日積分消耗量</div>
                <div class="text-h4">{{ consumeTodayPoints }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import userService from '@/services/user'
import recipeService from '@/services/recipe'

const $q = useQuasar()
const totalUsers = ref(0)
const allRecipes = ref(0)
const getTodayPoints = ref(0)
const consumeTodayPoints = ref(0)

const accountCount = async () => {
  try {
    const { data } = await userService.getAccountCount()
    totalUsers.value = data.result
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '無法取得使用者統計資料',
      caption: error?.response?.data?.message || '發生未知錯誤',
    })
  }
}

const allRecipe = async () => {
  try {
    const { data } = await recipeService.getAllRecipeNumber()
    allRecipes.value = data.result
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '無法取得食譜統計資料',
      caption: error?.response?.data?.message || '發生未知錯誤',
    })
  }
}

const getPoints = async () => {
  try {
    const { data } = await userService.todayPoints()
    getTodayPoints.value = data.getPoints
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '無法取得今日積分發放量',
      caption: error?.response?.data?.message || '發生未知錯誤',
    })
  }
}

const consumePoints = async () => {
  try {
    const { data } = await userService.todayPoints()
    consumeTodayPoints.value = data.consumePoints
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '無法取得今日積分消耗量',
      caption: error?.response?.data?.message || '發生未知錯誤',
    })
  }
}

accountCount()
allRecipe()
getPoints()
consumePoints()
</script>

<style lang="sass" scoped>
.q-card
  min-height: 120px
</style>
