export const officialUpdateLinks = {
  octoberSchedule: 'https://www.sceea.cn/Html/202606/Newsdetail_4848_1.html',
  practiceThesis2026H2: 'https://www.sceea.cn/Html/202606/Newsdetail_4825.html',
  graduation2026H1: 'https://www.sceea.cn/Html/202605/Newsdetail_4813.html',
  stoppedMajors2025: 'https://www.sceea.cn/Html/202511/Newsdetail_4489.html',
  socialMainSchool2026: 'https://www.sceea.cn/Html/202601/Newsdetail_4631.html',
}

export const officialUpdateCards = [
  {
    title: '2026年10月统考课表已发布',
    desc: '四川省教育考试院已发布2026年10月（262次）考试课表、课程简表。复习计划和报考安排要按10月课表重新核对，不要只看4月安排。',
    link: officialUpdateLinks.octoberSchedule,
    linkText: '查看10月课表',
  },
  {
    title: '2026年下半年实践/论文报考已截止',
    desc: '本次实践性环节考核和毕业论文（设计）答辩报考时间为2026年6月22日9:00至6月27日17:00。已报考的看主考学校通知，没报上的关注下一批。',
    link: officialUpdateLinks.practiceThesis2026H2,
    linkText: '查看论文实践通告',
  },
  {
    title: '2026年上半年毕业申请已截止',
    desc: '2026年上半年毕业申请和前置学历验证提交时间为2026年6月10日9:00至6月18日17:00。后续要关注下半年毕业申请通知。',
    link: officialUpdateLinks.graduation2026H1,
    linkText: '查看毕业申请通告',
  },
  {
    title: '停考专业不要盲目推荐',
    desc: '四川省教育考试院已发布停考15个专业相关通告，2025年10月1日起停考专业不再接受新生注册报名。选专业时要单独核对停考风险。',
    link: officialUpdateLinks.stoppedMajors2025,
    linkText: '查看停考通告',
  },
  {
    title: '社会型部分主考学校已调整',
    desc: '2026年上半年社会型新生注册起，食品卫生与营养学、英语、工程管理3个专升本专业的主考学校有调整。走大自考或低成本自学路线时要单独核。',
    link: officialUpdateLinks.socialMainSchool2026,
    linkText: '查看调整通告',
  },
]

export const stoppedMajorItems = [
  { name: '数控技术', code: '560103', level: '专科' },
  { name: '计算机应用技术', code: '610201', level: '专科' },
  { name: '酒店管理与数字化运营', code: '640105', level: '专科' },
  { name: '药学', code: '620301', level: '专科' },
  { name: '视觉传达设计', code: '550102', level: '专科' },
  { name: '酒店管理', code: '120902', level: '专升本' },
  { name: '物流管理', code: '120601', level: '专升本' },
  { name: '动画', code: '130310', level: '专升本' },
  { name: '动物科学', code: '090301', level: '专升本' },
  { name: '汉语国际教育', code: '050103', level: '专升本' },
  { name: '会展经济与管理', code: '120903', level: '专升本' },
  { name: '教育学', code: '040101', level: '专升本' },
  { name: '秘书学', code: '050107T', level: '专升本' },
  { name: '新闻学', code: '050301', level: '专升本' },
  { name: '交通管理', code: '120407T', level: '专升本' },
]

export const routePolicyReminders = [
  '2026年10月（262次）统考课表已发布，后续复习计划和考试顺序要按10月课表重新核。',
  '2026年下半年实践/论文报考已于6月27日17:00截止，论文和实践节点要看下一批或主考学校通知。',
  '2026年上半年毕业申请已于6月18日17:00截止，快考完的同学要关注下半年毕业申请通知。',
  '停考专业从2025年10月1日起不再接受新生注册，测评结果里涉及冷门或调整专业时必须再核官方通告。',
]

export function getStoppedMajor(item = {}) {
  const level = normalizeMajorLevel(item.level)
  const code = String(item.code || '').trim().toUpperCase()
  const name = String(item.name || '').trim()

  return stoppedMajorItems.find((major) => {
    const sameLevel = major.level === level
    const sameCode = code && major.code.toUpperCase() === code
    const sameName = major.name === name
    return sameLevel && (sameCode || sameName)
  })
}

export function isStoppedMajor(item = {}) {
  return Boolean(getStoppedMajor(item))
}

export function getStoppedMajorText(item = {}) {
  const major = getStoppedMajor(item)
  if (!major) return ''

  return `${major.name}（${major.level}）已列入四川省2025年停考专业，2025年10月1日起不再接受新生注册。`
}

function normalizeMajorLevel(level = '') {
  if (String(level).includes('专科')) return '专科'
  if (String(level).includes('本')) return '专升本'
  return String(level)
}
