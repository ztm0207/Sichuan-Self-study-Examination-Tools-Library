<template>
  <div class="tool-panel certificate-tool-panel">
    <el-card class="tool-form" shadow="never">
      <el-form label-position="top">
        <div class="certificate-section">
          <div class="certificate-section-head">
            <span>01</span>
            <strong>基础信息</strong>
          </div>
          <div class="certificate-form-grid foundation-grid">
            <el-form-item label="自考路径">
              <el-radio-group v-model="form.path" class="certificate-choice-group">
                <el-radio-button value="applied">小自考</el-radio-button>
                <el-radio-button value="social">大自考</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="报考层次">
              <el-radio-group v-model="form.level" class="certificate-choice-group">
                <el-radio-button value="junior">专科</el-radio-button>
                <el-radio-button value="undergraduate">专升本</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item v-if="form.level === 'undergraduate'" label="当前阶段">
              <el-radio-group v-model="form.currentStage" class="certificate-choice-group">
                <el-radio-button value="course">考课程</el-radio-button>
                <el-radio-button value="thesis">论文阶段</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>

        <div v-if="shouldShowThesisRiskOption" class="certificate-section">
          <div class="certificate-section-head">
            <span>02</span>
            <strong>论文预期</strong>
          </div>
          <div class="certificate-form-grid foundation-grid">
            <el-form-item>
              <template #label>
                <span class="form-label-with-help">
                  论文 / 答辩预期
                  <el-tooltip
                    effect="dark"
                    placement="top"
                    content="如果担心论文、查重、答辩或成绩归档没赶上当前批次，可以选择预留一次重做或补答辩时间。具体仍以主考院校当期通知为准。"
                  >
                    <span class="help-dot">?</span>
                  </el-tooltip>
                </span>
              </template>
              <el-select v-model="form.thesisAttemptRisk">
                <el-option label="一次通过" value="normal" />
                <el-option label="预留一次重做或补答辩" value="reserve" />
              </el-select>
            </el-form-item>
          </div>
        </div>

        <div v-if="form.path === 'applied' && shouldShowExamFields" class="certificate-quick-panel">
          <div class="certificate-section-head compact">
            <span>02</span>
            <strong>专业快速带入</strong>
          </div>
          <el-form-item label="按专业快速带入">
            <div class="certificate-major-picker">
              <el-select
                v-model="selectedOfferingId"
                clearable
                filterable
                placeholder="选择应用型学校专业"
              >
                <el-option
                  v-for="item in appliedMajorOptions"
                  :key="item.id"
                  :label="`${item.schoolName} · ${item.level} · ${item.name}`"
                  :value="item.id"
                />
              </el-select>
              <el-button
                v-if="selectedOffering"
                type="primary"
                plain
                round
                @click="applyFastestOffering"
              >
                按该专业最快估算
              </el-button>
            </div>
            <p v-if="selectedOffering" class="certificate-major-hint">
              <span>
                统考 {{ selectedCourseStats.unifiedTotal }} 门
                <el-tooltip effect="dark" placement="top" popper-class="course-count-tooltip">
                  <template #content>
                    <div class="course-count-tip">
                      <strong>统考课程</strong>
                      <span v-for="course in selectedCourseStats.unifiedCourses" :key="`unified-${course.id || course.code}`">
                        {{ formatCourseName(course) }}
                        <em v-if="isPracticeCourse(course)">实践/论文类，按学校通知安排，不计入笔试估算</em>
                      </span>
                    </div>
                  </template>
                  <span class="help-dot">?</span>
                </el-tooltip>
              </span>
              <span>
                省考 {{ selectedCourseStats.schoolTotal }} 门
                <el-tooltip effect="dark" placement="top" popper-class="course-count-tooltip">
                  <template #content>
                    <div class="course-count-tip">
                      <strong>省考课程</strong>
                      <span v-for="course in selectedCourseStats.schoolCourses" :key="`school-${course.id || course.code}`">
                        {{ formatCourseName(course) }}
                        <em v-if="isPracticeCourse(course)">实践/论文类，按学校通知安排，不计入笔试估算</em>
                      </span>
                    </div>
                  </template>
                  <span class="help-dot">?</span>
                </el-tooltip>
              </span>
              <span>最快带入：统考笔试 {{ selectedCourseStats.unifiedWritten }} 门，省考笔试 {{ selectedCourseStats.schoolWritten }} 门。</span>
            </p>
          </el-form-item>
        </div>

        <div v-if="shouldShowExamFields" class="certificate-section">
          <div class="certificate-section-head">
            <span>{{ form.path === 'applied' && shouldShowExamFields ? '03' : '02' }}</span>
            <strong>课程与批次</strong>
          </div>
          <div class="certificate-form-grid course-grid">
            <el-form-item label="剩余统考笔试 / 理论课程">
              <el-input-number v-model="form.unifiedSubjects" :min="0" :max="unifiedSubjectMax" :step="1" :precision="0" step-strictly />
              <p v-if="selectedOffering" class="field-limit-hint">最多 {{ unifiedSubjectMax }} 门</p>
            </el-form-item>

            <el-form-item v-if="form.path === 'applied'" label="剩余省考笔试 / 理论课程">
              <el-input-number v-model="form.schoolSubjects" :min="0" :max="schoolSubjectMax" :step="1" :precision="0" step-strictly />
              <p v-if="selectedOffering" class="field-limit-hint">最多 {{ schoolSubjectMax }} 门</p>
            </el-form-item>

            <el-form-item label="每次统考计划报几科">
              <el-select v-model.number="form.unifiedPerExam">
                <el-option label="1 科：保守" :value="1" />
                <el-option label="2 科：稳妥" :value="2" />
                <el-option label="3 科：正常" :value="3" />
                <el-option label="4 科：冲刺" :value="4" />
              </el-select>
            </el-form-item>

            <el-form-item v-if="form.path === 'applied'" label="每次省考计划报几科">
              <el-select v-model.number="form.schoolPerExam">
                <el-option label="2 科" :value="2" />
                <el-option label="3 科" :value="3" />
                <el-option label="4 科" :value="4" />
                <el-option label="5 科" :value="5" />
                <el-option label="6 科" :value="6" />
              </el-select>
            </el-form-item>

            <el-form-item>
              <template #label>
                <span class="form-label-with-help">
                  实践 / 论文类环节
                  <el-tooltip
                    effect="dark"
                    placement="top"
                    content="实践、实验、论文、毕业考核一般按主考院校通知安排，不按统考/省考笔试批次计算；选择“还有”会额外预留等待和成绩归档时间。"
                  >
                    <span class="help-dot">?</span>
                  </el-tooltip>
                </span>
              </template>
              <el-select v-model="form.practiceStatus">
                <el-option label="没有或已完成" value="done" />
                <el-option label="还有，需等学校安排" value="pending" />
              </el-select>
            </el-form-item>

            <el-form-item>
              <template #label>
                <span class="form-label-with-help">
                  单科通过预期
                  <el-tooltip
                    effect="dark"
                    placement="top"
                    content="这里按每科通过率估算，不是整体一次性通过率。比如还剩 6 门，选 80% 就会多预留一点补考时间，不按 6 门全都一次过来算。"
                  >
                    <span class="help-dot">?</span>
                  </el-tooltip>
                </span>
              </template>
              <el-select v-model.number="form.passRate">
                <el-option label="每科基本一次过（100%）" :value="1" />
                <el-option label="大部分能过（90%）" :value="0.9" />
                <el-option label="正常备考（80%）" :value="0.8" />
                <el-option label="可能有补考（70%）" :value="0.7" />
                <el-option label="补考较多（60%）" :value="0.6" />
              </el-select>
            </el-form-item>
          </div>
        </div>

        <div class="calculator-action-row">
          <el-button type="primary" round @click="calculate">估算拿证时间</el-button>
          <el-button round @click="clearCalculator">清除</el-button>
        </div>
      </el-form>
    </el-card>

    <div class="certificate-side-panel">
      <el-card v-if="result" class="tool-result certificate-result" shadow="never">
        <div class="certificate-result-head">
          <div>
            <span>预计拿证周期</span>
            <h3>{{ result.rangeText }}</h3>
          </div>
          <el-tag class="certificate-mode-tag" :type="result.tone" effect="dark" round>{{ result.modeLabel }}</el-tag>
        </div>

        <div class="certificate-result-grid">
          <div v-if="result.showExamStats">
            <span>统考完成</span>
            <strong>{{ result.unifiedText }}</strong>
          </div>
          <div v-if="form.path === 'applied' && result.showExamStats">
            <span>省考完成</span>
            <strong>{{ result.schoolText }}</strong>
          </div>
          <div>
            <span>毕业批次</span>
            <strong>{{ result.graduationText }}</strong>
          </div>
          <div v-if="result.finishRequirementText">
            <span>实践 / 论文</span>
            <strong>{{ result.finishRequirementText }}</strong>
          </div>
        </div>

        <ul class="certificate-advice-list">
          <li v-for="item in result.notes" :key="item">{{ item }}</li>
        </ul>

        <el-alert
          title="估算口径：社会型按 4 月、10 月统考；应用型另按 1 月、7 月省考；毕业按上半年 / 下半年申请窗口估算。实际以四川省教育考试院和主考院校通知为准。"
          type="info"
          show-icon
          :closable="false"
        />
      </el-card>

      <el-card v-else class="certificate-empty-result" shadow="never">
        <div class="certificate-empty-head">
          <span>估算口径</span>
          <h3>先填左侧，再生成拿证时间</h3>
        </div>
        <div class="certificate-logic-list">
          <div>
            <strong>统考</strong>
            <p>按 4 月、10 月批次估算。</p>
          </div>
          <div>
            <strong>省考</strong>
            <p>应用型按 1 月、7 月批次估算。</p>
          </div>
          <div>
            <strong>实践 / 论文</strong>
            <p>不按笔试批次计算，按主考院校通知预留时间。</p>
          </div>
          <div>
            <strong>毕业</strong>
            <p>按上半年、下半年毕业申请窗口估算。</p>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { schoolMajorOfferings } from '../../js/schools'

