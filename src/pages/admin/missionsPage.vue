<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="row">
        <div class="col-12">
          <q-table :rows="missions" :columns="columns" row-key="_id" flat bordered :filter="filter">
            <template #top>
              <q-toolbar>
                <q-toolbar-title>任務管理</q-toolbar-title>
                <q-space />
                <q-input v-model="filter" dense debounce="500" placeholder="搜尋" color="primary">
                  <template #append>
                    <q-icon name="search" />
                  </template>
                </q-input>
                <q-btn
                  color="primary"
                  icon="add"
                  label="新增任務"
                  @click="openDialog(null)"
                  class="q-ml-md"
                />
              </q-toolbar>
            </template>
            <template #body-cell-actions="props">
              <q-td :props="props">
                <q-btn icon="edit" flat round @click="openDialog(props.row)" />
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </div>

    <q-dialog v-model="dialog.open" persistent>
      <q-card style="min-width: 80vw; max-width: 80vw">
        <q-form @submit.prevent="submit">
          <q-card-section>
            <div class="text-h6">{{ dialog.id ? '編輯任務' : '新增任務' }}</div>
          </q-card-section>

          <q-card-section class="q-gutter-md">
            <q-select
              v-model="form.code"
              :options="codeOptions"
              label="任務代碼"
              :rules="[(val) => !!val || '請輸入任務代碼']"
            />

            <q-input
              v-model="form.name"
              label="任務名稱"
              :rules="[(val) => !!val || '請輸入任務名稱']"
            />

            <q-editor v-model="form.description" min-height="10rem" placeholder="任務說明" />

            <q-input
              v-model="form.pointsReward"
              label="任務積分"
              :rules="[(val) => !!val || '請輸入任務積分']"
            />

            <q-select
              v-model="form.limit"
              :options="limitOptions"
              label="限制"
              :rules="[(val) => !!val || '請選擇限制']"
            />
            <q-input
              v-model.number="form.dailyLimit"
              type="number"
              label="每日上限"
              :rules="[(val) => val >= 0 || '上限不能小於 0']"
            />
            <q-select
              v-model="form.isActive"
              :options="isActiveOptions"
              label="狀態"
              emit-value
              map-options
              :rules="[(val) => val !== null || '請選擇狀態']"
            />
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md">
            <q-btn flat label="取消" color="negative" @click="closeDialog" :disable="loading" />
            <q-btn type="submit" label="儲存" color="primary" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import missionService from '@/services/mission'

const $q = useQuasar()
const missions = ref([])
const filter = ref('')
const loading = ref(false)

const dialog = ref({
  open: false,
  id: '',
})

const getEmptyForm = () => ({
  code: '',
  name: '',
  description: '',
  pointsReward: 0,
  limit: '每日',
  dailyLimit: 0,
  isActive: 'true',
})

const form = ref(getEmptyForm())
const codeOptions = ['每日簽到', '發文', '解鎖食譜', '官方發放', '新增食譜']
const limitOptions = ['唯一', '每日', '無限制']
const isActiveOptions = ['true', 'false']

const columns = [
  { name: 'code', label: '任務代碼', field: 'code', align: 'left', sortable: true },
  { name: 'name', label: '任務名字', field: 'name', align: 'left', sortable: true },
  {
    name: 'pointsReward',
    label: '任務積分',
    field: 'pointsReward',
    align: 'right',
    sortable: true,
  },
  {
    name: 'limit',
    label: '限制',
    field: 'limit',
    format: (val) => val || '未知',
    align: 'right',
    sortable: true,
  },
  {
    name: 'dailyLimit',
    label: '每日上限',
    field: 'dailyLimit',
    align: 'right',
    sortable: true,
  },
  {
    name: 'createdAt',
    label: '創建日期',
    field: 'createdAt',
    format: (val) => new Date(val).toLocaleString(),
    align: 'left',
    sortable: true,
  },
  {
    name: 'updatedAt',
    label: '更新日期',
    field: 'updatedAt',
    format: (val) => new Date(val).toLocaleString(),
    align: 'left',
    sortable: true,
  },
  { name: 'actions', label: '操作', align: 'center' },
]

const getMissions = async () => {
  try {
    const { data } = await missionService.getAllMission()
    missions.value = data.result
  } catch {
    $q.notify({ message: '取得任務失敗', color: 'negative' })
  }
}

const openDialog = (mission) => {
  dialog.value.open = true
  if (mission) {
    dialog.value.id = mission._id

    const tempForm = JSON.parse(JSON.stringify(mission))

    form.value = {
      ...tempForm,
    }
  } else {
    dialog.value.id = ''
    form.value = getEmptyForm()
  }
}

const closeDialog = () => {
  dialog.value.open = false
}

const submit = async () => {
  try {
    loading.value = true
    if (dialog.value.id) {
      await missionService.updateMission(dialog.value.id, form.value)
      $q.notify({ message: '更新成功', color: 'positive' })
    } else {
      await missionService.createMission(form.value)
      $q.notify({ message: '新增成功', color: 'positive' })
    }
    closeDialog()
    getMissions()
  } catch (error) {
    console.log(error)
    const message = error?.response?.data?.message || '發生錯誤'
    $q.notify({ message, color: 'negative' })
  }
}

getMissions()
</script>
