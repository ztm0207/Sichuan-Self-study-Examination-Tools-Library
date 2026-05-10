<template>
  <div class="thesis-tool-panel">
    <el-card class="thesis-planner-card" shadow="never">
      <div class="thesis-tool-head">
        <span>论文规划器</span>
        <h2>先选小自考学校专业，再拆下一步</h2>
        <p>这个工具只面向应用型小自考专升本。先从内置学校专业带入信息，再按本科论文、毕业设计或毕业考核节点规划申请、写作、提交和答辩。</p>
      </div>

      <el-form label-position="top">
        <div class="thesis-form-grid">
          <el-form-item label="应用型学校专业快速带入">
            <el-select
              v-model="selectedOfferingId"
              filterable
              clearable
              placeholder="选择学校 + 专业"
            >
              <el-option
                v-for="item in offeringOptions"
                :key="item.id"
                :label="`${item.schoolName} · ${item.level} · ${item.name}`"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </div>

        <div v-if="profileSummary.length" class="thesis-cost-strip thesis-profile-strip">
          <div v-for="item in profileSummary" :key="item.label">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </div>
        </div>

        <div class="thesis-form-grid">
          <el-form-item label="当前阶段">
            <el-select v-model="form.phase" placeholder="选择当前阶段">
              <el-option v-for="phase in phaseOptions" :key="phase.value" :label="phase.label" :value="phase.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="距学校截止时间">
            <el-select v-model="form.deadline" placeholder="选择时间压力">
              <el-option label="还没通知" value="unknown" />
              <el-option label="30 天以上" value="relaxed" />
              <el-option label="15-30 天" value="normal" />
              <el-option label="15 天以内" value="tight" />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="申请条件核对">
          <el-checkbox-group v-model="form.readyItems" class="thesis-ready-group">
            <el-checkbox v-for="item in readyOptions" :key="item.value" :label="item.value">
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
          <p class="field-help-text">这里可以多选，用来判断哪些申请前置条件已经准备好。</p>
        </el-form-item>

        <el-form-item label="论文题目初稿">
          <el-input
            v-model="form.title"
            type="textarea"
            :rows="3"
            maxlength="90"
            show-word-limit
            placeholder="例如：成都市中小企业员工培训问题及优化策略研究"
          />
        </el-form-item>

        <div class="thesis-form-actions">
          <el-button plain @click="resetPlanner">清空重选</el-button>
        </div>
      </el-form>
    </el-card>

    <div class="thesis-side-stack">
      <el-card class="thesis-status-card" shadow="never">
        <div class="thesis-status-box" :class="statusClass">
          <span>{{ statusLabel }}</span>
          <h3>{{ currentPhase.title }}</h3>
          <p>{{ phaseDesc }}</p>
        </div>

        <div class="thesis-next-list">
          <h4>下一步</h4>
          <ul>
            <li v-for="item in nextActions" :key="item">{{ item }}</li>
          </ul>
        </div>
      </el-card>

      <el-card class="thesis-status-card" shadow="never">
        <h3 class="thesis-card-title">题目风险检查</h3>
        <div class="thesis-risk-list">
          <div v-for="risk in titleRisks" :key="risk.text" :class="`is-${risk.type}`">
            <strong>{{ risk.label }}</strong>
            <span>{{ risk.text }}</span>
          </div>
        </div>
      </el-card>
    </div>

    <el-card class="thesis-wide-card" shadow="never">
      <div class="thesis-section-head">
        <span>题目拆解</span>
        <h3>{{ titleBreakdown.title }}</h3>
      </div>
      <div class="thesis-breakdown-grid">
        <article v-for="item in titleBreakdown.items" :key="item.label">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
          <p>{{ item.hint }}</p>
        </article>
      </div>
    </el-card>

    <el-card class="thesis-wide-card" shadow="never">
      <div class="thesis-section-head">
        <span>专业分析</span>
        <h3>{{ majorProfile.title }}</h3>
      </div>
      <div class="thesis-major-profile">
        <article>
          <span>论文类型</span>
          <strong>{{ majorProfile.paperType }}</strong>
          <p>{{ majorProfile.logic }}</p>
        </article>
        <article>
          <span>推荐结构</span>
          <strong>{{ majorProfile.structure }}</strong>
          <p>{{ majorProfile.structureTip }}</p>
        </article>
        <article>
          <span>资料来源</span>
          <strong>{{ majorProfile.evidence }}</strong>
          <p>{{ majorProfile.evidenceTip }}</p>
        </article>
        <article>
          <span>避坑提醒</span>
          <strong>{{ majorProfile.avoid }}</strong>
          <p>{{ majorProfile.avoidTip }}</p>
        </article>
      </div>
    </el-card>

    <el-card class="thesis-wide-card" shadow="never">
      <div class="thesis-section-head">
        <span>选题方向</span>
        <h3>{{ activeMajorName || '先选择学校专业，再看推荐方向' }}</h3>
      </div>
      <div class="thesis-topic-list">
        <article v-for="topic in topicSuggestions" :key="topic.title">
          <strong>{{ topic.title }}</strong>
          <p>{{ topic.desc }}</p>
          <em>{{ topic.tip }}</em>
        </article>
      </div>
    </el-card>

    <el-card class="thesis-wide-card" shadow="never">
      <div class="thesis-section-head">
        <span>时间线</span>
        <h3>{{ timelineTitle }}</h3>
      </div>
      <div class="thesis-timeline-mini">
        <article v-for="item in timelineItems" :key="item.title" :class="{ active: item.active }">
          <span>{{ item.week }}</span>
          <strong>{{ item.title }}</strong>
          <p>{{ item.desc }}</p>
        </article>
      </div>
    </el-card>

    <el-card class="thesis-wide-card" shadow="never">
      <div class="thesis-section-head">
        <span>材料清单</span>
        <h3>按当前阶段优先准备</h3>
      </div>
      <div class="thesis-check-mini">
        <article v-for="group in materialGroups" :key="group.title" :class="{ active: group.active }">
          <strong>{{ group.title }}</strong>
          <div v-for="item in group.items" :key="item" class="thesis-material-item">
            <span>{{ item }}</span>
          </div>
        </article>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { schoolMajorOfferings } from '../../js/schools'

