import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  FlaskConical,
  Inbox,
  LayoutDashboard,
  Radar,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/requirements', label: 'Requirements', icon: Inbox, end: false },
  { to: '/research', label: 'Research', icon: FlaskConical, end: false },
  { to: '/insights', label: 'Insights', icon: BarChart3, end: false },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r bg-card transition-transform md:static md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <Radar className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold tracking-tight">
              Demand Radar
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onClose}
            aria-label="关闭菜单"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground',
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t p-3">
          <p className="px-1 text-[11px] leading-relaxed text-muted-foreground">
            发现信号 → 记录 → 研究 → 评分 → 验证 → MVP
          </p>
        </div>
      </aside>
    </>
  )
}
