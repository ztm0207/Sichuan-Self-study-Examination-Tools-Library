<template>
  <section class="section">
    <div class="container">
      <PageHero
        eyebrow="路线测评"
        title="四川自考路线测评"
        desc="第一次报名，先判断你适合社会型还是应用型。测完先给半份路线报告，再决定要不要人工核对学校、专业、费用和拿证时间。"
        :actions="[
          { label: '开始免费测评', path: '/route-test', type: 'primary' },
        ]"
        :points="['8 个问题初筛', '生成半份路线报告', '测完再人工核对']"
      />

      <div class="stat-strip route-data-strip">
        <el-card shadow="never"><el-statistic title="院校专业组合" :value="schoolMajorOfferings.length" /></el-card>
        <el-card shadow="never"><el-statistic title="支持层次" :value="planner.dataStats.levelCount" suffix="类" /></el-card>
        <el-card shadow="never"><el-statistic title="专业方向" :value="planner.dataStats.categoryCount" suffix="类" /></el-card>
      </div>

      <div class="route-test-panel">
        <el-card class="route-test-form-card" shadow="never">
          <div class="route-test-head">
            <span>{{ routeQuestionCount }} 个问题</span>
            <h2>先把你的情况摆出来</h2>
            <p>别一上来就问哪个学校好。先把学历、目标、预算、学习时间和专业方向说清楚，后面才好拿真实专业数据去筛，不然就是瞎推荐。</p>
          </div>

          <el-form label-position="top" class="route-test-form">
            <el-form-item v-for="question in questions" :key="question.key" :label="question.label">
              <div v-if="question.type === 'number'" class="route-number-field">
                <el-input-number
                  v-model="form[question.key]"
                  :min="question.min"
                  :max="question.max"
                  :step="question.step"
                  :precision="question.precision"
                  step-strictly
                  controls-position="right"
                  @change="normalizeNumberQuestion(question)"
                />
                <span>{{ question.unit }}</span>
              </div>
              <el-select
                v-else
                v-model="form[question.key]"
                class="route-question-select"
                :placeholder="`请选择${question.label}`"
                :multiple="question.multiple"
                :collapse-tags="question.multiple"
                :collapse-tags-tooltip="question.multiple"
                :filterable="question.filterable"
                clearable
              >
                <el-option
                  v-for="option in question.options"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>

            <div class="route-test-actions">
              <el-button type="primary" size="large" round @click="generateResult">
                生成我的四川自考路线
              </el-button>
              <el-button size="large" round @click="resetForm">重新选择</el-button>
            </div>
          </el-form>
        </el-card>

        <el-card class="route-test-result-card" shadow="never">
          <template v-if="hasResult">
            <div class="route-result-label">你的初步画像</div>
            <h2>{{ planner.profile.title }}</h2>
            <p class="route-result-summary">{{ planner.profile.summary }}</p>

            <div class="route-half-report">
              <span>你的初步路线</span>
              <h3>{{ planner.primaryReport.title }}</h3>
              <p>{{ planner.primaryReport.desc }}</p>
            </div>

            <div class="route-result-grid">
              <div>
                <span>目标层次</span>
                <p>{{ planner.profile.targetLevel }}</p>
              </div>
              <div>
                <span>本次命中</span>
                <p>{{ planner.matchSummary.matchText }}</p>
              </div>
              <div>
                <span>费用覆盖</span>
                <p>{{ planner.matchSummary.priceText }}</p>
              </div>
              <div>
                <span>课程压力</span>
                <p>{{ planner.matchSummary.courseText }}</p>
              </div>
            </div>

            <div class="route-result-section">
              <h3>判断原因</h3>
              <ul class="route-check-list">
                <li v-for="item in planner.primaryReport.reasons" :key="item">{{ item }}</li>
              </ul>
            </div>

            <div class="route-result-section">
              <h3>接下来还需要核对</h3>
              <ul class="route-check-list">
                <li v-for="item in planner.confirmItems" :key="item">{{ item }}</li>
              </ul>
            </div>

            <div class="route-result-section is-warning">
              <h3>这里还要自己留个心眼</h3>
              <ul class="route-check-list">
                <li v-for="item in planner.matchSummary.risks" :key="item">{{ item }}</li>
              </ul>
            </div>

            <el-alert
              title="结果只做初步路线参考，不承诺包过、不代考、不保证拿证时间。具体政策、考试安排、学校要求，请以四川省教育考试院和学校官方通知为准。"
              type="info"
              show-icon
              :closable="false"
            />
          </template>

          <template v-else>
            <div class="route-data-preview">
              <span>数据先摆一下</span>
              <h2>不是凭感觉测，会先从专业数据里筛</h2>
              <p>学校名单已按四川省教育考试院 2026 年应用型专业主考学校及招生专业一览表核对；专业、费用和论文要求继续按字段核验，不乱写全部已核。</p>

              <div class="route-source-grid">
                <div v-for="item in planner.dataStats.cards" :key="item.label">
                  <strong>{{ item.value }}</strong>
                  <span>{{ item.label }}</span>
                </div>
              </div>

              <div class="route-result-section">
                <h3>当前会先看这几块</h3>
                <ul class="route-check-list">
                  <li v-for="item in planner.previewChecks" :key="item">{{ item }}</li>
                </ul>
              </div>
            </div>
          </template>
        </el-card>
      </div>

      <template v-if="hasResult">
        <div class="route-report-head">
          <span>个人路线报告</span>
          <h2>给你三条可对比的四川自考路线</h2>
          <p>不是只推一个专业。你可以先看哪条路线更符合自己的预算、时间和用途，再决定要不要找老师确认。</p>
        </div>

        <el-card class="route-policy-card" shadow="never">
          <div>
            <span>当前官方节点</span>
            <h3>这些时间点先记到脑壳里</h3>
          </div>
          <ul class="route-check-list">
            <li v-for="item in routePolicyReminders" :key="item">{{ item }}</li>
          </ul>
        </el-card>

        <div class="planner-route-grid">
          <el-card v-for="route in planner.routes" :key="route.key" class="planner-route-card" shadow="hover">
            <div class="planner-route-top">
              <span>{{ route.label }}</span>
              <h3>{{ route.title }}</h3>
              <p>{{ route.desc }}</p>
            </div>

            <div class="planner-route-meta">
              <div>
                <span>预计周期</span>
                <strong>{{ route.duration }}</strong>
              </div>
              <div>
                <span>费用提醒</span>
                <strong>{{ route.costHint }}</strong>
              </div>
            </div>

            <div class="planner-pick-list">
              <div v-for="pick in route.picks" :key="pick.id" class="planner-pick">
                <div>
                  <strong>{{ pick.schoolName }}</strong>
                  <span>{{ pick.name }} · {{ pick.level }}</span>
                </div>
                <div class="planner-pick-tags">
                  <el-tag size="small" effect="plain">{{ pick.difficulty.label }}</el-tag>
                  <el-tag size="small" effect="plain">{{ pick.priceText }}</el-tag>
                </div>
                <div class="planner-pick-actions">
                  <RouterLink :to="majorDetailPath(pick)">
                    <el-button size="small" text type="primary">查看详情</el-button>
                  </RouterLink>
                  <RouterLink :to="majorComparePath(pick)">
                    <el-button size="small" text>同专业对比</el-button>
                  </RouterLink>
                </div>
              </div>
            </div>

            <div class="planner-route-section">
              <h4>为什么这样排</h4>
              <ul>
                <li v-for="item in route.reasons" :key="item">{{ item }}</li>
              </ul>
            </div>

            <div class="planner-route-section is-risk">
              <h4>风险提醒</h4>
              <ul>
                <li v-for="item in route.risks" :key="item">{{ item }}</li>
              </ul>
            </div>
          </el-card>
        </div>

        <el-card class="route-next-card" shadow="never">
          <div>
            <span>下一步行动</span>
            <h3>先别急着报名，把这几项核清楚</h3>
          </div>
          <ul class="route-check-list">
            <li v-for="item in planner.nextActions" :key="item">{{ item }}</li>
          </ul>
        </el-card>

        <ContactCard
          id="consult"
          class="route-result-contact"
          kicker="人工核对路线"
          title="你的路线已经出来了，下一步就核这几个细节"
          desc="如果你已经看到推荐路线，但还拿不准学校、专业、费用、论文或拿证时间，可以把测评结果发来核一次。不是一加就追着你报名，有需要再问。"
          :tips="resultConsultTips"
        />
      </template>

      <el-card class="route-note-card" shadow="never">
        <h3>这个测评工具是干嘛的？</h3>
        <p>
          它不是算命，也不是直接给你定学校。它是先用你的情况做第一次筛选，再用本站已整理的四川学校、专业、费用和课程数据生成参考路线。
          最后涉及学校是否还能报、专业计划有没有调整、费用和论文要求怎么走，还是要以官方通知和学校当期要求为准。
        </p>
      </el-card>

      <ContactCard
        v-if="!hasResult"
        id="consult"
        kicker="轻咨询入口"
        title="不知道该准备哪些资料，可以先说你的阶段"
        desc="适合已经确定专业或正在备考，但不知道复习资料、论文材料、毕业学位材料怎么整理的人。"
        :tips="lightConsultTips"
      />
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import PageHero from '../components/PageHero.vue'
import ContactCard from '../components/ContactCard.vue'
import { schoolMajorOfferings } from '../js/schools'
import { getMajorPlanById } from '../js/sichuanMajorPlans'
import { analyzeMajorDifficulty } from '../js/majorDifficulty'
import { isStoppedMajor, routePolicyReminders } from '../js/officialUpdates'