const selectedOfferingId = ref('')
const form = reactive({
  schoolName: '',
  majorName: '',
  phase: 'prepare',
  deadline: 'unknown',
  readyItems: ['notice'],
  title: '',
})

const phaseOptions = [
  { value: 'not_started', label: '还没开始', title: '先确认是否具备申请条件' },
  { value: 'notice', label: '已看到通知', title: '把时间、材料和格式先锁定' },
  { value: 'prepare', label: '准备申请/选题', title: '先看学校通知和题库' },
  { value: 'topic', label: '已定题', title: '把题目缩小到能写清楚' },
  { value: 'outline', label: '写提纲', title: '先搭目录，再动正文' },
  { value: 'draft', label: '写初稿', title: '先完成，再修改' },
  { value: 'revise', label: '导师修改中', title: '按意见逐条处理' },
  { value: 'final', label: '定稿/查重', title: '重点处理格式和引用' },
  { value: 'defense', label: '准备答辩', title: '把论文讲清楚' },
  { value: 'passed', label: '已通过', title: '等成绩归档和毕业申请' },
]

const readyOptions = [
  { value: 'notice', label: '已找到主考院校通知' },
  { value: 'courses', label: '课程接近考完或符合申请条件' },
  { value: 'template', label: '已拿到格式模板' },
  { value: 'fee', label: '已确认缴费/提交入口' },
  { value: 'degree', label: '需要学位，已看论文成绩要求' },
]

const offeringOptions = computed(() => (
  schoolMajorOfferings
    .filter((item) => item.level?.includes('专升本'))
    .sort((a, b) => `${a.schoolName}${a.level}${a.name}`.localeCompare(`${b.schoolName}${b.level}${b.name}`, 'zh-Hans-CN'))
))

const selectedOffering = computed(() => schoolMajorOfferings.find((item) => item.id === selectedOfferingId.value))
const activeMajorName = computed(() => selectedOffering.value?.name || form.majorName.trim())
const activeSchoolName = computed(() => selectedOffering.value?.schoolName || form.schoolName.trim())
const currentPhase = computed(() => phaseOptions.find((item) => item.value === form.phase) || phaseOptions[2])
const thesisCourseNames = computed(() => {
  const courses = [...(selectedOffering.value?.unifiedCourses || []), ...(selectedOffering.value?.schoolExamCourses || [])]
  return courses.filter((course) => /论文|毕业考核|毕业设计|综合实践/.test(course.name || '')).map((course) => course.name)
})
const thesisCourseText = computed(() => thesisCourseNames.value.length ? thesisCourseNames.value.slice(0, 2).join('、') : '未单列')

const profileSummary = computed(() => {
  const items = [
    { label: '路径', value: '小自考/应用型' },
    { label: '层次', value: selectedOffering.value?.level || '专升本' },
  ]
  if (activeSchoolName.value) items.push({ label: '主考院校', value: activeSchoolName.value })
  if (activeMajorName.value) items.push({ label: '专业', value: activeMajorName.value })
  if (selectedOffering.value) {
    items.push({ label: '论文费用', value: selectedOffering.value.thesisPriceText || '待学校通知确认' })
    items.push({ label: '论文/考核课程', value: thesisCourseText.value })
  }
  return items.slice(0, 6)
})

