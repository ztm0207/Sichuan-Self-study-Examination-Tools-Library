<template>
  <div class="tool-panel study-plan-tool">
    <el-card class="tool-form study-plan-form" shadow="never">
      <el-form label-position="top">
        <div class="certificate-section">
          <div class="certificate-section-head compact">
            <span>01</span>
            <strong>选择专业与课程</strong>
          </div>

          <el-form-item label="报考层次">
            <el-radio-group v-model="form.offeringLevel" class="study-choice-group study-level-group">
              <el-radio-button value="all">全部</el-radio-button>
              <el-radio-button value="专科">专科</el-radio-button>
              <el-radio-button value="专升本">专升本</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="应用型专业快速带入">
            <el-select
              v-model="selectedOfferingId"
              filterable
              clearable
              placeholder="选择学校 + 专业"
            >
              <el-option
                v-for="item in appliedMajorOptions"
                :key="item.id"
                :label="`${item.schoolName} · ${item.level} · ${item.name}`"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <div v-if="selectedOffering" class="study-major-summary">
            <span>{{ selectedOffering.level }}</span>
            <span>统考 {{ courseSummary.unifiedWritten }} 门笔试</span>
            <span>省考 {{ courseSummary.schoolWritten }} 门笔试</span>
            <span v-if="courseSummary.practiceTotal">实践/论文 {{ courseSummary.practiceTotal }} 门不计入复习小时</span>
          </div>

          <el-form-item label="本次考试类型">
            <el-radio-group v-model="form.examKind" class="study-choice-group">
              <el-radio-button value="unified">统考</el-radio-button>
              <el-radio-button value="province">省考</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item :label="`本次准备的${selectedExamKindLabel}课程`">
            <el-select
              v-model="selectedCourseKeys"
              multiple
              filterable
              collapse-tags
              collapse-tags-tooltip
              :disabled="!selectedOffering"
              :placeholder="`选择${selectedExamKindLabel}课程`"
            >
              <el-option
                v-for="course in activeSelectableCourses"
                :key="course.key"
                :label="course.optionLabel"
                :value="course.key"
                :disabled="course.isPractice"
              >
                <div class="study-course-option" :class="`is-${course.profile.type}`">
                  <span>{{ course.optionLabel }}</span>
                  <em>{{ course.profile.label }}</em>
                </div>
              </el-option>
            </el-select>
          </el-form-item>

          <div v-if="selectedCourses.length" class="study-selected-course-tags">
            <span
              v-for="course in selectedCourses"
              :key="course.key"
              :class="`is-${course.profile.type}`"
            >
              {{ course.sourceLabel }} · {{ course.name }} · {{ course.profile.label }}
            </span>
          </div>

          <div v-if="form.examKind === 'unified'" class="study-schedule-box">
            <div class="study-schedule-head">
              <strong>{{ unifiedExamScheduleMeta.cycle }}统考时段参考</strong>
              <span>10月课表已发布，正式报考前要重新核对</span>
            </div>
            <el-alert
              class="study-slot-alert"
              type="info"
              show-icon
              :closable="false"
              title="当前内置时段仍按2026年4月课表辅助识别冲突；2026年10月课表已发布，最终以考试院10月课表为准。"
            />
            <div v-if="selectedCourses.length" class="study-slot-list">
              <article
                v-for="course in sortedSelectedCourses"
                :key="`slot-${course.key}`"
                :class="{ 'is-missing': !course.schedule, 'is-conflict': isSlotConflict(course) }"
              >
                <strong>{{ course.schedule?.slot || '待匹配' }}</strong>
                <span>{{ course.name }}</span>
                <em v-if="course.schedule">{{ course.schedule.date }} {{ course.schedule.start }}-{{ course.schedule.end }}</em>
                <em v-else>未在当前内置课表中匹配到课程代码</em>
                <button type="button" class="study-slot-remove" @click="removeSelectedCourse(course.key)">删除</button>
              </article>
            </div>
            <el-alert
              v-if="slotConflictGroups.length"
              class="study-slot-alert"
              type="warning"
              show-icon
              :closable="false"
              title="所选课程存在同一考试时段冲突，现实报考时不能同场次同时参加。"
            />
          </div>

          <div v-else class="study-province-note">
            <strong>省考不建议按统考强度复习。</strong>
            <span>它通常由主考院校或助学点按批次组织，复习重点是确认考试形式、平台、时间和提交要求；一般不用像统考那样长期刷题备考，具体以学校通知为准。</span>
          </div>

        </div>

        <div class="certificate-section">
          <div class="certificate-section-head compact">
            <span>02</span>
            <strong>复习条件</strong>
          </div>

          <div class="study-form-grid">
            <el-form-item label="距离考试天数">
              <el-input-number v-model="form.days" :min="7" :max="240" :step="1" step-strictly />
            </el-form-item>
            <el-form-item label="每天可复习小时">
              <el-input-number v-model="form.hoursPerDay" :min="0.5" :max="8" :step="0.5" />
            </el-form-item>
            <el-form-item label="当前基础">
              <el-select v-model="form.level">
                <el-option label="基础较弱" value="weak" />
                <el-option label="一般" value="normal" />
                <el-option label="基础较好" value="good" />
              </el-select>
            </el-form-item>
            <el-form-item label="每周休息">
              <el-select v-model="form.restDays">
                <el-option label="不固定休息" :value="0" />
                <el-option label="休 1 天" :value="1" />
                <el-option label="休 2 天" :value="2" />
              </el-select>
            </el-form-item>
          </div>

          <el-form-item label="计划节奏">
            <el-radio-group v-model="form.pace" class="study-pace-group">
              <el-radio-button value="steady">稳妥</el-radio-button>
              <el-radio-button value="normal">正常</el-radio-button>
              <el-radio-button value="sprint">冲刺</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </div>

        <div class="calculator-action-row">
          <el-button round @click="clearForm">清空</el-button>
          <el-button type="primary" round @click="generate">生成复习计划</el-button>
        </div>
      </el-form>
    </el-card>

    <div class="study-plan-side">
      <el-card v-if="result" class="study-result-card" shadow="never">
        <div class="study-result-head">
          <div>
            <span>复习压力</span>
            <h3>{{ result.pressure.label }}</h3>
          </div>
          <el-tag :type="result.pressure.type" effect="dark">{{ result.totalHours }} 小时</el-tag>
        </div>

        <p class="study-result-summary">{{ result.summary }}</p>

        <div class="study-result-metrics">
          <div>
            <strong>{{ result.courseCount }}</strong>
            <span>门笔试课</span>
          </div>
          <div>
            <strong>{{ result.effectiveDays }}</strong>
            <span>有效复习天</span>
          </div>
          <div>
            <strong>{{ result.avgHours }}</strong>
            <span>平均每科小时</span>
          </div>
        </div>

        <div class="study-result-section">
          <h4>课程分配</h4>
          <div class="study-course-plan-list">
            <article v-for="course in result.courses" :key="course.key" class="study-course-plan-item">
              <div class="study-course-plan-head">
                <strong>{{ course.name }}</strong>
                <el-tag size="small" :type="course.profile.type">{{ course.hours }} 小时</el-tag>
              </div>
              <p>{{ course.profile.method }}</p>
              <span>
                {{ course.sourceLabel }} · {{ course.profile.label }}
                <template v-if="course.schedule"> · {{ course.schedule.slot }} {{ course.schedule.start }}-{{ course.schedule.end }}</template>
              </span>
            </article>
          </div>
        </div>

        <div class="study-result-section">
          <h4>阶段安排</h4>
          <div class="study-stage-grid">
            <article v-for="stage in result.stages" :key="stage.title">
              <strong>{{ stage.title }}</strong>
              <span>{{ stage.days }} 天</span>
              <p>{{ stage.text }}</p>
            </article>
          </div>
        </div>

        <div class="study-result-section">
          <h4>执行建议</h4>
          <ul class="study-advice-list">
            <li v-for="item in result.advices" :key="item">{{ item }}</li>
          </ul>
        </div>
      </el-card>

      <el-card v-else class="study-empty-card" shadow="never">
        <div class="study-empty-head">
          <span>生成逻辑</span>
          <h3>先看课程强度，再排每天任务</h3>
        </div>
        <div class="study-empty-steps">
          <div><strong>1</strong><span>按专业带入统考、省考课程</span></div>
          <div><strong>2</strong><span>自动识别数学、英语、技术、记忆型课程</span></div>
          <div><strong>3</strong><span>按剩余天数和基础分配复习小时</span></div>
        </div>
        <p>实践、论文、毕业考核更偏流程安排，不计入笔试复习小时；需要准备材料时再单独排节点。</p>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { schoolMajorOfferings } from '../../js/schools'