const unifiedExamMonths = [4, 10]
const schoolExamMonths = [1, 7]
const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
const practiceCoursePattern = /实践|实习|实验|毕业考核|毕业论文|论文|毕业设计|综合训练|项目综合|课程设计/
const medicinePattern = /护理|药|医学|检验|营养|卫生|病理|生理|解剖|内科|外科|儿科|妇产|微生物|免疫|诊断|毒理|兽医|动物|畜牧|传染病|寄生虫/
const engineeringPattern = /工程|机械|电气|电子|汽车|土木|造价|建筑|施工|桥梁|道路|交通|测量|力学|结构|消防|飞行器|制造|材料|控制/
const agriculturePattern = /农|园林|植物|作物|土壤|栽培|病虫害|林业|耕作|生态/
const artMediaPattern = /设计|动画|媒体|视觉|产品|艺术|制图|表现|摄影|播音|主持|广播|电视|编导|广告|界面|图形/
const financePattern = /金融|财务|会计|审计|成本|税|投资|证券|保险|经济|统计|资产|预算/
const educationLanguagePattern = /教育|学前|小学|英语|语言|文学|汉语|语文|阅读|写作/

const form = reactive({
  path: 'applied',
  level: 'undergraduate',
  unifiedSubjects: 6,
  schoolSubjects: 4,
  unifiedPerExam: 2,
  schoolPerExam: 4,
  passRate: 0.8,
  currentStage: 'course',
  practiceStatus: 'done',
  thesisAttemptRisk: 'normal',
})

