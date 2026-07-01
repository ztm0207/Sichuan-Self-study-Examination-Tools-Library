<template>
  <section class="section">
    <div class="container">
      <PageHero
        eyebrow="毕业 / 学位证"
        title="毕业申请与学位证指南"
        desc="课程考完只是接近终点，毕业申请和学位申请还要单独确认条件、材料和时间窗口。"
        :actions="[
          { label: '查看论文工具', path: '/thesis', type: 'primary' },
        ]"
        :points="['毕业条件', '论文实践', '学位标准']"
      />

      <el-card class="graduation-hero-card" shadow="never">
        <div>
          <el-tag class="badge" effect="light" round>先看重点</el-tag>
          <h2>毕业证看“是否符合毕业条件”，学位证看“是否达到院校学位标准”</h2>
          <p>
            自考毕业不是自动办理，学位证也不是毕业证附带。想稳妥收尾，建议在最后 2-3 门课程时就开始核对：
            成绩、实践课、论文、前置学历、照片信息、平均分、外语和主考院校申请时间。
          </p>
        </div>
        <RouterLink to="/process"><el-button type="primary" round>回到完整流程</el-button></RouterLink>
      </el-card>

      <el-card class="inline-tip-card official-update-card" shadow="never">
        <div>
          <h3>2026年上半年毕业申请已经截止</h3>
          <p>四川省2026年上半年毕业申请和前置学历验证提交时间为6月10日9:00至6月18日17:00。现在要做的是整理成绩、论文/实践、前置学历和材料，等下半年毕业申请通知。</p>
        </div>
        <a :href="officialUpdateLinks.graduation2026H1" target="_blank" rel="noopener">
          <el-button type="primary" round>查看申请通告</el-button>
        </a>
      </el-card>

      <el-card class="graduation-major-panel" shadow="never">
        <div class="graduation-major-form">
          <div>
            <span>按学校专业自查</span>
            <h2>先选你的学校专业，再看毕业和学位重点</h2>
            <p>不同学校、层次和专业的论文 / 毕业考核、实践课、学位关注点会不一样。这里先按你的学校专业做重点提醒。</p>
          </div>
          <el-select
            v-model="selectedOfferingId"
            filterable
            clearable
            placeholder="选择学校 + 层次 + 专业"
          >
            <el-option
              v-for="item in offeringOptions"
              :key="item.id"
              :label="`${item.schoolName} · ${item.level} · ${item.name}`"
              :value="item.id"
            />
          </el-select>
        </div>

        <div class="graduation-major-empty" v-if="!selectedOffering">
          <strong>还没选择专业</strong>
          <p>选择后会显示：毕业申请重点、论文 / 实践提醒、学位证关注项和材料优先级。</p>
        </div>

        <template v-else>
          <div class="graduation-major-summary">
            <div>
              <span>学校</span>
              <strong>{{ selectedOffering.schoolName }}</strong>
            </div>
            <div>
              <span>专业</span>
              <strong>{{ selectedOffering.name }}</strong>
            </div>
            <div>
              <span>层次</span>
              <strong>{{ selectedOffering.level }}</strong>
            </div>
            <div>
              <span>论文 / 考核</span>
              <strong>{{ graduationProfile.thesisText }}</strong>
            </div>
            <div>
              <span>学校入口</span>
              <strong>{{ graduationProfile.schoolPortalText }}</strong>
            </div>
            <div>
              <span>费用状态</span>
              <strong>{{ graduationProfile.feeStatusText }}</strong>
            </div>
          </div>

          <div class="graduation-major-grid">
            <article>
              <span>毕业申请重点</span>
              <strong>{{ graduationProfile.graduationFocus }}</strong>
              <p>{{ graduationProfile.graduationTip }}</p>
            </article>
            <article>
              <span>论文实践提醒</span>
              <strong>{{ graduationProfile.practiceFocus }}</strong>
              <p>{{ graduationProfile.practiceTip }}</p>
            </article>
            <article>
              <span>学位证判断</span>
              <strong>{{ graduationProfile.degreeFocus }}</strong>
              <p>{{ graduationProfile.degreeTip }}</p>
            </article>
            <article>
              <span>专业差异</span>
              <strong>{{ graduationProfile.majorFocus }}</strong>
              <p>{{ graduationProfile.majorTip }}</p>
            </article>
          </div>

          <div class="graduation-focus-panel">
            <article class="graduation-focus-card">
              <div class="graduation-focus-head">
                <span>本校本专业优先核对</span>
                <RouterLink v-if="graduationProfile.schoolWebsite" :to="`/schools/${selectedOffering.schoolId}`">
                  <el-button type="primary" plain round>看学校详情</el-button>
                </RouterLink>
              </div>
              <ul class="graduation-mini-list">
                <li v-for="item in graduationProfile.priorityItems" :key="item">{{ item }}</li>
              </ul>
              <div class="graduation-tag-row">
                <el-tag v-for="tag in graduationProfile.riskTags" :key="tag" effect="plain" round>{{ tag }}</el-tag>
              </div>
            </article>

            <article class="graduation-focus-card">
              <div class="graduation-focus-head">
                <span>材料与时间节点</span>
                <RouterLink to="/certificate-time">
                  <el-button plain round>估算时间</el-button>
                </RouterLink>
              </div>
              <div class="graduation-check-columns">
                <div>
                  <strong>材料重点</strong>
                  <ul class="graduation-mini-list">
                    <li v-for="item in graduationProfile.materialItems" :key="item">{{ item }}</li>
                  </ul>
                </div>
                <div>
                  <strong>时间重点</strong>
                  <ul class="graduation-mini-list">
                    <li v-for="item in graduationProfile.timingItems" :key="item">{{ item }}</li>
                  </ul>
                </div>
              </div>
            </article>
          </div>
        </template>
      </el-card>

      <div class="graduation-key-grid">
        <el-card v-for="card in graduationKeyCards" :key="card.title" class="content-card" shadow="hover">
          <h3>{{ card.title }}</h3>
          <p>{{ card.desc }}</p>
          <div class="tag-list">
            <el-tag v-for="tag in card.tags" :key="tag" effect="plain" round>{{ tag }}</el-tag>
          </div>
        </el-card>
      </div>

      <SectionTitle
        class="mt-large"
        eyebrow="毕业申请"
        title="毕业申请按这 4 步检查"
        desc="具体时间和材料以四川教育考试院及主考院校当期通知为准，这里先帮你把检查顺序理清楚。"
      />

      <div class="process-step-grid graduation-flow-grid">
        <el-card v-for="step in graduationFlowSteps" :key="step.title" class="process-card" shadow="hover">
          <h2>{{ step.title }}</h2>
          <p>{{ step.desc }}</p>
        </el-card>
      </div>

      <el-card class="detail-block" shadow="never">
        <h2>毕业证和学位证，先分清楚</h2>
        <p class="block-desc">这两件事经常被放在一起问，但审核逻辑并不一样。</p>
        <el-table :data="graduationCompareRows" border stripe>
          <el-table-column prop="item" label="维度" min-width="120" />
          <el-table-column prop="diploma" label="毕业证" min-width="260" />
          <el-table-column prop="degree" label="学位证" min-width="260" />
        </el-table>
      </el-card>

      <SectionTitle
        class="mt-large"
        eyebrow="材料自查"
        title="提交前，把这几项逐个核对"
      />

      <div class="checklist-grid">
        <el-card v-for="group in graduationChecklist" :key="group.title" class="checklist-card" shadow="hover">
          <h3>{{ group.title }}</h3>
          <ul>
            <li v-for="item in group.items" :key="item">{{ item }}</li>
          </ul>
        </el-card>
      </div>

      <SectionTitle
        class="mt-large"
        eyebrow="时间节点"
        title="什么时候开始准备最稳妥"
      />

      <div class="graduation-timeline-grid">
        <el-card v-for="item in graduationTimelineCards" :key="item.title" class="content-card" shadow="hover">
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </el-card>
      </div>

      <SectionTitle
        class="mt-large"
        eyebrow="学位证"
        title="本科用户，提前盯住这 4 个条件"
        desc="不同主考院校的学位要求可能不同，不要等毕业证到手后才第一次查看。"
      />

      <div class="degree-condition-grid">
        <el-card v-for="item in degreeConditionCards" :key="item.title" class="content-card" shadow="hover">
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </el-card>
      </div>

      <el-card class="inline-tip-card degree-tip" shadow="never">
        <div>
          <h3>一句话提醒</h3>
          <p>
            只要你本科阶段未来可能用到学位证，就从现在开始按“平均分、论文、外语、期限”四项倒推安排。
            学位证最怕的不是难，而是发现太晚。
          </p>
        </div>
        <RouterLink to="/thesis"><el-button type="primary" round>查看论文指南</el-button></RouterLink>
      </el-card>

      <el-card class="detail-block" shadow="never">
        <h2>高频问题</h2>
        <el-collapse>
          <el-collapse-item
            v-for="item in graduationFaqItems"
            :key="item.question"
            :title="item.question"
            :name="item.question"
          >
            <p class="faq-answer">{{ item.answer }}</p>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <ContactCard
        title="毕业和学位节点不清楚，可以按学校专业核对"
        desc="适合已经在考或快考完，想确认论文、毕业申请、学位条件和时间窗口的人。"
        :tips="[
          '你当前学校、专业、层次和已通过课程',
          '是否还剩论文、实践课、英语或学位相关要求',
          '你想申请毕业或学位的大概时间',
        ]"
      />
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import {
  degreeConditionCards,
  graduationChecklist,
  graduationCompareRows,
  graduationFaqItems,
  graduationFlowSteps,
  graduationKeyCards,
  graduationTimelineCards,
} from '../js/flows'
import { schoolMajorOfferings, schools } from '../js/schools'
import SectionTitle from '../components/SectionTitle.vue'
import PageHero from '../components/PageHero.vue'
import ContactCard from '../components/ContactCard.vue'
import { officialUpdateLinks } from '../js/officialUpdates'

