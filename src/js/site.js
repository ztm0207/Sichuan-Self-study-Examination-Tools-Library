export const navItems = [
  { label: '首页', path: '/' },
  { label: '路线测评', path: '/route-test' },
  { label: '查学校', path: '/schools' },
  { label: '查专业', path: '/majors' },
  { label: '查费用', path: '/prices' },
  { label: '大小自考', path: '/exam-types' },
  { label: '拿证时间', path: '/certificate-time' },
  { label: '复习计划', path: '/study-plan' },
  { label: '论文工具', path: '/thesis' },
]

export const homeHero = {
  badge: '四川自考路线测评',
  title: '四川自考第一次报名，别先问学校',
  titleLines: ['四川自考第一次报名', '别先问学校'],
  subtitle: '先测你适合社会型还是应用型，3 分钟生成报名路线建议，再去看学校、专业、费用和拿证时间。',
  note: '不承诺包过，也不催你报名。先帮你把大自考、小自考、专业、费用和拿证节奏想清楚。',
  primaryAction: { label: '开始免费测评', path: '/route-test' },
}

export const homeDirectorySections = [
  {
    title: '路线测评',
    path: '/route-test',
    intro: '先回答几个问题，初步判断你适合应用型、社会型、快速拿证、低预算还是稳妥路线。',
    items: [
      { label: '11 个问题初筛', path: '/route-test' },
      { label: '3 条路线对比', path: '/route-test' },
      { label: '测完再核费用', path: '/route-test' },
    ],
  },
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
  title: '测完还有拿不准的，再发来一起核',
  desc: '适合已经有大概方向，但还怕学校、专业、费用、论文或拿证时间看错的人。',
  wechat: 'mystjy66',
  qrCode: `${import.meta.env.BASE_URL}wechat-qr.png`,
  tips: [
    '你的当前学历、想报专科还是专升本',
    '你测出来的路线、目标学校或目标专业',
    '你最担心的是费用、考试科目、论文、毕业还是学位',
  ],
}
