import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/Home.vue'), meta: { title: '首页' } },
  { path: '/schools', name: 'schools', component: () => import('../views/Schools.vue'), meta: { title: '查学校' } },
  { path: '/schools/:id', name: 'school-detail', component: () => import('../views/SchoolDetail.vue'), meta: { title: '学校详情' } },
  { path: '/majors', name: 'majors', component: () => import('../views/Majors.vue'), meta: { title: '查专业' } },
  { path: '/majors/:id', name: 'major-detail', component: () => import('../views/MajorDetail.vue'), meta: { title: '专业详情' } },
  { path: '/prices', name: 'prices', component: () => import('../views/Prices.vue'), meta: { title: '查费用' } },
  { path: '/exam-types', name: 'exam-types', component: () => import('../views/ExamTypes.vue'), meta: { title: '大小自考对比' } },
  { path: '/process', name: 'process', component: () => import('../views/Process.vue'), meta: { title: '流程库' } },
  { path: '/thesis', name: 'thesis', component: () => import('../views/Thesis.vue'), meta: { title: '论文工具库' } },
  { path: '/graduation', name: 'graduation', component: () => import('../views/Graduation.vue'), meta: { title: '毕业/学位' } },
  { path: '/certificate-time', name: 'certificate-time', component: () => import('../views/CertificateTime.vue'), meta: { title: '拿证时间计算器' } },
  { path: '/study-plan', name: 'study-plan', component: () => import('../views/StudyPlan.vue'), meta: { title: '复习计划生成器' } },
  {
    path: '/tools',
    redirect: (to) => {
      if (to.query.tab === 'certificate-time') return '/certificate-time'
      if (to.query.tab === 'study-plan') return '/study-plan'
      if (to.query.tab === 'major-assessment') return '/exam-types'
      return '/certificate-time'
    },
  },
  { path: '/resources', name: 'resources', component: () => import('../views/Resources.vue'), meta: { title: '资料/咨询' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = `${to.meta.title || '四川小自考工具库'} - 四川小自考工具库`
})

export default router
