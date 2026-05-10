<template>
  <section class="section">
    <div class="container">
      <RouterLink to="/schools" class="back-link"><el-button text>← 返回学校库</el-button></RouterLink>

      <div v-if="school" class="detail-layout">
        <el-card class="detail-main" shadow="never">
          <div class="school-detail-hero">
            <div class="school-detail-copy">
              <el-tag class="badge" effect="light" round>四川自考院校专业</el-tag>
              <h1>{{ school.name }}</h1>
              <p class="lead">按该校实际开设专业整理层次、专业代码、助学价格、论文费用和统考 / 省考课程，先核费用，再看课程结构。</p>
              <div class="school-detail-actions">
                <el-link v-if="school.website" type="primary" :href="school.website" target="_blank" rel="noreferrer">
                  打开学校官网
                </el-link>
                <RouterLink to="/prices">查看费用表</RouterLink>
              </div>
            </div>
            <div class="school-detail-summary">
              <div>
                <span>助学价格</span>
                <strong>{{ priceSummary }}</strong>
              </div>
              <div>
                <span>论文费用</span>
                <strong>{{ thesisSummary }}</strong>
              </div>
            </div>
          </div>

          <div class="info-grid school-detail-stats">
            <el-card shadow="never"><el-statistic title="地区" :value="school.area" /></el-card>
            <el-card shadow="never"><el-statistic title="院校专业" :value="offerings.length" /></el-card>
            <el-card shadow="never"><el-statistic title="统考课程" :value="school.unifiedCourseCount" /></el-card>
            <el-card shadow="never"><el-statistic title="省考课程" :value="school.schoolExamCourseCount" /></el-card>
            <el-card shadow="never"><el-statistic title="价格待核对" :value="school.priceMissingCount" /></el-card>
            <el-card shadow="never"><el-statistic title="论文待核对" :value="school.thesisPriceMissingCount" /></el-card>
          </div>

          <el-card class="detail-block fee-note-card" shadow="never">
            <div>
              <el-tag effect="light" round>核对提醒</el-tag>
              <h2>报名之前先确认这 3 项</h2>
              <p>这里汇总该校已列明的助学价格和论文费用；显示“待核对”的项目，建议以学校继续教育学院、助学点通知或缴费页面为准。</p>
            </div>
            <ul>
              <li>助学价格是否按年收取，是否含教材、资料或平台费</li>
              <li>论文费用是否另收，专科通常不涉及论文费用</li>
              <li>同一学校不同专业价格可能不同，先按专业逐项核对</li>
            </ul>
          </el-card>

          <el-card class="detail-block school-major-card" shadow="never">
            <div class="course-toolbar">
              <div>
                <h2>该学校下的专业与价格</h2>
                <p>先切换专科或专升本，再按专业筛选；不选择专业时默认展示当前层次全部专业。</p>
              </div>
            </div>

            <el-tabs v-if="groupedOfferings.length" v-model="activeLevel" @tab-change="clearSelectedMajor">
              <el-tab-pane
                v-for="group in groupedOfferings"
                :key="group.level"
                :label="`${group.level}（${group.items.length}）`"
                :name="group.level"
              >
                <div class="school-level-head">
                  <div>
                    <h3>{{ group.level }}专业</h3>
                    <span :class="{ 'is-filtered': selectedMajorId }">{{ getVisibleItems(group).length }} / {{ group.items.length }} 个专业</span>
                  </div>
                  <el-select
                    v-model="selectedMajorId"
                    class="major-level-filter"
                    clearable
                    filterable
                    :placeholder="`选择${group.level}专业`"
                  >
                    <el-option
                      v-for="item in group.items"
                      :key="item.id"
                      :label="`${item.name}${item.code ? `（${item.code}）` : ''}`"
                      :value="item.id"
                    />
                  </el-select>
                </div>
                <div class="school-offering-list">
                  <article v-for="item in getVisibleItems(group)" :key="item.id" class="school-offering-card">
                    <div class="school-offering-head">
                      <div>
                        <RouterLink :to="majorDetailPath(item)" class="school-offering-title">
                          {{ item.name }}
                        </RouterLink>
                        <p>专业代码：{{ item.code || '待核对' }} · {{ item.category || '类别待核对' }}</p>
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

                    <details class="course-details">
                      <summary>查看统考 / 省考课程明细</summary>
                      <div class="major-difficulty-card school-difficulty-card">
                        <div class="major-difficulty-head">
                          <div>
                            <span>专业难度评估</span>
                            <h3>{{ getDifficultyResult(item).label }}</h3>
                          </div>
                          <el-tag :type="getDifficultyResult(item).tone" effect="dark" round>
                            {{ getDifficultyResult(item).score ? `${getDifficultyResult(item).score}/5` : '待更新' }}
                          </el-tag>
                        </div>
                        <p>{{ getDifficultyResult(item).summary }}</p>
                        <div class="difficulty-facts">
                          <div v-for="fact in getDifficultyResult(item).facts" :key="`${item.id}-${fact.label}`">
                            <span>{{ fact.label }}</span>
                            <strong>{{ fact.value }}</strong>
                          </div>
                        </div>
                        <ul class="difficulty-advice-list">
                          <li v-for="advice in getDifficultyResult(item).advice" :key="`${item.id}-${advice}`">{{ advice }}</li>
                        </ul>
                      </div>

                      <div v-if="getPolicyNotes(item).length" class="exemption-note-list school-detail-note-list">
                        <div
                          v-for="note in getPolicyNotes(item)"
                          :key="`${item.id}-${note.title}-${note.text}`"
                          :class="['exemption-note', `is-${note.type}`]"
                        >
                          <strong>{{ note.title }}</strong>
                          <p>{{ note.text }}</p>
                        </div>
                      </div>

                      <div class="course-split-grid compact-course-grid">
                        <div class="course-list-panel">
                          <h3>统考课程（{{ item.unifiedCourseCount }} 门）</h3>
                          <div v-if="item.unifiedCourses.length" class="course-list">
                            <div v-for="(course, index) in item.unifiedCourses" :key="course.id" class="course-row">
                              <span>{{ course.code }}</span>
                              <strong>{{ course.name }}</strong>
                              <em>{{ course.credits }} 学分</em>
                              <small
                                v-if="getCourseDisplayRemark(item.unifiedCourses, index)"
                                :class="courseRemarkClass(getCourseDisplayRemark(item.unifiedCourses, index))"
                              >
                                {{ getCourseDisplayRemark(item.unifiedCourses, index) }}
                              </small>
                            </div>
                          </div>
                          <el-empty v-else description="暂无统考课程明细" />
                        </div>
                        <div class="course-list-panel">
                          <h3>省考课程（{{ item.schoolExamCourseCount }} 门）</h3>
                          <div v-if="item.schoolExamCourses.length" class="course-list">
                            <div v-for="(course, index) in item.schoolExamCourses" :key="course.id" class="course-row">
                              <span>{{ course.code }}</span>
                              <strong>{{ course.name }}</strong>
                              <em>{{ course.credits }} 学分</em>
                              <small
                                v-if="getCourseDisplayRemark(item.schoolExamCourses, index)"
                                :class="courseRemarkClass(getCourseDisplayRemark(item.schoolExamCourses, index))"
                              >
                                {{ getCourseDisplayRemark(item.schoolExamCourses, index) }}
                              </small>
                            </div>
                          </div>
                          <el-empty v-else description="暂无省考课程明细" />
                        </div>
                      </div>
                    </details>
                  </article>
                </div>
              </el-tab-pane>
            </el-tabs>

            <el-empty v-else description="当前学校暂未整理院校专业。" />
          </el-card>
        </el-card>

        <aside class="detail-aside">
          <el-card class="side-card" shadow="hover">
            <h3>下一步</h3>
            <p>如果已经确定学校，可以继续按专业对比价格和课程数量。</p>
            <div class="side-action-stack">
              <RouterLink to="/majors"><el-button class="full" type="primary" round>按专业反查</el-button></RouterLink>
              <RouterLink to="/prices"><el-button class="full" round>单独查费用</el-button></RouterLink>
            </div>
          </el-card>
          <el-card class="side-card" shadow="hover">
            <h3>当前学校概况</h3>
            <div class="side-mini-list">
              <span>专业层次</span>
              <strong>{{ levelSummary }}</strong>
              <span>助学价格</span>
              <strong>{{ priceSummary }}</strong>
              <span>待核对项</span>
              <strong>价格 {{ school.priceMissingCount }} / 论文 {{ school.thesisPriceMissingCount }}</strong>
            </div>
          </el-card>
        </aside>
      </div>

      <el-empty v-else description="没有找到这个学校">
        <RouterLink to="/schools"><el-button type="primary" round>返回学校库</el-button></RouterLink>
      </el-empty>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { analyzeMajorDifficulty } from '../js/majorDifficulty'
