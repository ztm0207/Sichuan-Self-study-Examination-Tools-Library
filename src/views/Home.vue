<template>
  <div>
    <section class="hero home-hero">
      <div class="container">
        <div class="home-hero-panel">
          <div class="home-hero-copy">
            <el-tag class="badge" effect="light" round>{{ homeHero.badge }}</el-tag>
            <h1 class="home-hero-title" :aria-label="homeHero.title">
              <template v-if="homeHero.titleLines?.length">
                <span v-for="line in homeHero.titleLines" :key="line">{{ line }}</span>
              </template>
              <template v-else>{{ homeHero.title }}</template>
            </h1>
            <p class="hero-subtitle">{{ homeHero.subtitle }}</p>
            <p class="hero-note">{{ homeHero.note }}</p>
            <div class="hero-actions">
              <RouterLink :to="homeHero.primaryAction.path">
                <el-button type="primary" size="large" round>
                  <el-icon><School /></el-icon>
                  {{ homeHero.primaryAction.label }}
                </el-button>
              </RouterLink>
              <RouterLink :to="homeHero.secondaryAction.path">
                <el-button size="large" round>
                  <el-icon><Money /></el-icon>
                  {{ homeHero.secondaryAction.label }}
                </el-button>
              </RouterLink>
            </div>
            <div class="home-hero-points">
              <span v-for="point in homeHeroPoints" :key="point">{{ point }}</span>
            </div>
          </div>

          <div class="home-hero-aside">
            <div class="home-hero-route">
              <p class="overview-kicker">先把这三件事看清</p>
              <ol>
                <li v-for="step in heroRouteSteps" :key="step">{{ step }}</li>
              </ol>
            </div>
            <div class="overview-links">
              <RouterLink v-for="link in heroQuickLinks" :key="link.path" :to="link.path">
                <span>{{ link.index }}</span>
                <strong>{{ link.label }}</strong>
                <em>→</em>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section directory-section">
      <div class="container">
        <div class="directory-heading">
          <SectionTitle
            eyebrow="目录结构"
            title="按真实决策顺序进入"
            desc="首页、查学校、查专业、查费用、大小自考、拿证时间、复习计划、论文工具库，按这个顺序推进。"
          />
          <RouterLink to="/process" class="directory-process-link">
            <el-icon><DataAnalysis /></el-icon>
            查看完整流程
          </RouterLink>
        </div>

        <div class="directory-grid">
          <RouterLink
            v-for="(section, index) in homeDirectorySections"
            :key="section.title"
            class="card-link"
            :class="{ 'is-wide': index < 2 }"
            :to="section.path"
          >
            <el-card class="directory-card" :class="{ 'is-primary': index < 2 }" shadow="hover">
              <div class="directory-card-head">
                <div class="directory-icon">
                  <el-icon><component :is="directoryIcons[index]" /></el-icon>
                </div>
                <span>{{ String(index + 1).padStart(2, '0') }}</span>
              </div>
              <h3>{{ section.title }}</h3>
              <p>{{ section.intro }}</p>
              <div class="directory-items">
                <RouterLink
                  v-for="item in section.items"
                  :key="item.label"
                  :to="item.path"
                  @click.stop
                >
                  {{ item.label }}
                </RouterLink>
              </div>
            </el-card>
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="section muted">
      <div class="container">
        <SectionTitle
          eyebrow="使用建议"
          title="先自己筛一轮，再做决定"
          desc="不用一开始就纠结报名。先把目标、预算和学习时间摆出来，很多选择会自然变窄。"
        />
        <div class="topic-grid home-advice-grid">
          <el-card v-for="item in homeAdviceCards" :key="item.title" class="content-card advice-card" shadow="hover">
            <div class="advice-index">{{ item.index }}</div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
            <div class="advice-tags">
              <span v-for="tag in item.tags" :key="tag">{{ tag }}</span>
            </div>
          </el-card>
        </div>
      </div>
    </section>

    <div class="container">
      <ContactCard
        title="学校、专业、费用拿不准，可以先发来一起筛"
        desc="适合刚开始了解四川小自考，还没确定学校、专业、预算和拿证节奏的人。"
      />
    </div>
  </div>
</template>

<script setup>
import {
  DataAnalysis,
  EditPen,
  Money,
  Reading,
  School,
  Switch,
  Timer,
} from '@element-plus/icons-vue'
import { homeDirectorySections, homeHero } from '../js/site'
import SectionTitle from '../components/SectionTitle.vue'
import ContactCard from '../components/ContactCard.vue'

const homeHeroPoints = ['院校专业先核对', '价格和论文费分开看', '统考省考按学校查']

const heroRouteSteps = ['查学校与专业', '核价格和论文费用', '排考试与论文节奏']

const heroQuickLinks = [
  { index: '01', label: '查院校', path: '/schools' },
  { index: '02', label: '查专业', path: '/majors' },
  { index: '03', label: '查费用', path: '/prices' },
]

const homeAdviceCards = [
  {
    index: '01',
    title: '先定目标',
    desc: '为了拿证、学位、考公考编还是工作转向，目标不同，专业优先级也不同。',
    tags: ['拿证', '学位', '用途'],
  },
  {
    index: '02',
    title: '再看成本',
    desc: '把助学价格、论文费用、时间成本分开看，别只用总价判断值不值。',
    tags: ['价格', '论文费', '时间'],
  },
  {
    index: '03',
    title: '最后排节奏',
    desc: '看统考、省考课程和自己的复习时间，确认能不能按预期推进到毕业。',
    tags: ['统考', '省考', '毕业'],
  },
]

const directoryIcons = [School, Reading, Money, Switch, Timer, DataAnalysis, EditPen]
</script>
