'use client'
import { SchedulingProvider } from '@/data/contexts/ContentScheduling'
import UserForce from '@/components/shared/UserForce'
import Page from '@/components/shared/Page'

const Layout = (props: any) => {
  return (
    <UserForce>
      <SchedulingProvider>
        <Page>
          {props.children}
        </Page>
      </SchedulingProvider>
    </UserForce>
  )
}

export default Layout
