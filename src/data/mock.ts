export type PathwayLevel = 'Low' | 'Medium' | 'High' | 'Optimal' | 'Risk'

export type Pathway = {
  name: string
  level: PathwayLevel
  desc: string
  rationale?: string
}

export type ProductInsight = {
  id: string
  product: string
  longevity_score: number
  time_impact: string
  positives: string[]
  risks: string[]
  pathways: Pathway[]
}

export const products: ProductInsight[] = [
  {
    id: 'yogurt',
    product: '希腊酸奶 (Greek Yogurt)',
    longevity_score: 88,
    time_impact: '+18 min',
    positives: ['高蛋白饱腹感更强，减少无意识加餐', '益生菌支持肠道屏障与免疫稳态', '低糖版本可降低胰岛素波动'],
    risks: ['注意选择“无添加糖”版本，避免隐形糖', '乳糖不耐受人群需评估耐受性'],
    pathways: [
      {
        name: 'Sirtuin 激活',
        level: 'High',
        desc: '富含特定氨基酸与代谢信号，利于 Sirtuin 相关稳态。',
        rationale: '蛋白质与发酵产物可影响能量感知与细胞应激反应，间接支持 Sirtuin 轴的有益激活。',
      },
      {
        name: 'mTOR 抑制',
        level: 'Optimal',
        desc: '低糖架构避免过度激活 mTOR 导致衰老加速。',
        rationale: '相较高糖零食，血糖/胰岛素峰值更温和，减少促生长信号的长期偏高。',
      },
      {
        name: '慢性炎症',
        level: 'Low',
        desc: '益生菌有助于调节肠道微环境，降低系统性炎症潜力。',
        rationale: '肠道菌群与炎症因子存在相关性，发酵乳制品可能支持更稳定的微生态。',
      },
      { name: 'AMPK 激活', level: 'Medium', desc: '提供稳态能量供给，促进代谢灵活性。', rationale: '更好的饱腹与更平稳的能量输入，有利于能量感知通路保持敏感。' },
      { name: '胰岛素负荷', level: 'Low', desc: '无糖/低糖版本整体负荷更友好。', rationale: '糖越少，短时胰岛素刺激越低。' },
      { name: '氧化应激', level: 'Low', desc: '整体加工度较低，氧化压力相对可控。', rationale: '减少高温油炸与高糖反应产物的暴露。' },
      { name: '肠道屏障', level: 'High', desc: '发酵产物可能支持黏膜屏障。', rationale: '发酵代谢物与免疫稳态存在关联。' },
      { name: '蛋白质量', level: 'High', desc: '优质蛋白提供修复材料。', rationale: '氨基酸谱更完整，有利于组织修复与肌肉维持。' },
      { name: '微量营养', level: 'Medium', desc: '含钙与部分 B 族维生素。', rationale: '营养密度较好，但仍需多样化饮食。' },
      { name: '加工度', level: 'Low', desc: '相对轻加工，添加剂可控。', rationale: '选择配料表简短的产品更佳。' },
    ],
  },
  {
    id: 'cola',
    product: '可口可乐 (Coca‑Cola)',
    longevity_score: 22,
    time_impact: '-15 min',
    positives: ['短时提神（但不等同于健康收益）'],
    risks: ['高糖负荷刺激胰岛素与炎症信号', '液体热量更易过量摄入', '长期饮用与代谢风险相关'],
    pathways: [
      { name: 'mTOR 激活', level: 'Risk', desc: '高糖推动促生长信号偏高。', rationale: '反复的血糖峰值可放大促生长/合成信号。' },
      { name: '慢性炎症', level: 'Risk', desc: '糖负荷与炎症标志物存在相关性。', rationale: '高糖摄入可能促进炎症环境与氧化应激。' },
      { name: 'AMPK 激活', level: 'Low', desc: '能量感知通路难以被良性激活。', rationale: '高糖更偏向“过剩信号”，不利于 AMPK 轴敏感性。' },
      { name: '胰岛素负荷', level: 'Risk', desc: '单次摄入即可造成明显峰值。', rationale: '液体糖吸收快，峰值更陡。' },
      { name: '氧化应激', level: 'Medium', desc: '代谢压力上升。', rationale: '高糖代谢与氧化压力存在关联。' },
      { name: '肠道屏障', level: 'Low', desc: '对微生态无明显支持。', rationale: '缺乏纤维与有益发酵产物。' },
      { name: '微量营养', level: 'Low', desc: '营养密度低。', rationale: '热量几乎来自糖。' },
      { name: '加工度', level: 'Risk', desc: '高度加工饮品。', rationale: '添加糖是主要风险来源。' },
      { name: 'Sirtuin 激活', level: 'Low', desc: '缺乏有益代谢信号。', rationale: '不提供支持性营养结构。' },
      { name: '饱腹感', level: 'Low', desc: '不增加饱腹，易叠加额外热量。', rationale: '液体热量很难带来等量饱腹。' },
    ],
  },
  {
    id: 'bread',
    product: '全麦面包 (Whole Wheat Bread)',
    longevity_score: 71,
    time_impact: '+7 min',
    positives: ['膳食纤维支持肠道与血糖稳定', '更高营养密度（与精制面包相比）'],
    risks: ['部分产品“全麦”比例不足，需看配料表', '对麸质敏感人群需谨慎'],
    pathways: [
      { name: '胰岛素负荷', level: 'Medium', desc: '纤维有助于平缓吸收。', rationale: '与精制谷物相比峰值更缓，但仍是碳水。' },
      { name: '慢性炎症', level: 'Low', desc: '纤维与微生态更友好。', rationale: '更好的微生态通常与更低炎症相关。' },
      { name: 'AMPK 激活', level: 'Medium', desc: '支持代谢灵活性。', rationale: '更平稳的能量输入有利于能量感知。' },
      { name: 'mTOR 抑制', level: 'Medium', desc: '整体中性偏好。', rationale: '取决于搭配与总热量。' },
      { name: '微量营养', level: 'Medium', desc: '含部分矿物质与 B 族。', rationale: '但加工会影响含量。' },
      { name: '加工度', level: 'Medium', desc: '差异很大。', rationale: '配料越短越好。' },
      { name: '肠道屏障', level: 'Medium', desc: '纤维支持短链脂肪酸生成。', rationale: '更健康的菌群代谢物可能支持屏障。' },
      { name: '氧化应激', level: 'Low', desc: '整体压力可控。', rationale: '相对精制高糖零食更友好。' },
      { name: 'Sirtuin 激活', level: 'Medium', desc: '间接支持稳态。', rationale: '更好的代谢稳态可支持长寿轴。' },
      { name: '饱腹感', level: 'Medium', desc: '纤维与体积带来饱腹。', rationale: '但仍需注意涂抹酱/搭配热量。' },
    ],
  },
]

export function getProductById(id: string | null | undefined) {
  return products.find((p) => p.id === id) ?? products[0]
}