import { unifiedExamSchedule202604, unifiedExamScheduleMeta } from '../../js/unifiedExamSchedules'

const practiceCoursePattern = /实践|实习|实验|毕业考核|毕业论文|论文|毕业设计|综合训练|项目综合|课程设计/
const mathPattern = /数学|线性代数|概率|统计|离散数学|高等数学|工程数学|数量方法/
const englishPattern = /英语/
const technicalPattern = /计算机|软件|工程|机械|电气|电子|汽车|数据|网络|系统|程序|算法|数据库|人工智能|土木|造价/
const engineeringPattern = /工程|机械|电气|电子|汽车|土木|造价|建筑|施工|桥梁|道路|交通|测量|力学|结构|消防|飞行器|制造|材料|控制/
const financePattern = /金融|财务|会计|审计|成本|税|投资|证券|保险|经济|统计|资产|预算/
const medicinePattern = /护理|药|医学|检验|营养|卫生|病理|生理|解剖|内科|外科|儿科|妇产|微生物|免疫|诊断|毒理|兽医|动物|畜牧|传染病|寄生虫/
const agriculturePattern = /农|园林|植物|作物|土壤|栽培|病虫害|林业|耕作|生态/
const languagePattern = /英语|翻译|写作|阅读|听力|口语|语言|文学|汉语|语文/
const educationLanguagePattern = /教育|学前|小学|英语|语言|文学|汉语|语文|阅读|写作/
const artMediaPattern = /设计|动画|媒体|视觉|产品|艺术|制图|表现|摄影|播音|主持|广播|电视|编导|广告|界面|图形/
const foodPattern = /食品|烹饪|营养|卫生|质量|安全|毒理/
const lawSecurityPattern = /法律|法学|公安|消防|社会工作|社会政策|宪法|民法|刑法|法理|治安|权益|责任/
const businessPublicPattern = /工商|管理|市场|营销|商务|物流|旅游|酒店|行政|公共|城市|文化产业|人力资源|质量|认证|信息资源|土地资源/
const sportsPattern = /体育|运动|健康|训练/
const memoryPattern = /思想|马克思|近现代|概论|法律|法学|管理|经济|教育|护理|药学|行政|社会|旅游|人力资源|公共|政策|伦理|文化|公安|体育/

