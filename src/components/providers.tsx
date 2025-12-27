'use client'

import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { store } from '@/store'
import { useEffect } from 'react'
import { restoreAuth } from '@/store/slices/authSlice'
import { ThemeProvider } from '@/components/theme-provider'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
})

function AuthRestorer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(restoreAuth())
  }, [])

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="dashboard-theme">
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AuthRestorer>{children}</AuthRestorer>
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  )
}