const statusLabel = computed(() => '小自考本科规划')
const statusClass = computed(() => ({
  'is-tight': form.deadline === 'tight',
}))
const phaseDesc = computed(() => {
  const deadlineTip = deadlineAdviceMap[form.deadline] || ''
  const pathTip = '小自考论文节点通常要同步看主考院校、学校或助学点通知，尤其是申请窗口、缴费、模板和提交入口。'
  return [phaseAdviceMap[form.phase]?.desc || phaseAdviceMap.prepare.desc, deadlineTip, pathTip].filter(Boolean).join(' ')
})
const nextActions = computed(() => {
  const base = phaseAdviceMap[form.phase]?.actions || phaseAdviceMap.prepare.actions
  const missing = readyOptions
    .filter((item) => !form.readyItems.includes(item.value))
    .slice(0, 2)
    .map((item) => `补齐：${item.label}`)
  const urgent = form.deadline === 'tight' ? ['先提交合规版本，不再大幅换题'] : []
  return [...urgent, ...base, ...missing].slice(0, 5)
})
const titleRisks = computed(() => analyzeTitle(form.title, activeMajorName.value, form.deadline))
const majorProfile = computed(() => getMajorProfile(activeMajorName.value))
const titleBreakdown = computed(() => buildTitleBreakdown(form.title, activeMajorName.value, majorProfile.value))
const topicSuggestions = computed(() => getTopicSuggestions(activeMajorName.value))
const timelineItems = computed(() => buildTimeline(form.phase, form.deadline))
const timelineTitle = computed(() => form.deadline === 'tight' ? '按紧急提交节奏倒排' : '按当前阶段往后推')
const materialGroups = computed(() => buildMaterialGroups(form.phase))

watch(selectedOffering, (offering) => {
  if (!offering) {
    form.schoolName = ''
    form.majorName = ''
    return
  }
  form.schoolName = offering.schoolName || ''
  form.majorName = offering.name || ''
})

watch(selectedOfferingId, (id, oldId) => {
  if (id === oldId) return
  form.phase = 'prepare'
  form.deadline = 'unknown'
  form.readyItems = ['notice']
  form.title = ''
})

function resetPlanner() {
  selectedOfferingId.value = ''
  form.schoolName = ''
  form.majorName = ''
  form.phase = 'prepare'
  form.deadline = 'unknown'
  form.readyItems = ['notice']
  form.title = ''
}

const deadlineAdviceMap = {
  relaxed: '时间还算宽，可以先把题目和提纲打磨稳。',
  normal: '时间适中，建议每周固定完成一部分可提交内容。',
  tight: '时间偏紧，优先保证题目不跑偏、格式合规、材料能提交。',
}

const phaseAdviceMap = {
  not_started: {
    desc: '先不要急着写，先看主考院校论文申请条件、申请窗口、费用和格式模板。',
    actions: ['确认课程是否接近考完', '查看主考院校论文通知', '记录申请入口、截止时间和缴费方式'],
  },
  notice: {
    desc: '已经看到通知后，先把申请资格、题目范围、格式模板、提交入口和答辩方式整理成一页清单。',
    actions: ['下载格式模板和附件表格', '标记申请、初稿、定稿、答辩四个日期', '确认是否需要先缴费或系统申报'],
  },
  prepare: {
    desc: '这个阶段最重要的是选题不要太大，先拿到学校模板、题库或指导要求。',
    actions: ['确定学校论文申请时间', '选择小而具体的题目', '准备 3 个备选题目给老师确认'],
  },
  topic: {
    desc: '题目确定后，先拆研究对象、研究问题和资料来源，避免写到一半没材料。',
    actions: ['把题目改成具体对象', '列 3-4 个一级标题', '先找 8-10 篇参考文献'],
  },
  outline: {
    desc: '提纲阶段决定后面好不好写，目录要能回答“发现问题、分析原因、提出建议”。',
    actions: ['完成三级目录', '确认每章要写什么材料', '发给指导老师确认方向'],
  },
  draft: {
    desc: '初稿先求完整，不要一边写一边反复纠结一句话，后面还有修改轮次。',
    actions: ['按目录完成正文', '引用来源同步记录', '先完成摘要、关键词和参考文献框架'],
  },
  revise: {
    desc: '修改阶段要按导师意见逐条处理，别只改格式不改逻辑。',
    actions: ['整理导师意见清单', '逐条修改并标记完成', '重点处理重复率、格式和案例材料'],
  },
  final: {
    desc: '定稿前主要看格式、查重、引用、页眉页脚、目录和签字材料。',
    actions: ['套学校格式模板', '按要求查重或提交检测', '检查文件命名和上传材料'],
  },
  defense: {
    desc: '答辩不是背全文，而是能说明自己为什么选题、写了什么、结论是什么。',
    actions: ['准备 2-3 分钟自述', '准备选题原因、研究方法、结论、不足', '熟悉论文目录和关键数据'],
  },
  passed: {
    desc: '论文通过后还要等成绩归档，后面衔接毕业申请和学位申请。',
    actions: ['确认论文成绩是否已归档', '关注毕业申请窗口', '需要学位的继续核对平均分和外语要求'],
  },
}