const selectedOfferingId = ref('')
const selectedCourseKeys = ref([])
const result = ref(null)

const form = reactive({
  offeringLevel: 'all',
  examKind: 'unified',
  days: 45,
  hoursPerDay: 2,
  level: 'normal',
  restDays: 1,
  pace: 'normal',
})

const selectedOffering = computed(() => schoolMajorOfferings.find((item) => item.id === selectedOfferingId.value))

const appliedMajorOptions = computed(() => (
  schoolMajorOfferings
    .filter((item) => (
      (item.unifiedCourses?.length || item.schoolExamCourses?.length)
      && (form.offeringLevel === 'all' || item.level === form.offeringLevel)
    ))
    .sort((a, b) => `${a.schoolName}${a.level}${a.name}`.localeCompare(`${b.schoolName}${b.level}${b.name}`, 'zh-Hans-CN'))
))

const selectableCourses = computed(() => {
  if (!selectedOffering.value) return []

  return [
    ...(selectedOffering.value.unifiedCourses || []).map((course, index) => normalizeCourse(course, 'unified', index)),
    ...(selectedOffering.value.schoolExamCourses || []).map((course, index) => normalizeCourse(course, 'province', index)),
  ]
})

const unifiedSelectableCourses = computed(() => selectableCourses.value.filter((course) => course.source === 'unified'))
const provinceSelectableCourses = computed(() => selectableCourses.value.filter((course) => course.source === 'province'))
const activeSelectableCourses = computed(() => (
  form.examKind === 'province' ? provinceSelectableCourses.value : unifiedSelectableCourses.value
))
const selectedExamKindLabel = computed(() => (form.examKind === 'province' ? '省考' : '统考'))
const selectedCourses = computed(() => (
  selectableCourses.value.filter((course) => selectedCourseKeys.value.includes(course.key) && !course.isPractice)
))
const slotOrder = ['周六上午', '周六下午', '周日上午', '周日下午']
const sortedSelectedCourses = computed(() => (
  [...selectedCourses.value].sort((a, b) => {
    const aIndex = a.schedule?.slot ? slotOrder.indexOf(a.schedule.slot) : 99
    const bIndex = b.schedule?.slot ? slotOrder.indexOf(b.schedule.slot) : 99
    if (aIndex !== bIndex) return aIndex - bIndex
    return (a.code || '').localeCompare(b.code || '')
  })
))
const slotConflictGroups = computed(() => {
  if (form.examKind !== 'unified') return []

  const groups = selectedCourses.value.reduce((result, course) => {
    if (!course.schedule?.slot) return result
    result[course.schedule.slot] = [...(result[course.schedule.slot] || []), course]
    return result
  }, {})

  return Object.values(groups).filter((courses) => courses.length > 1)
})
const conflictCourseKeys = computed(() => new Set(slotConflictGroups.value.flat().map((course) => course.key)))