const selectedOfferingId = ref('')
const offeringOptions = computed(() => (
  schoolMajorOfferings
    .slice()
    .sort((a, b) => `${a.schoolName}${a.level}${a.name}`.localeCompare(`${b.schoolName}${b.level}${b.name}`, 'zh-Hans-CN'))
))
const selectedOffering = computed(() => schoolMajorOfferings.find((item) => item.id === selectedOfferingId.value))
const selectedSchool = computed(() => schools.find((item) => item.id === selectedOffering.value?.schoolId))
const graduationProfile = computed(() => buildGraduationProfile(selectedOffering.value))

function buildGraduationProfile(offering) {
  if (!offering) return {}
  const isUndergraduate = offering.level?.includes('专升本')
  const courses = [...(offering.unifiedCourses || []), ...(offering.schoolExamCourses || [])]
  const practiceCourses = courses.filter((course) => /实践|实习|实验|毕业考核|毕业论文|论文|毕业设计|综合训练|课程设计/.test(course.name || ''))
  const writtenCourses = courses.filter((course) => !practiceCourses.includes(course))
  const thesisText = isUndergraduate
    ? (offering.thesisPriceText || '按学校通知确认')
    : '专科通常不涉及'
  const majorProfile = getMajorGraduationProfile(offering.name)
  const schoolProfile = getSchoolGraduationProfile(selectedSchool.value, offering)
  const feeStatusText = getFeeStatusText(offering)
  const schoolPortalText = schoolProfile.portalText
  const base = {
    schoolPortalText,
    schoolWebsite: selectedSchool.value?.website || '',
    feeStatusText,
    priorityItems: buildPriorityItems(offering, {
      isUndergraduate,
      practiceCourses,
      writtenCourses,
      majorProfile,
      schoolProfile,
    }),
    materialItems: buildMaterialItems(offering, {
      isUndergraduate,
      practiceCourses,
      majorProfile,
      schoolProfile,
    }),
    timingItems: buildTimingItems(offering, {
      isUndergraduate,
      practiceCourses,
      schoolProfile,
    }),
    riskTags: buildRiskTags(offering, {
      isUndergraduate,
      practiceCourses,
      writtenCourses,
      majorProfile,
      schoolProfile,
    }),
  }

  if (!isUndergraduate) {
    return {
      ...base,
      thesisText,
      graduationFocus: '先核对课程和实践环节',
      graduationTip: '专科重点通常是课程成绩、实践或实习环节、个人信息和毕业申请窗口，不按本科论文和学位流程准备。',
      practiceFocus: practiceCourses.length ? `有 ${practiceCourses.length} 个实践 / 考核类环节` : '按专业计划核对是否有实践',
      practiceTip: practiceCourses.length ? practiceCourses.slice(0, 2).map((item) => item.name).join('、') : '如果专业计划没有实践或毕业考核，主要关注课程成绩和申请材料。',
      degreeFocus: '专科通常不涉及学位证',
      degreeTip: '如果后续计划升本，需要提前关注专升本专业的学位条件，而不是在专科阶段准备学位申请。',
      majorFocus: majorProfile.focus,
      majorTip: majorProfile.tip,
    }
  }

  return {
    ...base,
    thesisText,
    graduationFocus: '课程、论文、前置学历一起核对',
    graduationTip: '本科毕业前要确认课程成绩、论文或毕业考核成绩、前置学历核验、照片和考籍信息都没有问题。',
    practiceFocus: practiceCourses.length ? `重点盯 ${practiceCourses.length} 个论文 / 实践类环节` : '论文或毕业考核按学校通知确认',
    practiceTip: practiceCourses.length ? practiceCourses.slice(0, 2).map((item) => item.name).join('、') : '如果课程列表中未单列论文课程，也要关注主考院校论文申请和成绩归档通知。',
    degreeFocus: '提前看平均分、论文、外语和期限',
    degreeTip: '只要未来可能用学位证，就不要只按 60 分通过规划。不同主考院校要求不同，以当期学位通知为准。',
    majorFocus: majorProfile.focus,
    majorTip: majorProfile.tip,
  }
}