const EXAM_FEE_PER_COURSE = 35
const UNCERTAIN = 'uncertain'

const categoryOptions = createCategoryOptions()
const questions = [
  {
    key: 'purpose',
    label: '你这次自考主要为了什么？',
    options: [
      { label: '快速拿证', value: 'certificate' },
      { label: '考公/考编/考证', value: 'exam' },
      { label: '升职加薪', value: 'promotion' },
      { label: '考研', value: 'postgraduate' },
      { label: '学技能', value: 'skill' },
      { label: '提升学历', value: 'degree' },
    ],
  },
  {
    key: 'education',
    label: '你现在的学历是？',
    options: [
      { label: '高中/中专/技校', value: 'high-school' },
      { label: '大专在读', value: 'college-studying' },
      { label: '大专已毕业', value: 'college' },
      { label: '本科在读/已毕业', value: 'bachelor' },
    ],
  },
  {
    key: 'firstApply',
    label: '你是不是第一次了解四川自考？',
    options: [
      { label: '第一次，很多都还不清楚', value: 'yes' },
      { label: '了解过一点，但还没报名', value: 'some' },
      { label: '已经报名/正在备考', value: 'no' },
    ],
  },
  {
    key: 'target',
    label: '你想报哪个层次？',
    options: [
      { label: '专科', value: 'junior' },
      { label: '专升本', value: 'undergraduate' },
      { label: '不确定，系统推荐', value: 'unknown' },
    ],
  },
  {
    key: 'studyTime',
    label: '你每天大概能学多久？',
    type: 'number',
    min: 0.5,
    max: 8,
    step: 0.5,
    precision: 1,
    unit: '小时/天',
  },
  {
    key: 'budget',
    label: '你预算大概是多少？',
    options: [
      { label: '越低越好', value: 'lowest' },
      { label: '3000 以内', value: 'under-3000' },
      { label: '3000 到 6000', value: '3000-6000' },
      { label: '6000 到 10000', value: '6000-10000' },
      { label: '10000 以上', value: 'over-10000' },
    ],
  },
  {
    key: 'categoryPreferences',
    label: '有没有目标专业方向？',
    multiple: true,
    options: categoryOptions,
  },
  {
    key: 'priority',
    label: '你更看重什么？',
    multiple: true,
    options: [
      { label: '最快考完', value: 'fastest' },
      { label: '最便宜', value: 'cheapest' },
      { label: '最稳妥', value: 'steady' },
      { label: '考公/考编更适合', value: 'exam' },
      { label: '专业好就业', value: 'career' },
      { label: '学校名气好', value: 'school' },
      { label: '统考少/难度低', value: 'easy' },
    ],
  },
]

