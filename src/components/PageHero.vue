<template>
  <div class="page-hero">
    <div class="page-hero-copy">
      <span class="page-kicker">{{ eyebrow }}</span>
      <h1>{{ title }}</h1>
      <p>{{ desc }}</p>
      <div v-if="actions.length" class="page-hero-actions">
        <RouterLink v-for="action in actions" :key="action.path" :to="action.path">
          <el-button :type="action.type || 'default'" round>{{ action.label }}</el-button>
        </RouterLink>
      </div>
    </div>
    <div v-if="points.length" class="page-hero-points">
      <span v-for="point in points" :key="point">{{ point }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  eyebrow: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  actions: {
    type: Array,
    default: () => [],
  },
  points: {
    type: Array,
    default: () => [],
  },
})
</script>
