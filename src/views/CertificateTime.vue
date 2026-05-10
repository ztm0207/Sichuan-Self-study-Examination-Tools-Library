<template>
  <section class="section">
    <div class="container">
      <PageHero
        eyebrow="拿证时间计算器"
        title="按四川自考批次估算拿证时间"
        desc="区分统考、省考、论文和毕业申请窗口，把剩余课程放进更接近实际的时间表。"
        :actions="[
          { label: '先查专业课程', path: '/majors', type: 'primary' },
          { label: '看大小自考对比', path: '/exam-types' },
        ]"
        :points="['4/10月统考', '1/7月省考', '毕业申请窗口']"
      />

      <CertificateCalculator />

      <el-card class="inline-tip-card mt-section" shadow="never">
        <div>
          <h3>估算结果怎么用</h3>
          <p>它适合先做时间参考。实际周期会受当期开考课程、通过率、论文申请时间、成绩归档和毕业审核影响。</p>
        </div>
      </el-card>

      <ContactCard
        title="拿证周期不确定，可以把剩余科目发来核对"
        desc="适合已经有目标专业或正在考试，想把统考、省考、论文和毕业申请排进时间表的人。"
        :tips="[
          '你的学校、专业、层次，以及已过和未过课程',
          '你每次考试大概能报几门、每天能学多久',
          '是否有论文、实践课、学位或毕业时间要求',
        ]"
      />
    </div>
  </section>
</template>

<script setup>
import PageHero from '../components/PageHero.vue'
import ContactCard from '../components/ContactCard.vue'
import CertificateCalculator from '../components/tools/CertificateCalculator.vue'
</script>
