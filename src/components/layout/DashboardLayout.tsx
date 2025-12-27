'use client'

import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { logout } from '@/store/slices/authSlice'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import Link from 'next/link'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="h-9 w-9 rounded-xl  from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold shadow-md group-hover:shadow-lg transition-shadow ring-2 ring-primary/10">
                PD
              </div>
              <span className="font-semibold text-lg group-hover:text-primary transition-colors">Project Dashboard</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-muted/50">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium leading-none mb-1">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <Badge
                  variant={user.role === 'Admin' ? 'default' : 'secondary'}
                  className="shadow-sm"
                >
                  {user.role}
                </Badge>
              </div>
            )}
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="shadow-sm hover:shadow"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-6 px-4">{children}</main>
    </div>
  )
}