const result = ref(null)
const suppressResultReset = ref(false)
const selectedOfferingId = ref('')
const selectedOffering = computed(() => schoolMajorOfferings.find((item) => item.id === selectedOfferingId.value))
const selectedCourseStats = computed(() => getOfferingCourseStats(selectedOffering.value))
const selectedTimeProfile = computed(() => getOfferingTimeProfile(selectedOffering.value, selectedCourseStats.value))
const unifiedSubjectMax = computed(() => selectedOffering.value ? selectedCourseStats.value.unifiedWritten : 30)
const schoolSubjectMax = computed(() => selectedOffering.value ? selectedCourseStats.value.schoolWritten : 30)
const shouldShowExamFields = computed(() => !(form.level === 'undergraduate' && form.currentStage === 'thesis'))
const shouldShowThesisRiskOption = computed(() => (
  form.path === 'applied'
  && form.level === 'undergraduate'
  && form.currentStage === 'thesis'
))
const appliedMajorOptions = computed(() => (
  schoolMajorOfferings
    .filter((item) => hasCoursePlan(item) && item.level === selectedLevelName.value)
    .sort((a, b) => `${a.schoolName}${a.level}${a.name}`.localeCompare(`${b.schoolName}${b.level}${b.name}`, 'zh-Hans-CN'))
))
const selectedLevelName = computed(() => form.level === 'junior' ? '专科' : '专升本')

