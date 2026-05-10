<template>
  <div class="tool-panel">
    <el-card class="tool-form" shadow="never">
      <el-form label-position="top">
        <el-form-item label="数学基础">
          <el-select v-model="form.math">
            <el-option label="较弱" value="weak" />
            <el-option label="一般" value="normal" />
            <el-option label="较好" value="good" />
          </el-select>
        </el-form-item>
        <el-form-item label="每天学习时间">
          <el-select v-model="form.time">
            <el-option label="1 小时以内" value="less" />
            <el-option label="1-2 小时" value="normal" />
            <el-option label="2 小时以上" value="more" />
          </el-select>
        </el-form-item>
        <el-form-item label="主要目标">
          <el-select v-model="form.goal">
            <el-option label="尽快拿证" value="certificate" />
            <el-option label="学点东西" value="skill" />
            <el-option label="和工作相关" value="job" />
          </el-select>
        </el-form-item>
        <el-form-item label="预算情况">
          <el-select v-model="form.budget">
            <el-option label="预算有限" value="low" />
            <el-option label="可接受一定费用" value="normal" />
            <el-option label="更看重效率" value="high" />
          </el-select>
        </el-form-item>
        <el-form-item label="自律程度">
          <el-select v-model="form.discipline">
            <el-option label="容易拖延" value="weak" />
            <el-option label="一般" value="normal" />
            <el-option label="比较自律" value="good" />
          </el-select>
        </el-form-item>
        <el-button type="primary" round @click="assess">开始测评</el-button>
      </el-form>
    </el-card>

    <el-card v-if="result" class="tool-result" shadow="never">
      <h3>四川自考选择建议</h3>
      <p>{{ result.summary }}</p>
      <div class="tag-list">
        <el-tag v-for="tag in result.tags" :key="tag" effect="plain" round>{{ tag }}</el-tag>
      </div>
      <el-alert title="测评结果仅供参考，具体还要结合四川当年专业计划、学校/助学点信息和个人时间预算。" type="info" show-icon :closable="false" />
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const form = reactive({
  math: 'weak',
  time: 'normal',
  goal: 'certificate',
  budget: 'normal',
  discipline: 'normal',
})

const result = ref(null)

function assess() {
  const preferApplied = form.discipline === 'weak' || form.budget === 'high'

  if (preferApplied) {
    result.value = {
      summary: '你可以优先了解四川应用型（小自考）：有助学安排和省考支持，但需要核实学校/助学点和费用。',
      tags: ['应用型（小自考）', '效率优先', '注意核实助学点', '适合需要督促的人'],
    }
    return
  }

  if (form.math === 'weak' && form.goal === 'certificate') {
    result.value = {
      summary: '专业上更建议优先了解少数学压力、上班族友好的小自考专业。',
      tags: ['行政管理', '人力资源管理', '汉语言文学', '先查四川专业库'],
    }
    return
  }

  result.value = {
    summary: '你适合先按“专业目标 + 预算 + 自律程度”三步判断，再去学校库和专业库查具体小自考入口。',
    tags: ['先查学校', '再查专业', '小自考路径', '以官方通知为准'],
  }
}
</script>
