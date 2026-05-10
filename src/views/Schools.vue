<template>
  <section class="section">
    <div class="container">
      <PageHero
        eyebrow="查学校"
        title="按院校查看可报专业与费用"
        desc="以院校专业为主整理四川应用型自考信息，先看学校，再看该学校下每个专业的助学价格、论文费用和课程结构。"
        :actions="[
          { label: '按专业查', path: '/majors', type: 'primary' },
          { label: '单独查费用', path: '/prices' },
        ]"
        :points="['学校官网', '院校专业', '价格论文费']"
      />

      <el-card class="notice-card school-tip-card" shadow="never">
        <div>
          <el-tag effect="light" round>使用提示</el-tag>
          <h3>每所学校已汇总专业和费用</h3>
          <p>进入学校详情后，可以直接查看专科、专升本专业、专业代码、助学价格、论文费用和课程数量。</p>
        </div>
        <ul>
          <li>支持学校名、拼音和首字母搜索</li>
          <li>费用暂未确认的项目会标记为待核对</li>
          <li>专科论文费用显示为通常不涉及</li>
        </ul>
      </el-card>

      <div class="filter-bar">
        <el-input v-model="keyword" clearable placeholder="搜索学校，例如：四川大学、scdx、成都理工" />
        <el-select v-model="area" placeholder="全部地区" clearable>
          <el-option label="全部地区" value="" />
          <el-option label="成都" value="成都" />
          <el-option label="四川其他" value="四川" />
          <el-option label="北京" value="北京" />
        </el-select>
      </div>

      <div class="school-grid">
        <RouterLink
          v-for="school in schoolCards"
          :key="school.id"
          :to="`/schools/${school.id}`"
          class="card-link"
        >
          <el-card class="school-card" shadow="hover">
            <div class="school-card-head">
              <h3>{{ school.name }}</h3>
              <el-tag effect="plain" round>{{ school.area }}</el-tag>
            </div>
            <p>院校专业：{{ school.majorCount }} 个</p>
            <div class="score-row">
              <span>助学价格</span>
              <strong>{{ school.priceSummary }}</strong>
            </div>
            <div class="score-row">
              <span>论文费用</span>
              <strong>{{ school.thesisSummary }}</strong>
            </div>
            <small v-if="school.priceMissingCount || school.thesisPriceMissingCount">
              待核对：价格 {{ school.priceMissingCount }} 项，论文 {{ school.thesisPriceMissingCount }} 项
            </small>
            <small v-else>价格和论文费用已列明</small>
          </el-card>
        </RouterLink>
      </div>

      <el-empty v-if="!schoolCards.length" description="没有找到匹配学校" />
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import PageHero from '../components/PageHero.vue'
import { getSchoolMajorOfferings, schools } from '../js/schools'

const keyword = ref('')
const area = ref('')

