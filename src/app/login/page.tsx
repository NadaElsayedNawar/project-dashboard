'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { setCredentials, setLoading } from '@/store/slices/authSlice'
import { mockLogin } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormLabel, FormMessage } from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const onSubmit = async (data: LoginFormData) => {
    setError(null)
    dispatch(setLoading(true))

    try {
      const result = await mockLogin(data.email, data.password)

      if (result) {
        dispatch(setCredentials(result))
        document.cookie = `token=${result.token}; path=/; max-age=86400`
        router.push('/dashboard')
      } else {
        setError('Invalid email or password')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-950 dark:via-blue-950/30 dark:to-slate-900 p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md shadow-2xl border-border/40 backdrop-blur-sm bg-card/95">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-2xl from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-3xl shadow-xl ring-4 ring-primary/10">
              PD
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base">
              Sign in to manage your projects
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField>
              <FormLabel htmlFor="email" className="text-sm font-medium">
                Email Address
              </FormLabel>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="h-11 bg-background/50"
                {...register('email')}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <FormMessage id="email-error">{errors.email.message}</FormMessage>
              )}
            </FormField>

            <FormField>
              <FormLabel htmlFor="password" className="text-sm font-medium">
                Password
              </FormLabel>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="h-11 bg-background/50"
                {...register('password')}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password && (
                <FormMessage id="password-error">
                  {errors.password.message}
                </FormMessage>
              )}
            </FormField>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                <FormMessage role="alert" aria-live="polite" className="text-destructive">
                  {error}
                </FormMessage>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </Form>

          <div className="space-y-3 pt-2 border-t border-border/50">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-border/50" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Demo Accounts
              </p>
              <div className="h-px flex-1 bg-border/50" />
            </div>

            <div className="space-y-2">
              <div className="group flex items-center justify-between p-3 bg-muted/50 hover:bg-muted rounded-lg transition-colors cursor-pointer border border-transparent hover:border-primary/20">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">admin@example.com</span>
                  <span className="text-xs text-muted-foreground">Password: admin123</span>
                </div>
                <Badge variant="default" className="shadow-sm">Admin</Badge>
              </div>

              <div className="group flex items-center justify-between p-3 bg-muted/50 hover:bg-muted rounded-lg transition-colors cursor-pointer border border-transparent hover:border-primary/20">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">pm@example.com</span>
                  <span className="text-xs text-muted-foreground">Password: pm123</span>
                </div>
                <Badge variant="secondary" className="shadow-sm">PM</Badge>
              </div>

              <div className="group flex items-center justify-between p-3 bg-muted/50 hover:bg-muted rounded-lg transition-colors cursor-pointer border border-transparent hover:border-primary/20">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">dev@example.com</span>
                  <span className="text-xs text-muted-foreground">Password: dev123</span>
                </div>
                <Badge variant="outline" className="shadow-sm">Dev</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
