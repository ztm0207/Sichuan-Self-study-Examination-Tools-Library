<template>
  <div class="app-shell">
    <SiteHeader />
    <main>
      <RouterView />
    </main>
    <div class="site-floating-actions" aria-label="快捷操作">
      <RouterLink to="/route-test">免费测路线</RouterLink>
      <a href="#consult">人工核对</a>
    </div>
    <SiteFooter />
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>