watch(
  () => form.path,
  (value) => {
    if (value === 'social') {
      form.schoolSubjects = 0
      selectedOfferingId.value = ''
    } else if (form.schoolSubjects === 0) {
      form.schoolSubjects = 4
    }
    resetResult()
  }
)

watch(
  () => form.level,
  (value) => {
    if (value === 'junior') {
      form.currentStage = 'course'
      form.thesisAttemptRisk = 'normal'
    }
    if (selectedOffering.value && selectedOffering.value.level !== selectedLevelName.value) {
      selectedOfferingId.value = ''
    }
    resetResult()
  }
)

watch(
  selectedOffering,
  (item) => {
    if (!item || !shouldShowExamFields.value) {
      return
    }

    const stats = getOfferingCourseStats(item)
    form.practiceStatus = stats.practiceTotal > 0 ? 'pending' : 'done'
    form.unifiedSubjects = Math.min(form.unifiedSubjects, stats.unifiedWritten)
    form.schoolSubjects = Math.min(form.schoolSubjects, stats.schoolWritten)
  }
)

watch(
  () => [
    form.unifiedSubjects,
    form.schoolSubjects,
    form.unifiedPerExam,
    form.schoolPerExam,
    form.passRate,
    form.currentStage,
    form.practiceStatus,
    form.thesisAttemptRisk,
    selectedOfferingId.value,
  ],
  () => {
    resetResult()
  }
)

