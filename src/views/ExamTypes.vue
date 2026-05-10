<template>
  <section class="section">
    <div class="container">
      <PageHero
        eyebrow="大小自考对比"
        title="应用型和社会型怎么选"
        desc="先看预算、自律和服务需求，再决定走应用型还是社会型。"
        :actions="[
          { label: '先查费用', path: '/prices', type: 'primary' },
          { label: '估算拿证时间', path: '/certificate-time' },
        ]"
        :points="['费用服务', '统考省考', '自律要求']"
      />

      <el-card class="exam-hero-card" shadow="never">
        <div>
          <el-tag class="badge" effect="light" round>先看结论</el-tag>
          <h2>没有绝对更好的路径，只有更适合当前情况的路径</h2>
          <p>
            时间紧、需要提醒、能接受费用，优先了解应用型；预算低、自律强、愿意自己查通知，社会型也可行。
            真正要避免的是没看专业计划、没核实费用就仓促报名。
          </p>
        </div>
        <div class="hero-checks">
          <span>确认用途</span>
          <span>看专业计划</span>
          <span>核实费用</span>
          <span>再定路径</span>
        </div>
      </el-card>

      <div class="decision-grid">
        <el-card v-for="card in quickChoiceCards" :key="card.title" class="decision-card" shadow="hover">
          <h3>{{ card.title }}</h3>
          <p>{{ card.desc }}</p>
          <div class="tag-list">
            <el-tag v-for="point in card.points" :key="point" effect="plain" round>{{ point }}</el-tag>
          </div>
        </el-card>
      </div>

      <div class="type-grid mt-section aligned-type-grid">
        <el-card v-for="type in examTypes" :key="type.id" class="type-card rich-type-card" shadow="hover">
          <div class="type-section type-intro">
            <el-tag class="badge" effect="light" round>{{ type.alias }}</el-tag>
            <h2>{{ type.name }}</h2>
            <p class="lead-copy">{{ type.summary }}</p>
          </div>

          <div class="type-section type-key-section">
            <div class="key-point">
              <strong>一句话理解：</strong>
              <span>{{ type.keyPoint }}</span>
            </div>
          </div>

          <div class="type-section">
            <h3>重点区别</h3>
            <ul>
              <li v-for="item in type.features" :key="item">{{ item }}</li>
            </ul>
          </div>

          <div class="type-section">
            <div class="mini-columns">
              <div>
                <h3>更适合</h3>
                <ul>
                  <li v-for="item in type.suitable" :key="item">{{ item }}</li>
                </ul>
              </div>
              <div>
                <h3>慎重选择</h3>
                <ul>
                  <li v-for="item in type.notSuitable" :key="item">{{ item }}</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="type-section">
            <h3>报名前要确认</h3>
            <ul>
              <li v-for="item in type.beforeApply" :key="item">{{ item }}</li>
            </ul>
          </div>
        </el-card>
      </div>

      <el-card class="detail-block" shadow="never">
        <h2>核心对比表</h2>
        <p class="block-desc">这张表适合快速扫一遍，也适合发给还在纠结路径的人做参考。</p>
        <el-table :data="compareTableRows" border stripe>
          <el-table-column prop="name" label="维度" min-width="130" fixed />
          <el-table-column prop="applied" label="应用型（小自考）" min-width="260" />
          <el-table-column prop="social" label="社会型（大自考）" min-width="260" />
        </el-table>
      </el-card>

      <el-card class="detail-block" shadow="never">
        <h2>不同情况怎么选</h2>
        <p class="block-desc">先按自己的真实情况判断，不要只听别人说哪个更快。</p>
        <el-table :data="scenarioRows" border stripe>
          <el-table-column prop="scenario" label="你的情况" min-width="220" />
          <el-table-column prop="suggestion" label="建议倾向" min-width="180" />
          <el-table-column prop="reason" label="原因" min-width="320" />
        </el-table>
      </el-card>

      <SectionTitle
        class="mt-large"
        eyebrow="报名前四问"
        title="决定之前，把这四件事问清楚"
        desc="路径只是选择之一，专业、预算、学位和服务边界同样会影响毕业体验。"
      />

      <div class="checklist-grid">
        <el-card v-for="group in applyChecklist" :key="group.title" class="checklist-card" shadow="hover">
          <h3>{{ group.title }}</h3>
          <ul>
            <li v-for="item in group.items" :key="item">{{ item }}</li>
          </ul>
        </el-card>
      </div>

      <el-card class="detail-block" shadow="never">
        <h2>高频问题</h2>
        <el-collapse>
          <el-collapse-item
            v-for="item in faqItems"
            :key="item.question"
            :title="item.question"
            :name="item.question"
          >
            <p class="faq-answer">{{ item.answer }}</p>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <ContactCard
        title="不知道走大自考还是小自考，可以先核对情况"
        desc="把预算、学习时间、自律程度和目标专业说清楚，再判断哪条路径更稳。"
        :tips="[
          '你倾向省钱还是更想节省时间和精力',
          '每天或每周能稳定拿出多少学习时间',
          '有没有目标学校、专业、学位或毕业时间要求',
        ]"
      />
    </div>
  </section>
</template>

<script setup>
import SectionTitle from '../components/SectionTitle.vue'
import PageHero from '../components/PageHero.vue'
import ContactCard from '../components/ContactCard.vue'
import {
  applyChecklist,
  examTypes,
  examTypeCompareRows,
  faqItems,
  quickChoiceCards,
  scenarioRows,
} from '../js/examTypes'

const compareTableRows = examTypeCompareRows.map(row => ({
  name: row[0],
  applied: row[1],
  social: row[2],
}))
</script>