function analyzeTitle(title, majorName = '', deadline = 'unknown') {
  const text = title.trim()
  if (!text) {
    return [{ type: 'info', label: '待填写', text: '输入论文题目后，这里会检查题目是否过大、过空、专业贴合度和提交风险。' }]
  }

  const risks = []
  if (text.length < 12) {
    risks.push({ type: 'warning', label: '偏短', text: '题目太短通常研究对象不清楚，建议补充对象、地区或场景。' })
  }
  if (text.length > 34) {
    risks.push({ type: 'warning', label: '偏长', text: '题目过长容易堆概念，建议压缩成“对象 + 问题 + 方法/策略”。' })
  }
  if (/我国|中国|企业|大学生|中小企业|互联网|新媒体|乡村振兴/.test(text) && !/以.+为例|基于|某|成都|四川|地区|公司|学校|医院|社区|平台|课堂/.test(text)) {
    risks.push({ type: 'danger', label: '题目偏大', text: '建议缩小到某个企业、学校、地区、群体、平台或具体业务场景。' })
  }
  if (!/问题|策略|优化|影响|路径|现状|应用|分析|研究|设计|改进/.test(text)) {
    risks.push({ type: 'warning', label: '问题不够明确', text: '题目最好能看出要分析什么问题，或者要提出什么改进建议。' })
  }
  if (!/以.+为例|基于|某|成都|四川|地区|公司|学校|医院|社区|平台|课堂|项目/.test(text)) {
    risks.push({ type: 'info', label: '对象可再具体', text: '如果学校允许，加入案例对象、地区或具体场景，后续资料会更好组织。' })
  }
  if (majorName && !isTitleCloseToMajor(text, majorName)) {
    risks.push({ type: 'info', label: '专业贴合度', text: '注意让题目和专业方向靠近，避免答辩时被问为什么和本专业关系不强。' })
  }
  if (deadline === 'tight' && risks.some((risk) => risk.type === 'danger')) {
    risks.push({ type: 'danger', label: '紧急风险', text: '截止时间很近时不建议继续用大题，先缩小范围再写。' })
  }
  if (!risks.length) {
    risks.push({ type: 'success', label: '方向可用', text: '这个题目有具体问题意识，下一步重点确认资料是否好找、学校是否允许。' })
  }
  return risks
}

function buildTitleBreakdown(title, majorName = '', profile = getMajorProfile(majorName)) {
  const text = title.trim()
  if (!text) {
    return {
      title: '用“四件事”检查题目是否能写',
      items: [
        { label: '研究对象', value: '待补充', hint: '写清楚是某类人、某个组织、某个地区还是某个平台。' },
        { label: '核心问题', value: '待补充', hint: '最好能看到问题、现状、影响、优化或设计方向。' },
        { label: '资料来源', value: '待确认', hint: '提前判断能否找到文献、案例、数据或访谈材料。' },
        { label: '专业贴合', value: majorName || '待选择专业', hint: '题目需要能解释和本专业课程之间的关系。' },
      ],
    }
  }
  return {
    title: '把题目拆成可写的论文骨架',
    items: [
      { label: '研究对象', value: extractObject(text), hint: '对象越具体，目录越容易落地。' },
      { label: '核心问题', value: extractProblem(text), hint: '正文要围绕这个问题展开，不要写成资料综述。' },
      { label: '建议目录', value: profile.structure, hint: profile.structureTip },
      { label: '专业贴合', value: majorName || '未选择专业', hint: majorName ? '答辩时准备一句话说明它和专业课程的关系。' : '选择或填写专业后，可辅助判断贴合度。' },
    ],
  }
}

function extractObject(text) {
  const match = text.match(/(?:以|基于)(.+?)(?:为例|的|问题|策略|优化|研究|分析)/)
  if (match?.[1]) return match[1]
  if (/成都|四川|地区|公司|学校|医院|社区|平台|课堂|项目/.test(text)) return '题目中已有具体场景'
  return '建议补充具体对象'
}

function extractProblem(text) {
  const problemWords = ['问题', '策略', '优化', '影响', '路径', '现状', '应用', '分析', '设计', '改进']
  const word = problemWords.find((item) => text.includes(item))
  return word ? `围绕“${word}”展开` : '建议补充问题意识'
}

function isTitleCloseToMajor(title, majorName) {
  const keywords = getMajorKeywords(majorName)
  return keywords.some((keyword) => title.includes(keyword))
}

