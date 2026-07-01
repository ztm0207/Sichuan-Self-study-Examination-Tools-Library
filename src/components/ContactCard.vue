<template>
  <el-card class="contact-card" shadow="hover">
    <div class="contact-copy">
      <span class="contact-kicker">{{ kicker }}</span>
      <h2>{{ title }}</h2>
      <p>{{ desc }}</p>
      <ul class="contact-list">
        <li v-for="tip in tips" :key="tip">{{ tip }}</li>
      </ul>
    </div>
    <div class="contact-side">
      <div class="contact-qr">
        <img v-if="contactInfo.qrCode" :src="contactInfo.qrCode" alt="微信二维码" />
        <div v-else class="contact-qr-placeholder">
          <span>微信号</span>
          <strong>{{ contactInfo.wechat }}</strong>
        </div>
      </div>
      <div class="contact-wechat">
        <span>人工核对路线</span>
        <strong>{{ contactInfo.wechat }}</strong>
        <small>扫码添加，或直接搜索微信号，把测评结果发来核一下。</small>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { contactInfo } from '../js/site'

defineProps({
  kicker: {
    type: String,
    default: '轻咨询入口',
  },
  title: {
    type: String,
    default: contactInfo.title,
  },
  desc: {
    type: String,
    default: contactInfo.desc,
  },
  tips: {
    type: Array,
    default: () => contactInfo.tips,
  },
})
</script>
