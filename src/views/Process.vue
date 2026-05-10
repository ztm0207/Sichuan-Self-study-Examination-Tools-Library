<template>
  <section class="section process-page">
    <div class="container">
      <PageHero
        eyebrow="流程规划"
        title="四川自考从报名到拿证，一页看清"
        desc="把新手最容易混乱的节点压缩成路线图：先定目标和路径，再选学校专业，最后按考试、论文、毕业顺序推进。"
        :actions="[
          { label: '先查学校专业', path: '/schools', type: 'primary' },
          { label: '估算拿证时间', path: '/certificate-time' },
        ]"
        :points="['选路径', '查费用', '排考试', '办毕业']"
      />

      <nav class="process-anchor-nav compact" aria-label="自考流程页内导航">
        <a v-for="item in navItems" :key="item.id" :href="`#${item.id}`">{{ item.label }}</a>
      </nav>

      <section id="roadmap" class="process-section">
        <div class="process-compact-head">
          <el-tag effect="light" round>总路线</el-tag>
          <h2>按这个顺序走，基本不会乱</h2>
          <p>流程不复杂，复杂的是信息分散。下面 7 步覆盖从决策到毕业的主要节点。</p>
        </div>

        <div class="process-roadmap-grid">
          <article v-for="(step, index) in roadmapSteps" :key="step.title" class="process-mini-card">
            <span>{{ String(index + 1).padStart(2, '0') }}</span>
            <h3>{{ step.title }}</h3>
            <p>{{ step.desc }}</p>
          </article>
        </div>
      </section>

      <section id="decision" class="process-section">
        <div class="process-split-panel">
          <div>
            <el-tag effect="light" round>报名前</el-tag>
            <h2>先确认 3 个问题</h2>
            <p>不要先问“哪个最快”，先确认用途、预算和可投入时间。</p>
          </div>
          <div class="process-check-grid">
            <div v-for="item in decisionChecks" :key="item.title">
              <strong>{{ item.title }}</strong>
              <span>{{ item.desc }}</span>
            </div>
          </div>
        </div>
      </section>

      <section id="choose" class="process-section">
        <div class="process-compact-head">
          <el-tag effect="light" round>选学校专业</el-tag>
          <h2>先看专业，再核学校和费用</h2>
          <p>同一个专业在不同学校，费用、课程数量和论文费用可能不同。</p>
        </div>

        <div class="process-action-grid">
          <RouterLink v-for="item in chooseActions" :key="item.title" :to="item.path" class="card-link">
            <el-card class="process-action-card" shadow="hover">
              <h3>{{ item.title }}</h3>
              <p>{{ item.desc }}</p>
              <span>{{ item.cta }}</span>
            </el-card>
          </RouterLink>
        </div>
      </section>

      <section id="register" class="process-section">
        <div class="process-compact-head">
          <el-tag effect="light" round>报名报考</el-tag>
          <h2>注册和报考是两件事</h2>
          <p>注册解决考籍，报考解决这次考哪几门；每次考试前都要看当期通知。</p>
        </div>

        <div class="process-route-grid">
          <el-card v-for="item in routeCards" :key="item.title" class="process-route-card" shadow="hover">
            <h3>{{ item.title }}</h3>
            <ul>
              <li v-for="point in item.points" :key="point">{{ point }}</li>
            </ul>
            <RouterLink :to="item.path"><el-button :type="item.primary ? 'primary' : ''" round>{{ item.button }}</el-button></RouterLink>
          </el-card>
        </div>
      </section>

      <section id="study" class="process-section">
        <div class="process-split-panel">
          <div>
            <el-tag effect="light" round>备考</el-tag>
            <h2>报几科，看时间和基础</h2>
            <p>新手不要一开始追求满报，先稳定通过，再加速度。</p>
          </div>
          <div class="process-check-grid">
            <div v-for="item in studyRules" :key="item.title">
              <strong>{{ item.title }}</strong>
              <span>{{ item.desc }}</span>
            </div>
          </div>
        </div>
      </section>

      <section id="finish" class="process-section">
        <div class="process-compact-head">
          <el-tag effect="light" round>论文毕业</el-tag>
          <h2>课程考完后，还有 3 个收尾</h2>
          <p>本科尤其要提前看论文、毕业申请和学位要求。</p>
        </div>

        <div class="process-roadmap-grid three">
          <article v-for="item in finishSteps" :key="item.title" class="process-mini-card">
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </article>
        </div>
      </section>

      <section id="avoid" class="process-section">
        <div class="process-compact-head">
          <el-tag effect="light" round>避坑</el-tag>
          <h2>最后确认这些风险</h2>
        </div>

        <el-collapse class="process-faq">
          <el-collapse-item v-for="item in faqItems" :key="item.question" :title="item.question" :name="item.question">
            <p>{{ item.answer }}</p>
          </el-collapse-item>
        </el-collapse>
      </section>

      <el-card class="cta-strip" shadow="never">
        <div>
          <h2>下一步建议：先把学校、专业、费用核清楚</h2>
          <p>确定路径后，再去排考试节奏和论文毕业时间。</p>
        </div>
        <RouterLink to="/schools"><el-button type="primary" size="large" round>查看学校专业</el-button></RouterLink>
      </el-card>

      <ContactCard
        title="流程卡在哪一步，可以把当前状态发来"
        desc="适合已经知道大概方向，但不确定报名、备考、论文、毕业顺序怎么安排的人。"
        :tips="[
          '你目前处在选专业、报名、备考、论文还是毕业阶段',
          '目标拿证时间，以及每周大概学习时间',
          '是否已经确定学校、专业、费用和考试路径',
        ]"
      />
    </div>
  </section>