function calculate() {
  if (!validateForm()) {
    return
  }

  const today = startOfDay(new Date())
  const unifiedPlan = shouldShowExamFields.value ? estimateExamPlan({
    count: form.unifiedSubjects,
    perExam: form.unifiedPerExam,
    passRate: form.passRate,
    months: unifiedExamMonths,
    startDate: today,
  }) : createEmptyExamPlan(today)
  const schoolPlan = form.path === 'applied' && shouldShowExamFields.value
    ? estimateExamPlan({
      count: form.schoolSubjects,
      perExam: form.schoolPerExam,
      passRate: form.passRate,
      months: schoolExamMonths,
      startDate: today,
    })
    : createEmptyExamPlan(today)

  const examFinishDate = maxDate(unifiedPlan.finishDate, schoolPlan.finishDate)
  const finishRequirementPlan = estimateFinishRequirementPlan(examFinishDate, today)
  const eligibleDate = addMonths(maxDate(examFinishDate, finishRequirementPlan.finishDate), 1)
  const graduation = nextGraduationBatch(eligibleDate)
  const monthsToGraduation = diffMonths(today, graduation.date)
  const riskMonths = getRiskMonths()
  const maxMonths = monthsToGraduation + riskMonths

  result.value = {
    modeLabel: form.path === 'applied' ? '应用型估算' : '社会型估算',
    tone: form.path === 'applied' ? 'success' : 'warning',
    rangeText: `${formatDuration(monthsToGraduation)} - ${formatDuration(maxMonths)}`,
    showExamStats: shouldShowExamFields.value,
    unifiedText: formatExamPlan(unifiedPlan, '统考'),
    schoolText: formatExamPlan(schoolPlan, '省考'),
    finishRequirementText: finishRequirementPlan.resultText,
    graduationText: `${graduation.label}（毕业时间 ${formatDate(graduation.date)}）`,
    notes: buildNotes(unifiedPlan, schoolPlan, finishRequirementPlan, graduation),
  }
}

function estimateExamPlan({ count, perExam, passRate, months, startDate }) {
  if (!count) {
    return createEmptyExamPlan(startDate)
  }

  const adjustedSubjects = Math.ceil(count / passRate)
  const sessionsNeeded = Math.max(1, Math.ceil(adjustedSubjects / perExam))
  const sessions = getFutureSessions(months, sessionsNeeded, startDate)
  const finishDate = sessions[sessions.length - 1]

  return {
    count,
    adjustedSubjects,
    sessionsNeeded,
    finishDate,
    sessionText: sessions.map(formatSession).join('、'),
  }
}

function createEmptyExamPlan(date) {
  return {
    count: 0,
    adjustedSubjects: 0,
    sessionsNeeded: 0,
    finishDate: date,
    sessionText: '无需安排',
  }
}

function estimateFinishRequirementPlan(examFinishDate, today) {
  if (form.level !== 'undergraduate' && form.practiceStatus !== 'pending') {
    return {
      finishDate: today,
      text: '',
      resultText: '',
      status: 'none',
    }
  }

  if (form.currentStage === 'thesis') {
    const hasReserve = shouldShowThesisRiskOption.value && form.thesisAttemptRisk === 'reserve'
    const finishDate = addMonths(today, hasReserve ? 8 : 2)

    return {
      finishDate,
      text: hasReserve
        ? '已到论文 / 毕业考核阶段，并预留一次重做或补答辩时间，按约 8 个月完成论文、答辩和成绩归档估算。'
        : '已到论文 / 毕业考核阶段，按约 2-3 个月完成论文、答辩或成绩归档估算。',
      resultText: `约 ${formatMonth(finishDate)} 完成`,
      status: hasReserve ? 'thesis-reserve' : 'thesis',
    }
  }

  if (form.level !== 'undergraduate' && form.practiceStatus === 'pending') {
    const finishDate = addMonths(examFinishDate, 2)
    return {
      finishDate,
      text: '实践类环节不按笔试批次计算，按主考院校通知额外预留约 1-3 个月。',
      resultText: `约 ${formatMonth(finishDate)} 完成`,
      status: 'practice',
    }
  }

  const finishDate = addMonths(examFinishDate, 5)
  return {
    finishDate,
    text: `论文 / 毕业考核还没开始，课程完成后额外预留约 4-6 个月。`,
    resultText: `约 ${formatMonth(finishDate)} 完成`,
    status: 'need-time',
  }
}

function getFutureSessions(months, count, startDate) {
  const sessions = []
  let year = startDate.getFullYear()

  while (sessions.length < count) {
    for (const month of months) {
      const sessionDate = new Date(year, month - 1, 15)
      if (canStillPlanSession(sessionDate, startDate)) {
        sessions.push(sessionDate)
      }

      if (sessions.length >= count) {
        break
      }
    }
    year += 1
  }

  return sessions
}