function createDefaultForm() {
  return {
    purpose: 'degree',
    firstApply: 'yes',
    education: 'college',
    target: 'undergraduate',
    studyTime: 1,
    budget: '3000-6000',
    learningMode: 'compare',
    categoryPreferences: [UNCERTAIN],
    schoolPreferences: [UNCERTAIN],
    avoidSubject: [],
    costFocus: ['all'],
    priority: ['steady'],
  }
}

const form = reactive(createDefaultForm())
const hasResult = ref(false)

const routeQuestionCount = computed(() => questions.length)
const planner = computed(() => createPlannerResult(form))

const lightConsultTips = [
  '你现在处在备考、论文、毕业还是学位阶段',
  '你的学校、专业、层次和当前剩余事项',
  '你最想要的是复习资料、时间规划还是材料清单',
  '2026年下半年论文/实践报考已截止，毕业申请也要等下一批通知',
]

const resultConsultTips = [
  '把测评结果截图或推荐路线发来',
  '重点核学校、专业、助学费、论文费和拿证时间',
  '如果目标是考公、考编、学位或考研，要单独看专业和学位条件',
]

function generateResult() {
  normalizeNumberQuestions()
  hasResult.value = true
}

function resetForm() {
  Object.assign(form, createDefaultForm())
  hasResult.value = false
}

function normalizeNumberQuestion(question) {
  if (!question || question.type !== 'number') return
  const value = Number(form[question.key])
  const min = Number(question.min ?? 0)
  const max = Number(question.max ?? value)
  const step = Number(question.step ?? 1)
  const safeValue = Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : min
  form[question.key] = Number((Math.round(safeValue / step) * step).toFixed(question.precision ?? 0))
}

function normalizeNumberQuestions() {
  questions.filter((question) => question.type === 'number').forEach(normalizeNumberQuestion)
}

function createCategoryOptions() {
  const categories = [...new Set(schoolMajorOfferings.map((item) => item.category).filter(Boolean))]
  return [
    { label: '不确定，先都看看', value: UNCERTAIN },
    ...categories.map((category) => ({ label: category, value: category })),
  ]
}

