<template>
  <section class="section">
    <div class="container">
      <PageHero
        eyebrow="查费用"
        title="按学校和专业核对价格"
        desc="把助学价格和论文费用单独拎出来看，适合报名之前做预算、比学校、核对费用边界。"
        :actions="[
          { label: '按专业查学校', path: '/majors', type: 'primary' },
          { label: '按学校查专业', path: '/schools' },
        ]"
        :points="['助学价格', '论文费用', '待核对项']"
      />

      <div class="filter-bar wrap">
        <el-input v-model="keyword" clearable placeholder="搜索学校或专业，例如：四川大学、行政管理" />
        <el-select v-model="level" placeholder="全部层次" clearable>
          <el-option label="全部层次" value="" />
          <el-option v-for="item in schoolMajorLevels" :key="item" :label="item" :value="item" />
        </el-select>
        <el-select v-model="priceStatus" placeholder="费用状态" clearable>
          <el-option label="全部费用" value="" />
          <el-option label="价格已录入" value="ready" />
          <el-option label="价格待核对" value="missing" />
        </el-select>
      </div>

      <div class="stat-strip">
        <el-card shadow="never"><el-statistic title="当前结果" :value="filteredOfferings.length" /></el-card>
        <el-card shadow="never"><el-statistic title="价格待核对" :value="missingPriceCount" /></el-card>
        <el-card shadow="never"><el-statistic title="论文费待核对" :value="missingThesisCount" /></el-card>
      </div>

      <el-table :data="pagedOfferings" border stripe class="price-table">
        <el-table-column prop="schoolName" label="学校" min-width="180" />
        <el-table-column prop="name" label="专业" min-width="170" />
        <el-table-column prop="level" label="层次" width="110" />
        <el-table-column prop="priceText" label="助学价格" min-width="140" />
        <el-table-column prop="thesisPriceText" label="论文费用" min-width="140" />
        <el-table-column label="课程" min-width="150">
          <template #default="{ row }">
            <span v-if="hasCoursePlan(row)">统考 {{ row.unifiedCourseCount }} / 省考 {{ row.schoolExamCourseCount }}</span>
            <span v-else>课程需核实</span>
          </template>
        </el-table-column>
        <el-table-column label="入口" width="120" fixed="right">
          <template #default="{ row }">
            <RouterLink :to="majorDetailPath(row)">
              <el-button text type="primary">查看</el-button>
            </RouterLink>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-if="filteredOfferings.length > pageSize"
        v-model:current-page="currentPage"
        class="list-pagination"
        background
        layout="prev, pager, next, total"
        :page-size="pageSize"
        :total="filteredOfferings.length"
      />

      <el-empty v-if="!filteredOfferings.length" description="没有找到匹配费用记录" />
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import PageHero from '../components/PageHero.vue'
import { schoolMajorLevels, schoolMajorOfferings } from '../js/schools'

const keyword = ref('')
const level = ref('')
const priceStatus = ref('')
const currentPage = ref(1)
const pageSize = 50

const filteredOfferings = computed(() => {
  const query = keyword.value.trim()

  return schoolMajorOfferings.filter((item) => {
    const text = `${item.name}${item.code}${item.schoolName}${item.category}`
    const matchKeyword = query ? text.includes(query) : true
    const matchLevel = level.value ? item.level === level.value : true
    const isMissing = item.priceText === '待核对' || item.thesisPriceText === '待核对'
    const matchPrice =
      priceStatus.value === 'missing'
        ? isMissing
        : priceStatus.value === 'ready'
          ? !isMissing
          : true

    return matchKeyword && matchLevel && matchPrice
  })
})

const missingPriceCount = computed(() => filteredOfferings.value.filter((item) => item.priceText === '待核对').length)
const missingThesisCount = computed(() => filteredOfferings.value.filter((item) => item.thesisPriceText === '待核对').length)
const pagedOfferings = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredOfferings.value.slice(start, start + pageSize)
})

watch([keyword, level, priceStatus], () => {
  currentPage.value = 1
})

function majorDetailPath(item) {
  return `/majors/${item.planId || item.id}`
}

function hasCoursePlan(item) {
  return (item.unifiedCourseCount || 0) > 0 || (item.schoolExamCourseCount || 0) > 0
}
</script>