function getMajorKeywords(majorName = '') {
  if (/会计|财务|金融|经济/.test(majorName)) return ['会计', '财务', '审计', '成本', '税', '内控', '金融', '风险', '投资']
  if (/人力/.test(majorName)) return ['员工', '绩效', '招聘', '培训', '薪酬', '人力']
  if (/市场|工商|电子商务|物流|旅游|酒店|文化产业/.test(majorName)) return ['营销', '客户', '品牌', '企业', '电商', '运营', '服务', '文化']
  if (/行政|公共|城市管理|土地资源|信息资源|农林经济/.test(majorName)) return ['公共', '治理', '服务', '资源', '城市', '社区', '土地', '信息']
  if (/教育|学前|小学|汉语言|英语|思想政治|体育/.test(majorName)) return ['幼儿', '学生', '课堂', '教学', '教育', '家校', '语文', '阅读', '体育', '思政']
  if (/护理|药学|医学|动物医学|食品|营养/.test(majorName)) return ['护理', '患者', '用药', '医院', '健康', '动物', '食品', '安全', '检测']
  if (/农学|园林/.test(majorName)) return ['农业', '作物', '园林', '植物', '病虫害', '生态', '乡村']
  if (/法学|法律|公安|社会工作/.test(majorName)) return ['法律', '合同', '劳动', '权益', '责任', '治理', '社区', '案例']
  if (/计算机|软件|电子信息|信息管理|网络/.test(majorName)) return ['系统', '平台', '数据', '信息', '应用', '管理']
  if (/工程|造价|土木|建筑|机械|汽车|交通|道路|桥梁|电气|飞行器|消防|环境|城乡规划/.test(majorName)) return ['工程', '造价', '施工', '项目', '成本', '交通', '安全', '环境', '规划']
  if (/设计|艺术|媒体|视觉|产品|动画|播音|编导|广告|网络与新媒体/.test(majorName)) return ['设计', '视觉', '品牌', '界面', '媒体', '传播', '作品', '用户']
  return ['管理', '问题', '策略', '优化', '应用']
}

