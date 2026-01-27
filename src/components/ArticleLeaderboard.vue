<template>
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
</template>

<script setup>
defineProps({
  leaderboard: {
    type: Array,
    required: true,
  },
})
</script>

<style lang="sass" scoped>
.rounded-borders
  border-radius: 16px !important
</style>
