<template>
  <section class="section">
    <div class="container">
      <PageHero
        eyebrow="查专业"
        title="按专业查看开设学校"
        desc="已经有目标专业，就在这里反查开设学校、费用、论文和课程压力；还没想清楚，就先去路线测评缩小范围。"
        :actions="[
          { label: '不知道选啥先测评', path: '/route-test', type: 'primary' },
          { label: '查费用表', path: '/prices' },
          { label: '按学校查', path: '/schools' },
        ]"
        :points="['专业反查学校', '费用论文对比', '课程压力筛选']"
      />

      <el-card class="major-guide-card" shadow="never">
        <div>
          <span>怎么用</span>
          <h2>先确定专业，再比较学校</h2>
          <p>这个页面适合你已经有大概方向之后用。比如你想看行政管理，就直接搜行政管理，再比较不同学校的费用、论文费用、统考省考课程和核验状态。</p>
        </div>
        <RouterLink to="/route-test">
          <el-button type="primary" round>我还不知道选什么</el-button>
        </RouterLink>
      </el-card>

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
        <el-select v-model="category" placeholder="全部方向" clearable>
          <el-option label="全部方向" value="" />
          <el-option v-for="item in schoolMajorCategories" :key="item" :label="item" :value="item" />
        </el-select>
      </div>

      <div class="major-quick-filter">
        <span>快速筛：</span>
        <el-checkbox-group v-model="quickFilters">
          <el-checkbox-button
            v-for="item in quickFilterOptions"
            :key="item.value"
            :label="item.value"
          >
            {{ item.label }}
          </el-checkbox-button>
        </el-checkbox-group>
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
              <el-tag :type="getVerificationTone(item)" effect="plain" round>{{ getVerificationText(item) }}</el-tag>
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
import { useRoute } from 'vue-router'
import PageHero from '../components/PageHero.vue'
import { schoolMajorCategories, schoolMajorLevels, schoolMajorOfferings, schools } from '../js/schools'
import { analyzeMajorDifficulty } from '../js/majorDifficulty'

const route = useRoute()
const keyword = ref(getQueryText(route.query.keyword))
const level = ref(getQueryText(route.query.level))
const schoolId = ref(getQueryText(route.query.schoolId))
const category = ref(getQueryText(route.query.category))
const quickFilters = ref([])
const currentPage = ref(1)
const pageSize = 48
const quickFilterOptions = [
  { label: '不考数学', value: 'no-math' },
  { label: '英语压力低', value: 'low-english' },
  { label: '适合考公', value: 'exam-friendly' },
  { label: '上班族友好', value: 'worker-friendly' },
  { label: '费用已核', value: 'price-ready' },
  { label: '论文费已核', value: 'thesis-ready' },
  { label: '课程完整', value: 'course-ready' },
]

const filteredOfferings = computed(() => {
  const query = keyword.value.trim()

  return schoolMajorOfferings.filter((item) => {
    const text = `${item.name}${item.code}${item.schoolName}${item.category}`
    const matchKeyword = query ? text.includes(query) : true
    const matchLevel = level.value ? item.level === level.value : true
    const matchSchool = schoolId.value ? item.schoolId === schoolId.value : true
    const matchCategory = category.value ? item.category === category.value : true
    const matchQuickFilters = quickFilters.value.every((filter) => matchesQuickFilter(item, filter))
    return matchKeyword && matchLevel && matchSchool && matchCategory && matchQuickFilters
  })
})

const pagedOfferings = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredOfferings.value.slice(start, start + pageSize)
})

watch([keyword, level, schoolId, category, quickFilters], () => {
  currentPage.value = 1
})

watch(
  () => route.query,
  (query) => {
    keyword.value = getQueryText(query.keyword)
    level.value = getQueryText(query.level)
    schoolId.value = getQueryText(query.schoolId)
    category.value = getQueryText(query.category)
    currentPage.value = 1
  },
)

function majorDetailPath(item) {
  return `/majors/${item.planId || item.id}`
}

function hasCoursePlan(item) {
  return (item.unifiedCourseCount || 0) > 0 || (item.schoolExamCourseCount || 0) > 0
}

function getQueryText(value) {
  return Array.isArray(value) ? value[0] || '' : value || ''
}

function matchesQuickFilter(item, filter) {
  const difficulty = analyzeMajorDifficulty(item)

  if (filter === 'no-math') {
    return difficulty.facts.some((fact) => fact.label === '数学压力' && /不考数学|可选考替代/.test(fact.value))
  }

  if (filter === 'low-english') {
    return difficulty.facts.some((fact) => fact.label === '英语安排' && /未见英语课|可加考替代/.test(fact.value))
  }

  if (filter === 'exam-friendly') {
    return /行政|汉语言|法学|法律|教育|思想政治|社会工作|公共/.test(`${item.name}${item.category || ''}`)
  }

  if (filter === 'worker-friendly') {
    return difficulty.score > 0 && difficulty.score <= 2
  }

  if (filter === 'price-ready') {
    return item.priceText && item.priceText !== '待核对'
  }

  if (filter === 'thesis-ready') {
    return item.thesisPriceText && item.thesisPriceText !== '待核对'
  }

  if (filter === 'course-ready') {
    return hasCoursePlan(item)
  }

  return true
}

function getVerificationText(item) {
  if (!hasCoursePlan(item)) return '课程待核'
  if (!item.priceText || item.priceText === '待核对') return '费用待核'
  if (item.level === '专升本' && item.thesisPriceText === '待核对') return '论文费待核'
  return '信息较完整'
}

function getVerificationTone(item) {
  return getVerificationText(item) === '信息较完整' ? 'success' : 'warning'
}
</script>