function canStillPlanSession(sessionDate, startDate) {
  const cutoff = new Date(sessionDate.getFullYear(), sessionDate.getMonth() - 1, 10)
  return startDate <= cutoff
}

function nextGraduationBatch(date) {
  const year = date.getFullYear()
  const juneApplyCutoff = new Date(year, 4, 25)
  const decemberApplyCutoff = new Date(year, 10, 25)

  if (date <= juneApplyCutoff) {
    return {
      label: `${year}年上半年毕业申请`,
      date: new Date(year, 5, 30),
    }
  }

  if (date <= decemberApplyCutoff) {
    return {
      label: `${year}年下半年毕业申请`,
      date: new Date(year, 11, 30),
    }
  }

  return {
    label: `${year + 1}年上半年毕业申请`,
    date: new Date(year + 1, 5, 30),
  }
}

function getRiskMonths() {
  if (!shouldShowExamFields.value) {
    return 3
  }

  let months = form.passRate <= 0.6 ? 12 : form.passRate <= 0.7 ? 9 : form.passRate <= 0.8 ? 6 : 3

  if (form.unifiedSubjects + form.schoolSubjects >= 12) {
    months += 3
  }

  if (form.level === 'undergraduate') {
    months += 2
  } else if (form.practiceStatus === 'pending') {
    months += 1
  }

  if (selectedOffering.value) {
    months += selectedTimeProfile.value.riskMonths
  }

  return months
}

function buildNotes(unifiedPlan, schoolPlan, finishRequirementPlan, graduation) {
  const notes = []
  const courseStats = selectedCourseStats.value

  if (unifiedPlan.sessionsNeeded > 0) {
    notes.push(`统考按 ${form.unifiedPerExam} 科/次估算，需要约 ${unifiedPlan.sessionsNeeded} 个统考批次。`)
  }

  if (form.path === 'applied' && schoolPlan.sessionsNeeded > 0) {
    notes.push(`省考按 ${form.schoolPerExam} 科/次估算，需要约 ${schoolPlan.sessionsNeeded} 个省考批次。`)
  }

  if (finishRequirementPlan.status !== 'none') {
    notes.push(finishRequirementPlan.text)
  }

  if (finishRequirementPlan.status === 'need-time') {
    notes.push('本科论文通常不能等到最后才看，建议剩 2-3 门统考时就开始关注主考院校通知。')
  }

  if (finishRequirementPlan.status === 'thesis-reserve') {
    notes.push('如果第一次论文或答辩没有通过，通常会影响当期毕业申请，需要按主考院校下一次论文 / 答辩安排再走一次。')
  }

  if (selectedOffering.value && courseStats.practiceTotal > 0) {
    notes.push(`所选专业含 ${courseStats.practiceTotal} 门实践/论文类课程，未计入统考/省考笔试批次，需按主考院校通知单独安排。`)
  }

  if (selectedOffering.value) {
    notes.push(selectedTimeProfile.value.note)
  }

  notes.push(`所有课程、实践和论文成绩归档后，还要赶上 ${graduation.label} 的申请窗口。`)

  return notes
}

function applyFastestOffering() {
  const item = selectedOffering.value

  if (!item) {
    ElMessage.warning('请先选择一个应用型学校专业')
    return
  }

  withResultResetPaused(() => {
    form.path = 'applied'
    form.level = item.level === '专科' ? 'junior' : 'undergraduate'
    form.currentStage = 'course'
    form.practiceStatus = selectedCourseStats.value.practiceTotal > 0 ? 'pending' : 'done'
    form.unifiedSubjects = selectedCourseStats.value.unifiedWritten
    form.schoolSubjects = selectedCourseStats.value.schoolWritten
    form.unifiedPerExam = 4
    form.schoolPerExam = 6
    form.passRate = 1
    form.thesisAttemptRisk = 'normal'
  })
  calculate()
}

