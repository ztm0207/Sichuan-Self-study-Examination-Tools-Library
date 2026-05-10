<template>
  <div class="section-title">
    <el-tag v-if="eyebrow" class="eyebrow" effect="light" round>{{ eyebrow }}</el-tag>
    <h2>{{ title }}</h2>
    <p v-if="desc" class="section-desc">{{ desc }}</p>
  </div>
</template>

<script setup>
defineProps({
  eyebrow: String,
  title: {
    type: String,
    required: true,
  },
  desc: String,
})
</script>
