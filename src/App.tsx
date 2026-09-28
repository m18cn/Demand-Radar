import { lazy, Suspense, useEffect, type ReactNode } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Radar, TriangleAlert } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'
import { useRequirementStore } from '@/store/requirementStore'
import { DashboardPage } from '@/pages/DashboardPage'
import { RequirementsPage } from '@/pages/RequirementsPage'
import { RequirementDetailPage } from '@/pages/RequirementDetailPage'
import { ResearchQueuePage } from '@/pages/ResearchQueuePage'

// Recharts 仅在 Insights 页使用，懒加载以拆分首屏 bundle。
const InsightsPage = lazy(() =>
  import('@/pages/InsightsPage').then((module) => ({
    default: module.InsightsPage,
  })),
)

function Bootstrap({ children }: { children: ReactNode }) {
  const status = useRequirementStore((s) => s.status)
  const error = useRequirementStore((s) => s.error)
  const initialize = useRequirementStore((s) => s.initialize)

  useEffect(() => {
    void initialize()
  }, [initialize])

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-muted-foreground">
        <Radar className="h-8 w-8 animate-pulse" />
        <p className="text-sm">正在加载需求池…</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-center">
        <TriangleAlert className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground">
          加载数据失败：{error ?? '未知错误'}
        </p>
        <Button variant="outline" onClick={() => void initialize()}>
          重试
        </Button>
      </div>
    )
  }

  return <>{children}</>
}

export default function App() {
  return (
    <Bootstrap>
      <HashRouter>
        <Suspense
          fallback={
            <div className="flex justify-center py-24 text-muted-foreground">
              <Radar className="h-6 w-6 animate-pulse" />
            </div>
          }
        >
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="/requirements" element={<RequirementsPage />} />
              <Route
                path="/requirements/:id"
                element={<RequirementDetailPage />}
              />
              <Route path="/research" element={<ResearchQueuePage />} />
              <Route path="/insights" element={<InsightsPage />} />
            </Route>
          </Routes>
        </Suspense>
      </HashRouter>
    </Bootstrap>
  )
}