const courseSummary = computed(() => {
  const unified = (selectedOffering.value?.unifiedCourses || []).map((course, index) => normalizeCourse(course, 'unified', index))
  const province = (selectedOffering.value?.schoolExamCourses || []).map((course, index) => normalizeCourse(course, 'province', index))

  return {
    unifiedWritten: unified.filter((course) => !course.isPractice).length,
    schoolWritten: province.filter((course) => !course.isPractice).length,
    practiceTotal: [...unified, ...province].filter((course) => course.isPractice).length,
  }
})

watch(selectedOfferingId, () => {
  selectedCourseKeys.value = []
  result.value = null
})

watch(
  () => [form.offeringLevel, form.days, form.hoursPerDay, form.level, form.restDays, form.pace, form.examKind, selectedCourseKeys.value.join('|')],
  () => {
    if (
      form.offeringLevel !== 'all'
      && selectedOffering.value
      && selectedOffering.value.level !== form.offeringLevel
    ) {
      selectedOfferingId.value = ''
      selectedCourseKeys.value = []
    }
    result.value = null
  }
)

watch(
  () => form.examKind,
  () => {
    selectedCourseKeys.value = []
  }
)

function normalizeCourse(course, source, index) {
  const isPractice = practiceCoursePattern.test(course.name || '')
  const profile = getCourseProfile(course, isPractice)
  const sourceLabel = source === 'unified' ? '统考' : '省考'
  const code = course.code || `course-${index + 1}`
  const schedule = source === 'unified' && code ? unifiedExamSchedule202604[code] : null

  return {
    ...course,
    key: `${source}-${index}-${code}`,
    source,
    sourceLabel,
    isPractice,
    profile,
    schedule,
    optionLabel: `${sourceLabel} · ${course.name}${course.code ? `（${course.code}）` : ''}${isPractice ? ' · 实践/论文' : ''}`,
  }
}

function getCourseProfile(course, isPractice) {
  const name = course.name || ''
  let score = Number(course.credits || 3) >= 6 ? 3 : 2
  const reasons = []
  let method = '先用真题摸题型，再按错题回到教材或讲义补点。'

  if (isPractice) {
    return {
      score: 0,
      label: '流程类',
      type: 'info',
      method: '按学校通知准备材料和提交节点，不放进笔试复习小时。',
    }
  }

  if (mathPattern.test(name)) {
    score += 2
    reasons.push('数学')
    method = '每天保留计算训练，错题要重做到步骤完整。'
  }
  if (englishPattern.test(name) || languagePattern.test(name)) {
    score += 1
    reasons.push(englishPattern.test(name) ? '英语' : '语言')
    method = englishPattern.test(name)
      ? '单词、阅读和作文模板同步推进，考前保留整卷练习。'
      : '按作品、题型或文本材料整理答题框架，主观题要提前练表达。'
  }
  if (technicalPattern.test(name)) {
    score += 1
    reasons.push('技术')
    method = '概念题和应用题分开刷，重点记高频定义和步骤。'
  }
  if (engineeringPattern.test(name)) {
    score += 1
    reasons.push('工程')
    method = '公式、图表、流程和案例题一起练，重点把步骤写完整。'
  }
  if (financePattern.test(name)) {
    score += 1
    reasons.push('财经')
    method = '概念、分录或计算题分开推进，考前用真题整理高频模板。'
  }
  if (medicinePattern.test(name)) {
    score += 2
    reasons.push('医药')
    method = '先梳理专业概念和流程，再用病例、药理或操作规范类题目巩固。'
  }
  if (foodPattern.test(name)) {
    score += 1
    reasons.push('食品')
    method = '把标准、流程、检测指标和安全风险分开整理，考前重点复盘高频名词解释。'
  }
  if (agriculturePattern.test(name)) {
    score += 1
    reasons.push('农学')
    method = '按对象、技术流程和应用场景整理知识点，搭配高频名词解释复习。'
  }
  if (lawSecurityPattern.test(name)) {
    score += 1
    reasons.push('法务')
    method = '法条概念和案例判断一起练，主观题按“依据、事实、结论”组织答案。'
  }
  if (businessPublicPattern.test(name)) {
    score += 1
    reasons.push('管理')
    method = '先搭管理框架，再用真题整理高频概念、流程和案例分析模板。'
  }
  if (sportsPattern.test(name)) {
    score += 1
    reasons.push('体育')
    method = '理论概念、训练原则和教学场景结合记忆，主观题提前整理分点表达。'
  }
  if (artMediaPattern.test(name)) {
    score += 1
    reasons.push('艺术')
    method = '理论关键词配案例记忆，作品或设计类题目提前整理模板。'
  }
  if (memoryPattern.test(name) && score > 2) {
    score -= 1
    reasons.push('记忆')
    method = '按真题高频点背关键词，主观题用提纲反复复述。'
  }

  const finalScore = Math.min(5, Math.max(1, score))
  const label = finalScore >= 5 ? '高强度' : finalScore >= 4 ? '较高强度' : finalScore >= 3 ? '中等强度' : '低强度'
  const type = finalScore >= 5 ? 'danger' : finalScore >= 4 ? 'warning' : finalScore >= 3 ? 'primary' : 'success'

  return {
    score: finalScore,
    label: reasons.length ? `${label} · ${reasons.slice(0, 2).join('/')}` : label,
    type,
    method,
  }
}

