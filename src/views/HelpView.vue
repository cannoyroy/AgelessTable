/**
 * @file 帮助中心页面
 * @description FAQ、使用指南和联系方式
 */
<template>
  <div class="space-y-4">
    <header class="space-y-1">
      <div class="chip">帮助 · Help</div>
      <h1 class="text-2xl font-semibold tracking-tight">帮助中心</h1>
      <p class="text-sm text-ink/70">常见问题与使用指南</p>
    </header>

    <!-- 搜索框 -->
    <div class="card p-3">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索问题..."
        class="w-full rounded-xl bg-paper/70 px-4 py-2 text-sm ring-1 ring-ink/10 placeholder:text-ink/40"
      />
    </div>

    <!-- FAQ -->
    <section class="space-y-3">
      <h3 class="text-sm font-semibold">常见问题</h3>
      <div
        v-for="(faq, index) in filteredFAQs"
        :key="index"
        class="card overflow-hidden"
      >
        <button
          class="tap w-full px-4 py-3 text-left"
          @click="toggleFAQ(index)"
        >
          <div class="flex items-center justify-between gap-3">
            <span class="text-sm font-semibold">{{ faq.question }}</span>
            <span
              class="text-ink/60 transition-transform"
              :class="expandedFAQ === index && 'rotate-180'"
            >
              ▼
            </span>
          </div>
        </button>
        <Transition name="expand">
          <div v-if="expandedFAQ === index" class="border-t border-ink/5 px-4 py-3">
            <p class="text-sm text-ink/70 leading-relaxed">{{ faq.answer }}</p>
          </div>
        </Transition>
      </div>
    </section>

    <!-- 使用指南 -->
    <section class="card p-4">
      <h3 class="mb-3 text-sm font-semibold">使用指南</h3>
      <div class="space-y-3">
        <div v-for="(guide, index) in guides" :key="index">
          <h4 class="mb-1 text-sm font-medium text-ink">{{ guide.title }}</h4>
          <p class="text-xs text-ink/70 leading-relaxed">{{ guide.content }}</p>
        </div>
      </div>
    </section>

    <!-- 关于我们 -->
    <section class="card p-4">
      <h3 class="mb-3 text-sm font-semibold">关于我们</h3>
      <p class="text-sm text-ink/70 leading-relaxed">
        逆龄餐桌（Ageless Table）是一个基于知识图谱和多智能体的抗衰老营养分析引擎。
        我们的使命是帮助人们从被动治疗转向主动预防，通过科学的营养分析，
        将食物成分转化为可解释的长寿通路影响（如 mTOR、AMPK、Sirtuin、慢性炎症），
        并转化为可操作的日常决策。
      </p>
    </section>

    <!-- 联系方式 -->
    <section class="card p-4">
      <h3 class="mb-3 text-sm font-semibold">联系我们</h3>
      <div class="space-y-2 text-sm text-ink/70">
        <div>反馈邮箱：feedback@agelesstable.com</div>
        <div>技术支持：support@agelesstable.com</div>
      </div>
      <button
        class="tap hoverleaf mt-4 w-full rounded-2xl bg-moss px-4 py-3 text-sm font-semibold text-paper shadow-soft"
        @click="handleFeedback"
      >
        提交反馈
      </button>
    </section>

    <!-- 服务条款 -->
    <section class="card p-4">
      <h3 class="mb-3 text-sm font-semibold">法律信息</h3>
      <div class="space-y-2">
        <button
          class="tap hoverleaf w-full rounded-xl bg-paper/50 px-4 py-3 text-left text-sm ring-1 ring-ink/10"
          @click="showTerms"
        >
          服务条款
        </button>
        <button
          class="tap hoverleaf w-full rounded-xl bg-paper/50 px-4 py-3 text-left text-sm ring-1 ring-ink/10"
          @click="showPrivacy"
        >
          隐私政策
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from '../composables/useToast'

const toast = useToast()
const searchQuery = ref('')
const expandedFAQ = ref<number | null>(null)

/**
 * FAQ 数据
 */
const faqs = [
  {
    question: '什么是逆龄餐桌？',
    answer: '逆龄餐桌是一个基于知识图谱和多智能体的抗衰老营养分析引擎，帮助您通过科学的营养分析做出更健康的饮食选择。',
  },
  {
    question: '长寿分数是如何计算的？',
    answer: '长寿分数综合考虑了食物对 mTOR、AMPK、Sirtuin、慢性炎症等多个长寿通路的影响，以及营养密度、加工度等因素，范围为 0-100。',
  },
  {
    question: '时间影响因子代表什么？',
    answer: '时间影响因子是基于流行病学研究数据，估算该食物对健康寿命的影响。正值表示可能增加健康时间，负值表示可能减少健康时间。',
  },
  {
    question: '如何使用扫描功能？',
    answer: '进入"扫描"页面，选择要分析的食品或上传食品图片，系统会在 2 秒内检索长寿知识图谱并生成洞察报告。',
  },
  {
    question: 'Lab 功能需要登录吗？',
    answer: '游客可以浏览 Lab 页面，但需要登录后才能使用完整的对话功能和个性化建议。',
  },
  {
    question: '健康偏好设置有什么用？',
    answer: '设置健康偏好后，系统会根据您的特定健康需求（如高血糖、慢性炎症、体重管理等）调整分析重点和建议。',
  },
  {
    question: '我的数据会被如何使用？',
    answer: '您的扫描历史和偏好设置存储在本地设备，不会上传到服务器。您可以在设置中随时导出或删除数据。',
  },
  {
    question: '演示版有什么限制？',
    answer: '当前为演示版本，使用模拟数据进行展示。完整版将接入真实的营养数据库和 AI 分析引擎。',
  },
  {
    question: '如何联系技术支持？',
    answer: '您可以通过帮助中心的"联系我们"部分发送反馈，或发送邮件至 support@agelesstable.com。',
  },
  {
    question: '应用是否提供医疗建议？',
    answer: '不提供。逆龄餐桌是决策支持工具，不提供医疗诊断或治疗建议。如有医疗问题，请咨询专业医生。',
  },
]

/**
 * 使用指南
 */
const guides = [
  {
    title: '1. 开始扫描',
    content: '打开扫描页面，选择食品或上传图片，等待 2 秒钟即可获得完整的营养分析报告。',
  },
  {
    title: '2. 查看洞察',
    content: '在洞察页面，您可以看到长寿分数、时间影响因子、优势与风险，以及详细的通路分析。',
  },
  {
    title: '3. AI 对话',
    content: '登录后，在 Lab 页面可以与 AI 营养科学家对话，深入了解食物对健康的影响。',
  },
  {
    title: '4. 设置偏好',
    content: '在个人页面设置您的健康偏好，系统会根据您的需求提供个性化建议。',
  },
  {
    title: '5. 查看历史',
    content: '在个人页面可以查看所有扫描历史，并管理收藏的食品。',
  },
]

/**
 * 过滤后的 FAQ
 */
const filteredFAQs = computed(() => {
  if (!searchQuery.value) return faqs
  const query = searchQuery.value.toLowerCase()
  return faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query)
  )
})

/**
 * 切换 FAQ 展开状态
 */
function toggleFAQ(index: number) {
  expandedFAQ.value = expandedFAQ.value === index ? null : index
}

/**
 * 处理反馈提交
 */
function handleFeedback() {
  toast.info('反馈功能即将上线，敬请期待')
}

/**
 * 显示服务条款
 */
function showTerms() {
  toast.info('服务条款详情即将上线')
}

/**
 * 显示隐私政策
 */
function showPrivacy() {
  toast.info('隐私政策详情即将上线')
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