function getFeeStatusText(offering) {
  const pricePending = !offering.priceText || offering.priceText === '待核对'
  const thesisPending = offering.level?.includes('专升本') && (!offering.thesisPriceText || offering.thesisPriceText === '待核对')

  if (pricePending && thesisPending) return '学费和论文费待核对'
  if (pricePending) return '学费待核对'
  if (thesisPending) return '论文费待核对'
  return '费用已有整理'
}

function getSchoolGraduationProfile(school, offering) {
  const schoolName = school?.name || offering.schoolName || ''
  const text = `${schoolName} ${offering.name}`
  const portalText = school?.website ? '已整理官网入口' : '官网入口待核对'
  const base = {
    portalText,
    schoolFocus: '先看学校继续教育学院、自考办或主考院校当期通知。',
    noticeHint: '毕业、论文、实践、学位要求以学校当期通知为准。',
    materialHint: '保存官网通知截图、报名记录、缴费记录和提交回执。',
  }

  if (/师范|教育/.test(text)) {
    return {
      ...base,
      schoolFocus: '师范教育类学校要重点看论文、教学案例和学位外语要求。',
      noticeHint: '教育类论文常看教学对象、课堂材料和格式表达，建议提前核对模板。',
    }
  }
  if (/财经|金融|会计|财务|经济/.test(text)) {
    return {
      ...base,
      schoolFocus: '财经类学校和专业要重点看平均分、论文案例和学位申请批次。',
      noticeHint: '准备学位时，不建议课程只按 60 分通过规划。',
    }
  }
  if (/医|护理|药|食品|营养|动物/.test(text)) {
    return {
      ...base,
      schoolFocus: '医药食品类专业要重点看实践、实习、规范材料和论文边界。',
      noticeHint: '涉及健康、检测、防疫或护理材料时，注意按学校要求脱敏和归档。',
    }
  }
  if (/理工|工程|交通|电子|信息|机械|汽车|土木|消防|环境|飞行器/.test(text)) {
    return {
      ...base,
      schoolFocus: '理工工程类学校和专业要重点看实践、课程设计、项目材料和毕业设计提交要求。',
      noticeHint: '项目截图、图纸、流程、实验或现场材料不要等毕业申请前才补。',
    }
  }
  if (/艺术|传媒|外国语|播音|编导|设计|动画|广告|新媒体/.test(text)) {
    return {
      ...base,
      schoolFocus: '艺术传媒语言类专业要重点看作品、论文格式、答辩表达和学位外语要求。',
      noticeHint: '作品说明、过程稿、图片、音视频脚本和传播案例要提前整理。',
    }
  }
  if (/警察|公安|法学|法律|社会工作/.test(text)) {
    return {
      ...base,
      schoolFocus: '法学公安社工类专业要重点看案例依据、规范引用和毕业材料一致性。',
      noticeHint: '论文材料建议落到具体案例、治理场景或服务对象。',
    }
  }

  return base
}

