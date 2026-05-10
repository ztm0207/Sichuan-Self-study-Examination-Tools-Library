const certificatePolicies = [
  {
    schoolName: '四川大学',
    name: '软件工程',
    level: '专升本',
    certificate: '软件工程师（中级）证书',
  },
  {
    schoolName: '四川大学',
    name: '信息资源管理',
    level: '专升本',
    certificate: '信息资源管理师职业能力认证证书（中级）',
  },
  {
    schoolName: '西南交通大学',
    name: '工程造价',
    level: '专科',
    certificate: '1+X 项目对应职业技能证书',
  },
  {
    schoolName: '西南交通大学',
    name: '工程管理',
    level: '专升本',
    certificate: '1+X 项目对应职业技能证书',
  },
  {
    schoolName: '西南交通大学',
    name: '消防工程',
    level: '专升本',
    certificate: '消防工程能力认证高级证书',
  },
  {
    schoolName: '西南科技大学',
    name: '数字媒体艺术设计',
    level: '专科',
    certificate: '数字媒体设计师（初级）证书',
  },
  {
    schoolName: '西南科技大学',
    name: '数字媒体艺术',
    level: '专升本',
    certificate: '数字媒体设计师（中级）证书',
  },
  {
    schoolName: '四川农业大学',
    name: '工商企业管理',
    level: '专科',
    certificate: '工商管理专业能力（初级）证书',
  },
  {
    schoolName: '四川农业大学',
    name: '工商管理',
    level: '专升本',
    certificate: '工商管理专业能力（中级）证书',
  },
  {
    schoolName: '四川农业大学',
    name: '现代农业技术',
    level: '专科',
    certificate: '智慧农业职业能力证书（初级）',
  },
  {
    schoolName: '四川农业大学',
    name: '农学',
    level: '专升本',
    certificate: '智慧农业职业能力证书（中级）',
  },
  {
    schoolName: '四川农业大学',
    name: '城乡规划',
    level: '专升本',
    certificate: '城乡规划职业能力证书（中级）',
  },
  {
    schoolName: '攀枝花学院',
    name: '护理',
    level: '专科',
    certificate: '中医健康管理师（初级）技能证书',
  },
  {
    schoolName: '攀枝花学院',
    name: '护理学',
    level: '专升本',
    certificate: '中医健康管理师（中级）技能证书',
  },
  {
    schoolName: '成都信息工程大学',
    name: '人力资源管理',
    level: '专科',
    certificate: '人力资源数字化管理职业技能等级证书（初级）',
  },
  {
    schoolName: '成都信息工程大学',
    name: '人力资源管理',
    level: '专升本',
    certificate: '人力资源数字化管理职业技能等级证书（中级）',
  },
  {
    schoolName: '成都信息工程大学',
    name: '社会工作',
    level: '专科',
    certificate: '社区治理职业技能等级证书（初级）',
  },
  {
    schoolName: '成都信息工程大学',
    name: '社会工作',
    level: '专升本',
    certificate: '社区治理职业技能等级证书（中级）',
  },
  {
    schoolName: '成都工业学院',
    name: '视觉传达设计',
    level: '专升本',
    certificate: '数字视觉设计技术与应用能力证书（中级）',
  },
  {
    schoolName: '四川旅游学院',
    name: '食品质量与安全',
    level: '专科',
    certificate: '食品合规管理职业技能等级证书（初级）',
  },
  {
    schoolName: '四川旅游学院',
    name: '食品质量与安全',
    level: '专升本',
    certificate: '食品合规管理职业技能等级证书（中级）',
  },
  {
    schoolName: '四川旅游学院',
    name: '文化产业管理',
    level: '专升本',
    certificate: '数字媒体交互设计职业技能等级证书（中级）',
  },
  {
    schoolName: '四川师范大学',
    name: '公共事务管理',
    level: '专科',
    certificate: '公共事业管理师证书（初级）',
  },
  {
    schoolName: '四川师范大学',
    name: '公共事业管理',
    level: '专升本',
    certificate: '公共事业管理师证书（中级）',
  },
  {
    schoolName: '四川职业技术学院',
    name: '行政管理',
    level: '专科',
    certificate: '行政管理指导员证书（初级）',
  },
  {
    schoolName: '四川职业技术学院',
    name: '质量管理与认证',
    level: '专科',
    certificate: '质量管理与认证职业能力证书（初级）',
  },
  {
    schoolName: '中国传媒大学',
    name: '网络与新媒体',
    level: '专升本',
    certificate: '网络与新媒体专业 1+X 对应证书',
  },
  {
    schoolName: '成都师范学院',
    name: '学前教育',
    level: '专科',
    certificate: '学前教育指导师（初级）证书',
  },
  {
    schoolName: '成都师范学院',
    name: '学前教育',
    level: '专升本',
    certificate: '学前教育指导师（中级）证书',
  },
]

