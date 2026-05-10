<template>
  <section class="section">
    <div class="container">
      <PageHero
        eyebrow="复习计划生成器"
        title="按专业课程强度安排复习"
        desc="先选择应用型专业，再勾选本次准备考试的统考、省考课程，结合剩余天数、基础和每天可用时间生成复习节奏。"
        :actions="[
          { label: '开始生成计划', path: '/study-plan', type: 'primary' },
          { label: '看资料整理计划', path: '/resources' },
        ]"
        :points="['按专业带入课程', '识别课程强度', '生成阶段计划']"
      />

      <StudyPlanGenerator />

      <el-card class="inline-tip-card mt-section" shadow="never">
        <div>
          <h3>复习计划要跟报考节奏一起看</h3>
          <p>数学、英语、技术类课程通常需要更多练习时间；实践、论文类更偏流程节点，不适合和笔试课程放在一起算复习量。</p>
        </div>
        <RouterLink to="/certificate-time"><el-button type="primary" round>估算拿证时间</el-button></RouterLink>
      </el-card>
    </div>
  </section>
</template>

<script setup>
import PageHero from '../components/PageHero.vue'
import StudyPlanGenerator from '../components/tools/StudyPlanGenerator.vue'
</script>