function clearCalculator() {
  withResultResetPaused(() => {
    form.path = 'applied'
    form.level = 'undergraduate'
    form.unifiedSubjects = 6
    form.schoolSubjects = 4
    form.unifiedPerExam = 2
    form.schoolPerExam = 4
    form.passRate = 0.8
    form.currentStage = 'course'
    form.practiceStatus = 'done'
    form.thesisAttemptRisk = 'normal'
    selectedOfferingId.value = ''
    result.value = null
  })
}

function resetResult() {
  if (!suppressResultReset.value) {
    result.value = null
  }
}

function withResultResetPaused(callback) {
  suppressResultReset.value = true
  callback()
  queueMicrotask(() => {
    suppressResultReset.value = false
  })
}

function validateForm() {
  const requiredFields = [
    [form.path, '请选择自考路径'],
    [form.level, '请选择报考层次'],
  ]

  if (form.level === 'undergraduate') {
    requiredFields.push([form.currentStage, '请选择当前阶段'])
  }

  if (shouldShowThesisRiskOption.value) {
    requiredFields.push([form.thesisAttemptRisk, '请选择论文 / 答辩预期'])
  }

  if (shouldShowExamFields.value) {
    requiredFields.push(
      [form.practiceStatus, '请选择实践 / 论文类环节状态'],
      [form.unifiedSubjects, '请填写剩余统考课程'],
      [form.unifiedPerExam, '请选择每次统考计划报几科'],
      [form.passRate, '请选择通过预期']
    )

    if (form.path === 'applied') {
      requiredFields.push(
        [form.schoolSubjects, '请填写剩余省考课程'],
        [form.schoolPerExam, '请选择每次省考计划报几科']
      )
    }
  }

  const emptyField = requiredFields.find(([value]) => value === '' || value === null || value === undefined)

  if (emptyField) {
    ElMessage.warning(emptyField[1])
    return false
  }

  const numericFields = shouldShowExamFields.value
    ? [
      [form.unifiedSubjects, '剩余统考课程'],
      [form.unifiedPerExam, '每次统考课程'],
      ...(form.path === 'applied' ? [[form.schoolSubjects, '剩余省考课程'], [form.schoolPerExam, '每次省考课程']] : []),
    ]
    : []

  const invalidNumber = numericFields.find(([value]) => !Number.isInteger(value) || value < 0)

  if (invalidNumber) {
    ElMessage.warning(`${invalidNumber[1]}必须是整数`)
    return false
  }

  if (selectedOffering.value && form.unifiedSubjects > unifiedSubjectMax.value) {
    ElMessage.warning(`剩余统考课程不能超过该专业统考笔试 / 理论课程 ${unifiedSubjectMax.value} 门`)
    return false
  }

  if (selectedOffering.value && form.path === 'applied' && form.schoolSubjects > schoolSubjectMax.value) {
    ElMessage.warning(`剩余省考课程不能超过该专业省考笔试 / 理论课程 ${schoolSubjectMax.value} 门`)
    return false
  }

  return true
}

function hasCoursePlan(item) {
  return (item.unifiedCourseCount || 0) > 0 || (item.schoolExamCourseCount || 0) > 0
}

function getOfferingCourseStats(item) {
  const unifiedCourses = item?.unifiedCourses || []
  const schoolCourses = item?.schoolExamCourses || []
  const unifiedPractice = unifiedCourses.filter(isPracticeCourse).length
  const schoolPractice = schoolCourses.filter(isPracticeCourse).length

  return {
    unifiedCourses,
    schoolCourses,
    unifiedTotal: unifiedCourses.length || item?.unifiedCourseCount || 0,
    schoolTotal: schoolCourses.length || item?.schoolExamCourseCount || 0,
    unifiedWritten: unifiedCourses.length
      ? unifiedCourses.filter((course) => !isPracticeCourse(course)).length
      : item?.unifiedCourseCount || 0,
    schoolWritten: schoolCourses.length
      ? schoolCourses.filter((course) => !isPracticeCourse(course)).length
      : item?.schoolExamCourseCount || 0,
    practiceTotal: unifiedPractice + schoolPractice,
  }
}

