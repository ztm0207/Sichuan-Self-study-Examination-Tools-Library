const supplementalPlans = {
  '专科|大数据与会计': {
    code: '530302',
    planId: 'applied-530302',
    category: '经管类',
    totalCredits: 76,
    totalText: '合计 76 学分',
    unifiedCourses: [
      course('unified', 1, '03706', '思想道德修养与法律基础', 2),
      course('unified', 2, '12656', '毛泽东思想和中国特色社会主义理论体系概论', 4),
      course('unified', 3, '13124', '英语（专）', 7),
      course('unified', 4, '00018', '计算机应用基础', 2),
      course('unified', 5, '00019', '计算机应用基础（实践）', 2),
      course('unified', 6, '13125', '高等数学（经管类）', 6),
      course('unified', 7, '13886', '经济学原理（初级）', 5),
      course('unified', 8, '13126', '管理学原理（初级）', 5),
      course('unified', 9, '00041', '基础会计学', 5),
      course('unified', 10, '00067', '财务管理学', 6),
      course('unified', 11, '13138', '财务会计（初级）', 6),
      course('unified', 12, '13139', '成本会计', 3),
    ],
    schoolExamCourses: [
      course('province', 1, '04759', '财经应用文写作', 5),
      course('province', 2, '04095', '经济法基础', 6),
      course('province', 3, '01445', '税收基础', 6),
      course('province', 4, '04391', '会计软件', 4),
      course('province', 5, '04392', '会计软件（实践）', 2),
      course('province', 6, '00807', '金融概论', 6, '免考英语（专科）替换课程'),
      course('province', 7, '13420', '大数据概论', 6),
    ],
  },
  '专科|环境艺术设计': {
    code: '550106',
    planId: 'applied-550106',
    category: '艺术传媒',
    totalCredits: 72,
    totalText: '合计 72 学分',
    unifiedCourses: [
      course('unified', 1, '03706', '思想道德修养与法律基础', 2),
      course('unified', 2, '12656', '毛泽东思想和中国特色社会主义理论体系概论', 4),
      course('unified', 3, '00688', '设计概论', 4),
      course('unified', 4, '14107', '人体工程学', 4),
      course('unified', 5, '13809', '计算机设计软件运用', 8),
      course('unified', 6, '00708', '装饰材料与构造', 5),
      course('unified', 7, '14733', '专业制图', 6),
      course('unified', 8, '14731', '专业效果图', 6),
      course('unified', 9, '14236', '室内设计基础', 8),
      course('unified', 10, '14426', '项目综合实习（实践）', 4),
    ],
    schoolExamCourses: [
      course('province', 1, '06220', '形态与空间造型', 5),
      course('province', 2, '00707', '建筑设计基础', 4),
      course('province', 3, '01222', '室内设计（一）', 2),
      course('province', 4, '01223', '室内设计（一）（实践）', 3),
      course('province', 5, '03890', '装饰、装修工程施工', 3),
      course('province', 6, '04029', '公共环境设施设计', 4),
    ],
  },
  '专科|质量管理与认证': {
    code: '590207',
    planId: 'applied-590207',
    category: '经管类',
    totalCredits: 73,
    totalText: '合计 73 学分',
    unifiedCourses: [
      course('unified', 1, '02460', '工程质量与进度控制', 4),
      course('unified', 2, '04729', '大学语文', 4),
      course('unified', 3, '06092', '工作分析', 4),
      course('unified', 4, '13124', '英语（专）', 7),
      course('unified', 5, '13126', '管理学原理（初级）', 5),
      course('unified', 6, '15040', '习近平新时代中国特色社会主义思想概论', 3),
      course('unified', 7, '15041', '毛泽东思想和中国特色社会主义理论体系概论', 3),
      course('unified', 8, '15042', '思想道德与法治', 3),
    ],
    schoolExamCourses: [
      course('province', 1, '00267', '社会调查理论与方法', 4),
      course('province', 2, '01615', '质量管理体系认证', 6),
      course('province', 3, '14925', '质量管理体系认证（实践）', 2),
      course('province', 4, '03809', '项目管理案例分析（实践）', 2),
      course('province', 5, '07763', '质量管理基础', 5),
      course('province', 6, '14923', '质量管理基础（实践）', 2),
      course('province', 7, '07764', '计量学基础', 5),
      course('province', 8, '14924', '标准化基础', 5),
      course('province', 9, '11729', '项目管理实验分析（实践）', 4),
      course('province', 10, '14906', '职业生涯与人生规划（实践）', 5),
      course('province', 11, '03451', '科技创新与社会发展', 4, '不考英语（专）的加考课程'),
      course('province', 12, '07158', '调查报告写作', 6),
    ],
  },
}

export function fillMissingOfferingCourses(offerings) {
  for (const item of offerings) {
    if ((item.unifiedCourseCount || 0) > 0 || (item.schoolExamCourseCount || 0) > 0) {
      continue
    }

    const plan = supplementalPlans[`${item.level}|${item.name}`]

    if (!plan) {
      continue
    }

    item.code ||= plan.code
    item.planId ||= plan.planId
    item.category ||= plan.category
    item.totalCredits ||= plan.totalCredits
    item.totalText ||= plan.totalText
    item.unifiedCourses = cloneCourses(plan.unifiedCourses)
    item.schoolExamCourses = cloneCourses(plan.schoolExamCourses)
    item.unifiedCourseCount = item.unifiedCourses.length
    item.schoolExamCourseCount = item.schoolExamCourses.length
  }
}

function course(examKind, index, code, name, credits, remark = '') {
  return {
    id: `${examKind}-${String(index).padStart(2, '0')}-${code}`,
    examKind,
    code,
    name,
    credits,
    remark,
  }
}

function cloneCourses(courses) {
  return courses.map((item) => ({ ...item }))
}