function generate() {
  if (!selectedOffering.value) {
    ElMessage.warning('请先选择一个专业')
    return
  }
  if (!Number.isInteger(form.days) || form.days < 7) {
    ElMessage.warning('距离考试天数请填写 7 天以上的整数')
    return
  }
  if (!Number.isFinite(form.hoursPerDay) || form.hoursPerDay <= 0) {
    ElMessage.warning('请填写每天可复习时间')
    return
  }
  if (!selectedCourses.value.length) {
    ElMessage.warning('请至少选择 1 门笔试课程')
    return
  }
  if (slotConflictGroups.value.length) {
    ElMessage.warning('所选统考课程存在同一考试时段冲突，请调整本次课程')
    return
  }

  const effectiveDays = Math.max(1, Math.round(form.days * ((7 - form.restDays) / 7)))
  const totalHours = Math.max(1, Math.round(effectiveDays * form.hoursPerDay))
  const levelFactor = { weak: 1.25, normal: 1, good: 0.85 }[form.level]
  const paceFactor = { steady: 1.12, normal: 1, sprint: 0.9 }[form.pace]
  const weightedCourses = selectedCourses.value.map((course) => ({
    ...course,
    weight: Math.max(1, course.profile.score * levelFactor * paceFactor),
  }))
  const totalWeight = weightedCourses.reduce((sum, course) => sum + course.weight, 0)
  const courses = weightedCourses.map((course) => ({
    ...course,
    hours: Math.max(4, Math.round(totalHours * (course.weight / totalWeight))),
  }))
  const avgHours = Math.round(totalHours / selectedCourses.value.length)
  const pressure = getPressure(avgHours, courses)
  const stages = buildStages(effectiveDays)

  result.value = {
    pressure,
    totalHours,
    effectiveDays,
    avgHours,
    courseCount: selectedCourses.value.length,
    summary: `${selectedOffering.value.name} 本次准备 ${selectedExamKindLabel.value} ${selectedCourses.value.length} 门笔试课，按每天 ${form.hoursPerDay} 小时、每周休 ${form.restDays} 天估算，可用复习时间约 ${totalHours} 小时。`,
    courses,
    stages,
    advices: buildAdvices(courses, pressure, form.examKind, selectedOffering.value, courseSummary.value),
  }
}

function removeSelectedCourse(courseKey) {
  selectedCourseKeys.value = selectedCourseKeys.value.filter((key) => key !== courseKey)
}

function isSlotConflict(course) {
  return conflictCourseKeys.value.has(course.key)
}

function getPressure(avgHours, courses) {
  const hasHardCourse = courses.some((course) => course.profile.score >= 5)

  if (avgHours < 18 || (avgHours < 24 && hasHardCourse)) {
    return { label: '偏紧', type: 'danger' }
  }
  if (avgHours < 32 || hasHardCourse) {
    return { label: '需要稳住节奏', type: 'warning' }
  }
  return { label: '相对稳妥', type: 'success' }
}