</template>

<script setup>
import PageHero from '../components/PageHero.vue'
import ContactCard from '../components/ContactCard.vue'

const navItems = [
  { id: 'roadmap', label: '总路线' },
  { id: 'decision', label: '报名前' },
  { id: 'choose', label: '选学校专业' },
  { id: 'register', label: '报名报考' },
  { id: 'study', label: '备考' },
  { id: 'finish', label: '论文毕业' },
  { id: 'avoid', label: '避坑' },
]

const roadmapSteps = [
  { title: '定目标', desc: '明确是升职、考证、考公、考研，还是补学历。' },
  { title: '选路径', desc: '先比较大自考和小自考，再看自己时间和预算。' },
  { title: '查专业', desc: '看课程难度、是否考数学英语、是否符合用途。' },
  { title: '核学校费用', desc: '确认助学价格、论文费用、待核对项目。' },
  { title: '注册报考', desc: '按当期通知完成注册、报科、缴费、打印准考证。' },
  { title: '复习考试', desc: '统考优先排难课，省考配合学校安排推进。' },
  { title: '论文毕业', desc: '课程通过后，再处理论文、毕业和学位申请。' },
]

const decisionChecks = [
  { title: '用途', desc: '是否需要学位、是否限制专业、是否用于考编考公。' },
  { title: '预算', desc: '助学费、论文费、教材资料和考试费分开核。' },
  { title: '时间', desc: '每周能稳定学习多久，决定一次报几科。' },
]

const chooseActions = [
  { title: '查学校', desc: '看每所学校开设哪些专业、费用和课程结构。', cta: '进入学校库', path: '/schools' },
  { title: '查专业', desc: '从专业反查开设学校，比较同专业不同学校差异。', cta: '进入专业库', path: '/majors' },
  { title: '查费用', desc: '单独核助学价格、论文费用和待确认项。', cta: '进入费用表', path: '/prices' },
]

const routeCards = [
  {
    title: '社会型（大自考）',
    points: ['自己关注考试院通知', '自己选课、报考、复习', '费用低，但管理成本高'],
    button: '看大小自考区别',
    path: '/exam-types',
  },
  {
    title: '应用型（小自考）',
    points: ['先核学校和助学点', '确认统考、省考和费用', '适合想要规划和提醒的人'],
    button: '查学校专业',
    path: '/schools',
    primary: true,
  },
]

const studyRules = [
  { title: '新手', desc: '建议先报 2-3 科，确认学习节奏后再加。' },
  { title: '时间少', desc: '优先公共课或熟悉科目，避免一次堆难课。' },
  { title: '想快', desc: '统考、省考、论文节点一起倒排，不只看考试科数。' },
]

const finishSteps = [
  { title: '论文 / 实践', desc: '本科通常有论文或毕业考核，按主考院校通知申请。' },
  { title: '毕业申请', desc: '课程通过不等于自动毕业，还要按批次提交材料。' },
  { title: '学位申请', desc: '看平均分、论文、外语、期限等院校要求。' },
]

const faqItems = [
  { question: '先选学校还是先选专业？', answer: '建议先选专业方向，再比较学校费用、课程和服务。只看学校名容易忽略专业难度。' },
  { question: '小自考是不是一定更快？', answer: '不一定。它通常更好规划，但仍取决于统考通过率、报考节奏、论文和毕业批次。' },
  { question: '费用只看助学费够吗？', answer: '不够。还要看论文费、教材资料、平台服务、实践考核和是否有待核对项。' },
  { question: '课程考完就能拿证吗？', answer: '不能自动拿证。还需要毕业申请，本科还可能涉及论文和学位申请。' },
]
</script>
