<template>
  <section class="section">
    <div class="container">
      <RouterLink to="/majors" class="back-link"><el-button text>← 返回专业库</el-button></RouterLink>

      <div v-if="plan" class="detail-layout">
        <el-card class="detail-main" shadow="never">
          <div class="school-detail-hero major-detail-hero">
            <div class="school-detail-copy">
              <el-tag class="badge" effect="light" round>{{ plan.examTypeLabel }}</el-tag>
              <h1>{{ plan.name }}（{{ plan.level }}）</h1>
              <p class="lead">专业代码：{{ plan.code }}。按开设学校查看课程结构、助学价格和论文费用，适合先选专业再反查学校。</p>
              <div class="school-detail-actions">
                <RouterLink to="/schools">按学校查</RouterLink>
                <RouterLink to="/prices">查看费用表</RouterLink>
              </div>
            </div>
            <div class="school-detail-summary">
              <div>
                <span>开设学校</span>
                <strong>{{ offerings.length || '待核对' }}</strong>
              </div>
              <div>
                <span>合计学分</span>
                <strong>{{ plan.totalCredits || '待核对' }}</strong>
              </div>
            </div>
          </div>

          <div class="info-grid school-detail-stats">
            <el-card shadow="never"><el-statistic title="考试类型" :value="plan.examTypeLabel" /></el-card>
            <el-card shadow="never"><el-statistic title="专业类别" :value="plan.category" /></el-card>
            <el-card shadow="never"><el-statistic title="合计学分" :value="plan.totalCredits || '待核对'" /></el-card>
          </div>

          <el-card class="detail-block school-major-card" shadow="never">
            <div v-if="offerings.length" class="course-toolbar">
              <div>
                <h2>按学校区分课程</h2>
                <p>选择开设学校后，查看该校对应的统考、省考课程和费用。</p>
              </div>
              <el-select v-model="selectedOfferingId" class="major-level-filter" placeholder="选择学校专业" filterable>
                <el-option
                  v-for="item in offerings"
                  :key="item.id"
                  :label="`${item.schoolName} · ${item.name}`"
                  :value="item.id"
                />
              </el-select>
            </div>
            <div v-else class="course-toolbar">
              <div>
                <h2>按学校区分课程</h2>
                <p>当前院校专业表还没有匹配到开设学校。</p>
              </div>
            </div>

            <div v-if="selectedOffering" class="selected-offering-panel">
              <div class="school-offering-head">
                <div>
                  <RouterLink :to="`/schools/${selectedOffering.schoolId}`" class="school-offering-title">
                    {{ selectedOffering.schoolName }}
                  </RouterLink>
                  <p>{{ selectedOffering.level }} · {{ selectedOffering.name }} · 专业代码：{{ selectedOffering.code || '待核对' }}</p>
                </div>
                <div class="school-offering-tags">
                  <template v-if="hasCoursePlan(selectedOffering)">
                    <el-tag effect="plain" round>统考 {{ selectedOffering.unifiedCourseCount }}</el-tag>
                    <el-tag effect="plain" round>省考 {{ selectedOffering.schoolExamCourseCount }}</el-tag>
                  </template>
                  <el-tag v-else type="info" effect="plain" round>课程需核实</el-tag>
                </div>
              </div>
              <div class="school-offering-fees">
                <div>
                  <span>助学价格</span>
                  <strong>{{ selectedOffering.priceText }}</strong>
                </div>
                <div>
                  <span>论文费用</span>
                  <strong>{{ selectedOffering.thesisPriceText }}</strong>
                </div>
              </div>
              <div v-if="getPolicyNotes(selectedOffering).length" class="exemption-note-list">
                <div
                  v-for="note in getPolicyNotes(selectedOffering)"
                  :key="`${selectedOffering.id}-${note.title}-${note.text}`"
                  :class="['exemption-note', `is-${note.type}`]"
                >
                  <strong>{{ note.title }}</strong>
                  <p>{{ note.text }}</p>
                </div>
              </div>
            </div>

            <div v-if="difficultyResult" class="major-difficulty-card">
              <div class="major-difficulty-head">
                <div>
                  <span>专业难度评估</span>
                  <h3>{{ difficultyResult.label }}</h3>
                </div>
                <el-tag :type="difficultyResult.tone" effect="dark" round>
                  {{ difficultyResult.score ? `${difficultyResult.score} / 5` : '待评估' }}
                </el-tag>
              </div>
              <p>{{ difficultyResult.summary }}</p>
              <div class="difficulty-facts">
                <div v-for="fact in difficultyResult.facts" :key="fact.label">
                  <span>{{ fact.label }}</span>
                  <strong>{{ fact.value }}</strong>
                </div>
              </div>
              <div class="tag-list">
                <el-tag v-for="tag in difficultyResult.tags" :key="tag" effect="plain" round>{{ tag }}</el-tag>
              </div>
              <ul class="difficulty-advice-list">
                <li v-for="item in difficultyResult.advice" :key="item">{{ item }}</li>
              </ul>
            </div>

            <div v-if="selectedOffering" class="course-split-grid">
              <div class="course-list-panel">
                <h3>统考课程（{{ selectedOffering.unifiedCourseCount }} 门）</h3>
                <div v-if="selectedOffering.unifiedCourses.length" class="course-list">
                  <div v-for="(course, index) in selectedOffering.unifiedCourses" :key="course.id" class="course-row">
                    <span>{{ course.code }}</span>
                    <strong>{{ course.name }}</strong>
                    <em>{{ course.credits }} 学分</em>
                    <small
                      v-if="getCourseDisplayRemark(selectedOffering.unifiedCourses, index)"
                      :class="courseRemarkClass(getCourseDisplayRemark(selectedOffering.unifiedCourses, index))"
                    >
                      {{ getCourseDisplayRemark(selectedOffering.unifiedCourses, index) }}
                    </small>
                  </div>
                </div>
                <el-empty v-else description="暂无统考课程明细" />
              </div>
              <div class="course-list-panel">
                <h3>省考课程（{{ selectedOffering.schoolExamCourseCount }} 门）</h3>
                <div v-if="selectedOffering.schoolExamCourses.length" class="course-list">
                  <div v-for="(course, index) in selectedOffering.schoolExamCourses" :key="course.id" class="course-row">
                    <span>{{ course.code }}</span>
                    <strong>{{ course.name }}</strong>
                    <em>{{ course.credits }} 学分</em>
                    <small
                      v-if="getCourseDisplayRemark(selectedOffering.schoolExamCourses, index)"
                      :class="courseRemarkClass(getCourseDisplayRemark(selectedOffering.schoolExamCourses, index))"
                    >
                      {{ getCourseDisplayRemark(selectedOffering.schoolExamCourses, index) }}
                    </small>
                  </div>
                </div>
                <el-empty v-else description="暂无省考课程明细" />
              </div>
            </div>

            <div v-else-if="plan.courses.length" class="course-list-panel">
              <h3>课程明细</h3>
              <div class="course-list">
                <div v-for="course in plan.courses" :key="course.id || course.code" class="course-row">
                  <span>{{ course.code }}</span>
                  <strong>{{ course.name }}</strong>
                  <em>{{ course.credits }} 学分</em>
                </div>
              </div>
            </div>
            <el-alert v-else title="课程信息需以主管部门及主考院校最新公布为准。" type="info" show-icon :closable="false" />
          </el-card>

          <el-card class="detail-block school-major-card" shadow="never">
            <div class="course-toolbar">
              <div>
                <h2>开设学校与费用</h2>
                <p>同一专业在不同学校可能价格、论文费用和省考课程数量不同。</p>
              </div>
              <el-select
                v-if="offerings.length"
                v-model="selectedFeeSchoolId"
                class="major-level-filter"
                clearable
                filterable
                placeholder="选择学校"
              >
                <el-option
                  v-for="item in offerings"
                  :key="item.id"
                  :label="item.schoolName"
                  :value="item.id"
                />
              </el-select>
            </div>
            <div v-if="visibleFeeOfferings.length" class="school-offering-list">
              <article v-for="item in visibleFeeOfferings" :key="item.id" class="school-offering-card">
                <div class="school-offering-head">
                  <div>
                    <RouterLink :to="`/schools/${item.schoolId}`" class="school-offering-title">
                      {{ item.schoolName }}
                    </RouterLink>
                    <p>{{ item.level }} · {{ item.name }} · 专业代码：{{ item.code || '待核对' }}</p>
                  </div>
                  <div class="school-offering-tags">
                    <template v-if="hasCoursePlan(item)">
                      <el-tag effect="plain" round>统考 {{ item.unifiedCourseCount }}</el-tag>
                      <el-tag effect="plain" round>省考 {{ item.schoolExamCourseCount }}</el-tag>
                    </template>
                    <el-tag v-else type="info" effect="plain" round>课程需核实</el-tag>
                  </div>
                </div>
                <div class="school-offering-fees">
                  <div>
                    <span>助学价格</span>
                    <strong>{{ item.priceText }}</strong>
                  </div>
                  <div>
                    <span>论文费用</span>
                    <strong>{{ item.thesisPriceText }}</strong>
                  </div>
                </div>
              </article>
            </div>
            <el-alert v-else :title="offerings.length ? '当前筛选下没有学校' : '当前院校专业表还没有匹配到开设学校。'" type="info" show-icon :closable="false" />
          </el-card>

          <el-card class="detail-block fee-note-card" shadow="never">
            <div>
              <el-tag effect="light" round>核对提醒</el-tag>
              <h2>选专业时重点看这 3 项</h2>
              <p>专业本身只是第一步，实际报考体验还取决于学校费用、课程结构和论文要求。</p>
            </div>
            <ul>
              <li>对比开设学校的助学价格和论文费用</li>
              <li>查看统考课程数量，评估备考压力</li>
              <li>留意是否有实践、论文、选考课程说明</li>
            </ul>
          </el-card>
        </el-card>

        <aside class="detail-aside">
          <el-card class="side-card" shadow="hover">
            <h3>想按学校查？</h3>
            <p>去学校库查看学校入口，以及该学校下每个专业的统考、省考课程。</p>
            <RouterLink to="/schools"><el-button class="full" type="primary" round>去学校库</el-button></RouterLink>
          </el-card>
          <el-card class="side-card" shadow="hover">
            <h3>想了解统考和省考？</h3>
            <p>应用型自考通常按统考和省考推进，具体考试安排以当期通知为准。</p>
            <RouterLink to="/exam-types"><el-button class="full" round>查看区别</el-button></RouterLink>
          </el-card>
        </aside>
      </div>

      <el-empty v-else description="没有找到这个专业">
        <RouterLink to="/majors"><el-button type="primary" round>返回专业库</el-button></RouterLink>
      </el-empty>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { courseRemarkClass, getCourseDisplayRemark, getPolicyNotes } from '../js/majorPolicyNotes'