function getMajorProfile(majorName = '') {
  if (/会计|财务|审计|金融|经济/.test(majorName)) {
    return {
      title: '财经类：重点写清数据、流程和风险控制',
      paperType: '案例分析 / 内控优化 / 成本控制 / 金融风险',
      logic: '适合围绕某企业、某业务环节、某项费用或某类金融服务，写“现状、问题、原因、改进”。',
      structure: '现状 - 问题 - 原因 - 对策',
      structureTip: '目录要能落到财务流程、成本项目、内控节点、金融产品或风险控制。',
      evidence: '企业制度、公开年报、访谈记录、费用分类、业务流程、行业数据',
      evidenceTip: '没有真实企业数据时，也要用公开资料或合理案例支撑，不要只讲概念。',
      avoid: '只抄理论、没有数据、对策空泛',
      avoidTip: '比如“加强管理”“提高意识”太虚，最好写成具体制度、岗位、流程或表单。',
    }
  }
  if (/人力|行政|公共事业|工商|市场|电子商务|物流|旅游|酒店|城市管理|土地资源|信息资源|文化产业|农林经济/.test(majorName)) {
    return {
      title: '管理 / 公共服务类：重点写清具体场景和改进方案',
      paperType: '运营问题分析 / 服务优化 / 治理改进 / 资源管理',
      logic: '适合围绕企业、门店、平台、岗位、社区、城市服务或资源管理流程，把问题拆成可观察的管理现象。',
      structure: '背景 - 现状 - 问题 - 优化策略',
      structureTip: '目录里要有具体对象和业务场景，别写成泛泛的行业介绍。',
      evidence: '访谈、问卷、平台数据、岗位流程、用户评价、公开案例、政策文件',
      evidenceTip: '有工作经历的考生可以优先写自己熟悉的行业或岗位，资料会更好找。',
      avoid: '题目太大、对象不清、建议像口号',
      avoidTip: '把“企业营销策略”缩成“某公司某产品线上营销优化策略”会更稳。',
    }
  }
  if (/教育|学前|小学|汉语言|英语|思想政治|体育/.test(majorName)) {
    return {
      title: '教育 / 语言 / 体育类：重点写清教学对象、文本或课堂场景',
      paperType: '教学策略 / 文本分析 / 学习问题研究 / 训练活动设计',
      logic: '适合围绕某学段、某课程、某类文本、某个教学活动或体育训练场景，写问题和改进路径。',
      structure: '理论依据 - 现状问题 - 原因分析 - 教学策略',
      structureTip: '如果是汉语言或英语，也可以用“文本特征 - 表达手法 - 价值分析”；体育类要落到教学或训练场景。',
      evidence: '课堂观察、学生作业、教学案例、教材文本、问卷访谈、训练记录',
      evidenceTip: '教育类不要只堆教育理论，最好有课堂、学生或文本材料承接。',
      avoid: '只谈理念、没有学段、没有案例',
      avoidTip: '题目里加上学段、课程或文本对象，答辩时更容易说明研究范围。',
    }
  }
  if (/计算机|软件|信息|网络|电子/.test(majorName)) {
    return {
      title: '计算机 / 信息类：重点写清需求、功能和应用价值',
      paperType: '系统设计 / 平台优化 / 信息化应用',
      logic: '适合围绕某个管理场景或平台，写需求分析、功能设计、应用问题和优化。',
      structure: '需求分析 - 功能设计 - 应用实现 - 测试优化',
      structureTip: '不一定要写成完整开发论文，但要能讲清系统解决了什么问题。',
      evidence: '需求清单、流程图、原型图、功能模块、测试记录、用户反馈',
      evidenceTip: '如果代码能力有限，可以偏“系统需求与应用优化”，降低实现压力。',
      avoid: '只写技术名词、没有业务场景',
      avoidTip: '比如“大数据应用研究”太空，最好落到某平台、某部门或某业务流程。',
    }
  }
  if (/法学|法律|公安|社会工作/.test(majorName)) {
    return {
      title: '法学 / 公安 / 社会工作类：重点写清问题、案例和规范依据',
      paperType: '案例评析 / 制度完善 / 权益保护 / 社区治理',
      logic: '适合围绕劳动、合同、侵权、消费者权益、基层治理或社会服务等具体问题，用案例分析规范适用。',
      structure: '问题提出 - 案例分析 - 规范适用 - 完善建议',
      structureTip: '目录要体现关系、争议焦点、规范依据和可执行建议，不能只写社会评论。',
      evidence: '法律条文、裁判文书、典型案例、监管文件、政策文件、访谈材料',
      evidenceTip: '案例要和题目高度相关，引用条文时注意最新有效版本。',
      avoid: '像新闻评论、缺少法条、结论绝对化',
      avoidTip: '建议用“完善建议”“适用困境”这类稳妥表达，避免过度下结论。',
    }
  }
  if (/护理|药学|医学|健康|动物医学|食品|营养/.test(majorName)) {
    return {
      title: '医药 / 动物医学 / 食品营养类：重点写清对象、流程和规范安全',
      paperType: '护理干预 / 用药管理 / 健康教育 / 食品安全 / 动物防疫',
      logic: '适合围绕某类患者、用药场景、食品检测流程、营养管理或动物防疫场景，写问题、措施和效果评价。',
      structure: '对象与现状 - 问题分析 - 规范措施 - 效果评价',
      structureTip: '目录要体现专业规范和安全边界，不建议写超出岗位范围的治疗或诊疗方案。',
      evidence: '护理记录、健康宣教材料、访谈问卷、指南规范、检测标准、病例或样本统计',
      evidenceTip: '涉及患者、动物或检测数据时要注意脱敏和规范表达。',
      avoid: '专业结论过大、缺少规范依据',
      avoidTip: '自考论文更适合写流程管理、健康教育、用药安全、食品安全或防疫管理等可控主题。',
    }
  }
  if (/农学|园林/.test(majorName)) {
    return {
      title: '农学 / 园林类：重点写清对象、技术流程和应用场景',
      paperType: '栽培管理 / 病虫害防治 / 园林养护 / 乡村应用',
      logic: '适合围绕某类作物、某个园林项目、某项栽培技术或病虫害防治问题，写现状、问题和改进措施。',
      structure: '对象概况 - 现状问题 - 技术分析 - 改进措施',
      structureTip: '目录要能落到作物、植物、养护流程、生态场景或农业生产问题。',
      evidence: '种植记录、养护方案、病虫害资料、政策文件、图片记录、访谈问卷',
      evidenceTip: '有真实场景或图片记录会更稳，避免只写农业理论。 ',
      avoid: '对象太泛、技术措施空、没有场景材料',
      avoidTip: '把题目落到某作物、某地区、某园林项目或某项技术，会更容易写清楚。',
    }
  }
  if (/工程|造价|土木|建筑|机械|汽车|交通|道路|桥梁|电气|电子信息|飞行器|消防|环境|城乡规划/.test(majorName)) {
    return {
      title: '工程 / 交通 / 环境规划类：重点写清项目对象和技术流程',
      paperType: '项目管理 / 施工质量 / 成本控制 / 技术改进 / 安全治理',
      logic: '适合围绕某工程、某工序、某设备、某交通场景、某环境问题或某项目管理问题，写流程、风险和改进。',
      structure: '项目概况 - 问题识别 - 原因分析 - 改进措施',
      structureTip: '目录要有工程对象、技术环节、项目管理节点或规划治理场景。',
      evidence: '项目流程、施工记录、成本清单、质量问题、规范标准、监测资料、现场照片',
      evidenceTip: '图表、流程图和对比表比大段理论更有说服力。',
      avoid: '没有项目、没有参数、只有概念',
      avoidTip: '把题目落到某项目或某工序，能明显降低写作难度。',
    }
  }
  if (/设计|艺术|视觉|环境设计|产品|动画|媒体|传播|播音|编导|广告|网络与新媒体/.test(majorName)) {
    return {
      title: '设计 / 传媒类：重点写清作品对象、用户和表达策略',
      paperType: '设计实践 / 视觉优化 / 传播策略 / 内容表达',
      logic: '适合围绕品牌、界面、空间、海报、短视频、播音主持或传播活动，写问题和设计改进。',
      structure: '需求分析 - 设计定位 - 方案表达 - 效果评价',
      structureTip: '如果学校要求作品说明，要把设计目标、受众和呈现逻辑说清楚。',
      evidence: '竞品案例、用户反馈、设计草图、视觉规范、传播数据',
      evidenceTip: '图片、方案对比和用户反馈能增强论文可信度。',
      avoid: '只展示作品、不解释设计依据',
      avoidTip: '答辩时通常会问为什么这样设计，要提前准备设计理由。',
    }
  }
  return {
    title: majorName ? `${majorName}：先按专业课程找具体应用场景` : '先选择专业，查看对应写作分析',
    paperType: '问题分析 / 应用研究 / 优化策略',
    logic: '通用思路是先找具体对象，再写现状、问题、原因和改进建议。',
    structure: '现状 - 问题 - 原因 - 对策',
    structureTip: '多数自考论文先用这个结构更稳，再按学校模板调整。',
    evidence: '公开资料、访谈问卷、课程案例、工作场景材料',
    evidenceTip: '优先选自己能拿到材料的对象，避免写到一半没有证据。',
    avoid: '题目空泛、资料不足、和专业关系弱',
    avoidTip: '选题时先问：对象是谁、问题是什么、材料从哪里来、和专业课怎么关联。',
  }
}