function buildPriorityItems(offering, context) {
  const items = [
    context.schoolProfile.schoolFocus,
    `课程计划内笔试课约 ${context.writtenCourses.length} 门，实践/论文类约 ${context.practiceCourses.length} 门。`,
  ]

  if (context.isUndergraduate) {
    items.push('本科同时核对课程成绩、论文成绩、前置学历、照片和考籍信息。')
    items.push('如果未来可能用学位证，提前按平均分、论文、外语和申请期限倒推。')
  } else {
    items.push('专科不走学位流程，重点核对课程成绩、实践环节、个人信息和毕业申请窗口。')
  }

  if (offering.sourceNote) {
    items.push(offering.sourceNote)
  }

  if (getFeeStatusText(offering).includes('待核对')) {
    items.push('费用或论文费仍有待核对项，报名前和毕业前都建议再看学校当期通知。')
  }

  return items.slice(0, 5)
}

function buildMaterialItems(offering, context) {
  const items = [
    '身份证、准考证、照片、联系电话和考籍信息保持一致。',
    '保存课程成绩、免考/转考/替换课程记录和毕业申请提交回执。',
  ]

  if (context.practiceCourses.length) {
    items.push(`重点留存：${context.practiceCourses.slice(0, 2).map((item) => item.name).join('、')} 相关材料。`)
  }

  if (context.isUndergraduate) {
    items.push('本科提前准备前置学历核验、论文定稿、答辩记录和成绩归档证明。')
  }

  items.push(context.schoolProfile.materialHint)
  items.push(context.majorProfile.material || context.majorProfile.tip)

  return [...new Set(items)].slice(0, 5)
}

