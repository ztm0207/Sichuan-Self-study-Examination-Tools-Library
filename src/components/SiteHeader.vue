<template>
  <header class="site-header">
    <div class="container nav-wrap">
      <RouterLink to="/" class="brand">
        <span class="brand-mark">自</span>
        <span>
          <strong>四川小自考工具库</strong>
          <small>信息库 · 工具箱 · 过来人经验</small>
        </span>
      </RouterLink>

      <el-button class="mobile-menu-btn" @click="open = !open" aria-label="切换导航">菜单</el-button>

      <nav :class="['nav', { open }]">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          custom
          v-slot="{ navigate, isActive }"
        >
          <el-button
            :type="isActive ? 'primary' : 'default'"
            :plain="!isActive"
            round
            @click="handleNavigate(navigate)"
          >
            {{ item.label }}
          </el-button>
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { navItems } from '../js/site'

const open = ref(false)

function handleNavigate(navigate) {
  open.value = false
  navigate()
}
</script>