function buildStages(days) {
  const first = Math.max(3, Math.round(days * 0.4))
  const second = Math.max(3, Math.round(days * 0.35))
  const third = Math.max(2, days - first - second)

  return [
    {
      title: '摸题型',
      days: first,
      text: '每科先做近年真题，标出高频章节和完全不会的题型。',
    },
    {
      title: '补短板',
      days: second,
      text: '按错题集中补知识点，主观题开始背关键词和答题框架。',
    },
    {
      title: '压节奏',
      days: third,
      text: '整卷限时模拟，回看错题本，考前只保留高频清单。',
    },
  ]
}

function buildAdvices(courses, pressure, examKind, offering, summary) {
  const advices = [
    '每天先做题再看资料，复习顺序按“真题、错题、讲义、模拟”推进。',
  ]
  const majorAdvice = getMajorStudyAdvice(offering, summary)

  if (majorAdvice) {
    advices.push(majorAdvice)
  }

  if (examKind === 'province') {
    advices.push('省考按学校通知准备，重点确认考试平台、提交方式、准考证和考务时间。')
  } else {
    advices.push('统考科目优先排在精力好的时间段，考前按官方时段做一次模拟。')
    advices.push('四川省2026年10月统考课表已经发布，本计划只做复习量参考，最终报考课程和时间以考试院当次课表为准。')
  }

  if (pressure.type === 'danger') {
    advices.unshift('当前时间偏紧，建议减少本次报考课程或增加每天复习时间。')
  }
  if (courses.some((course) => mathPattern.test(course.name || ''))) {
    advices.push('含数学类课程时，不建议只背题型，每周至少安排 2 次完整计算训练。')
  }
  if (courses.some((course) => englishPattern.test(course.name || ''))) {
    advices.push('英语类课程需要持续输入，单词和阅读不要集中到最后一周。')
  }
  if (examKind === 'unified' && courses.filter((course) => course.schedule).length >= 3) {
    advices.push('本次统考课程较多，最后一周按周六、周日真实考试节奏做套题。')
  }

  return advices
}

function getMajorStudyAdvice(offering, summary) {
  if (!offering) return ''

  const text = [
    offering.name,
    ...(offering.unifiedCourses || []).map((course) => course.name),
    ...(offering.schoolExamCourses || []).map((course) => course.name),
  ].join(' ')

  if (medicinePattern.test(text)) {
    return '医药护理、动物医学或检验营养类专业，不建议只背答案，复习时要把专业名词、流程规范和案例题放在一起。'
  }
  if (engineeringPattern.test(text)) {
    return '工程、交通、机械、消防类专业要给计算、图表、流程题留出单独训练时间，不要只看选择题。'
  }
  if (agriculturePattern.test(text)) {
    return '农学、园林、现代农业类专业适合按“对象、技术、问题、措施”整理知识点。'
  }
  if (foodPattern.test(text)) {
    return '食品、烹饪、营养类专业要重点梳理标准、检测、安全和流程类知识。'
  }
  if (artMediaPattern.test(text)) {
    return '设计、艺术、传媒类专业除理论题外，也要提前准备作品、案例或材料分析的表达框架。'
  }
  if (financePattern.test(text)) {
    return '财经类专业建议把概念题、计算题和案例题分开安排，最后一周集中复盘易混科目。'
  }
  if (lawSecurityPattern.test(text)) {
    return '法学、公安、社会工作类专业要把概念、制度和案例判断结合起来，主观题提前练分点作答。'
  }
  if (businessPublicPattern.test(text)) {
    return '管理、市场、行政、公共事务类专业适合先搭框架，再用高频真题压缩记忆范围。'
  }
  if (educationLanguagePattern.test(text)) {
    return '教育、语言文学类专业主观题占比通常更值得重视，建议提前练关键词复述和短文表达。'
  }
  if (sportsPattern.test(text)) {
    return '体育教育类专业要把理论原则和教学、训练场景对应起来复习。'
  }
  if (summary?.practiceTotal > 0) {
    return '所选专业含实践、论文或毕业考核类课程，这些节点按学校通知准备，不放进笔试复习小时。'
  }

  return '所选专业已按课程名称做通用强度识别，没有匹配到特殊方向时，按笔试数量、剩余天数和个人基础来排复习节奏。'
}

function clearForm() {
  selectedOfferingId.value = ''
  selectedCourseKeys.value = []
  form.offeringLevel = 'all'
  form.examKind = 'unified'
  form.days = 45
  form.hoursPerDay = 2
  form.level = 'normal'
  form.restDays = 1
  form.pace = 'normal'
  result.value = null
}
</script>
