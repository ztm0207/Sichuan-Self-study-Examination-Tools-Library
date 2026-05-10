export const navItems = [
  { label: '首页', path: '/' },
  { label: '查学校', path: '/schools' },
  { label: '查专业', path: '/majors' },
  { label: '查费用', path: '/prices' },
  { label: '大小自考', path: '/exam-types' },
  { label: '拿证时间', path: '/certificate-time' },
  { label: '复习计划', path: '/study-plan' },
  { label: '论文工具', path: '/thesis' },
]

export const homeHero = {
  badge: '四川自考路径工具',
  title: '四川自考怎么选，一页先看清',
  titleLines: ['四川自考怎么选', '一页先看清'],
  subtitle: '先查学校、专业和费用，再看大小自考、拿证时间、复习计划和论文。',
  note: '本站用于信息整理和辅助决策，学校、专业、费用及毕业要求请以官方最新通知为准。',
  primaryAction: { label: '先查学校', path: '/schools' },
  secondaryAction: { label: '核对费用', path: '/prices' },
}

export const homeDirectorySections = [
  {
    title: '查学校',
    path: '/schools',
    intro: '先确定每所学校有哪些应用型自考专业，再看助学价格、论文费用、官网和核实状态。',
    items: [
      { label: '学校列表', path: '/schools' },
      { label: '学校官网', path: '/schools' },
      { label: '院校专业', path: '/schools' },
      { label: '专业价格', path: '/schools' },
      { label: '论文费用', path: '/schools' },
      { label: '是否已核实', path: '/schools' },
    ],
  },
  {
    title: '查专业',
    path: '/majors',
    intro: '按专业名称、层次和学校筛选，快速看同一专业有哪些学校开设。',
    items: [
      { label: '专业名称', path: '/majors' },
      { label: '专科/专升本', path: '/majors' },
      { label: '哪些学校有', path: '/majors' },
      { label: '开设学校', path: '/majors' },
      { label: '统考省考', path: '/majors' },
      { label: '费用对比', path: '/prices' },
    ],
  },
  {
    title: '查费用',
    path: '/prices',
    intro: '单独核对助学价格、论文费用和待确认项目，报名之前先把预算算清楚。',
    items: [
      { label: '助学价格', path: '/prices' },
      { label: '论文费用', path: '/prices' },
      { label: '费用待核对', path: '/prices' },
    ],
  },
  {
    title: '大小自考',
    path: '/exam-types',
    intro: '先弄清大自考和小自考的差别，再判断自己适合哪条路。',
    items: [
      { label: '大小自考区别', path: '/exam-types' },
      { label: '选择判断', path: '/exam-types' },
      { label: '适合人群', path: '/exam-types' },
    ],
  },
  {
    title: '拿证时间',
    path: '/certificate-time',
    intro: '把每次考试、课程数量和学习节奏放进时间表里，估算拿证周期。',
    items: [
      { label: '拿证时间计算器', path: '/certificate-time' },
      { label: '考试科目规划', path: '/certificate-time' },
    ],
  },
  {
    title: '复习计划',
    path: '/study-plan',
    intro: '从当前基础和可用时间出发，生成复习节奏，并准备考前冲刺。',
    items: [
      { label: '复习计划生成器', path: '/study-plan' },
      { label: '资料整理计划', path: '/resources' },
      { label: '考前冲刺清单', path: '/study-plan' },
    ],
  },
  {
    title: '论文工具',
    path: '/thesis',
    intro: '论文不只看写作，还要提前处理流程、选题、格式和答辩。',
    items: [
      { label: '论文流程', path: '/thesis' },
      { label: '论文选题', path: '/thesis' },
      { label: '论文格式检查', path: '/thesis' },
      { label: '答辩问题', path: '/thesis' },
    ],
  },
]

export const contactInfo = {
  title: '把情况说清楚，再帮你一起筛',
  desc: '适合已经看过院校专业和费用，但还拿不准学校、专业、路径或拿证节奏的人。',
  wechat: 'mystjy66',
  qrCode: '/wechat-qr.png',
  tips: [
    '你在四川哪个城市，是否已经有目标学校或专业',
    '你的预算、学习时间，以及想走大自考还是小自考',
    '你的主要目标：拿证、学位、考公考编、升职或转行',
  ],
}
