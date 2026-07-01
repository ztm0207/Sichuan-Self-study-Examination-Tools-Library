<template>
  <div class="app-shell">
    <SiteHeader />
    <main>
      <RouterView />
    </main>
    <div class="site-floating-actions" aria-label="快捷操作">
      <RouterLink to="/route-test">免费测路线</RouterLink>
      <button type="button" @click="scrollToConsult">人工核对</button>
    </div>
    <SiteFooter />
  </div>
</template>

<script setup>
import { nextTick } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'

const router = useRouter()

async function scrollToConsult() {
  let target = document.getElementById('consult')

  if (!target) {
    await router.push('/route-test')
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 80))
    target = document.getElementById('consult')
  }

  target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>
