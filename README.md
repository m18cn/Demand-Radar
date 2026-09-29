# Demand Radar

一个面向独立开发者的个人产品需求发现工具。

发现信号 → 快速记录 → 需求池 → 研究 → 评分 → 验证 → MVP

## 功能

- **Dashboard**：总需求数量、Inbox / Researching / Validated / MVP 数量、最近需求、高机会需求，以及「接下来研究什么」。
- **Requirements**：需求池，支持搜索、状态 / 来源 / 标签 / Score 筛选、排序，以及创建 / 编辑 / 删除。
- **Requirement Detail**：完整展示需求信息，支持补充研究信息、五项评分、修改状态。
- **Research Queue**：Inbox 与 Researching 中的需求，按机会分数排序。
- **Insights**：来源分布、状态分布、标签分布、用户类型分布、高机会需求（Recharts 可视化）。
- **快速记录**：全局入口，只需 title / targetUser / source / url / note，自动补全默认字段。
- **数据管理**：导出 JSON、导入 JSON、加载示例数据、清空所有数据。

## 技术栈

- React 18 + TypeScript（strict）
- Vite
- Tailwind CSS + shadcn/ui（Radix UI primitives）
- React Router（HashRouter）
- Zustand
- Zod
- Recharts

## 数据存储

第一版不依赖后端：

- `localStorage`：用户实际数据
- `seed.json`：示例数据（仅当用户在「数据 → 加载示例数据」中主动加载）
- JSON Import / Export：数据备份

首次打开应用时需求池为空，不再自动加载演示数据。用户从「快速记录」或「新建需求」开始，主动创建属于自己的需求。

所有页面通过 `StorageAdapter` 接口读写数据，页面不直接调用 `localStorage`：

```ts
interface StorageAdapter {
  load(): Promise<Requirement[]>
  save(requirements: Requirement[]): Promise<void>
  clear(): Promise<void>
}
```

## 本地开发

```bash
npm install
npm run dev
```

## 构建与校验

```bash
npm run typecheck   # TypeScript 严格校验
npm run build       # tsc --noEmit && vite build
npm run preview     # 预览构建产物
```

## 部署到 GitHub Pages

使用 HashRouter + 相对 base（`base: './'`），可直接部署到 GitHub Pages 或任意静态托管。

仓库已内置 `.github/workflows/deploy.yml`，推送到 `main` 分支即自动构建并部署。在仓库 **Settings → Pages** 中将 Source 设为 **GitHub Actions** 即可。

手动部署：

```bash
npm run build
# 将 dist/ 目录部署到任意静态托管
```

## 目录结构

```
src/
  components/       # UI 组件（ui/ 为 shadcn 风格基础组件）
  data/seed.json    # 示例数据
  hooks/            # useTheme 等
  lib/              # utils、filter、analytics、storage、validation
  pages/            # Dashboard / Requirements / Detail / Research / Insights
  services/         # 领域业务逻辑（创建、评分等）
  store/            # Zustand store
  types/            # 数据模型
```
