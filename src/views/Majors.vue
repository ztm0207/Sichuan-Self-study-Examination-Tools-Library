<template>
  <section class="section">
    <div class="container">
      <PageHero
        eyebrow="查专业"
        title="按专业查看开设学校"
        desc="以“学校 + 专业”为一条记录，快速筛选专业、层次、开设学校，并进入详情查看统考省考课程。"
        :actions="[
          { label: '查费用表', path: '/prices', type: 'primary' },
          { label: '按学校查', path: '/schools' },
        ]"
        :points="['专业名称', '开设学校', '统考省考']"
      />

      <div class="filter-bar wrap">
        <el-input v-model="keyword" clearable placeholder="搜索专业或学校，例如：行政管理、四川大学、护理学" />
        <el-select v-model="level" placeholder="全部层次" clearable>
          <el-option label="全部层次" value="" />
          <el-option v-for="item in schoolMajorLevels" :key="item" :label="item" :value="item" />
        </el-select>
        <el-select v-model="schoolId" placeholder="全部学校" clearable filterable>
          <el-option label="全部学校" value="" />
          <el-option v-for="item in schools" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </div>

      <div class="stat-strip">
        <el-card shadow="never"><el-statistic title="当前结果" :value="filteredOfferings.length" /></el-card>
        <el-card shadow="never"><el-statistic title="院校专业" :value="schoolMajorOfferings.length" /></el-card>
        <el-card shadow="never"><el-statistic title="学校数量" :value="schools.length" /></el-card>
      </div>

      <div class="major-grid">
        <RouterLink
          v-for="item in pagedOfferings"
          :key="item.id"
          :to="majorDetailPath(item)"
          class="card-link"
        >
          <el-card class="major-card" shadow="hover">
            <div class="major-top">
              <h3>{{ item.name }}</h3>
              <el-tag effect="plain" round>{{ item.level }}</el-tag>
            </div>
            <p>{{ item.schoolName }} · 专业代码：{{ item.code || '待核对' }}</p>
            <div class="score-row">
              <span>助学价格</span>
              <strong>{{ item.priceText }}</strong>
            </div>
            <div class="score-row">
              <span>论文费用</span>
              <strong>{{ item.thesisPriceText }}</strong>
            </div>
            <div class="tag-list">
              <el-tag v-if="item.category" effect="plain" round>{{ item.category }}</el-tag>
              <el-tag v-if="item.totalCredits" effect="plain" round>{{ item.totalCredits }} 学分</el-tag>
              <template v-if="hasCoursePlan(item)">
                <el-tag effect="plain" round>统考 {{ item.unifiedCourseCount }}</el-tag>
                <el-tag effect="plain" round>省考 {{ item.schoolExamCourseCount }}</el-tag>
              </template>
              <el-tag v-else type="info" effect="plain" round>课程需核实</el-tag>
            </div>
          </el-card>
        </RouterLink>
      </div>

      <el-pagination
        v-if="filteredOfferings.length > pageSize"
        v-model:current-page="currentPage"
        class="list-pagination"
        background
        layout="prev, pager, next, total"
        :page-size="pageSize"
        :total="filteredOfferings.length"
      />

      <el-empty v-if="!filteredOfferings.length" description="没有找到匹配专业" />
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import PageHero from '../components/PageHero.vue'
import { schoolMajorLevels, schoolMajorOfferings, schools } from '../js/schools'

const keyword = ref('')
const level = ref('')
const schoolId = ref('')
const currentPage = ref(1)
const pageSize = 48

const filteredOfferings = computed(() => {
  const query = keyword.value.trim()

  return schoolMajorOfferings.filter((item) => {
    const text = `${item.name}${item.code}${item.schoolName}${item.category}`
    const matchKeyword = query ? text.includes(query) : true
    const matchLevel = level.value ? item.level === level.value : true
    const matchSchool = schoolId.value ? item.schoolId === schoolId.value : true
    return matchKeyword && matchLevel && matchSchool
  })
})

const pagedOfferings = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredOfferings.value.slice(start, start + pageSize)
})

watch([keyword, level, schoolId], () => {
  currentPage.value = 1
})

function majorDetailPath(item) {
  return `/majors/${item.planId || item.id}`
}

function hasCoursePlan(item) {
  return (item.unifiedCourseCount || 0) > 0 || (item.schoolExamCourseCount || 0) > 0
}
</script>
