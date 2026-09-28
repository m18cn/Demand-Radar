import { useLocation } from 'react-router-dom'
import { Menu, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QuickAddRequirement } from '@/components/requirements/QuickAddRequirement'
import { DataManagementMenu } from '@/components/data/DataManagementMenu'
import { useTheme } from '@/hooks/useTheme'

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/requirements': 'Requirements',
  '/research': 'Research Queue',
  '/insights': 'Insights',
}

function titleFor(pathname: string): string {
  if (/^\/requirements\/.+/.test(pathname)) return 'Requirement Detail'
  return pageTitles[pathname] ?? 'Demand Radar'
}

interface HeaderProps {
  onOpenSidebar: () => void
}

export function Header({ onOpenSidebar }: HeaderProps) {
  const { pathname } = useLocation()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onOpenSidebar}
          aria-label="打开菜单"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <h1 className="text-sm font-semibold tracking-tight">
          {titleFor(pathname)}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <QuickAddRequirement />
        <DataManagementMenu />
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="切换主题"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  )
}
