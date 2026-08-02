'use client'
import { SchedulingProvider } from '@/data/contexts/SchedulingContext'
import RequireUser from '@/components/features/user/RequireUser'
import Page from '@/components/layout/Page'

const Layout = (props: any) => {
  return (
    <RequireUser>
      <SchedulingProvider>
        <Page>
          {props.children}
        </Page>
      </SchedulingProvider>
    </RequireUser>
  )
}

export default Layout