import { courseRemarkClass, getCourseDisplayRemark, getPolicyNotes } from '../js/majorPolicyNotes'
import { getSchoolById, getSchoolMajorOfferings } from '../js/schools'

const route = useRoute()
const activeLevel = ref('')
const selectedMajorId = ref('')
const difficultyCache = new WeakMap()

const school = computed(() => getSchoolById(route.params.id))
const offerings = computed(() => getSchoolMajorOfferings(route.params.id))
const groupedOfferings = computed(() => {
  const groups = []

  for (const item of offerings.value) {
    let group = groups.find((entry) => entry.level === item.level)
    if (!group) {
      group = { level: item.level, items: [] }
      groups.push(group)
    }
    group.items.push(item)
  }

  return groups
})
const levelSummary = computed(() => groupedOfferings.value.map((group) => `${group.level} ${group.items.length}`).join(' / ') || '待核对')
const priceSummary = computed(() => summarizePriceRange(offerings.value.map((item) => item.priceText)))
const thesisSummary = computed(() => summarizeValues(offerings.value.map((item) => item.thesisPriceText), ['待核对', '专科通常不涉及']))

watchEffect(() => {
  if (!groupedOfferings.value.some((group) => group.level === activeLevel.value)) {
    activeLevel.value = groupedOfferings.value[0]?.level || ''
    selectedMajorId.value = ''
  }
})

