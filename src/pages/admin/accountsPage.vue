<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="row">
        <div class="col-12">
          <q-table :rows="users" :columns="columns" row-key="_id" flat bordered :filter="filter">
            <template #top>
              <q-toolbar>
                <q-toolbar-title>使用者管理</q-toolbar-title>
                <q-space />
                <q-input v-model="filter" dense debounce="500" placeholder="搜尋" color="primary">
                  <template #append>
                    <q-icon name="search" />
                  </template>
                </q-input>
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
            <div class="text-h6">{{ 編輯使用者 }}</div>
          </q-card-section>

          <q-card-section class="q-gutter-md">
            <q-input
              v-model="form.account"
              label="使用者帳號"
              :rules="[(val) => !!val || '更新使用者帳號']"
            />

            <q-input
              v-model="form.points.current"
              label="使用者餘額"
              :rules="[(val) => !!val || '更新使用者餘額']"
            />

            <q-input
              v-model="form.points.totalEarned"
              label="使用者總積分"
              :rules="[(val) => !!val || '更新使用者總積分']"
            />

            <q-input
              v-model="form.role"
              :options="userOptions"
              label="身份"
              :rules="[(val) => !!val || '更新身份']"
            />
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md">
            <q-btn flat label="取消" color="negative" @click="closeDialog" />
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
import userService from '@/services/user'

const $q = useQuasar()
const users = ref([])
const filter = ref('')

const dialog = ref({
  open: false,
  id: '',
})

const getEmptyForm = () => ({
  account: 0,
  points: { current: 0, totalEarned: 0 },
  role: '',
  missionStatus: { lastLoginDate: '', dailyPostCount: 0, dailyRecipeCount: 0 },
})

const form = ref(getEmptyForm())

const userOptions = ['admin', 'user']

const columns = [
  { name: 'account', label: '使用者帳號', field: 'account', align: 'left', sortable: true },
  {
    name: 'current',
    label: '餘額',
    field: (row) => row.points.current,
    align: 'right',
    sortable: true,
  },
  {
    name: 'totalEarned',
    label: '總積分',
    field: (row) => row.points.totalEarned,
    align: 'right',
    sortable: true,
  },
  {
    name: 'role',
    label: '身份',
    field: 'role',
    format: (val) => val || '未知',
    align: 'left',
    sortable: true,
  },
  {
    name: 'dailyPostCount',
    label: '發文數',
    field: (row) => row.missionStatus.dailyPostCount,
    align: 'left',
    sortable: true,
  },
  {
    name: 'dailyRecipeCount',
    label: '新增食譜數',
    field: (row) => row.missionStatus.dailyRecipeCount,
    align: 'left',
    sortable: true,
  },
  {
    name: 'lastLoginDate',
    label: '最後登入時間',
    field: (val) => new Date(val.missionStatus.lastLoginDate).toLocaleString(),
    align: 'left',
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

const getUsers = async () => {
  try {
    const { data } = await userService.getAllAccount()
    users.value = data.result
  } catch (error) {
    console.log(error)
    $q.notify({ message: '取得使用者失敗', color: 'negative' })
  }
}

const openDialog = (user) => {
  dialog.value.open = true
  if (user) {
    dialog.value.id = user._id

    const tempForm = JSON.parse(JSON.stringify(user))

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
    if (dialog.value.id) {
      await userService.updateUser(dialog.value.id, form.value)
      $q.notify({ message: '更新成功', color: 'positive' })
    } else {
      await userService.create(form.value)
      $q.notify({ message: '新增成功', color: 'positive' })
    }
    closeDialog()
    getUsers()
  } catch (error) {
    console.log(error)
    const message = error?.response?.data?.message || '發生錯誤'
    $q.notify({ message, color: 'negative' })
  }
}

getUsers()
</script>
