const mathPattern = /数学|线性代数|概率|统计|工程数学|离散数学/
const englishPattern = /英语/
const practicePattern = /实践|实习|实验|毕业考核|论文|综合训练|项目综合/
const technicalPattern = /计算机|软件|工程|机械|电气|电子|土木|汽车|数据|网络|系统|程序|算法|数据库|人工智能|造价|建筑|施工|桥梁|道路|交通|测量|力学|结构|消防|飞行器|制造|材料|控制/
const medicalPattern = /护理|药|医学|解剖|生理|病理|临床|检验|营养|卫生|诊断|毒理|兽医|动物|畜牧|传染病|寄生虫/
const foodPattern = /食品|烹饪|营养|卫生|质量|安全|毒理/
const agriculturePattern = /农|园林|植物|作物|土壤|栽培|病虫害|林业|耕作|生态/
const artMediaPattern = /设计|动画|媒体|视觉|产品|艺术|制图|表现|摄影|播音|主持|广播|电视|编导|广告|界面|图形/
const lawSecurityPattern = /法律|法学|公安|消防|社会工作|社会政策|宪法|民法|刑法|法理|治安|权益|责任/
const businessPublicPattern = /工商|管理|市场|营销|商务|物流|旅游|酒店|行政|公共|城市|文化产业|人力资源|质量|认证|信息资源|土地资源/
const educationLanguagePattern = /教育|学前|小学|英语|语言|文学|汉语|语文|阅读|写作/
const sportsPattern = /体育|运动|健康|训练/
const writingPattern = /写作|论文|文学|新闻|广告|秘书|汉语|语言|编导|播音|主持/

export function analyzeMajorDifficulty(item) {
  if (!item) {
    return createPendingResult()
  }

  const planCourses = item.courses || []
  const schoolExamCourses = item.schoolExamCourses || []
  const unifiedCourses = item.unifiedCourses?.length || schoolExamCourses.length
    ? item.unifiedCourses || []
    : planCourses
  const courses = [...unifiedCourses, ...schoolExamCourses]

  if (!courses.length) {
    return createPendingResult()
  }

  const mathCourses = courses.filter((course) => mathPattern.test(course.name))
  const englishCourses = courses.filter((course) => englishPattern.test(course.name))
  const practiceCourses = courses.filter((course) => practicePattern.test(course.name))
  const optionalText = String(item.optionalCourseGroup || '')
  const canReplaceMath = mathCourses.length > 0 && /不考.*数学|选考课程学分不低于/.test(optionalText)
  const canReplaceEnglish = courses.some((course) => /不考英语|免考英语/.test(course.remark || ''))
  const hasGraduationTask = courses.some((course) => /毕业考核|论文/.test(course.name))
  const technicalLoad = courses.filter((course) => technicalPattern.test(course.name)).length
  const medicalLoad = courses.filter((course) => medicalPattern.test(course.name)).length
  const foodLoad = courses.filter((course) => foodPattern.test(course.name)).length
  const agricultureLoad = courses.filter((course) => agriculturePattern.test(course.name)).length
  const artMediaLoad = courses.filter((course) => artMediaPattern.test(course.name)).length
  const lawSecurityLoad = courses.filter((course) => lawSecurityPattern.test(course.name)).length
  const businessPublicLoad = courses.filter((course) => businessPublicPattern.test(course.name)).length
  const educationLanguageLoad = courses.filter((course) => educationLanguagePattern.test(course.name)).length
  const sportsLoad = courses.filter((course) => sportsPattern.test(course.name)).length
  const writingLoad = courses.filter((course) => writingPattern.test(course.name)).length

  let score = 2

  if (mathCourses.length) {
    score += canReplaceMath ? 1 : 2
  }

  if (unifiedCourses.length >= 11) {
    score += 1
  } else if (unifiedCourses.length <= 7) {
    score -= 1
  }

  if (practiceCourses.length >= 9) {
    score += 2
  } else if (practiceCourses.length >= 5) {
    score += 1
  }

  if (technicalLoad >= 6 || medicalLoad >= 5) {
    score += 1
  }

  if (foodLoad >= 4 || agricultureLoad >= 4) {
    score += 1
  }

  if (artMediaLoad >= 4 && practiceCourses.length >= 4) {
    score += 1
  }

  if (lawSecurityLoad >= 5 || sportsLoad >= 4) {
    score += 1
  }

  if (businessPublicLoad >= 5 && !mathCourses.length && practiceCourses.length <= 4) {
    score -= 1
  }

  if (educationLanguageLoad >= 5 && !mathCourses.length && practiceCourses.length <= 4) {
    score -= 1
  }

  if (writingLoad >= 5 && technicalLoad < 4 && !mathCourses.length) {
    score -= 1
  }

  score = Math.max(1, Math.min(5, score))

  return {
    score,
    label: getDifficultyLabel(score),
    tone: getDifficultyTone(score),
    summary: createSummary(score, item, {
      mathCourses,
      canReplaceMath,
      canReplaceEnglish,
      practiceCourses,
      unifiedCourses,
      technicalLoad,
      medicalLoad,
      foodLoad,
      agricultureLoad,
      artMediaLoad,
      lawSecurityLoad,
      businessPublicLoad,
      educationLanguageLoad,
      sportsLoad,
    }),
    facts: [
      {
        label: '数学压力',
        value: getMathStatus(mathCourses, canReplaceMath),
      },
      {
        label: '英语安排',
        value: englishCourses.length ? (canReplaceEnglish ? '可加考替代' : '考英语') : '未见英语课',
      },
      {
        label: '实践/论文',
        value: hasGraduationTask ? `${practiceCourses.length} 门，含毕业环节` : `${practiceCourses.length} 门`,
      },
      {
        label: '统考压力',
        value: `${unifiedCourses.length} 门统考`,
      },
    ],
    tags: createTags(item, {
      mathCourses,
      canReplaceMath,
      canReplaceEnglish,
      practiceCourses,
      unifiedCourses,
      technicalLoad,
      medicalLoad,
      foodLoad,
      agricultureLoad,
      artMediaLoad,
      lawSecurityLoad,
      businessPublicLoad,
      educationLanguageLoad,
      sportsLoad,
    }),
    advice: createAdvice(item, {
      mathCourses,
      canReplaceMath,
      canReplaceEnglish,
      practiceCourses,
      unifiedCourses,
      technicalLoad,
      medicalLoad,
      foodLoad,
      agricultureLoad,
      artMediaLoad,
      lawSecurityLoad,
      businessPublicLoad,
      educationLanguageLoad,
      sportsLoad,
      hasGraduationTask,
    }),
  }
}