function clearSelectedMajor() {
  selectedMajorId.value = ''
}

function getVisibleItems(group) {
  if (!selectedMajorId.value) {
    return group.items
  }

  return group.items.filter((item) => item.id === selectedMajorId.value)
}

function majorDetailPath(item) {
  return `/majors/${item.planId || item.id}`
}

function hasCoursePlan(item) {
  return (item.unifiedCourseCount || 0) > 0 || (item.schoolExamCourseCount || 0) > 0
}

function getDifficultyResult(item) {
  if (!item) {
    return analyzeMajorDifficulty(item)
  }

  if (!difficultyCache.has(item)) {
    difficultyCache.set(item, analyzeMajorDifficulty(item))
  }

  return difficultyCache.get(item)
}

function summarizeValues(values, ignored = []) {
  const hidden = new Set(ignored)
  const unique = [...new Set(values.filter((value) => value && !hidden.has(value)))]

  if (!unique.length) {
    return '待核对'
  }

  if (unique.length <= 2) {
    return unique.join(' / ')
  }

  return `${unique[0]} 等 ${unique.length} 档`
}

function summarizePriceRange(values) {
  const prices = values.flatMap(extractAnnualPrices)

  if (!prices.length) {
    return '待核对'
  }

  const min = Math.min(...prices)
  const max = Math.max(...prices)

  if (min === max) {
    return `${formatPrice(min)}元/年`
  }

  return `${formatPrice(min)} → ${formatPrice(max)}元/年`
}

function extractAnnualPrices(value) {
  if (!value || value === '待核对') {
    return []
  }

  const text = String(value).replace(/,/g, '')
  const match = text.match(/(\d+(?:\.\d+)?)\s*(?:[-~－—至]\s*(\d+(?:\.\d+)?))?\s*元\/年/)

  if (!match) {
    return []
  }

  return [Number(match[1]), Number(match[2])]
    .filter((price) => Number.isFinite(price))
}

function formatPrice(value) {
  return Number.isInteger(value) ? String(value) : String(value)
}
</script>