function getTopicSuggestions(majorName = '') {
  if (/会计|财务|金融|经济/.test(majorName)) {
    return [
      { title: '中小企业成本控制', desc: '围绕采购、库存、人工、费用控制展开。', tip: '适合资料容易找的会计、财务管理专业。' },
      { title: '企业内部控制问题', desc: '从流程、授权、监督、风险点分析。', tip: '题目建议落到某类企业或某家公司。' },
      { title: '金融服务风险控制', desc: '写业务流程、客户风险和合规管理。', tip: '适合金融、财务和经济管理方向。' },
    ]
  }
  if (/人力/.test(majorName)) {
    return [
      { title: '员工培训体系优化', desc: '围绕培训需求、课程设计、效果评估展开。', tip: '适合有企业或岗位案例的人。' },
      { title: '绩效考核问题研究', desc: '分析指标设置、反馈机制和激励效果。', tip: '要落到某类岗位或某家公司。' },
      { title: '员工流失原因与对策', desc: '从薪酬、晋升、管理沟通和组织氛围分析。', tip: '最好有访谈或问卷材料。' },
    ]
  }
  if (/工商|市场|电子商务|物流|旅游|酒店|行政|公共|城市管理|土地资源|信息资源|文化产业|农林经济/.test(majorName)) {
    return [
      { title: '线上营销优化', desc: '围绕用户获取、内容投放、转化和复购分析。', tip: '适合电商、市场营销、工商管理。' },
      { title: '客户服务质量提升', desc: '分析服务流程、投诉反馈和用户满意度。', tip: '适合酒店、旅游、管理类专业。' },
      { title: '公共服务流程优化', desc: '把一个具体服务流程拆成节点，找低效原因和优化方案。', tip: '适合行政、城市管理、公共事业和资源管理方向。' },
    ]
  }
  if (/教育|学前|小学|汉语言|英语|思想政治|体育/.test(majorName)) {
    return [
      { title: '课堂活动或阅读教学', desc: '围绕一个年龄段、一个学科或一个活动类型写。', tip: '适合结合教学案例。' },
      { title: '家校共育问题', desc: '分析沟通、参与度、反馈机制。', tip: '题目要缩到某类家庭或某个学段。' },
      { title: '体育或思政教学活动设计', desc: '从教学目标、活动组织和效果反馈展开。', tip: '适合体育教育、思想政治教育和小学教育方向。' },
    ]
  }
  if (/计算机|软件|电子|信息/.test(majorName)) {
    return [
      { title: '信息管理系统应用', desc: '写某场景下的信息化问题和优化。', tip: '可以不写开发全流程，重点写需求和应用。' },
      { title: '数据安全与管理', desc: '围绕权限、备份、隐私和流程管理。', tip: '适合有工作场景的考生。' },
      { title: '平台使用体验优化', desc: '从用户流程、界面、效率和反馈分析。', tip: '题目要明确平台类型。' },
    ]
  }
  if (/法学|法律|公安|社会工作/.test(majorName)) {
    return [
      { title: '劳动合同纠纷问题', desc: '围绕典型案例、争议焦点和权益保护展开。', tip: '要引用法律条文和裁判文书。' },
      { title: '基层社区治理问题', desc: '分析服务对象、治理流程和协同机制。', tip: '适合社会工作、公安管理和公共治理方向。' },
      { title: '个人信息保护问题', desc: '围绕收集、使用、告知和责任承担分析。', tip: '注意用最新法规和案例。' },
    ]
  }
  if (/护理|药学|医学|健康|动物医学|食品|营养/.test(majorName)) {
    return [
      { title: '患者健康教育优化', desc: '围绕宣教内容、沟通方式和依从性展开。', tip: '适合护理、健康服务方向。' },
      { title: '食品安全管理问题', desc: '分析检测流程、卫生标准和风险防控。', tip: '适合食品质量、营养和烹饪相关方向。' },
      { title: '动物防疫管理优化', desc: '围绕防疫流程、饲养管理和风险控制展开。', tip: '适合动物医学方向。' },
    ]
  }
  if (/农学|园林/.test(majorName)) {
    return [
      { title: '作物栽培管理优化', desc: '围绕某作物、某地区和栽培技术展开。', tip: '适合农学、现代农业方向。' },
      { title: '园林植物养护问题', desc: '分析养护流程、病虫害和景观效果。', tip: '适合园林方向。' },
      { title: '乡村农业技术应用', desc: '围绕技术推广、农户接受度和应用效果分析。', tip: '资料最好落到某地区或某项目。' },
    ]
  }
  if (/工程|造价|土木|建筑|机械|汽车|交通|道路|桥梁|电气|电子信息|飞行器|消防|环境|城乡规划/.test(majorName)) {
    return [
      { title: '施工质量控制', desc: '围绕某工序、材料、人员和验收节点分析。', tip: '适合有项目案例的人。' },
      { title: '工程成本控制', desc: '分析预算、材料、变更和现场管理问题。', tip: '造价类专业更适合。' },
      { title: '安全或环境管理优化', desc: '围绕消防、交通、环境或生产安全风险展开。', tip: '适合消防、交通、环境、机械和电子信息方向。' },
    ]
  }
  if (/设计|艺术|视觉|环境设计|产品|动画|媒体|传播|播音|编导|广告|网络与新媒体/.test(majorName)) {
    return [
      { title: '品牌视觉优化', desc: '分析识别系统、用户认知和视觉表达。', tip: '适合视觉传达、设计类专业。' },
      { title: '界面体验改进', desc: '围绕用户流程、信息架构和视觉层级展开。', tip: '要有竞品或用户反馈。' },
      { title: '新媒体内容传播策略', desc: '分析内容定位、传播渠道和互动效果。', tip: '适合网络与新媒体、播音主持、编导和广告方向。' },
    ]
  }
  return [
    { title: '某类组织的问题与优化策略', desc: '先选一个具体对象，再分析问题、原因和建议。', tip: '最稳妥，资料也比较好找。' },
    { title: '某地区或某群体的现状分析', desc: '适合教育、管理、社会服务等方向。', tip: '最好能找到公开数据或问卷材料。' },
    { title: '某业务流程改进研究', desc: '围绕流程低效、管理缺口和优化路径展开。', tip: '适合有工作经验的人。' },
  ]
}