function getOfferingTimeProfile(item, stats) {
  if (!item) {
    return {
      riskMonths: 0,
      note: '',
    }
  }

  const courseText = [
    item.name,
    ...(stats.unifiedCourses || []).map((course) => course.name),
    ...(stats.schoolCourses || []).map((course) => course.name),
  ].join(' ')

  if (medicinePattern.test(courseText)) {
    return {
      riskMonths: 2,
      note: '医药护理、动物医学或营养检验类专业通常更依赖专业基础和实践规范，建议给实践、材料审核和成绩归档多留一点时间。',
    }
  }

  if (engineeringPattern.test(courseText)) {
    return {
      riskMonths: 2,
      note: '工程、交通、机械、消防等专业常见实践、课程设计或案例类环节，除笔试批次外要同步关注学校实践考核通知。',
    }
  }

  if (agriculturePattern.test(courseText)) {
    return {
      riskMonths: 1,
      note: '农学、园林、现代农业类专业可能涉及实践或应用型考核，时间估算已按学校安排额外预留一点弹性。',
    }
  }

  if (artMediaPattern.test(courseText)) {
    return {
      riskMonths: 1,
      note: '设计、艺术、传媒类专业要留意作品、实践或提交材料要求，相关节点通常以主考院校通知为准。',
    }
  }

  if (financePattern.test(courseText)) {
    return {
      riskMonths: 0,
      note: '财经管理类专业主要按统考、省考笔试批次推进，重点是避免同一批次报考过满导致补考顺延。',
    }
  }

  if (educationLanguagePattern.test(courseText)) {
    return {
      riskMonths: 0,
      note: '教育、语言文学类专业主要看笔试推进和本科论文节点，建议课程后期提前关注论文申请通知。',
    }
  }

  return {
    riskMonths: stats.practiceTotal > 0 ? 1 : 0,
    note: '所选专业已按统考、省考、实践/论文和毕业申请窗口统一估算；没有单独匹配到特殊方向时，按通用小自考节奏处理。',
  }
}

function isPracticeCourse(course) {
  return practiceCoursePattern.test(course?.name || '')
}

function formatCourseName(course) {
  return `${course?.code ? `${course.code} ` : ''}${course?.name || '课程待核对'}`
}

function formatExamPlan(plan, label) {
  if (!plan.count) {
    return `${label}无剩余`
  }

  return `${plan.sessionsNeeded} 个批次，约 ${formatMonth(plan.finishDate)} 完成`
}

function formatDuration(months) {
  if (months <= 1) {
    return '1 个月内'
  }

  if (months < 12) {
    return `${months} 个月左右`
  }

  const years = months / 12
  return `${years.toFixed(years >= 2 ? 1 : 1)} 年左右`
}

function formatSession(date) {
  return `${date.getFullYear()}年${monthNames[date.getMonth()]}`
}

function formatMonth(date) {
  return `${date.getFullYear()}年${monthNames[date.getMonth()]}`
}

function formatDate(date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

function addMonths(date, months) {
  return new Date(date.getFullYear(), date.getMonth() + months, date.getDate())
}

function diffMonths(start, end) {
  const yearDiff = end.getFullYear() - start.getFullYear()
  const monthDiff = end.getMonth() - start.getMonth()
  const dayOffset = end.getDate() >= start.getDate() ? 0 : -1
  return Math.max(1, yearDiff * 12 + monthDiff + dayOffset)
}

function maxDate(...dates) {
  return new Date(Math.max(...dates.map((date) => date.getTime())))
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}
</script>
