<template>
  <q-table
    flat
    :rows="logs"
    :columns="columns"
    row-key="_id"
    v-model:pagination="pagination"
    no-data-label="No history available."
    separator="horizontal"
  >
    <template v-slot:body-cell-type="props">
      <q-td :props="props" auto-width>
        <q-avatar
          :color="getIconStyle(props.row.type).bgColor"
          :text-color="getIconStyle(props.row.type).textColor"
          :icon="getIconStyle(props.row.type).icon"
          size="md"
        />
      </q-td>
    </template>

    <template v-slot:body-cell-info="props">
      <q-td :props="props">
        <div class="text-weight-bold">{{ props.row.title }}</div>
        <div class="text-caption text-grey-7">
          {{ props.row.description }}
        </div>
      </q-td>
    </template>

    <template v-slot:body-cell-date="props">
      <q-td :props="props">
        {{ props.value }}
      </q-td>
    </template>

    <template v-slot:body-cell-amount="props">
      <q-td :props="props">
        <div
          class="text-h6 text-weight-bold"
          :class="props.row.type === '獲得' ? 'text-green' : 'text-deep-orange'"
        >
          {{ props.row.type === '獲得' ? '+' : '-' }}{{ props.row.amount }}
        </div>
      </q-td>
    </template>

    <template v-slot:no-data>
      <div class="full-width row flex-center q-pa-lg text-grey">No history available.</div>
    </template>
  </q-table>
</template>

<script setup>
import { ref } from 'vue'
import { date } from 'quasar'

defineProps({
  logs: {
    type: Array,
    default: () => [],
  },
})

const iconStyles = {
  獲得: { icon: 'check_circle', bgColor: 'green-1', textColor: 'green' },
  消耗: { icon: 'lock_open', bgColor: 'orange-1', textColor: 'deep-orange' },
  default: { icon: 'info', bgColor: 'grey-1', textColor: 'grey' },
}

const getIconStyle = (type) => iconStyles[type] || iconStyles.default

const formatLogDate = (timestamp) => {
  if (!timestamp) return ''

  const logDate = new Date(timestamp)
  const today = new Date()
  const yesterday = date.subtractFromDate(today, { days: 1 })
  const timeStr = date.formatDate(logDate, 'hh:mm A')

  if (date.isSameDate(logDate, today, 'day')) {
    return `Today, ${timeStr}`
  } else if (date.isSameDate(logDate, yesterday, 'day')) {
    return `Yesterday, ${timeStr}`
  } else {
    return date.formatDate(logDate, 'MMM DD, YYYY, hh:mm A')
  }
}

const columns = [
  {
    name: 'type',
    label: '',
    align: 'left',
    field: 'type',
    style: 'width: 50px',
  },
  {
    name: 'info',
    label: 'Details',
    align: 'left',
    field: (row) => `${row.title} ${row.description}`,
    sortable: false,
  },
  {
    name: 'date',
    label: 'Date',
    align: 'right',
    field: 'createdAt',
    sortable: true,
    format: (val) => formatLogDate(val),
  },
  {
    name: 'amount',
    label: 'Points',
    align: 'right',
    field: 'amount',
    sortable: true,
  },
]

const pagination = ref({
  sortBy: 'date',
  descending: true,
  page: 1,
  rowsPerPage: 10,
})
</script>