function createPendingResult() {
  return {
    score: 0,
    label: '暂不评估',
    tone: 'info',
    summary: '课程计划暂未确认，先不做难度判断。建议以官方课程计划或学校通知为准。',
    facts: [
      { label: '课程信息', value: '需核实' },
      { label: '建议', value: '先核学校通知' },
    ],
    tags: ['课程需核实', '暂不评级'],
    advice: ['课程计划未确认前，不建议只按专业名称判断难度。', '先确认是否有数学、实践课、毕业论文和统考课程数量。'],
  }
}

function getDifficultyLabel(score) {
  if (score <= 1) return '较容易'
  if (score === 2) return '相对友好'
  if (score === 3) return '中等'
  if (score === 4) return '偏难'
  return '较难'
}

function getDifficultyTone(score) {
  if (score <= 2) return 'success'
  if (score === 3) return 'warning'
  return 'danger'
}

function getMathStatus(mathCourses, canReplaceMath) {
  if (!mathCourses.length) {
    return '不考数学'
  }

  return canReplaceMath ? '有数学，可选考替代' : '考数学'
}

function createSummary(score, item, factors) {
  const levelText = score >= 4 ? '整体难度偏高' : score <= 2 ? '整体对上班族比较友好' : '整体属于中等难度'
  const mathText = factors.mathCourses.length
    ? factors.canReplaceMath ? '数学有替代空间' : '数学是主要压力点'
    : '不考数学'
  const practiceText = factors.practiceCourses.length >= 6 ? '实践课较多' : '实践课压力可控'
  const directionText = getDirectionSummary(factors)

  return `${item.name}（${item.level}）${levelText}，${mathText}，${practiceText}${directionText ? `，${directionText}` : ''}。建议结合自己的数学基础、每天学习时间和是否能配合实践/论文节点来选。`
}

