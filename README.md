# Ageless Table (逆龄餐桌)

> **Knowledge-graph + multi-agent anti-aging nutrition analysis engine.**  
> **Scan a Day, Keep Aging at Bay.**

[中文说明 / Chinese README →](./README.zh-CN.md)

---

## Banner

![image-20251220234828651](README/banner.png)

---

## Abstract

**Ageless Table is a knowledge-grounded, multi-agent anti-aging nutrition analysis engine built on a “Longevity Knowledge Graph”.**  
It helps people shift from reactive treatment to proactive prevention by translating food ingredients into interpretable longevity pathway impacts (e.g., mTOR / AMPK / Sirtuin / chronic inflammation) and turning them into actionable daily decisions.

---

## Key Features

### 🧠 Knowledge-Grounded Reasoning

No “hallucinated health advice”. Every conclusion is designed to be **traceable to evidence** (guidelines, standards, and scientific literature) and presented with honest uncertainty when evidence is insufficient.

### 🔗 Chain of Prompts (Parallel “Expert Consultation”)

Instead of a single answer, Ageless Table runs **parallel analyses**—benefits, risks, target groups, and alternatives—then synthesizes them into a readable “consultation record”.

### ⚖️ Hybrid Logic Engine (Probabilistic × Deterministic)

Combine LLM reasoning with **deterministic scoring and constraints** to produce intuitive outputs like:
- **Longevity Score (0–100)**
- **Time Impact** (e.g., “+12 min” / “-15 min”)

---

## The Product Loop (From Scan to Insight)

1. **Scan (Multimodal Perception)**  
   Barcode / label / photo → identify ingredients & nutrition structure
2. **Insight (Longevity Dashboard)**  
   One-glance score + time impact + clear “benefit vs risk”
3. **Deep Dive (Pathway Cards)**  
   mTOR / AMPK / Sirtuin / inflammation… tap to expand rationale
4. **Lab (AI Nutrition Scientist)**  
   Conversational follow-ups with “anti-hallucination” transparency
5. **Action (Decision Support)**  
   Alternatives, pairing suggestions, and habit-building feedback loops

---

## Architecture

![Architecture](docs/architecture.png)

---

## Demo

> TODO: Add GIFs under `docs/` (or update paths below).

### 1) Scan → Insight (Generate a Longevity Report)
![Demo: Scan to Insight](docs/demo-scan-to-insight.gif)

### 2) Lab → Score Binding (Dynamic UI Update)
![Demo: Lab score binding](docs/demo-lab-score.gif)

---

## Quick Start

> Even if judges don’t run it, this shows it **can be executed** end-to-end.

### Requirements
- Node.js **18+** (recommended)
- npm (comes with Node)

### Run locally

```bash
cd ageless-table
npm install
npm run dev
```

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

---

## Current Demo Scope

This repo currently ships a **mobile-first prototype** with:
- Bottom tabs: **Scan / Insight / Lab / Profile**
- **Scan**: choose a product → 2s “LKG retrieving…” animation → auto-navigate to Insight
- **Insight**: Score gauge + time impact + benefit/risk + expandable pathway rationale
- **Lab**:
  - Guest can view the page but **chat input is locked**
  - After login, chat is enabled
  - Supports parsing tags like **`[SCORE: 85]`** to update the gauge (demo-only protocol)
- **Auth (mock)**:
  - Email + password login/register stored in `localStorage`
  - Redirect back after auth

---

## Roadmap

### V1 — Demo-ready prototype (Now)
- Full “Scan → Insight → Lab” narrative loop
- Stable mock data and reliable UI interactions

### V2 — Real data foundation
- Barcode → factual nutrition database binding
- OCR for labels/receipts, and lightweight visual recognition for dishes

### V3 — Evidence-first anti-hallucination
- RAG evidence chain with conflict detection and self-consistency checks
- Transparent citations and uncertainty reporting

### V4 — Value realization at scale
- Personalized health profile and long-term trend tracking
- B2B API for insurers / health platforms; B2C freemium flywheel

---

## Use Cases

- **Supermarket decision in 10 seconds**: “Is this worth it today?”
- **Takeout & drinks**: decode “70% sugar” labels into real impacts
- **Inflammation / glucose-aware eating**: avoid “pro-aging structures”
- **Habit building**: “+12 min” positive feedback loop for daily choices
- **Enterprise wellness / insurance**: low-friction, high-coverage digital health layer

---

## Disclaimer

Ageless Table is a **demo/prototype** for education and decision support.  
It does **not** provide medical diagnosis or treatment advice. For medical concerns, consult qualified professionals.