import { analyzeMajorDifficulty } from '../js/majorDifficulty'
import { getMajorPlanById } from '../js/sichuanMajorPlans'
import { getMajorOfferingsByPlanId, getOfferingById, schoolMajorOfferings } from '../js/schools'

const route = useRoute()
const selectedOfferingId = ref('')
const selectedFeeSchoolId = ref('')

const fallbackOffering = computed(() => getOfferingById(route.params.id))
const plan = computed(() => getMajorPlanById(route.params.id) || createPlanFromOffering(fallbackOffering.value))
const offerings = computed(() => {
  if (getMajorPlanById(route.params.id)) {
    return getMajorOfferingsByPlanId(route.params.id)
  }

  const base = fallbackOffering.value

  if (!base) {
    return []
  }

  return schoolMajorOfferings.filter((item) => {
    const sameLevel = item.level === base.level
    const sameName = item.name === base.name
    const sameCode = base.code ? item.code === base.code : true
    return sameLevel && sameName && sameCode
  })
})
const selectedOffering = computed(() => offerings.value.find((item) => item.id === selectedOfferingId.value))
const difficultyResult = computed(() => analyzeMajorDifficulty(selectedOffering.value || fallbackOffering.value))
const visibleFeeOfferings = computed(() => {
  if (!selectedFeeSchoolId.value) {
    return offerings.value
  }

  return offerings.value.filter((item) => item.id === selectedFeeSchoolId.value)
})