function buildTimingItems(offering, context) {
  const items = [
    '最后 2-3 门课程时开始看毕业条件和学位条件。',
    '课程、实践、论文全部合格后，再赶毕业申请窗口。',
  ]

  if (context.isUndergraduate) {
    items.push('论文申请、定稿、答辩、成绩归档任何一项拖延，都可能顺延毕业批次。')
  }

  if (context.practiceCourses.length) {
    items.push('实践/考核类课程通常按学校通知安排，不按统考省考笔试节奏处理。')
  }

  items.push(context.schoolProfile.noticeHint)

  return items.slice(0, 5)
}

function buildRiskTags(offering, context) {
  const tags = [
    context.isUndergraduate ? '本科看学位' : '专科看毕业',
    context.practiceCourses.length ? '有实践/论文环节' : '实践环节较少',
  ]

  if (context.writtenCourses.length >= 12) tags.push('笔试课程较多')
  if (getFeeStatusText(offering).includes('待核对')) tags.push('费用需再核')
  if (offering.sourceNote) tags.push('补充专业需复核')
  tags.push(context.majorProfile.tag)

  return [...new Set(tags.filter(Boolean))].slice(0, 6)
}

function getMajorGraduationProfile(majorName = '') {
  if (/会计|财务|审计|金融|经济/.test(majorName)) {
    return { focus: '财经类重点看平均分和论文案例', tip: '如果要学位，平时课程不要只求低分通过；论文尽量选择能落到企业流程、成本、内控、金融风险或财务数据的题目。', material: '财经类建议留存企业案例、流程表、公开年报、费用或风险控制材料。', tag: '财经案例' }
  }
  if (/人力|行政|公共事业|工商|市场|电子商务|物流|旅游|酒店|城市管理|土地资源|信息资源|文化产业|农林经济/.test(majorName)) {
    return { focus: '管理公共服务类重点看案例对象', tip: '论文和毕业材料最好落到具体组织、岗位、服务流程、社区治理或资源管理场景，避免题目过大导致答辩时说不清。', material: '管理类建议留存问卷、访谈、服务流程、平台数据、岗位制度或政策文件。', tag: '案例对象' }
  }
  if (/教育|学前|小学|汉语言|英语|思想政治|体育/.test(majorName)) {
    return { focus: '教育语言体育类重点看论文质量和表达规范', tip: '论文选题要贴合教学、文本、思政或体育训练场景，格式、引用和答辩表达会影响整体收尾体验。', material: '教育语言类建议留存课堂案例、文本资料、教学设计、学生作业或训练记录。', tag: '表达规范' }
  }
  if (/计算机|软件|信息|网络|电子信息/.test(majorName)) {
    return { focus: '计算机信息类重点看实践和毕业设计', tip: '如果有系统设计、实践或综合训练类课程，要提前确认提交物、截图、说明文档和成绩归档要求。', material: '信息类建议留存需求说明、流程图、原型图、系统截图、测试记录和说明文档。', tag: '实践提交' }
  }
  if (/工程|造价|土木|建筑|机械|汽车|交通|道路|桥梁|电气|飞行器|消防|环境|城乡规划/.test(majorName)) {
    return { focus: '工程交通环境类重点看实践材料', tip: '项目、工序、课程设计、实习、综合实践、安全或环境治理材料要提前留存，别等毕业申请时才补证明和附件。', material: '工程类建议留存项目资料、图纸截图、施工或检测记录、成本清单、规范标准和现场照片。', tag: '项目材料' }
  }
  if (/护理|药学|医学|健康|动物医学|食品|营养/.test(majorName)) {
    return { focus: '医药食品动物医学类重点看规范和实践环节', tip: '涉及实践、实习、健康教育、用药安全、食品检测或动物防疫的材料要按学校要求准备，论文题目避免超出专业和岗位边界。', material: '医药食品类建议留存规范依据、流程记录、检测标准、宣教材料、样本统计或脱敏案例。', tag: '规范安全' }
  }
  if (/农学|园林/.test(majorName)) {
    return { focus: '农学园林类重点看应用材料', tip: '作物、园林、病虫害、养护或乡村应用类材料要提前整理，论文最好落到具体地区、项目或技术场景。', material: '农学园林类建议留存种植养护记录、病虫害资料、图片、项目资料和地区政策。', tag: '应用场景' }
  }
  if (/法学|法律|公安|社会工作/.test(majorName)) {
    return { focus: '法学公安社工类重点看论文规范和案例依据', tip: '论文最好有清晰案例、规范依据、争议焦点或服务对象，申请学位时尤其要关注论文成绩和提交期限。', material: '法学社工类建议留存法规条文、案例材料、政策文件、访谈记录或服务对象资料。', tag: '案例依据' }
  }
  if (/设计|艺术|视觉|环境设计|产品|动画|媒体|传播|播音|编导|广告|网络与新媒体/.test(majorName)) {
    return { focus: '设计传媒类重点看作品或方案材料', tip: '如果涉及作品、方案、设计说明、传播案例、音视频脚本或新媒体内容，要保存过程稿、成品图、说明文档和答辩材料。', material: '设计传媒类建议留存过程稿、作品图、脚本、传播数据、竞品案例和答辩说明。', tag: '作品材料' }
  }
  return { focus: '先按专业计划逐项核对', tip: '不同专业的实践、论文和毕业考核名称可能不同，先看专业计划，再看主考院校当期通知。', material: '建议留存专业计划、课程成绩、实践记录、学校通知和申请提交回执。', tag: '逐项核对' }
}
</script>
