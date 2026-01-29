import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const _id = ref('')
    const account = ref('')
    const role = ref('user')
    const token = ref('')
    const points = ref(0)
    const pointLog = ref([])
    const lastReadLogDate = ref(null)

    const isLoggedIn = computed(() => token.value.length > 0)
    const isAdmin = computed(() => role.value === 'admin')

    const login = (data) => {
      account.value = data.account
      role.value = data.role
      points.value = data.points
      _id.value = data._id
      pointLog.value = data.pointLog
      lastReadLogDate.value = data.lastReadLogDate

      if (data.token) {
        token.value = data.token
      }
    }

    const logout = () => {
      account.value = ''
      role.value = 'user'
      token.value = ''
      points.value = 0
      _id.value = ''
      pointLog.value = []
      lastReadLogDate.value = null
    }

    return {
      _id,
      account,
      role,
      token,
      isLoggedIn,
      isAdmin,
      login,
      logout,
      points,
      pointLog,
      lastReadLogDate,
    }
  },
  {
    persist: {
      key: 'user',
      pick: ['token'],
    },
  },
)