const mergedRemarkCoursePairs = [
  ['00807', '13420'],
  ['03451', '07158'],
  ['06737', '10397'],
]

export function getPolicyNotes(item) {
  if (!item) {
    return []
  }

  const notes = []
  const certificatePolicy = getCertificatePolicy(item)

  if (certificatePolicy) {
    notes.push({
      type: 'certificate',
      title: '1+X 证书试点 / 成果转换',
      text: `${certificatePolicy.certificate}可按学校公布规则申请学习成果转换或免考指定课程，具体替换课程、报名批次和费用以主考院校及证书方最新通知为准。`,
    })
  }

  if (item.optionalCourseGroup) {
    notes.push({
      type: 'substitute',
      title: '免考 / 选考说明',
      text: cleanNote(item.optionalCourseGroup),
    })
  }

  const courses = [...(item.unifiedCourses || []), ...(item.schoolExamCourses || [])]

  for (let index = 0; index < courses.length; index += 1) {
    const course = courses[index]
    if (!isPolicyRemark(course.remark)) {
      continue
    }

    if (isEnglishSubstituteRemark(course.remark)) {
      const nextCourse = getMergedRemarkNextCourse(courses, index)
      const title = nextCourse
        ? `不考英语加考课程：${formatCourseTitle(course)}、${formatCourseTitle(nextCourse)}`
        : formatCourseTitle(course)

      notes.push({
        type: 'english',
        title,
        text: cleanNote(course.remark),
      })
      continue
    }

    notes.push({
      type: course.remark.includes('英语') ? 'english' : 'extra',
      title: formatCourseTitle(course),
      text: cleanNote(course.remark),
    })
  }

  return notes
}

export function getCourseDisplayRemark(courses = [], index = 0) {
  const course = courses[index]

  if (!course) {
    return ''
  }

  if (course.remark) {
    return course.remark
  }

  const previousCourse = courses[index - 1]

  if (isMergedRemarkSecondCourse(previousCourse, course)) {
    return previousCourse.remark
  }

  return ''
}

export function courseRemarkClass(value = '') {
  if (!isPolicyRemark(value)) {
    return ''
  }

  return value.includes('英语') ? 'is-english-policy' : 'is-policy'
}

function getCertificatePolicy(item) {
  return certificatePolicies.find((policy) => (
    policy.schoolName === item.schoolName &&
    policy.name === item.name &&
    policy.level === item.level
  ))
}

function getMergedRemarkNextCourse(courses, index) {
  const course = courses[index]
  const nextCourse = courses[index + 1]

  return isMergedRemarkFirstCourse(course, nextCourse) ? nextCourse : null
}

function isMergedRemarkFirstCourse(course, nextCourse) {
  if (!course || !nextCourse || !isEnglishSubstituteRemark(course.remark)) {
    return false
  }

  return mergedRemarkCoursePairs.some(([firstCode, secondCode]) => (
    course.code === firstCode && nextCourse.code === secondCode
  ))
}

function isMergedRemarkSecondCourse(previousCourse, course) {
  return isMergedRemarkFirstCourse(previousCourse, course)
}

function isEnglishSubstituteRemark(value = '') {
  return /不考英语|免考英语/.test(value)
}

function isPolicyRemark(value = '') {
  return /不考|免考|加考|选考|1\+X|证书|成果转换|抵免/.test(value)
}

function formatCourseTitle(course) {
  return `${course.name}（${course.code}）`
}

function cleanNote(value = '') {
  return String(value).replace(/\s+/g, ' ').trim()
}