watchEffect(() => {
  if (!offerings.value.length) {
    selectedOfferingId.value = ''
    selectedFeeSchoolId.value = ''
    return
  }

  if (!offerings.value.some((item) => item.id === selectedOfferingId.value)) {
    selectedOfferingId.value = offerings.value[0].id
  }

  if (selectedFeeSchoolId.value && !offerings.value.some((item) => item.id === selectedFeeSchoolId.value)) {
    selectedFeeSchoolId.value = ''
  }
})

function createPlanFromOffering(offering) {
  if (!offering) {
    return null
  }

  return {
    id: offering.planId || offering.id,
    name: offering.name,
    level: offering.level,
    code: offering.code || '待核对',
    examType: 'applied',
    examTypeLabel: '应用型（小自考）',
    category: offering.category || '待核对',
    totalCredits: offering.totalCredits || parseTotalCredits(offering.totalText),
    sourcePage: offering.sourcePage || '',
    courses: [...(offering.unifiedCourses || []), ...(offering.schoolExamCourses || [])],
  }
}

function hasCoursePlan(item) {
  return (item?.unifiedCourseCount || 0) > 0 || (item?.schoolExamCourseCount || 0) > 0
}

function parseTotalCredits(text) {
  const match = String(text || '').match(/合计\s*(\d+)\s*学分/)
  return match ? Number(match[1]) : ''
}
</script>