function createTags(item, factors) {
  const tags = []

  tags.push(`${item.unifiedCourseCount || factors.unifiedCourses.length} 门统考`)

  if (factors.mathCourses.length) {
    tags.push(factors.canReplaceMath ? '数学可替代' : '考数学')
  } else {
    tags.push('不考数学')
  }

  if (factors.canReplaceEnglish) {
    tags.push('英语可加考替代')
  }

  if (factors.practiceCourses.length >= 6) {
    tags.push('实践课较多')
  }

  if (factors.technicalLoad >= 6) {
    tags.push('技术课较多')
  }

  if (factors.medicalLoad >= 5) {
    tags.push('专业基础要求高')
  }

  if (factors.foodLoad >= 4) {
    tags.push('食品安全/流程多')
  }

  if (factors.agricultureLoad >= 4) {
    tags.push('农学应用课多')
  }

  if (factors.artMediaLoad >= 4) {
    tags.push('作品/设计要求')
  }

  if (factors.lawSecurityLoad >= 5) {
    tags.push('法务案例多')
  }

  if (factors.businessPublicLoad >= 5) {
    tags.push('管理记忆型')
  }

  if (factors.educationLanguageLoad >= 5) {
    tags.push('主观表达多')
  }

  if (factors.sportsLoad >= 4) {
    tags.push('体育理论/实践')
  }

  return tags
}

function createAdvice(item, factors) {
  const advice = []

  if (factors.mathCourses.length && !factors.canReplaceMath) {
    advice.push('数学基础弱的话，先别急着报，建议先看数学真题和教材目录，确认能否坚持复习。')
  } else if (!factors.mathCourses.length) {
    advice.push('如果你主要目标是稳妥拿证，这类不考数学的专业通常更友好。')
  } else {
    advice.push('数学相关课程存在选考或替代说明，报名前要确认替代规则和学分要求。')
  }

  if (factors.unifiedCourses.length >= 10) {
    advice.push('统考门数偏多，建议一次报考控制在 2-3 门，先攻克难课。')
  } else {
    advice.push('统考数量不算夸张，可以按“公共课 + 专业课”搭配推进。')
  }

  if (factors.practiceCourses.length >= 6) {
    advice.push('实践课较多，除了笔试，还要留意主考院校实践考核、材料提交和时间安排。')
  }

  if (factors.hasGraduationTask) {
    advice.push('本科阶段通常还有论文或毕业考核，后期要预留选题、写作、答辩和毕业申请时间。')
  }

  if (factors.technicalLoad >= 6) {
    advice.push('技术类课程多，适合有相关工作或学习基础的人；零基础建议提前做入门学习。')
  }

  if (factors.medicalLoad >= 5) {
    advice.push('医药护理类专业更看重专业基础和实践规范，适合相关从业或有明确用途的人。')
  }

  if (factors.foodLoad >= 4) {
    advice.push('食品、烹饪、营养类专业要关注标准、检测、卫生安全和流程类知识，适合有相关兴趣或从业方向的人。')
  }

  if (factors.agricultureLoad >= 4) {
    advice.push('农学、园林类专业应用课较多，复习时要按对象、技术和场景整理，不要只背零散名词。')
  }

  if (factors.artMediaLoad >= 4) {
    advice.push('艺术、设计、传媒类专业通常要兼顾理论、作品或实践提交，选专业前要确认自己是否能配合材料准备。')
  }

  if (factors.lawSecurityLoad >= 5) {
    advice.push('法学、公安、社会工作类专业主观题和案例判断较多，要提前练分点作答。')
  }

  if (factors.businessPublicLoad >= 5 && !factors.mathCourses.length) {
    advice.push('管理、行政、市场类专业通常更适合上班族，但要靠持续背诵和真题压缩范围。')
  }

  if (factors.educationLanguageLoad >= 5 && !factors.mathCourses.length) {
    advice.push('教育、语言文学类专业主观表达多，适合愿意阅读、写作和背关键词的人。')
  }

  if (factors.sportsLoad >= 4) {
    advice.push('体育教育类专业要兼顾理论和实践场景，建议提前确认实践考核或教学类要求。')
  }

  return [...new Set(advice)].slice(0, 4)
}

function getDirectionSummary(factors) {
  if (factors.medicalLoad >= 5) return '医药护理方向专业基础要求较高'
  if (factors.technicalLoad >= 6) return '工程技术类课程占比较高'
  if (factors.foodLoad >= 4) return '食品营养方向要重视标准和流程'
  if (factors.agricultureLoad >= 4) return '农学园林方向应用课较多'
  if (factors.artMediaLoad >= 4) return '艺术传媒方向要兼顾作品或实践'
  if (factors.lawSecurityLoad >= 5) return '法务公安方向案例和主观题较多'
  if (factors.sportsLoad >= 4) return '体育方向要兼顾理论和实践场景'
  if (factors.businessPublicLoad >= 5) return '管理类偏记忆和案例分析'
  if (factors.educationLanguageLoad >= 5) return '教育语言类偏阅读和主观表达'
  return ''
}
