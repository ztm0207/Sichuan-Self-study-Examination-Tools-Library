<template>
  <section class="section">
    <div class="container">
      <PageHero
        eyebrow="资料清单"
        title="先按阶段自查，再准备对应资料"
        desc="复习、论文、毕业和学位需要准备的材料不一样。先用站内工具把当前阶段和关键节点理清楚，具体要求仍以考试院、主考院校和学校通知为准。"
        :actions="[
          { label: '生成复习计划', path: '/study-plan', type: 'primary' },
          { label: '看论文规划器', path: '/thesis' },
        ]"
        :points="['复习规划', '论文准备', '毕业学位']"
      />

      <el-card class="resource-guide-card" shadow="never">
        <div>
          <span>使用建议</span>
          <h2>先判断自己卡在哪一步，再看需要什么资料</h2>
          <p>自考资料不需要一次性看完。先确定当前是复习、论文、毕业还是学位阶段，再用对应工具把关键节点理清楚。</p>
        </div>
        <div class="resource-guide-steps">
          <span>先定阶段</span>
          <span>再查工具</span>
          <span>最后补资料</span>
        </div>
      </el-card>

      <div class="resource-section">
        <div class="resource-section-head">
          <div>
            <span>资料方向</span>
            <h2>这 3 类内容适合先做成轻清单</h2>
            <p>每一项都对应一个站内工具，适合先自查，再决定下一步该准备哪些材料。</p>
          </div>
          <el-tag effect="light" round>{{ resources.length }} 个方向</el-tag>
        </div>

        <div class="resource-grid">
          <el-card v-for="item in resources" :key="item.id" class="resource-card" shadow="hover">
            <div class="resource-head">
              <div>
                <span>{{ item.stage }}</span>
                <h3>{{ item.name }}</h3>
              </div>
              <el-tag type="info" effect="plain" round>{{ item.type }}</el-tag>
            </div>
            <p>{{ item.desc }}</p>
            <div class="resource-meta">
              <span>适合：{{ item.audience }}</span>
              <strong>先自查</strong>
            </div>
            <div class="tag-list">
              <el-tag v-for="tag in item.tags" :key="tag" effect="plain" round>{{ tag }}</el-tag>
            </div>
            <RouterLink :to="item.path">
              <el-button class="full" type="primary" plain round>{{ item.method }}</el-button>
            </RouterLink>
          </el-card>
        </div>
      </div>

      <ContactCard
        title="不知道该准备哪些资料，可以先说你的阶段"
        desc="适合已经确定专业或正在备考，但不知道复习资料、论文材料、毕业学位材料怎么整理的人。"
        :tips="[
          '你现在处在备考、论文、毕业还是学位阶段',
          '你的学校、专业、层次和当前剩余事项',
          '你最想要的是复习资料、时间规划还是材料清单',
        ]"
      />
    </div>
  </section>
</template>

<script setup>
import { resources } from '../js/resources'
import ContactCard from '../components/ContactCard.vue'
import PageHero from '../components/PageHero.vue'
</script>