function createSchoolOptions() {
  const schoolMap = schoolMajorOfferings.reduce((result, item) => {
    result.set(item.schoolName, (result.get(item.schoolName) || 0) + 1)
    return result
  }, new Map())

  const schools = [...schoolMap.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-Hans-CN'))
    .map(([name, count]) => ({
      label: `${name}（${count}个专业组合）`,
      value: name,
    }))

  return [
    { label: '不确定，先按数据推荐', value: UNCERTAIN },
    ...schools,
  ]
}

function createPlannerResult(values) {
  const targetLevel = resolveTargetLevel(values)
  const profile = createProfile(values, targetLevel)
  const levelOfferings = schoolMajorOfferings.filter((item) => item.level === targetLevel)
  const scopedOfferings = applyUserScope(levelOfferings, values)
  const activeOfferings = scopedOfferings.length ? scopedOfferings : levelOfferings
  const candidates = activeOfferings
    .map((item) => enrichOffering(item, values))
  const matchSummary = createMatchSummary(levelOfferings, activeOfferings, candidates, values, targetLevel)
  const routes = [
    createRoute('fast', '路线 A', '最快拿证型', '优先看课程压力、统考数量和可规划节奏，适合想尽快跑完流程的人。', candidates, values),
    createRoute('cheap', '路线 B', '低成本对比型', '优先看费用更低、风险更清楚的组合。预算很低时，也建议同时核对社会型自学路径。', candidates, values),
    createRoute('steady', '路线 C', '稳妥均衡型', '在难度、费用、学校和用途之间取一个相对稳的方案，适合大多数第一次了解的人。', candidates, values),
  ]

  return {
    profile,
    dataStats: createDataStats(),
    previewChecks: createPreviewChecks(values, targetLevel),
    matchSummary,
    routes,
    primaryReport: createPrimaryReport(values, profile, targetLevel, routes),
    confirmItems: createConfirmItems(values, targetLevel),
    nextActions: [
      '先从三条路线里选一个最接近自己的方向，不要一上来全都想要',
      '点进学校和专业详情，再核对课程数量、价格、论文费用和官网入口',
      '已经备考的，要按2026年10月统考课表重新核本次能报哪些课程',
      '把测评结果发给老师，让老师确认当前学校、专业、费用和报名方式',
      '涉及包过、代考、保证拿证时间这类说法，不建议相信',
    ],
  }
}

function applyUserScope(offerings, values) {
  const categoryPreferences = selectedValues(values.categoryPreferences, UNCERTAIN)
  const schoolPreferences = selectedValues(values.schoolPreferences, UNCERTAIN)

  return offerings.filter((item) => {
    const categoryMatched = !categoryPreferences.length || categoryPreferences.includes(item.category)
    const schoolMatched = !schoolPreferences.length || schoolPreferences.includes(item.schoolName)
    return categoryMatched && schoolMatched
  })
}

function createDataStats() {
  const levelCount = new Set(schoolMajorOfferings.map((item) => item.level)).size
  const categoryCount = new Set(schoolMajorOfferings.map((item) => item.category).filter(Boolean)).size
  const schoolCount = new Set(schoolMajorOfferings.map((item) => item.schoolName)).size
  const priceReadyCount = schoolMajorOfferings.filter(hasReadyPrice).length
  const courseReadyCount = schoolMajorOfferings.filter((item) => getCourseCount(item) > 0).length
  const thesisReadyCount = schoolMajorOfferings.filter((item) => item.thesisPriceText && item.thesisPriceText !== '待核对').length

  return {
    levelCount,
    categoryCount,
    schoolCount,
    priceReadyCount,
    courseReadyCount,
    thesisReadyCount,
    cards: [
      { label: '学校', value: `${schoolCount} 所` },
      { label: '院校专业组合', value: `${schoolMajorOfferings.length} 个` },
      { label: '专业方向', value: `${categoryCount} 类` },
      { label: '学校名单已核', value: `${schoolCount} 所` },
    ],
  }
}

function createPreviewChecks(values, targetLevel) {
  const categoryText = describeSelected(values.categoryPreferences, '专业方向不确定，就先看全部方向')
  const schoolText = describeSelected(values.schoolPreferences, '学校不确定，就先按费用、难度和课程压力排序')

  return [
    `学校名单已按考试院 2026 年官方一览表核到 51 所；官方正文写 50 所，但表格逐行是 51 所。`,
    '考试院已发布2026年10月统考课表，后面做复习和报考顺序要看最新课表。',
    `先按 ${targetLevel} 从数据里筛一遍，不把专科和专升本混着推。`,
    `再看 ${categoryText}，不确定就不强行卡死专业。`,
    `如果你选了意向学校，会先看 ${schoolText}。`,
    '最后结合学费、论文费用、统考/校考课程数、数学英语实践课压力来排路线。',
  ]
}

function createMatchSummary(levelOfferings, activeOfferings, candidates, values, targetLevel) {
  const priceReadyCount = activeOfferings.filter(hasReadyPrice).length
  const thesisMissingCount = activeOfferings.filter((item) => item.level === '专升本' && item.thesisPriceText === '待核对').length
  const stoppedCount = activeOfferings.filter(isStoppedMajor).length
  const courseCounts = activeOfferings.map(getCourseCount).filter(Boolean)
  const unifiedCounts = activeOfferings.map((item) => item.unifiedCourseCount || 0).filter(Boolean)
  const categories = [...new Set(activeOfferings.map((item) => item.category).filter(Boolean))]
  const schools = [...new Set(activeOfferings.map((item) => item.schoolName).filter(Boolean))]
  const usedFallback = activeOfferings.length === levelOfferings.length && hasNarrowScope(values)
  const courseText = courseCounts.length
    ? `${Math.min(...courseCounts)}-${Math.max(...courseCounts)} 门课程，统考最多 ${Math.max(...unifiedCounts, 0)} 门`
    : '课程计划需要继续核对'

  return {
    matchText: `${targetLevel} 命中 ${activeOfferings.length} 个组合`,
    priceText: `${priceReadyCount}/${activeOfferings.length} 个有学费信息`,
    courseText,
    basis: [
      `层次范围：${targetLevel}，原始可选 ${levelOfferings.length} 个组合。`,
      `专业方向：${categories.slice(0, 4).join('、') || '暂无分类'}${categories.length > 4 ? ` 等 ${categories.length} 类` : ''}。`,
      `学校范围：${schools.slice(0, 4).join('、') || '暂无学校'}${schools.length > 4 ? ` 等 ${schools.length} 所` : ''}。`,
      '学校名单：已按考试院 2026 年官方一览表图片核对，本站 51 所与表格一致。',
      `费用重点：${describeCostFocus(values)}。`,
    ],
    risks: [
      usedFallback ? '你选的方向或学校暂时没有命中，结果先退回到目标层次全部数据里筛。' : '',
      thesisMissingCount ? `有 ${thesisMissingCount} 个组合论文/实践费用还要核，不能只看学费。` : '',
      priceReadyCount < activeOfferings.length ? `有 ${activeOfferings.length - priceReadyCount} 个组合学费还没完全核清，结果里会降权。` : '',
      stoppedCount ? `有 ${stoppedCount} 个组合命中停考专业，测评会自动降权，新生不要直接报。` : '',
      candidates.some((item) => (item.difficulty.score || 3) >= 4) ? '部分专业课程压力偏高，怕数学、英语、实践课的人要单独看课程表。' : '',
      '2026年10月课表已发布，正式报考前要去考试院核对当次课表。',
      '学校是否还能报、招生批次、论文要求和费用口径，最后还是要以学校当期通知为准。',
    ].filter(Boolean),
  }
}

function createPrimaryReport(values, profile, targetLevel, routes) {
  const assistedLean = values.learningMode === 'assisted' || values.firstApply === 'yes' || getStudyHours(values) <= 1
  const cheapLean = values.learningMode === 'self' || values.budget === 'lowest' || values.budget === 'under-3000' || hasPriority(values, 'cheapest')
  const firstPick = routes.find((route) => route.key === 'steady')?.picks?.[0] || routes[0]?.picks?.[0]
  const title = cheapLean
    ? '建议先把社会型和应用型放一起对比'
    : assistedLean
      ? '更适合先按应用型小自考路线核对'
      : '适合先按稳妥路线筛学校和专业'

  return {
    title,
    desc: firstPick
      ? `当前可以先拿 ${firstPick.schoolName} ${firstPick.name} 做参考底稿，再去核学校是否可报、费用口径和考试节奏。`
      : '当前先按你的目标层次做初步判断，具体学校和专业还需要继续核。',
    reasons: [
      `目标层次先按 ${targetLevel} 处理，不把专科和专升本混在一起推荐。`,
      getFirstApplyReason(values),
      getBudgetReason(values),
      getPriorityReason(values),
      profile.eligibility,
    ].filter(Boolean),
  }
}

function createConfirmItems(values, targetLevel) {
  return [
    `当前学历是否适合直接走 ${targetLevel}，专升本要重点核前置学历。`,
    '当前批次到底哪些学校、哪些专业还能报，不要只看旧截图。',
    '助学费、报考费、资料费、论文/实践费用分别是多少。',
    '最近一次统考/省考建议先报哪几科，有没有同场冲突。',
    hasPriority(values, 'exam') ? '如果后面想考公考编，要单独核专业名称和岗位限制。' : '',
  ].filter(Boolean)
}

function getFirstApplyReason(values) {
  if (values.firstApply === 'yes') return '你是第一次了解，先做路线判断比直接问学校更稳，不然容易听别人推荐什么就报什么。'
  if (values.firstApply === 'some') return '你已经了解过一点，但还没报名，重点是把费用、考试科目和毕业时间核清楚。'
  return '你已经报名或正在备考，重点不是重新选一遍，而是核剩余科目、论文和毕业节奏。'
}

function getBudgetReason(values) {
  if (values.budget === 'lowest' || values.budget === 'under-3000') return '你的预算偏低，要把社会型自学和应用型助学费用放一起算。'
  if (values.budget === 'over-10000') return '你的预算空间相对大，但也不能只听贵的，还是要看专业和服务是否匹配。'
  return '你的预算处在常见区间，重点看学费、论文费、报考费和资料费有没有拆清楚。'
}

function getPriorityReason(values) {
  if (hasPriority(values, 'fastest')) return '你更看重速度，要优先核课程安排、考试批次、论文和毕业申请窗口。'
  if (hasPriority(values, 'cheapest')) return '你更看重省钱，要接受自己多查通知、多盯流程，不能只看低价。'
  if (hasPriority(values, 'exam')) return '你有考公/考编倾向，专业名称和岗位匹配比学校名气更重要。'
  if (hasPriority(values, 'school')) return '你看重学校名气，但自考最终还要看专业计划、费用和毕业学位要求。'
  if (hasPriority(values, 'easy')) return '你想难度低，就要重点避开统考压力大、数学英语实践课多的组合。'
  return '你更看重稳妥，适合先选费用清楚、课程压力适中、流程能跟上的组合。'
}

function resolveTargetLevel(values) {
  if (values.target === 'junior') return '专科'
  if (values.target === 'undergraduate') return '专升本'
  return values.education === 'high-school' ? '专科' : '专升本'
}

function createProfile(values, targetLevel) {
  const type = getProfileType(values)
  const eligibility = targetLevel === '专升本' && values.education === 'high-school'
    ? '可以先了解专升本路线，但申请本科毕业前通常需要完成专科或以上前置学历核验。'
    : targetLevel === '专升本'
      ? '方向上可以先看专升本，但仍要核对前置学历、专业计划和学校要求。'
      : '可以先看专科路线，再结合后续是否继续升本来规划。'

  return {
    title: type.title,
    summary: type.summary,
    targetLevel,
    eligibility,
  }
}

function getProfileType(values) {
  if (['exam', 'promotion', 'postgraduate', 'skill'].includes(values.purpose) || hasPriority(values, 'career')) {
    return {
      title: '职业提升实用型',
      summary: '你不适合只按哪个好考来选专业，要结合考证、岗位、升职或后续用途一起判断。',
    }
  }

  if (hasPriority(values, 'fastest') || values.purpose === 'certificate') {
    return {
      title: '快速拿证规划型',
      summary: '你更需要看课程数量、考试节奏和毕业环节，别只听别人说某个专业快。',
    }
  }

  if (hasPriority(values, 'cheapest') || values.budget === 'lowest' || values.budget === 'under-3000' || values.learningMode === 'self') {
    return {
      title: '低预算自学型',
      summary: '你更关注成本，适合先把必要费用和自学成本算清楚，再判断要不要助学。',
    }
  }

  if (values.learningMode === 'assisted' || getStudyHours(values) <= 0.5) {
    return {
      title: '低基础省心型',
      summary: '你现在更需要清楚流程、资料和节奏，有人带不一定最便宜，但可能更省心。',
    }
  }

  return {
    title: '上班族稳妥通关型',
    summary: '你适合优先看难度可控、资料成熟、费用边界清楚的专业学校组合。',
  }
}

function enrichOffering(item, values) {
  const difficulty = analyzeMajorDifficulty(item)
  const courseCount = getCourseCount(item)
  const cost = estimateCost(item, courseCount)
  const targetScore = getTargetScore(item, values)
  const avoidPenalty = getAvoidPenalty(item, difficulty, values)
  const timePenalty = getTimePenalty(item, difficulty, values)
  const stopped = isStoppedMajor(item)

  return {
    ...item,
    difficulty,
    courseCount,
    cost,
    stopped,
    baseScore: targetScore - avoidPenalty - timePenalty,
  }
}

function createRoute(key, label, title, desc, candidates, values) {
  const picks = choosePicks(candidates, key, values)
  return {
    key,
    label,
    title,
    desc,
    picks,
    duration: getDurationText(key, values),
    costHint: getRouteCostHint(key, picks),
    reasons: getRouteReasons(key, values, picks),
    risks: getRouteRisks(key, values, picks),
  }
}

function choosePicks(candidates, routeKey, values) {
  const sorted = [...candidates].sort((a, b) => scoreByRoute(b, routeKey, values) - scoreByRoute(a, routeKey, values))
  const picked = []
  const seenMajor = new Set()

  for (const item of sorted) {
    const majorKey = item.name
    if (seenMajor.has(majorKey) && picked.length < 2) continue
    picked.push(item)
    seenMajor.add(majorKey)
    if (picked.length >= 3) break
  }

  return picked
}

function scoreByRoute(item, routeKey, values) {
  const difficultyScore = item.difficulty.score || 3
  const coursePressure = item.courseCount ? Math.max(0, 18 - item.courseCount) : -2
  const costScore = item.cost.totalMid ? Math.max(0, 12000 - item.cost.totalMid) / 1000 : -3
  const fameScore = getSchoolScore(item.schoolName)
  const riskScore = item.priceText === '待核对' ? -3 : 0
  const stoppedPenalty = item.stopped ? -80 : 0
  const priceReadyBoost = hasReadyPrice(item) && hasCostFocus(values, 'tuition') ? 2 : 0
  const thesisReadyBoost = item.thesisPriceText && item.thesisPriceText !== '待核对' && hasCostFocus(values, 'thesis') ? 1.5 : 0

  if (routeKey === 'fast') {
    return item.baseScore + coursePressure * 1.4 + (6 - difficultyScore) * 3 + riskScore + stoppedPenalty + priceReadyBoost + (values.learningMode === 'assisted' ? 2 : 0)
  }

  if (routeKey === 'cheap') {
    return item.baseScore + costScore * 2.2 + stoppedPenalty + priceReadyBoost + thesisReadyBoost + (item.priceText === '待核对' ? -5 : 0) + (values.learningMode === 'self' ? 2 : 0)
  }

  return item.baseScore + (6 - difficultyScore) * 2 + costScore + fameScore + riskScore + stoppedPenalty + priceReadyBoost + thesisReadyBoost
}

function getTargetScore(item, values) {
  const text = `${item.name}${item.category || ''}`
  let score = 10

  if (values.purpose === 'exam' || hasPriority(values, 'exam')) {
    if (/行政|汉语言|法学|教育|思想政治|社会工作/.test(text)) score += 8
    if (/计算机|工程|机械|电气|土木/.test(text)) score -= 3
  }

  if (values.purpose === 'job' || values.purpose === 'promotion') {
    if (/工商|会计|财务|人力|行政|市场|电子商务|计算机|信息/.test(text)) score += 7
  }

  if (values.purpose === 'skill') {
    if (/计算机|软件|电子|设计|工程|会计|财务/.test(text)) score += 7
  }

  if (values.purpose === 'certificate' || values.purpose === 'degree') {
    if (/行政|人力|工商|汉语言|公共|学前|小学/.test(text)) score += 6
  }

  if (hasPriority(values, 'school')) score += getSchoolScore(item.schoolName)
  if (hasPriority(values, 'easy') && item.difficulty.score <= 2) score += 5
  if (hasPriority(values, 'career') && /会计|财务|法学|教育|计算机|人力|工商|行政/.test(text)) score += 5
  if (selectedValues(values.categoryPreferences, UNCERTAIN).includes(item.category)) score += 7
  if (selectedValues(values.schoolPreferences, UNCERTAIN).includes(item.schoolName)) score += 6

  return score
}

function getAvoidPenalty(item, difficulty, values) {
  const text = `${item.name}${item.category || ''}${item.unifiedCourses?.map((course) => course.name).join('') || ''}`
  let penalty = 0
  if (hasAvoid(values, 'none')) return 0
  if (hasAvoid(values, 'math') && /数学|线性代数|概率|统计|工程|计算机|机械|电气|电子|土木/.test(text)) penalty += 7
  if (hasAvoid(values, 'english') && /英语/.test(text)) penalty += 4
  if (hasAvoid(values, 'computer') && /计算机|软件|数据|网络|信息系统/.test(text)) penalty += 6
  if (hasAvoid(values, 'writing') && /汉语言|文学|论文|写作|法学|教育/.test(text)) penalty += 4
  if (penalty) return penalty
  return difficulty.score >= 4 ? 2 : 0
}

function hasPriority(values, key) {
  return selectedValues(values.priority).includes(key)
}

function hasAvoid(values, key) {
  const subjects = selectedValues(values.avoidSubject)
  if (key === 'none') return subjects.includes('none') && subjects.length === 1
  return subjects.filter((item) => item !== 'none').includes(key)
}

function hasCostFocus(values, key) {
  const costFocus = selectedValues(values.costFocus)
  return costFocus.includes(key) || costFocus.includes('all')
}

function selectedValues(value, neutralKey = '') {
  const values = Array.isArray(value) ? value : value ? [value] : []
  if (neutralKey) return values.filter((item) => item !== neutralKey)
  return values
}

function hasReadyPrice(item) {
  return Boolean(item?.priceText && item.priceText !== '待核对')
}

function hasNarrowScope(values) {
  return Boolean(
    selectedValues(values.categoryPreferences, UNCERTAIN).length ||
    selectedValues(values.schoolPreferences, UNCERTAIN).length
  )
}

function describeSelected(value, fallback) {
  const selected = selectedValues(value, UNCERTAIN)
  return selected.length ? selected.slice(0, 3).join('、') + (selected.length > 3 ? '等' : '') : fallback
}

function describeCostFocus(values) {
  const labels = {
    tuition: '助学费/学费',
    'exam-fee': '报考费',
    thesis: '论文/实践费用',
    material: '教材资料费',
    all: '全部费用',
  }
  const selected = selectedValues(values.costFocus)
  return selected.length ? selected.map((item) => labels[item] || item).join('、') : '暂未选择，默认先看学费和论文费用'
}

function getTimePenalty(item, difficulty, values) {
  const hours = getStudyHours(values)
  if (hours >= 2) return 0
  if (hours >= 1.5) return difficulty.score >= 5 ? 2 : 0
  if (hours >= 1) return difficulty.score >= 4 ? 4 : 0
  return difficulty.score >= 3 ? 6 : 2
}

function getStudyHours(values) {
  const hours = Number(values.studyTime)
  const safeHours = Number.isFinite(hours) ? hours : 1
  return Math.min(8, Math.max(0.5, safeHours))
}

function getCourseCount(item) {
  const count = (item.unifiedCourseCount || 0) + (item.schoolExamCourseCount || 0)
  if (count) return count
  const courses = [...(item.unifiedCourses || []), ...(item.schoolExamCourses || [])]
  return courses.length || (item.level === '专升本' ? 14 : 16)
}

function estimateCost(item, courseCount) {
  const tuition = parseTuition(item.priceText)
  const thesis = parseFirstNumber(item.thesisPriceText)
  const examFee = courseCount * EXAM_FEE_PER_COURSE
  const materialMin = 300
  const materialMax = 800

  if (!tuition) {
    return {
      text: '费用待核对',
      totalMid: null,
    }
  }

  const totalMin = tuition + examFee + (thesis || 0) + materialMin
  const totalMax = tuition + examFee + (thesis || 0) + materialMax

  return {
    text: `约 ${formatMoney(totalMin)}-${formatMoney(totalMax)} 元`,
    totalMid: Math.round((totalMin + totalMax) / 2),
  }
}

function parseTuition(text = '') {
  if (!text || text === '待核对') return null
  const totalMatch = String(text).match(/总学费\s*(\d+)/)
  if (totalMatch) return Number(totalMatch[1])

  const yearMatch = String(text).match(/(\d+)\s*元\/年/)
  if (yearMatch) return Number(yearMatch[1]) * 2

  return parseFirstNumber(text)
}

function parseFirstNumber(text = '') {
  const match = String(text).match(/(\d+)/)
  return match ? Number(match[1]) : 0
}

function formatMoney(value) {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function getSchoolScore(name = '') {
  if (/四川大学|电子科技大学/.test(name)) return 5
  if (/西南交通大学|西南财经大学|四川师范大学|成都理工大学|西南石油大学/.test(name)) return 4
  if (/大学/.test(name)) return 2
  return 1
}

function getDurationText(key, values) {
  const hours = getStudyHours(values)
  if (key === 'fast') return hours <= 0.5 ? '约 2.5-3 年' : '约 1.5-2.5 年'
  if (key === 'cheap') return values.learningMode === 'self' ? '约 2.5-4 年' : '约 2-3 年'
  return hours >= 2 ? '约 1.5-2.5 年' : '约 2-3 年'
}

function getRouteCostHint(key, picks) {
  const ready = picks.map((item) => item.cost).filter((item) => item.totalMid)
  if (!ready.length) return '费用需核对'
  const min = Math.min(...ready.map((item) => item.totalMid))
  const max = Math.max(...ready.map((item) => item.totalMid))
  if (key === 'cheap') return `优先看 ${formatMoney(min)} 元左右起`
  return min === max ? `约 ${formatMoney(min)} 元` : `约 ${formatMoney(min)}-${formatMoney(max)} 元`
}

function getRouteReasons(key, values, picks) {
  const first = picks[0]
  if (!first) return ['当前数据不足，建议先查学校和专业详情。']

  if (key === 'fast') {
    return [
      `优先选择课程压力相对可控的组合，首选 ${first.schoolName} ${first.name}。`,
      `按你每天学习时间，先把统考和省考节奏排出来，比单纯看学校名更重要。`,
      '适合想尽快跑完流程，但愿意接受助学费用和老师节奏的人。',
    ]
  }

  if (key === 'cheap') {
    return [
      `优先挑费用更低或费用边界更清楚的组合，首选 ${first.schoolName} ${first.name}。`,
      '如果预算特别低，可以把这条路线和社会型自学一起对比。',
      '低成本不等于没成本，教材、报考、补考、论文或实践费用都要单独算。',
    ]
  }

  return [
    `综合难度、费用、用途和学校数据，首选 ${first.schoolName} ${first.name}。`,
    '适合第一次了解四川自考，还没确定到底走快、省还是稳的人。',
    '先拿这条路线做底稿，再去核学校、专业和费用。',
  ]
}

function getRouteRisks(key, values, picks) {
  const hasMissingPrice = picks.some((item) => item.priceText === '待核对')
  const hasHardMajor = picks.some((item) => (item.difficulty.score || 3) >= 4)
  const hasStoppedMajor = picks.some((item) => item.stopped)
  const risks = []

  if (values.education === 'high-school' && values.target === 'undergraduate') {
    risks.push('你想走专升本时，要提前处理专科前置学历问题，不能只看本科专业。')
  }

  if (hasMissingPrice) risks.push('部分学校专业费用仍需核对，不能只按当前整理数据直接报名。')
  if (hasHardMajor) risks.push('路线中有偏难专业，数学、实践或专业课压力要提前看清。')
  if (hasStoppedMajor) risks.push('这条路线里还有停考专业，只有存量在籍考生才适合继续核过渡安排，新生不要直接报。')
  if (key === 'cheap') risks.push('低成本路线更考验自律和信息搜集能力，流程要自己盯紧。')
  if (key === 'fast') risks.push('快不等于保证拿证，考试安排、通过率、论文和毕业申请都会影响周期。')

  risks.push('学校、专业、费用和考试计划可能调整，最终以官方通知和学校当期要求为准。')
  return uniqueList(risks)
}

function uniqueList(items) {
  return [...new Set(items)]
}

function majorDetailPath(item) {
  return `/majors/${getMajorPlanById(item.planId) ? item.planId : item.id}`
}

function majorComparePath(item) {
  return {
    path: '/majors',
    query: {
      keyword: item.name,
      level: item.level,
    },
  }
}
</script>