function buildTimeline(phase, deadline) {
  const compact = deadline === 'tight'
  const all = compact
    ? [
        { key: 'prepare', week: '第 1-2 天', title: '锁题与材料', desc: '确认题目、模板、提交入口和必须附件。' },
        { key: 'topic', week: '第 3-4 天', title: '提纲成型', desc: '先搭目录，确定每章写什么。' },
        { key: 'draft', week: '第 5-10 天', title: '完成初稿', desc: '先写完整版本，同步记录引用来源。' },
        { key: 'revise', week: '第 11-13 天', title: '集中修改', desc: '处理导师意见、格式和重复率。' },
        { key: 'defense', week: '提交前', title: '检查归档', desc: '核文件命名、附件、答辩自述和成绩归档。' },
      ]
    : [
        { key: 'prepare', week: '第 1 周', title: '申请与选题', desc: '看通知、选题库、确定指导要求。' },
        { key: 'topic', week: '第 2 周', title: '定题与提纲', desc: '缩小题目，搭一级和二级目录。' },
        { key: 'draft', week: '第 3-5 周', title: '初稿写作', desc: '先完成正文，再补摘要和参考文献。' },
        { key: 'revise', week: '第 6-7 周', title: '修改定稿', desc: '按导师意见处理逻辑、格式和重复率。' },
        { key: 'defense', week: '第 8 周', title: '答辩归档', desc: '准备自述、常见问题，等待成绩归档。' },
      ]
  const phaseIndexMap = { not_started: 0, notice: 0, prepare: 0, topic: 1, outline: 1, draft: 2, revise: 3, final: 3, defense: 4, passed: 4 }
  const currentIndex = phaseIndexMap[phase] ?? 0
  return all.map((item, index) => ({ ...item, active: index >= currentIndex }))
}

function buildMaterialGroups(phase) {
  const groups = [
    {
      key: 'apply',
      title: '申请前',
      items: ['主考院校论文通知', '助学点/学校通知记录', '课程通过情况', '论文格式模板'],
    },
    {
      key: 'write',
      title: '写作中',
      items: ['题目确认记录', '论文提纲', '参考文献', '案例、问卷或调研材料'],
    },
    {
      key: 'submit',
      title: '提交前',
      items: ['定稿文件', '查重要求', '导师修改意见', '文件命名和上传附件'],
    },
    {
      key: 'defense',
      title: '答辩/归档',
      items: ['2-3 分钟自述', '常见答辩问题', '论文成绩归档', '毕业/学位申请窗口'],
    },
  ]
  const activeMap = {
    not_started: 'apply',
    notice: 'apply',
    prepare: 'apply',
    topic: 'write',
    outline: 'write',
    draft: 'write',
    revise: 'submit',
    final: 'submit',
    defense: 'defense',
    passed: 'defense',
  }
  return groups.map((group) => ({ ...group, active: group.key === activeMap[phase] }))
}
</script>
