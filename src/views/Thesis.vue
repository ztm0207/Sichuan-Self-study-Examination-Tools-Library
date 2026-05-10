<template>
  <section class="section">
    <div class="container">
      <PageHero
        eyebrow="论文工具库"
        title="小自考专升本论文规划工具"
        desc="面向四川应用型自考本科，覆盖论文申请、选题、提纲、格式、查重、答辩和成绩归档。专科通常不涉及论文，这里只保留专升本论文规划。"
        :actions="[
          { label: '查看毕业学位', path: '/graduation', type: 'primary' },
          { label: '看资料整理计划', path: '/resources' },
        ]"
        :points="['小自考本科', '选题提纲', '答辩归档']"
      />

      <ThesisPlanner />

      <el-card class="thesis-hero-card" shadow="never">
        <div>
          <el-tag class="badge" effect="light" round>先看重点</el-tag>
          <h2>论文不是写得越复杂越好，而是要合规、清楚、能交得上</h2>
          <p>
            自考论文最容易卡在三个地方：题目太大写不下去、格式查重临时返工、答辩时说不清自己写了什么。
            小自考要重点核对主考院校、学校或助学点发布的论文节点；稳妥的做法是先定小题目，再搭清楚目录，写作过程中同步处理引用、格式和导师意见。
          </p>
        </div>
        <RouterLink to="/graduation"><el-button type="primary" round>查看毕业学位</el-button></RouterLink>
      </el-card>

      <div class="thesis-key-grid">
        <el-card v-for="card in thesisKeyCards" :key="card.title" class="content-card" shadow="hover">
          <h3>{{ card.title }}</h3>
          <p>{{ card.desc }}</p>
          <div class="tag-list">
            <el-tag v-for="tag in card.tags" :key="tag" effect="plain" round>{{ tag }}</el-tag>
          </div>
        </el-card>
      </div>

      <SectionTitle
        class="mt-large"
        eyebrow="完整流程"
        title="从申请到答辩的 5 个节点"
        desc="具体申请时间、格式模板和查重要求，以主考院校当期通知为准。"
      />

      <div class="thesis-flow-grid">
        <el-card v-for="step in thesisFlowSteps" :key="step.title" class="process-card" shadow="hover">
          <h2>{{ step.title }}</h2>
          <p>{{ step.desc }}</p>
        </el-card>
      </div>

      <SectionTitle
        class="mt-large"
        eyebrow="选题"
        title="选题先小、再稳、再贴合专业"
      />

      <div class="degree-condition-grid">
        <el-card v-for="item in thesisChoiceCards" :key="item.title" class="content-card" shadow="hover">
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </el-card>
      </div>

      <el-card class="detail-block" shadow="never">
        <h2>一篇论文的基本结构怎么检查</h2>
        <p class="block-desc">不用一开始追求高级，先确保每个部分功能清楚、格式合规。</p>
        <el-table :data="thesisStructureRows" border stripe>
          <el-table-column prop="part" label="部分" min-width="120" />
          <el-table-column prop="focus" label="重点" min-width="280" />
          <el-table-column prop="avoid" label="避免" min-width="260" />
        </el-table>
      </el-card>

      <SectionTitle
        class="mt-large"
        eyebrow="检查清单"
        title="初稿、定稿、答辩前分别检查什么"
      />

      <div class="checklist-grid">
        <el-card v-for="group in thesisChecklist" :key="group.title" class="checklist-card" shadow="hover">
          <h3>{{ group.title }}</h3>
          <ul>
            <li v-for="item in group.items" :key="item">{{ item }}</li>
          </ul>
        </el-card>
      </div>

      <SectionTitle
        class="mt-large"
        eyebrow="答辩准备"
        title="答辩前，把这 4 类问题准备好"
      />

      <div class="thesis-defense-grid">
        <el-card v-for="item in thesisDefenseCards" :key="item.title" class="content-card" shadow="hover">
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </el-card>
      </div>

      <el-card class="inline-tip-card thesis-tip" shadow="never">
        <div>
          <h3>内容边界</h3>
          <p>
            论文库只做流程说明、选题建议、格式检查、目录优化和答辩准备。
            不做代写，不做买卖论文，不承诺包过。
          </p>
        </div>
        <RouterLink to="/resources"><el-button type="primary" round>看资料整理计划</el-button></RouterLink>
      </el-card>

      <el-card class="detail-block" shadow="never">
        <h2>高频问题</h2>
        <el-collapse>
          <el-collapse-item
            v-for="item in thesisFaqItems"
            :key="item.question"
            :title="item.question"
            :name="item.question"
          >
            <p class="faq-answer">{{ item.answer }}</p>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>
  </section>
</template>

<script setup>
import {
  thesisChecklist,
  thesisChoiceCards,
  thesisDefenseCards,
  thesisFaqItems,
  thesisFlowSteps,
  thesisKeyCards,
  thesisStructureRows,
} from '../js/flows'
import SectionTitle from '../components/SectionTitle.vue'
import PageHero from '../components/PageHero.vue'
import ThesisPlanner from '../components/tools/ThesisPlanner.vue'
</script>