const schoolSearchAliases = {
  'school-01': ['sichuandaxue', 'scdx'],
  'school-02': ['dianzikejidaxue', 'dzkjdx'],
  'school-03': ['xinanjiaotongdaxue', 'xnjtdx'],
  'school-04': ['xinancaijingdaxue', 'xncjdx'],
  'school-05': ['xinanshiyoudaxue', 'xnsydx'],
  'school-06': ['chengduyixueyuan', 'cdyxy'],
  'school-07': ['sichuannongyedaxue', 'scnydx'],
  'school-08': ['xinankejidaxue', 'xnkjdx'],
  'school-09': ['chengduligongdaxue', 'cdlgdx'],
  'school-10': ['sichuanshifandaxue', 'scsfdx'],
  'school-11': ['chengdixinxigongchengdaxue', 'cdxxgcdx'],
  'school-12': ['xinhuadaxue', 'xhdx'],
  'school-13': ['chengdutiyuxueyuan', 'cdtyxy'],
  'school-14': ['xinhuashifandaxue', 'xhsfdx'],
  'school-15': ['neijiangshifanxueyuan', 'njsfxy'],
  'school-16': ['leshanshifanxueyuan', 'lssfxy'],
  'school-17': ['sichuanjingchaxueyuan', 'scjcxy'],
  'school-18': ['mianyangshifanxueyuan', 'mysfxy'],
  'school-19': ['chengdushifanxueyuan', 'cdsfxy'],
  'school-20': ['sichuanqinghuagongdaxue', 'scqhgdx'],
  'school-21': ['sichuanwenlixueyuan', 'scwlxy'],
  'school-22': ['panzhihuaxueyuan', 'pzhxy'],
  'school-23': ['xinanyikedaxue', 'xnykdx'],
  'school-24': ['chuanbeiyixueyuan', 'cbyxy'],
  'school-25': ['chengdudaxue', 'cddx'],
  'school-26': ['xinanminzudaxue', 'xnmzdx'],
  'school-27': ['abashifanxueyuan', 'absfxy'],
  'school-28': ['chengduwaiguoyuxueyuan', 'cdwgyxy'],
  'school-30': ['chengdugongyexueyuan', 'cdgyxy'],
  'school-32': ['chengdudongruanxueyuan', 'cddrxy'],
  'school-33': ['chengduwenlixueyuan', 'cdwlxy'],
  'school-34': ['sichuandianyingdianshixueyuan', 'scdydsxy'],
  'school-35': ['chengdujinchengxueyuan', 'cdjcxy'],
  'school-36': ['sichuangongshangxueyuan', 'scgsxy'],
  'school-37': ['xinanjiaotongdaxuexiwangxueyuan', 'xnjtdxxwxy'],
  'school-38': ['sichuanwenhuayishuxueyuan', 'scwhysxy'],
  'school-40': ['mianyangchengshixueyuan', 'mycsxy'],
  'school-41': ['xichangxueyuan', 'xcxy'],
  'school-42': ['jilixueyuan', 'jlxy'],
  'school-44': ['zhongguominyonghangkongfeixingxueyuan', 'zgmhfxxy'],
  'school-45': ['sichuanlvyouxueyuan', 'sclyxy'],
  'school-46': ['xinancaijingdaxuetianfuxueyuan', 'xncjdxtfxy'],
  'school-47': ['sichuanchuanmeixueyuan', 'sccmxy'],
  'school-48': ['chengduyinxingjiudianguanlixueyuan', 'cdyxjdglxy'],
  'school-49': ['dianzikejidaxuechengduxueyuan', 'dzkjdxcddy'],
  'school-52': ['zhongguochuanmeidaxue', 'zgcddx'],
  'school-55': ['sichuandaxuejinjiangxueyuan', 'scdxjjxy'],
  'school-56': ['sichuangongyekejixueyuan', 'scgykjxy'],
  'school-57': ['chengduyishuzhiyedaxue', 'cdyszydx'],
  'school-58': ['chengduligongdaxuegongchengjishuxueyuan', 'cdlgdxgcjsxy'],
}

const schoolCards = computed(() => {
  const searchText = normalizeSearchText(keyword.value)

  return schools
    .filter((item) => {
      const matchKeyword = matchSchoolKeyword(item, searchText)
      const matchArea = area.value ? item.area === area.value : true
      return matchKeyword && matchArea
    })
    .map((item) => {
      const offerings = getSchoolMajorOfferings(item.id)
      return {
        ...item,
        priceSummary: summarizePriceRange(offerings.map((major) => major.priceText)),
        thesisSummary: summarizeValues(offerings.map((major) => major.thesisPriceText), ['待核对', '专科通常不涉及']),
      }
    })
})

function normalizeSearchText(value) {
  return value.trim().toLowerCase().replace(/\s+/g, '')
}

function matchSchoolKeyword(school, query) {
  return [school.name, ...(schoolSearchAliases[school.id] || [])].some((value) => fuzzyMatch(value, query))
}

function fuzzyMatch(value, query) {
  if (!query) {
    return true
  }

  const text = normalizeSearchText(value)

  if (text.includes(query)) {
    return true
  }

  let queryIndex = 0

  for (const char of text) {
    if (char === query[queryIndex]) {
      queryIndex += 1
    }

    if (queryIndex === query.length) {
      return true
    }
  }

  return false
}

function summarizeValues(values, ignored = []) {
  const hidden = new Set(ignored)
  const unique = [...new Set(values.filter((value) => value && !hidden.has(value)))]

  if (!unique.length) {
    return '待核对'
  }

  if (unique.length <= 2) {
    return unique.join(' / ')
  }

  return `${unique[0]} 等 ${unique.length} 档`
}

function summarizePriceRange(values) {
  const prices = values.flatMap(extractAnnualPrices)

  if (!prices.length) {
    return '待核对'
  }

  const min = Math.min(...prices)
  const max = Math.max(...prices)

  if (min === max) {
    return `${formatPrice(min)}元/年`
  }

  return `${formatPrice(min)} → ${formatPrice(max)}元/年`
}

function extractAnnualPrices(value) {
  if (!value || value === '待核对') {
    return []
  }

  const text = String(value).replace(/,/g, '')
  const match = text.match(/(\d+(?:\.\d+)?)\s*(?:[-~－—至]\s*(\d+(?:\.\d+)?))?\s*元\/年/)

  if (!match) {
    return []
  }

  return [Number(match[1]), Number(match[2])]
    .filter((price) => Number.isFinite(price))
}

function formatPrice(value) {
  return Number.isInteger(value) ? String(value) : String(value)
}
</script>
