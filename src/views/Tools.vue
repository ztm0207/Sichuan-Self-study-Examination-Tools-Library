<template>
  <section class="section">
    <div class="container">
      <SectionTitle
        eyebrow="工具箱"
        title="自考工具箱"
        desc="把复习计划、拿证时间和专业难度放在一起，方便先做自查和规划。"
      />

      <el-tabs v-model="activeTab" class="tool-tabs">
        <el-tab-pane label="复习计划生成器" name="study-plan">
          <StudyPlanGenerator />
        </el-tab-pane>
        <el-tab-pane label="拿证时间计算器" name="certificate-time">
          <CertificateCalculator />
        </el-tab-pane>
        <el-tab-pane label="专业难度测评" name="major-assessment">
          <MajorAssessment />
        </el-tab-pane>
      </el-tabs>

    </div>
  </section>
</template>

<script setup>
import SectionTitle from '../components/SectionTitle.vue'
import StudyPlanGenerator from '../components/tools/StudyPlanGenerator.vue'
import CertificateCalculator from '../components/tools/CertificateCalculator.vue'
import MajorAssessment from '../components/tools/MajorAssessment.vue'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const validTabs = new Set(['study-plan', 'certificate-time', 'major-assessment'])
const activeTab = ref(validTabs.has(route.query.tab) ? route.query.tab : 'study-plan')

watch(
  () => route.query.tab,
  (tab) => {
    if (validTabs.has(tab)) activeTab.value = tab
  }
)
</script>
